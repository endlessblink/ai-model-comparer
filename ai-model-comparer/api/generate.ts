import { VercelRequest, VercelResponse } from '@vercel/node';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { modelName } = req.body;

    if (!modelName) {
      return res.status(400).json({ error: 'Model name is required' });
    }

    const prompt = `Please provide detailed information about the AI model "${modelName}" in the following format:
    {
      "description": "A comprehensive description of what the model does and its main capabilities",
      "modelType": "The main category of the model (e.g., Language Model, Image Generation, Code Generation)",
      "advantages": "List of main advantages and strengths",
      "limitations": "List of limitations or potential drawbacks",
      "pricing": "Detailed pricing information including different tiers if available"
    }
    
    Please ensure all information is accurate and up-to-date. If certain information is not available, provide the most commonly known details.`;

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are a helpful assistant that provides information about AI models. Provide accurate, technical information in JSON format."
        },
        {
          role: "user",
          content: prompt
        }
      ]
    });

    const responseText = completion.choices[0]?.message?.content || '';
    let modelData;
    try {
      modelData = JSON.parse(responseText);
    } catch (e) {
      console.error('Failed to parse OpenAI response:', e);
      return res.status(500).json({ error: 'Failed to parse model data' });
    }

    return res.status(200).json(modelData);
  } catch (error) {
    console.error('Error generating model data:', error);
    return res.status(500).json({ error: 'Failed to generate model data' });
  }
}
