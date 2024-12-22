import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { corsHeaders } from '../_shared/cors.ts'

const ANTHROPIC_API_KEY = Deno.env.get('ANTHROPIC_API_KEY')
const ANTHROPIC_API_URL = 'https://api.anthropic.com/v1/messages'

interface AnthropicError {
  type: string
  message: string
}

interface AnthropicResponse {
  id: string
  type: string
  role: string
  content: Array<{
    type: string
    text: string
  }>
  model: string
  stop_reason: string | null
  usage: {
    input_tokens: number
    output_tokens: number
  }
}

serve(async (req) => {
  // Always add CORS headers
  const headers = { ...corsHeaders }

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers
    })
  }

  // Only allow POST requests
  if (req.method !== 'POST') {
    return new Response(
      JSON.stringify({
        error: 'Method not allowed',
        allowedMethods: ['POST', 'OPTIONS']
      }),
      {
        status: 405,
        headers: { ...headers, 'Content-Type': 'application/json' }
      }
    )
  }

  try {
    // Validate API key
    if (!ANTHROPIC_API_KEY) {
      throw new Error('Anthropic API key is not configured')
    }

    // Parse request
    let body
    try {
      body = await req.json()
    } catch (e) {
      return new Response(
        JSON.stringify({
          error: 'Invalid JSON in request body',
          details: e instanceof Error ? e.message : 'Unknown parsing error'
        }),
        {
          status: 400,
          headers: { ...headers, 'Content-Type': 'application/json' }
        }
      )
    }

    const { prompt, stream = false, max_tokens = 4096 } = body

    // Validate input
    if (!prompt || typeof prompt !== 'string') {
      return new Response(
        JSON.stringify({
          error: 'Invalid prompt parameter',
          details: 'Prompt must be a non-empty string'
        }),
        {
          status: 400,
          headers: { ...headers, 'Content-Type': 'application/json' }
        }
      )
    }

    // Prepare request
    const requestBody = {
      model: 'claude-3-opus-20240229',
      messages: [{ role: 'user', content: prompt }],
      max_tokens: Math.min(max_tokens, 4096),
      stream: stream,
      temperature: 0.7,
    }

    // Make request to Anthropic
    const response = await fetch(ANTHROPIC_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify(requestBody)
    })

    // Handle non-200 responses
    if (!response.ok) {
      const errorData = await response.json() as AnthropicError
      
      // Handle specific error types
      switch (errorData.type) {
        case 'invalid_request_error':
          return new Response(
            JSON.stringify({
              error: 'Invalid request parameters',
              details: errorData.message,
              type: errorData.type
            }),
            {
              status: 400,
              headers: { ...headers, 'Content-Type': 'application/json' }
            }
          )
        case 'authentication_error':
          return new Response(
            JSON.stringify({
              error: 'API key is invalid',
              details: errorData.message,
              type: errorData.type
            }),
            {
              status: 401,
              headers: { ...headers, 'Content-Type': 'application/json' }
            }
          )
        case 'rate_limit_error':
          return new Response(
            JSON.stringify({
              error: 'Rate limit exceeded',
              details: errorData.message,
              type: errorData.type
            }),
            {
              status: 429,
              headers: {
                ...headers,
                'Content-Type': 'application/json',
                'Retry-After': '60'
              }
            }
          )
        default:
          throw new Error(`Anthropic API error: ${errorData.message}`)
      }
    }

    // Handle streaming response
    if (stream) {
      const reader = response.body?.getReader()
      const encoder = new TextEncoder()
      const decoder = new TextDecoder()

      return new Response(
        new ReadableStream({
          async start(controller) {
            try {
              while (true) {
                const { done, value } = await reader!.read()
                if (done) break
                
                const chunk = decoder.decode(value)
                const lines = chunk.split('\n').filter(line => line.trim() !== '')
                
                for (const line of lines) {
                  if (line.startsWith('data: ')) {
                    const data = JSON.parse(line.slice(6))
                    controller.enqueue(encoder.encode(JSON.stringify(data) + '\n'))
                  }
                }
              }
              controller.close()
            } catch (error) {
              controller.error(error)
            }
          }
        }),
        {
          headers: {
            ...headers,
            'Content-Type': 'text/event-stream',
            'Cache-Control': 'no-cache',
            'Connection': 'keep-alive'
          }
        }
      )
    }

    // Handle regular response
    const data = await response.json() as AnthropicResponse
    return new Response(
      JSON.stringify({
        text: data.content[0].text,
        usage: data.usage,
        model: data.model,
        stop_reason: data.stop_reason
      }),
      {
        headers: { ...headers, 'Content-Type': 'application/json' }
      }
    )

  } catch (error) {
    console.error('Error processing request:', error)
    return new Response(
      JSON.stringify({
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString()
      }),
      {
        status: 500,
        headers: { ...headers, 'Content-Type': 'application/json' }
      }
    )
  }
})
