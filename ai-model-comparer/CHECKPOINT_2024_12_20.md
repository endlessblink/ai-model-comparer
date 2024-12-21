# Project Checkpoint - December 20, 2024

## Current Project State
AI Model Comparison Site - A web application for comparing different AI models with data generated through the Anthropic API.

### Active Development
- Frontend running on: http://localhost:5173
- Backend running on: http://localhost:3000
- Production deployment: Vercel (with automatic deployments from GitHub)
- Database: Supabase (with real-time updates)
- Using Claude model: claude-3-5-sonnet-20241022

### Environment Setup
```env
# Frontend (.env)
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

# Backend (.env)
ANTHROPIC_API_KEY=your_anthropic_api_key
```

### Key Files and Their Purposes

1. **Backend (server/index.ts)**
   - `pages/api/generate.ts`: Vercel serverless function for API handling
   - Express server setup (local development)
   - Anthropic API integration
   - Model data generation endpoint
   - Hebrew content generation
   - Latest model: claude-3-5-sonnet-20241022

2. **Frontend Structure**
   - `src/pages/admin/AddModel.tsx`: Admin interface for adding models
   - `src/utils/aiDataGenerator.ts`: API communication logic
   - `src/lib/database.types.ts`: Supabase database types
   - `src/types/modelTypes.ts`: TypeScript interfaces for model data
   - `src/lib/supabase.ts`: Supabase client configuration
   - `src/contexts/AuthContext.tsx`: Supabase authentication setup

3. **Database (Supabase)**
   - Table: models
   - Real-time updates enabled
   - Row Level Security (RLS) configured
   - Includes: name, description, features, pricing, pros/cons, etc.
   - Row Level Security enabled

### Recent Changes
1. Updated Claude model version to claude-3-5-sonnet-20241022
2. Improved error handling in model generation
3. Added Hebrew interface and content generation
4. Implemented proper TypeScript types for database

### Current Features
1. **Model Management**
   - Add new AI models
   - Generate model information automatically
   - Store in Supabase database

2. **Data Generation**
   - Hebrew content generation
   - Structured data format
   - Fact verification built into prompts

3. **User Interface**
   - RTL support for Hebrew
   - Admin interface for model management
   - Error handling and user feedback

### Known Issues
1. Need to ensure proper database connection
2. Verify Supabase table structure matches types
3. Monitor API response handling

### Next Steps
1. Test model addition functionality
2. Implement model comparison interface
3. Add search and filtering capabilities
4. Enhance error handling and user feedback

### Development Commands
```bash
# IMPORTANT: Always start both servers when running locally
# Terminal 1 - Start Frontend (Local Development)
cd ai-model-comparer
npm run dev
# Frontend will be available at: http://localhost:5173

# Terminal 2 - Start Backend (Local Development)
cd server
npm run dev
# Backend will be available at: http://localhost:3001

# Deploy to Production
git push origin main  # Automatic deployment via Vercel
```

### Local Development URLs
When running locally, always ensure both servers are running:
- Frontend URL: http://localhost:5173
- Backend URL: http://localhost:3001
- API Endpoints: http://localhost:3001/api/*

### Important Notes
1. The backend uses the latest Claude model version
2. All content is generated in Hebrew
3. Database schema includes support for complex pricing structures
4. Frontend is built with React + TypeScript + Vite
5. Production deployment is handled by Vercel
6. Database management and real-time updates through Supabase
7. Authentication handled by Supabase Auth

### Reference Documentation
- Full project documentation: PROJECT_DOCUMENTATION.md
- Database migrations: supabase/migrations/
- Type definitions: src/types/

## How to Use This Checkpoint
When starting a new chat:
1. Reference this checkpoint for project context
2. Mention any specific area you're working on
3. Include any error messages or issues you're encountering
4. Specify if you're working on frontend or backend

## Recent Troubleshooting
- Fixed Claude model version compatibility issue
- Updated type definitions for better TypeScript support
- Enhanced error handling in API responses
- Improved Hebrew content generation prompt

## Security Considerations
1. API keys stored in environment variables
2. Database access controlled through RLS
3. Protected admin routes
4. CORS configuration in place

This checkpoint represents the project state as of December 20, 2024. Use this document to maintain context across different chat sessions.
