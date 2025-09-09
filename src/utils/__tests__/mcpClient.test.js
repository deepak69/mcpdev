import { MCPClient, simulateMCPServerCall } from '../mcpClient'

// Mock fetch
global.fetch = jest.fn()

describe('MCPClient', () => {
  let mcpClient

  beforeEach(() => {
    mcpClient = new MCPClient('/api/mcp-server')
    fetch.mockClear()
  })

  describe('connect', () => {
    it('should connect successfully', async () => {
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ result: { tools: [] } })
      })

      const result = await mcpClient.connect()
      expect(result).toBe(true)
      expect(mcpClient.isConnected).toBe(true)
    })

    it('should handle connection failure', async () => {
      // Mock listTools to fail
      fetch.mockRejectedValueOnce(new Error('Network error'))

      const result = await mcpClient.connect()
      expect(result).toBe(false)
      expect(mcpClient.isConnected).toBe(false)
    })
  })

  describe('callTool', () => {
    it('should call tool successfully', async () => {
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ result: { success: true } })
      })

      const result = await mcpClient.callTool('test-tool', { param: 'value' })
      expect(result).toEqual({ success: true })
    })

    it('should retry on failure', async () => {
      fetch
        .mockRejectedValueOnce(new Error('Network error'))
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({ result: { success: true } })
        })

      const result = await mcpClient.callTool('test-tool', { param: 'value' })
      expect(result).toEqual({ success: true })
      expect(fetch).toHaveBeenCalledTimes(2)
    })

    it('should handle timeout', async () => {
      fetch.mockImplementationOnce(() => 
        new Promise((resolve) => 
          setTimeout(() => resolve({
            ok: true,
            json: async () => ({ result: { success: true } })
          }), 100)
        )
      )

      // Set short timeout for testing
      const originalTimeout = mcpClient.options.timeout
      mcpClient.options.timeout = 50

      await expect(mcpClient.callTool('test-tool')).rejects.toThrow()
      
      // Restore original timeout
      mcpClient.options.timeout = originalTimeout
    })
  })

  describe('listTools', () => {
    it('should list tools successfully', async () => {
      const mockTools = [
        { name: 'tool1', description: 'Tool 1' },
        { name: 'tool2', description: 'Tool 2' }
      ]

      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ result: { tools: mockTools } })
      })

      const result = await mcpClient.listTools()
      expect(result).toEqual(mockTools)
      expect(mcpClient.availableTools).toEqual(mockTools)
    })
  })
})

describe('simulateMCPServerCall', () => {
  it('should return assessment component for assessment message', async () => {
    const result = await simulateMCPServerCall('I want to start an assessment')
    
    expect(result.component).toBeDefined()
    expect(result.component.type).toBe('assessment-form')
    expect(result.component.data.dimensions).toBeDefined()
  })

  it('should return workflow component for guide message', async () => {
    const result = await simulateMCPServerCall('Guide me through the process')
    
    expect(result.component).toBeDefined()
    expect(result.component.type).toBe('workflow-guide')
    expect(result.component.data.steps).toBeDefined()
  })

  it('should return default response for other messages', async () => {
    const result = await simulateMCPServerCall('Hello world')
    
    expect(result.component).toBeNull()
    expect(result.content).toContain('explore Product Content Automation Strategy')
  })
})
