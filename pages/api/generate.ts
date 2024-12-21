import type { VercelRequest, VercelResponse } from '@vercel/node';
import OpenAI from 'openai';

// Initialize OpenAI with error handling
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  organization: process.env.OPENAI_ORGANIZATION_ID,
});

// Validate API configuration
if (!process.env.OPENAI_API_KEY) {
  console.error('OpenAI API key is not configured');
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { modelName } = req.body;

    if (!modelName) {
      return res.status(400).json({ error: 'Model name is required' });
    }

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are a JSON generator that outputs only valid, parseable JSON objects."
        },
        {
          role: "user",
          content: `Create a detailed JSON object for the AI model "${modelName}". Include description, modelType, advantages, limitations, and pricing information.`
        }
      ],
      temperature: 0.7,
      max_tokens: 1000,
      response_format: { type: "json_object" }  // Ensures JSON response
    });

    const responseContent = completion.choices[0].message.content;
    
    try {
      const parsedData = JSON.parse(responseContent || '{}');
      return res.status(200).json(parsedData);
    } catch (parseError) {
      console.error('JSON parsing error:', parseError);
      return res.status(500).json({ 
        error: 'Failed to parse OpenAI response',
        details: parseError.message
      });
    }
  } catch (error: any) {
    console.error('OpenAI API error:', error);
    return res.status(error.status || 500).json({ 
      error: error.message || 'Failed to generate model data',
      code: error.code,
      type: error.type
    });
  }
} 