import OpenAI from 'openai';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables
dotenv.config({ path: resolve(__dirname, '.env') });

// Debug environment variables
console.log('Environment variables loaded:', {
  API_KEY_LENGTH: process.env.OPENAI_API_KEY?.length || 0,
  API_KEY_PREFIX: process.env.OPENAI_API_KEY?.substring(0, 8) || 'not found',
  PROJECT_ID: process.env.OPENAI_PROJECT_ID
});

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  defaultHeaders: {
    'OpenAI-Project': process.env.OPENAI_PROJECT_ID
  }
});

async function testOpenAI() {
  try {
    console.log('Testing OpenAI API connection...');
    console.log('Configuration:', {
      hasApiKey: !!process.env.OPENAI_API_KEY,
      projectId: process.env.OPENAI_PROJECT_ID,
      keyPrefix: process.env.OPENAI_API_KEY?.substring(0, 8)
    });

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: "Say hello!" }]
    });

    console.log('Success! Response:', completion.choices[0].message);
  } catch (error) {
    console.error('Error details:', {
      message: error.message,
      status: error.status,
      type: error.type,
      code: error.code
    });
    
    // Log the full error for debugging
    console.error('Full error:', error);
  }
}

testOpenAI();
