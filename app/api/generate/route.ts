import { NextRequest } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';

// Types for request/response
interface GenerateRequest {
  modelName: string;
  description?: string;
  category?: string;
  prompt?: string;
}

interface GenerateResponse {
  content: string;
  error?: string;
}

// Error handling utility
class APIError extends Error {
  constructor(
    message: string,
    public status: number = 500,
    public code: string = 'INTERNAL_SERVER_ERROR'
  ) {
    super(message);
    this.name = 'APIError';
  }
}

// Configure Anthropic client
const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY!,
});

export const runtime = 'edge'; // Use edge runtime for better performance

export async function POST(req: NextRequest) {
  try {
    // Validate API key
    if (!process.env.ANTHROPIC_API_KEY) {
      throw new APIError('ANTHROPIC_API_KEY is not configured', 500, 'CONFIG_ERROR');
    }

    // Parse and validate request body
    const body = await req.json() as GenerateRequest;
    
    if (!body.modelName) {
      throw new APIError('modelName is required', 400, 'VALIDATION_ERROR');
    }

    // Construct prompt based on model information
    const prompt = body.prompt || `Generate a detailed description for the ${body.modelName} model.
      ${body.description ? `Context: ${body.description}` : ''}
      ${body.category ? `Category: ${body.category}` : ''}
      
      Please provide a comprehensive analysis including:
      1. Key features and capabilities
      2. Typical use cases
      3. Technical specifications
      4. Limitations and considerations
      
      Format the response as a JSON object with these fields:
      {
        "description": "Main description text",
        "features": ["list", "of", "key", "features"],
        "useCases": ["list", "of", "primary", "use", "cases"],
        "specifications": {
          "technical details as key-value pairs"
        },
        "strengths": ["list", "of", "strengths"],
        "limitations": ["list", "of", "limitations"]
      }`;

    // Call Claude API
    const message = await anthropic.messages.create({
      model: 'claude-3-opus-20240229',
      max_tokens: 1000,
      temperature: 0.7,
      messages: [{
        role: 'user',
        content: prompt
      }],
    });

    // Parse JSON response
    try {
      const content = message.content[0].text;
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      
      if (!jsonMatch) {
        throw new APIError('Failed to extract JSON from response', 500, 'PARSE_ERROR');
      }

      const parsedContent = JSON.parse(jsonMatch[0]);
      return new Response(
        JSON.stringify(parsedContent),
        {
          status: 200,
          headers: {
            'Content-Type': 'application/json',
            'Cache-Control': 'no-store'
          }
        }
      );
    } catch (parseError) {
      throw new APIError('Failed to parse response as JSON', 500, 'PARSE_ERROR');
    }

  } catch (error: any) {
    console.error('Generation error:', error);

    // Handle specific error types
    if (error instanceof APIError) {
      return new Response(
        JSON.stringify({ 
          error: error.message,
          code: error.code 
        }),
        { 
          status: error.status,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

    // Handle Anthropic API errors
    if (error.status) {
      return new Response(
        JSON.stringify({ 
          error: error.message,
          code: 'ANTHROPIC_API_ERROR'
        }),
        { 
          status: error.status,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

    // Generic error response
    return new Response(
      JSON.stringify({ 
        error: 'Internal server error',
        code: 'INTERNAL_SERVER_ERROR'
      }),
      { 
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
}
