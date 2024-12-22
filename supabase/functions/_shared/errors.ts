import { corsHeaders } from './cors.ts'

export class APIError extends Error {
  status: number
  constructor(message: string, status = 500) {
    super(message)
    this.name = 'APIError'
    this.status = status
  }
}

export function handleError(error: Error): Response {
  console.error('Function error:', error.message)
  
  const status = error instanceof APIError ? error.status : 500
  
  return new Response(
    JSON.stringify({
      error: error.message || 'An unknown error occurred'
    }),
    {
      status,
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/json'
      }
    }
  )
}
