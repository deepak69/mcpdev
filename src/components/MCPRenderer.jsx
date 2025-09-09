// MCP UI Resource Renderer
'use client'

import { useState, useEffect } from 'react'
import { HtmlResource } from '@mcp-ui/client'
import styles from './MCPRenderer.module.scss'

export default function MCPRenderer({ resource, onAction }) {
  const [error, setError] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    setIsLoading(true)
    setError(null)
    
    // Simulate resource loading
    setTimeout(() => {
      setIsLoading(false)
    }, 500)
  }, [resource?.uri])

  if (error) {
    return (
      <div className={styles.error}>
        <h3>Error Loading Component</h3>
        <p>{error.message}</p>
        <button onClick={() => window.location.reload()}>
          Reload Page
        </button>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className={styles.loading}>
        <div className={styles.spinner} />
        <p>Loading component...</p>
      </div>
    )
  }

  return (
    <div className={styles.mcpRenderer}>
      <div className={styles.header}>
        <h2>{resource._meta?.title || 'Interactive Component'}</h2>
        <div className={styles.badge}>MCP-UI</div>
      </div>
      
      <div className={styles.container}>
        <HtmlResource
          resource={resource}
          onUiAction={(tool, params) => {
            console.log('MCP UI Action:', { tool, params })
            onAction?.({ tool, params })
          }}
          onError={(error) => {
            console.error('MCP UI Error:', error)
            setError(error)
          }}
        />
      </div>
    </div>
  )
}
