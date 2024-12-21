const OpenAI = require('openai');
require('dotenv').config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
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
          content: "You are a JSON generator that outputs only valid JSON objects."
        },
        {
          role: "user",
          content: "Generate a test JSON object for the AI model 'GPT-4'. Return only valid JSON."
        }
      ],
      temperature: 0.7,
      max_tokens: 500
    });

    console.log('Response received:', completion.choices[0].message.content);
    
    // Try parsing the response
    const parsed = JSON.parse(completion.choices[0].message.content || '{}');
    console.log('Successfully parsed response:', parsed);
    
  } catch (error) {
    console.error('Error:', error);
  }
}

testOpenAI();
