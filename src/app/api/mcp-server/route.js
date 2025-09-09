import { mcpServerHandler } from '../../../utils/mcpClient'

export async function POST(request) {
  const body = await request.json()
  
  // Create a mock response object
  const mockRes = {
    status: (code) => ({
      json: (data) => ({ status: code, data })
    }),
    json: (data) => ({ status: 200, data })
  }

  try {
    const result = await mcpServerHandler({ 
      method: 'POST', 
      body 
    }, mockRes)
    
    return Response.json(result.data, { status: result.status })
  } catch (error) {
    console.error('MCP API error:', error)
    return Response.json({ error: 'Internal server error' }, { status: 500 })
  }
}
