import { useState, useEffect, useCallback } from 'react'
import { MCPClient } from '@/utils/mcpClient'

export function useMCPClient(serverUrl = '/api/mcp-server') {
  const [client] = useState(() => new MCPClient(serverUrl))
  const [isConnected, setIsConnected] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)
  const [availableTools, setAvailableTools] = useState([])

  const connect = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    
    try {
      const connected = await client.connect()
      setIsConnected(connected)
      
      if (connected) {
        const tools = await client.listTools()
        setAvailableTools(tools)
      }
    } catch (err) {
      setError(err.message)
      setIsConnected(false)
    } finally {
      setIsLoading(false)
    }
  }, [client])

  const callTool = useCallback(async (toolName, parameters = {}) => {
    setIsLoading(true)
    setError(null)
    
    try {
      const result = await client.callTool(toolName, parameters)
      return result
    } catch (err) {
      setError(err.message)
      throw err
    } finally {
      setIsLoading(false)
    }
  }, [client])

  const getResource = useCallback(async (uri) => {
    setIsLoading(true)
    setError(null)
    
    try {
      const result = await client.getResource(uri)
      return result
    } catch (err) {
      setError(err.message)
      throw err
    } finally {
      setIsLoading(false)
    }
  }, [client])

  useEffect(() => {
    connect()
  }, [connect])

  return {
    client,
    isConnected,
    isLoading,
    error,
    availableTools,
    connect,
    callTool,
    getResource
  }
}
