import * as dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';
import Anthropic from '@anthropic-ai/sdk';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables
dotenv.config({ path: resolve(__dirname, '.env') });

// Initialize Anthropic client
const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY
});

async function testModelGenerator() {
  try {
    console.log('Testing model data generation...');
    console.log('Environment check:', {
      hasAnthropicKey: !!process.env.ANTHROPIC_API_KEY,
      keyPrefix: process.env.ANTHROPIC_API_KEY?.substring(0, 7)
    });

    const prompt = `Generate detailed information about the AI model "ChatGPT" in JSON format. Include:
    - name
    - description (2-3 sentences)
    - features (list of key capabilities)
    - pricing (including free tier if available, and paid plans with features)
    - pros (list of advantages)
    - cons (list of limitations)
    - useCases (list of practical applications)
    - alternatives (list of similar models)
    
    Return ONLY valid JSON without any additional text or explanations.`;

    const response = await anthropic.messages.create({
      model: "claude-3-opus-20240229",
      max_tokens: 2000,
      messages: [
        {
          role: "user",
          content: prompt
        }
      ]
    });

    const content = response.content[0].text;
    const data = JSON.parse(content);
    console.log('Generated data:', JSON.stringify(data, null, 2));
  } catch (error) {
    console.error('Test failed:', error);
    if (error instanceof Error) {
      console.error('Error details:', {
        message: error.message,
        stack: error.stack
      });
    }
  }
}

testModelGenerator();
