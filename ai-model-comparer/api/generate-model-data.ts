import { VercelRequest, VercelResponse } from '@vercel/node';
import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
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

    const prompt = `
      Provide detailed information about the AI model/tool "${modelName}" in the following format:
      1. Brief description (2-3 sentences)
      2. Key features (list)
      3. Pricing information (including free tier if available)
      4. Pros and cons
      5. Main use cases
      6. Similar alternatives

      Format the response as structured data that can be parsed as JSON.
    `;

    const completion = await anthropic.messages.create({
      model: "claude-3-sonnet-20240229",
      max_tokens: 4096,
      messages: [{ role: "user", content: prompt }],
      system: "You are a helpful AI assistant that provides information about AI models and tools. Return responses in JSON format."
    });

    const response = completion.content[0].text;
    if (!response) {
      return res.status(500).json({ error: 'No response from Anthropic' });
    }

    return res.status(200).json(JSON.parse(response));
  } catch (error) {
    console.error('Error:', error);
    return res.status(500).json({ error: 'Failed to generate model data' });
  }
}
