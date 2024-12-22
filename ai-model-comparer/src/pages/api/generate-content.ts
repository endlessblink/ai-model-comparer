import Anthropic from '@anthropic-ai/sdk';
import type { NextApiRequest, NextApiResponse } from 'next';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { modelName, modelUrl, category } = req.body;

    if (!modelName || !modelUrl || !category) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const prompt = `You are a helpful AI assistant helping to create content for an AI tools comparison website.
I will give you information about an AI tool/model, and you need to generate a comprehensive description, list of pros and cons.
Please respond in JSON format with the following structure:
{
  "description": "A detailed description of the model and its capabilities",
  "pros": ["pro1", "pro2", "pro3"],
  "cons": ["con1", "con2", "con3"]
}

The model details:
Name: ${modelName}
URL: ${modelUrl}
Category: ${category}

Please make sure the description is informative and accurate, and the pros and cons are balanced and realistic.
Response should be in JSON format only, no additional text.`;

    const message = await anthropic.messages.create({
      model: 'claude-3-opus-20240229',
      max_tokens: 1000,
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
    });

    const content = message.content[0].text;
    return res.status(200).json(JSON.parse(content));
  } catch (error) {
    console.error('Error generating content:', error);
    return res.status(500).json({ error: 'Failed to generate content' });
  }
}
