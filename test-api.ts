import OpenAI from 'openai';
import dotenv from 'dotenv';
import type { APIError } from 'openai';

// Load environment variables
dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  organization: process.env.OPENAI_ORGANIZATION_ID,
});

async function testOpenAI() {
  try {
    console.log('Testing OpenAI API connection...');
    console.log('API Key available:', !!process.env.OPENAI_API_KEY);
    
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are a test responder. Reply with 'Test successful!'"
        },
        {
          role: "user",
          content: "Run test"
        }
      ],
      temperature: 0.7,
      max_tokens: 50
    });

    console.log('Response received:', completion.choices[0].message.content);
    return true;
  } catch (error) {
    const apiError = error as APIError;
    console.error('OpenAI API Error:', {
      message: apiError.message,
      status: apiError.status,
      code: apiError.code,
      type: apiError.type
    });
    return false;
  }
}

// Run the test
testOpenAI().then(success => {
  if (success) {
    console.log('API test completed successfully');
  } else {
    console.log('API test failed');
    process.exit(1);
  }
}); 