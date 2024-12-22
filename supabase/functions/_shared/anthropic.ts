import { Anthropic } from 'npm:@anthropic-ai/sdk'
import { APIError } from './errors.ts'

interface GenerationOptions {
  maxLength?: number;
  temperature?: number;
}

export async function generateModelDescription(
  modelName: string,
  modelUrl: string = 'Not specified',
  category: string = 'general',
  options: GenerationOptions = {}
): Promise<any> {
  const anthropic = new Anthropic({
    apiKey: Deno.env.get('ANTHROPIC_API_KEY')!,
  });

  const { maxLength = 1000, temperature = 0.7 } = options;

  try {
    console.log('Generating description with params:', {
      modelName,
      modelUrl,
      category,
      maxLength,
      temperature
    });

    const response = await anthropic.messages.create({
      model: 'claude-3-opus-20240229',
      max_tokens: maxLength,
      temperature: temperature,
      messages: [{
        role: 'user',
        content: `Generate a comprehensive description for an AI model with the following details:
          Name: ${modelName}
          URL: ${modelUrl}
          Category: ${category}
          
          Please provide:
          1. A brief overview of the model's purpose and key features
          2. Its main use cases and applications
          3. Any notable technical specifications or requirements
          4. Key strengths and potential limitations
          
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
          }`
      }]
    });

    console.log('Raw Anthropic response:', response);

    if (!response.content || response.content.length === 0) {
      throw new APIError('No content received from Anthropic API', 500);
    }

    try {
      // Extract JSON from the response
      const content = response.content[0].text;
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      
      if (!jsonMatch) {
        throw new APIError('Failed to extract JSON from response', 500);
      }

      const parsedContent = JSON.parse(jsonMatch[0]);
      console.log('Parsed content:', parsedContent);
      
      return parsedContent;
    } catch (parseError) {
      console.error('Failed to parse Anthropic response:', parseError);
      throw new APIError('Failed to parse model description', 500);
    }
  } catch (error) {
    console.error('Anthropic API error:', error);
    
    if (error instanceof APIError) {
      throw error;
    }
    
    // Handle rate limits
    if (error.status === 429) {
      throw new APIError('Rate limit exceeded. Please try again later.', 429);
    }
    
    // Handle authentication errors
    if (error.status === 401) {
      throw new APIError('Invalid API key or authentication error', 401);
    }
    
    throw new APIError(
      `Failed to generate model description: ${error.message}`,
      error.status || 500
    );
  }
}
