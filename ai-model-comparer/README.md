# AI Model Comparison Site

A comprehensive comparison tool for AI image generation models, built with React, TypeScript, and Supabase.

## Features

- Compare different AI image generation models
- Filter by categories, pricing, and features
- Protected admin interface for content management
- Real-time updates with Supabase
- Custom UI components with shadcn/ui

## Components

### Switch Component
The custom switch component has been styled to match the design:
```tsx
<Switch
  id="api-filter"
  className="peer inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors data-[state=checked]:bg-purple-500 data-[state=unchecked]:bg-gray-700"
/>

## Development Setup

1. Install dependencies:
```sh
npm install
```

2. Copy `.env.example` to `.env` and fill in your Supabase credentials:
```sh
cp .env.example .env
```

3. Start the development server:
```sh
npm run dev
```

## Deployment on Vercel

1. Push your code to GitHub
2. Visit [Vercel](https://vercel.com) and create a new project
3. Connect your GitHub repository
4. Configure environment variables:
   - Add `VITE_SUPABASE_URL`
   - Add `VITE_SUPABASE_ANON_KEY`
5. Deploy!

## Project Structure

- `/src/components` - React components
  - `/src/components/ui` - Shadcn UI components
- `/src/pages` - Page components
- `/src/lib` - Utility functions and API clients
- `/src/contexts` - React contexts (Auth, etc.)

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request
