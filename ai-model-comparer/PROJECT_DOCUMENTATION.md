# AI Model Comparison Site Documentation

## Project Overview
A web application for comparing different AI models, with data generated and maintained through the Anthropic API. The site is built with React, TypeScript, and Vite for the frontend, and Express for the backend.

## Project Structure
```
ai-model-comparer/
├── src/                    # Frontend source code
│   ├── components/        # React components
│   ├── lib/              # Shared libraries and utilities
│   ├── pages/            # Page components
│   ├── types/            # TypeScript type definitions
│   └── utils/            # Utility functions
├── server/                # Backend server code
│   └── index.ts          # Main server file
└── supabase/             # Database migrations and types
    └── migrations/       # SQL migration files
```

## Environment Variables
### Frontend (.env)
```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### Backend (.env)
```env
ANTHROPIC_API_KEY=your_anthropic_api_key
```

## Database Schema (Supabase)
Table: `models`
```sql
CREATE TABLE models (
    id BIGSERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT NOT NULL,
    features TEXT[] NOT NULL DEFAULT '{}',
    pricing JSONB NOT NULL DEFAULT '{}'::jsonb,
    pros TEXT[] NOT NULL DEFAULT '{}',
    cons TEXT[] NOT NULL DEFAULT '{}',
    use_cases TEXT[] NOT NULL DEFAULT '{}',
    alternatives TEXT[] NOT NULL DEFAULT '{}',
    source_date DATE NOT NULL DEFAULT CURRENT_DATE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

## API Endpoints
### Backend (http://localhost:3000)
- `POST /api/generate-model-data`
  - Generates model information using Anthropic API
  - Request body: `{ modelName: string }`
  - Response: ModelData object

## Data Types
### ModelData Interface
```typescript
export interface ModelData {
  name: string;
  description: string;
  features: string[];
  pricing: {
    freeTier?: string;
    paidTiers?: {
      name: string;
      price: string;
      billingType: string;
      features: string[];
      limits: string[];
    }[];
  };
  pros: string[];
  cons: string[];
  useCases: string[];
  alternatives: string[];
  sourceDate?: string;
}
```

## Development Setup
1. Install dependencies:
   ```bash
   # Frontend
   npm install
   
   # Backend
   cd server
   npm install
   ```

2. Start development servers:
   ```bash
   # Frontend (http://localhost:5173)
   npm run dev
   
   # Backend (http://localhost:3000)
   cd server
   npm run dev
   ```

## Key Features
1. **Model Data Generation**
   - Uses Anthropic API to generate accurate model information
   - All content is generated in Hebrew
   - Includes verification and fact-checking in the prompt

2. **Data Storage**
   - Uses Supabase as the database
   - Implements Row Level Security (RLS)
   - Automatic timestamps for creation and updates

3. **Admin Interface**
   - Protected routes for admin access
   - Model addition and management
   - Preview generated data before saving

## Current State and Known Issues
1. **Data Generation**
   - The prompt is configured to generate Hebrew content
   - Strict validation for required fields
   - Error handling for API responses

2. **Database**
   - Table structure supports all required fields
   - JSONB type for flexible pricing data
   - Array types for lists (features, pros, cons, etc.)

3. **Frontend**
   - Hebrew UI implementation
   - RTL support
   - Form validation and error handling

## Security Measures
1. **API Security**
   - Environment variables for sensitive keys
   - CORS configuration for specific origins
   - Content Security Policy headers

2. **Database Security**
   - Row Level Security enabled
   - Separate policies for read and write operations
   - Protected admin routes

## Development Workflow
1. **Adding New Models**
   - Navigate to admin interface
   - Enter model name
   - Review generated data
   - Save to database

2. **Updating Models**
   - Access through admin interface
   - Modify existing data
   - Automatic update timestamp

## Troubleshooting
1. **Server Issues**
   - Check environment variables
   - Verify Anthropic API key
   - Check server logs for errors

2. **Database Issues**
   - Verify Supabase connection
   - Check table schema
   - Review RLS policies

3. **Frontend Issues**
   - Check browser console
   - Verify API endpoints
   - Check network requests

## Next Steps
1. **Features to Add**
   - Model comparison interface
   - Search functionality
   - User authentication
   - Model ratings and reviews

2. **Improvements**
   - Enhanced error handling
   - Better data validation
   - Caching for API responses
   - Performance optimization

## Resources
- [Supabase Documentation](https://supabase.io/docs)
- [Anthropic API Documentation](https://docs.anthropic.com/)
- [React Documentation](https://reactjs.org/docs)
- [Vite Documentation](https://vitejs.dev/guide/)
