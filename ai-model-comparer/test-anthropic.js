import Anthropic from '@anthropic-ai/sdk';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables
dotenv.config({ path: resolve(__dirname, '.env') });

console.log('Testing Anthropic API connection...');

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

async function testAnthropicAPI() {
  try {
    console.log('Configuration:', {
      hasApiKey: !!process.env.ANTHROPIC_API_KEY,
      keyPrefix: process.env.ANTHROPIC_API_KEY?.substring(0, 7)
    });

    const message = await anthropic.messages.create({
      model: "claude-3-opus-20240229",
      max_tokens: 1000,
      messages: [
        {
          role: "user",
          content: "Say hello!"
        }
      ]
    });

    console.log('Success! Response:', message.content);
  } catch (error) {
    console.error('Error details:', {
      message: error.message,
      status: error.status,
      type: error.type
    });
    
    // Log the full error for debugging
    console.error('Full error:', error);
  }
}

testAnthropicAPI();
