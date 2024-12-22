import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { corsHeaders } from '../_shared/cors.ts'
import { APIError, handleError } from '../_shared/errors.ts'
import { generateModelDescription } from '../_shared/anthropic.ts'

interface ContentGenerationPayload {
  model: {
    name: string;
    description?: string;
    category?: string;
    url?: string;
  };
  options?: {
    maxLength?: number;
    temperature?: number;
  };
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Log environment check
    const hasAnthropicKey = !!Deno.env.get('ANTHROPIC_API_KEY')
    console.log('Environment check:', {
      hasAnthropicKey,
      method: req.method,
      url: req.url,
      headers: Object.fromEntries(req.headers.entries())
    })

    // Validate request method
    if (req.method !== 'POST') {
      console.error(`Invalid method: ${req.method}`)
      throw new APIError(`Method ${req.method} not allowed`, 405)
    }

    // Parse and validate request data
    let payload: ContentGenerationPayload
    let rawBody: string
    try {
      rawBody = await req.text()
      console.log('Raw request body:', rawBody)
      
      try {
        payload = JSON.parse(rawBody)
        console.log('Parsed payload:', payload)
      } catch (parseError) {
        console.error('JSON parse error:', parseError)
        throw new APIError(`Invalid JSON in request body: ${parseError.message}`, 400)
      }
    } catch (error) {
      console.error('Request body error:', error)
      throw new APIError(`Error reading request body: ${error.message}`, 400)
    }

    // Validate payload structure
    if (!payload.model) {
      throw new APIError('Missing required field: model', 400)
    }

    const { model, options = {} } = payload
    
    // Validate required fields
    if (!model.name) {
      throw new APIError('Missing required field: model.name', 400)
    }

    // Check for API key before making the request
    if (!hasAnthropicKey) {
      console.error('ANTHROPIC_API_KEY is not configured')
      throw new APIError('ANTHROPIC_API_KEY is not configured', 500)
    }

    console.log('Starting model description generation...')
    const modelData = await generateModelDescription(
      model.name,
      model.url || 'Not specified',
      model.category || 'general',
      options
    )
    console.log('Model description generated successfully:', modelData)

    return new Response(JSON.stringify(modelData), {
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/json'
      }
    })
  } catch (error) {
    console.error('Detailed error:', {
      name: error.name,
      message: error.message,
      stack: error.stack,
      status: error instanceof APIError ? error.status : 500,
      requestUrl: req.url,
      requestMethod: req.method,
      isAPIError: error instanceof APIError,
      errorType: typeof error,
      errorDetails: error
    })

    // Create a detailed error response
    const errorResponse = {
      error: error.message,
      status: error instanceof APIError ? error.status : 500,
      details: error instanceof APIError ? error.details : undefined
    }

    return new Response(JSON.stringify(errorResponse), {
      status: error instanceof APIError ? error.status : 500,
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/json'
      }
    })
  }
})
