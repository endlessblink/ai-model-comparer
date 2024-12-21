import * as dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';
import { generateModelData } from './src/utils/aiDataGenerator.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables
dotenv.config({ path: resolve(__dirname, '.env') });

async function testModelGenerator() {
  try {
    console.log('Testing model data generation...');
    console.log('Environment check:', {
      hasAnthropicKey: !!process.env.ANTHROPIC_API_KEY,
      keyPrefix: process.env.ANTHROPIC_API_KEY?.substring(0, 7)
    });

    const data = await generateModelData('ChatGPT');
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
