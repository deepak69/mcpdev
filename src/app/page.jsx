'use client'

import { useState } from 'react'
import ChatInterface from '../components/ChatInterface'
import ComponentRenderer from '../components/ComponentRenderer'
import { simulateMCPServerCall } from '../utils/mcpClient'
import styles from './page.module.scss'

export default function Home() {
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'assistant',
      content: 'Hello and welcome. Get started with your Product Content Automation Strategy by exploring the varied sample prompts, or asking a question below.',
      timestamp: new Date(),
      samplePrompts: [
        'Quick start with an assessment of current Product Content Automation Strategy',
        'Guide through a step by step process to optimize my Product Content Automation Strategy',
        'Show me my dashboard and overview',
        'Understand AI capabilities in data x context lorem ipsum lorem ipsum lorem ipsum lorem ipsum...'
      ]
    }
  ])
  const [currentComponent, setCurrentComponent] = useState(null)
  const [isLoading, setIsLoading] = useState(false)

  // Function to call real MCP server API
  const callMCPServer = async (message) => {
    try {
      // First try to call a tool based on message content
      let toolName = null
      let toolArgs = {}
      
      if (message.toLowerCase().includes('assessment')) {
        toolName = 'create_assessment'
        toolArgs = { type: 'maturity' }
      } else if (message.toLowerCase().includes('report')) {
        toolName = 'generate_report'
        toolArgs = { format: 'html' }
      }

      if (toolName) {
        // Call MCP tool
        const response = await fetch('/api/mcp-server', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            method: 'tools/call',
            params: {
              name: toolName,
              arguments: toolArgs
            }
          })
        })

        if (!response.ok) {
          throw new Error(`MCP server error: ${response.status}`)
        }

        const data = await response.json()
        
        if (data.result?.uiResource) {
          return {
            content: data.result.content || 'Tool executed successfully',
            component: {
              type: 'mcp-resource',
              resource: data.result.uiResource
            }
          }
        }
      }

      // Fallback to simulated response for other messages
      return await simulateMCPServerCall(message)
      
    } catch (error) {
      console.error('MCP server call failed:', error)
      // Fallback to simulated response
      return await simulateMCPServerCall(message)
    }
  }

  const handleSendMessage = async (message) => {
    // Add user message
    const newMessage = {
      id: Date.now(),
      type: 'user',
      content: message,
      timestamp: new Date()
    }

    setMessages(prev => [...prev, newMessage])
    setIsLoading(true)

    try {
      // Call real MCP server API
      const response = await callMCPServer(message)
      
      const assistantMessage = {
        id: Date.now() + 1,
        type: 'assistant',
        content: response.content,
        timestamp: new Date(),
        component: response.component
      }

      setMessages(prev => [...prev, assistantMessage])
      
      if (response.component) {
        setCurrentComponent(response.component)
      }
    } catch (error) {
      console.error('Error calling MCP server:', error)
      const errorMessage = {
        id: Date.now() + 1,
        type: 'assistant',
        content: 'Sorry, there was an error processing your request. Please try again.',
        timestamp: new Date()
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  // Handle component actions and send them back to chat
  const handleComponentAction = async (action) => {
    console.log('Component action received:', action)
    
    // Create a user message representing the action
    const actionMessage = {
      id: Date.now(),
      type: 'user',
      content: `UI Action: ${action.tool || 'unknown_action'}`,
      timestamp: new Date(),
      action: action
    }

    // Add the action as a user message
    setMessages(prev => [...prev, actionMessage])
    setIsLoading(true)

    try {
      // Process the action and generate a response
      const response = await processComponentAction(action)
      
      const assistantMessage = {
        id: Date.now() + 1,
        type: 'assistant',
        content: response.content,
        timestamp: new Date(),
        component: response.component
      }

      setMessages(prev => [...prev, assistantMessage])
      
      if (response.component) {
        setCurrentComponent(response.component)
      }
    } catch (error) {
      console.error('Error processing component action:', error)
      const errorMessage = {
        id: Date.now() + 1,
        type: 'assistant',
        content: 'Sorry, there was an error processing your action. Please try again.',
        timestamp: new Date()
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  // Process different types of component actions
  const processComponentAction = async (action) => {
    const { tool, params } = action

    switch (tool) {
      case 'submit_assessment':
        return {
          content: `🎯 Assessment Submitted Successfully!

**Assessment Results:**
- Assessment ID: ${params.assessmentId}
- Type: ${params.type}
- Average Score: ${params.averageScore}/5
- Timestamp: ${new Date(params.timestamp).toLocaleString()}

**Detailed Scores:**
${params.scores.map((score, index) => `- Dimension ${index + 1}: ${score}/5`).join('\n')}

Based on your assessment, I recommend focusing on the areas with lower scores. Would you like me to generate a detailed improvement plan or create a follow-up report?`,
          component: null
        }

      case 'refresh_report':
        return {
          content: `📊 Report Data Refreshed!

**Report Details:**
- Report ID: ${params.reportId}
- Last Updated: ${new Date(params.timestamp).toLocaleString()}

The analytics dashboard has been updated with the latest data. All metrics and charts have been refreshed to show current performance indicators.`,
          component: null
        }

      case 'export_report':
        return {
          content: `📥 Report Export Completed!

**Export Details:**
- Report ID: ${params.reportId}
- Format: ${params.format}
- Export Time: ${new Date(params.timestamp).toLocaleString()}

**Exported Metrics:**
- Total Users: ${params.metrics.totalUsers}
- Active Users: ${params.metrics.activeUsers}
- Conversion Rate: ${params.metrics.conversionRate}
- Revenue: ${params.metrics.revenue}

The report has been successfully exported and is ready for download or sharing.`,
          component: null
        }

      case 'button_click':
        return {
          content: `🔘 Button Clicked: ${params.id || 'Unknown Button'}

You clicked a button in the interface. This action has been recorded and processed. Is there anything specific you'd like me to help you with regarding this action?`,
          component: null
        }

      default:
        return {
          content: `⚡ UI Action Processed: ${tool}

**Action Details:**
${JSON.stringify(params, null, 2)}

This action has been received and processed. The system is ready for your next command.`,
          component: null
        }
    }
  }

  return (
    <div className={styles.container}>
      <div className={styles.chatSidebar}>
        <ChatInterface 
          messages={messages}
          onSendMessage={handleSendMessage}
          isLoading={isLoading}
        />
      </div>
      <div className={styles.componentArea}>
        <ComponentRenderer 
          component={currentComponent}
          onComponentAction={handleComponentAction}
        />
      </div>
    </div>
  )
}
