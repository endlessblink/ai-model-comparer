import type { VercelRequest, VercelResponse } from '@vercel/node'
import Anthropic from '@anthropic-ai/sdk'

// Error handling utility
class APIError extends Error {
  constructor(
    message: string,
    public status: number = 500,
    public code: string = 'INTERNAL_SERVER_ERROR'
  ) {
    super(message)
    this.name = 'APIError'
  }
}

// Configure Anthropic client
const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY!,
})

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Credentials', 'true')
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,POST')
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  )

  // Handle preflight request
  if (req.method === 'OPTIONS') {
    res.status(200).end()
    return
  }

  try {
    // Validate request method
    if (req.method !== 'POST') {
      throw new APIError('Method not allowed', 405, 'METHOD_NOT_ALLOWED')
    }

    // Validate API key
    if (!process.env.ANTHROPIC_API_KEY) {
      throw new APIError('ANTHROPIC_API_KEY is not configured', 500, 'CONFIG_ERROR')
    }

    // Parse and validate request body
    const { model, options = {} } = req.body

    if (!model?.name) {
      throw new APIError('model.name is required', 400, 'VALIDATION_ERROR')
    }

    // Construct prompt
    const prompt = `Generate a comprehensive description for an AI model with the following details:
      Name: ${model.name}
      ${model.description ? `Context: ${model.description}` : ''}
      ${model.category ? `Category: ${model.category}` : ''}
      
      Please provide:
      1. A brief overview of the model's purpose and key features
      2. Its main use cases and applications
      3. Any notable technical specifications or requirements
      4. Key strengths and potential limitations
      
      Format the response as a JSON object with these fields:
      {
        "description": "Main description text",
        "features": ["list", "of", "key", "features"],
        "useCases": ["list", "of", "primary", "use", "cases"],
        "specifications": {
          "technical details as key-value pairs"
        },
        "strengths": ["list", "of", "strengths"],
        "limitations": ["list", "of", "limitations"]
      }`

    // Call Claude API
    const message = await anthropic.messages.create({
      model: 'claude-3-opus-20240229',
      max_tokens: options.maxLength || 1000,
      temperature: options.temperature || 0.7,
      messages: [{
        role: 'user',
        content: prompt
      }],
    })

    // Parse JSON response
    try {
      const content = message.content[0].text
      const jsonMatch = content.match(/\{[\s\S]*\}/)
      
      if (!jsonMatch) {
        throw new APIError('Failed to extract JSON from response', 500, 'PARSE_ERROR')
      }

      const parsedContent = JSON.parse(jsonMatch[0])
      res.status(200).json(parsedContent)
    } catch (parseError) {
      throw new APIError('Failed to parse response as JSON', 500, 'PARSE_ERROR')
    }

  } catch (error: any) {
    console.error('Generation error:', error)

    // Handle specific error types
    if (error instanceof APIError) {
      res.status(error.status).json({
        error: error.message,
        code: error.code
      })
      return
    }

    // Handle Anthropic API errors
    if (error.status) {
      res.status(error.status).json({
        error: error.message,
        code: 'ANTHROPIC_API_ERROR'
      })
      return
    }

    // Generic error response
    res.status(500).json({
      error: 'Internal server error',
      code: 'INTERNAL_SERVER_ERROR'
    })
  }
}
