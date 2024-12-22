import express from 'express';
import cors from 'cors';
import Anthropic from '@anthropic-ai/sdk';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables from the parent directory's .env file
dotenv.config({ path: resolve(__dirname, '../.env') });

const app = express();
const port = 3001;

app.use(express.json());

// Add CSP headers BEFORE routes
app.use((req, res, next) => {
  res.setHeader(
    'Content-Security-Policy',
    "default-src 'self' http://localhost:* https://localhost:*; img-src 'self' data: http://localhost:* https://localhost:*; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; connect-src 'self' http://localhost:* https://localhost:*;"
  );
  next();
});

// Configure CORS with expanded settings
app.use(cors({
  origin: true, // Allow all origins in development
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Serve favicon
app.get('/favicon.ico', (req, res) => {
  res.status(204).end(); // No content response for favicon
});

const apiKey = process.env.ANTHROPIC_API_KEY;
if (!apiKey) {
  console.error('ANTHROPIC_API_KEY is not set in environment variables');
  process.exit(1);
}

console.log('Initializing Anthropic client with API key:', apiKey.substring(0, 10) + '...');

const anthropic = new Anthropic({
  apiKey: apiKey
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Root route handler
app.get('/', (req, res) => {
  res.json({
    status: 'ok',
    message: 'AI Model Comparer API Server',
    endpoints: {
      health: '/api/health',
      generateModelData: '/api/generate-model-data',
      generateContent: '/api/generate-content'
    }
  });
});

app.post('/api/generate-model-data', async (req, res) => {
  try {
    console.log('Received request with body:', req.body);
    const { modelName } = req.body;

    if (!modelName) {
      console.error('Missing modelName in request');
      return res.status(400).json({ error: 'Model name is required' });
    }

    if (!process.env.ANTHROPIC_API_KEY) {
      console.error('Missing ANTHROPIC_API_KEY');
      return res.status(500).json({ error: 'Server configuration error' });
    }

    const prompt = `Generate a detailed comparison data for the AI model/tool "${modelName}". Return the data as a JSON object with the following structure:

{
  "name": "model name in English",
  "description": "תיאור קצר וממצה",
  "features": ["תכונה 1", "תכונה 2", ...],
  "pricing": {
    "freeTier": "פרטי חבילה חינמית או 'לא קיים'",
    "paidTiers": [
      {
        "name": "שם החבילה",
        "price": "מחיר",
        "billingType": "סוג החיוב",
        "features": ["תכונה 1", "תכונה 2"],
        "limits": "מגבלות"
      }
    ]
  },
  "pros": ["יתרון 1", "יתרון 2", ...],
  "cons": ["חיסרון 1", "חיסרון 2", ...],
  "useCases": ["שימוש 1", "שימוש 2", ...],
  "alternatives": ["חלופה 1", "חלופה 2", ...],
  "sourceDate": "YYYY-MM-DD"
}

Important: Return ONLY the JSON object, without any additional text or explanation. Keep brand names and technical terms in English. Use "לא ידוע" for any unknown fields.`;

    console.log('Sending request to Anthropic for model:', modelName);
    const completion = await anthropic.messages.create({
      model: "claude-3-5-sonnet-20241022",
      max_tokens: 1500,
      messages: [{ 
        role: "user", 
        content: prompt
      }],
      system: "You are a helpful AI assistant that always returns valid JSON responses. Never include any text before or after the JSON object."
    });

    console.log('Full Anthropic response:', JSON.stringify(completion, null, 2));
    console.log('Response type:', typeof completion.content);
    console.log('Response content:', completion.content);

    // Get the content from the response
    const content = completion.content[0].text.trim();
    console.log('Response content:', content);

    // Parse the response content
    let modelData;
    try {
      // Remove any potential markdown code block markers
      const jsonContent = content.replace(/^```json\n?|\n?```$/g, '').trim();
      modelData = JSON.parse(jsonContent);
      console.log('Parsed model data:', modelData);

      // Validate required fields
      const requiredFields = ['name', 'description', 'features', 'pricing', 'pros', 'cons', 'useCases', 'alternatives'];
      const missingFields = requiredFields.filter(field => !modelData[field]);
      
      if (missingFields.length > 0) {
        console.error('Missing required fields:', missingFields);
        return res.status(400).json({ 
          error: 'Missing required fields in AI response', 
          details: missingFields 
        });
      }

      // Ensure arrays are actually arrays
      ['features', 'pros', 'cons', 'useCases', 'alternatives'].forEach(field => {
        if (!Array.isArray(modelData[field])) {
          modelData[field] = [];
        }
      });

      // Ensure pricing has the correct structure
      if (typeof modelData.pricing !== 'object') {
        modelData.pricing = {};
      }
      if (!modelData.pricing.paidTiers || !Array.isArray(modelData.pricing.paidTiers)) {
        modelData.pricing.paidTiers = [];
      }

      res.json(modelData);
    } catch (parseError) {
      console.error('Error parsing AI response:', parseError);
      console.error('Raw response:', completion.content);
      res.status(500).json({ 
        error: 'Failed to parse AI response',
        details: parseError.message
      });
    }
  } catch (error) {
    console.error('Server error:', error);
    res.status(500).json({ 
      error: 'Internal server error',
      details: error.message
    });
  }
});

app.post('/api/generate-content', async (req, res) => {
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

    const completion = await anthropic.messages.create({
      model: "claude-3-opus-20240229",
      max_tokens: 1000,
      messages: [{ 
        role: "user", 
        content: prompt
      }],
      system: "You are a helpful AI assistant that always returns valid JSON responses. Never include any text before or after the JSON object."
    });

    const content = completion.content[0].text.trim();
    const jsonContent = content.replace(/^```json\n?|\n?```$/g, '').trim();
    const modelData = JSON.parse(jsonContent);

    res.json(modelData);
  } catch (error) {
    console.error('Error generating content:', error);
    res.status(500).json({ 
      error: 'Failed to generate content',
      details: error.message 
    });
  }
});

// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ 
    error: 'Internal server error',
    details: err.message 
  });
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
  console.log('API Key status:', apiKey ? 'Set' : 'Not set');
});
