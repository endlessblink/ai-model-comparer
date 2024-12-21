import type { VercelRequest, VercelResponse } from '@vercel/node';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  organization: process.env.OPENAI_ORGANIZATION_ID, // Add this if you have an org ID
  project: process.env.OPENAI_PROJECT_ID, // Add project ID
});

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Debug: Check if we're receiving the request properly
  console.log('API request received:', { method: req.method, body: req.body });

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Debug: Check API key configuration
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'OpenAI API key is not configured' });
  }

  try {
    const { modelName } = req.body;

    if (!modelName) {
      return res.status(400).json({ error: 'Model name is required' });
    }

    console.log('Generating data for model:', modelName);

    const prompt = `Create a detailed JSON object for the AI model "${modelName}". Follow these strict requirements:
1. Response must be ONLY a valid JSON object
2. Do not include any explanatory text
3. Do not use markdown formatting
4. Ensure all strings are properly escaped

The JSON structure must be:
{
  "description": "string",
  "modelType": "string",
  "advantages": ["string"],
  "limitations": ["string"],
  "pricing": {
    "free": boolean,
    "plans": [
      {
        "name": "string",
        "price": "string",
        "features": ["string"]
      }
    ]
  }
}`;

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are a JSON generator that outputs only valid, parseable JSON objects. Never include any additional text, formatting, or explanations. The output should be directly parseable by JSON.parse()."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 1000
    });

    // Get the response content
    const responseContent = completion.choices[0].message.content;
    
    // Debug log
    console.log('OpenAI response:', responseContent);

    // Validate JSON before parsing
    try {
      const parsedData = JSON.parse(responseContent || '{}');
      
      // Validate required fields
      if (!parsedData.description || !parsedData.modelType) {
        throw new Error('Missing required fields in response');
      }

      return res.status(200).json(parsedData);
    } catch (parseError) {
      console.error('JSON parsing error:', parseError);
      return res.status(500).json({ 
        error: 'Failed to parse OpenAI response',
        details: parseError.message,
        rawResponse: responseContent
      });
    }
  } catch (error) {
    console.error('Error generating model data:', error);
    return res.status(500).json({ 
      error: error instanceof Error ? error.message : 'Failed to generate model data',
      details: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
}
