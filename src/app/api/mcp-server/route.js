import { mcpServerHandler } from '../../../utils/mcpServer'

export async function POST(request) {
  try {
    const body = await request.json()

    if (!body?.method || typeof body.method !== 'string') {
      return Response.json({ error: 'Invalid request: method is required' }, { status: 400 })
    }

    const raw = await mcpServerHandler({ body })

    if (!raw?.success) {
      return Response.json({ error: raw?.error || 'Internal server error' }, { status: 500 })
    }

    let payload
    switch (body.method) {
      case 'tools/list': {
        payload = { result: { tools: raw.tools || [] } }
        break
      }
      case 'tools/call': {
        payload = { result: { content: raw.content || 'Tool executed successfully', uiResource: raw.uiResource } }
        break
      }
      case 'resources/read': {
        payload = { result: raw.resource }
        break
      }
      default: {
        payload = raw
      }
    }

    return Response.json(payload, { status: 200 })
  } catch (error) {
    console.error('MCP API error:', error)
    return Response.json({ error: 'Internal server error' }, { status: 500 })
  }
}