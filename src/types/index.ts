// Message types
export interface Message {
  id: number
  type: 'user' | 'assistant'
  content: string
  timestamp: Date
  samplePrompts?: string[]
  component?: ComponentData
}

// Component types
export interface ComponentData {
  type: string
  data?: any
  resource?: MCPResource
}

export interface MCPResource {
  uri: string
  mimeType: string
  text: string
  _meta?: {
    title?: string
    [key: string]: any
  }
}

// Assessment types
export interface AssessmentDimension {
  id: string
  name: string
  maturity: 'beginner' | 'intermediate' | 'advanced'
}

export interface AssessmentData {
  title: string
  description: string
  dimensions: AssessmentDimension[]
}

// Workflow types
export interface WorkflowStep {
  id: number
  name: string
  status: 'pending' | 'current' | 'completed'
}

export interface WorkflowData {
  title: string
  steps: WorkflowStep[]
}

// MCP Client types
export interface MCPTool {
  name: string
  description: string
  inputSchema: {
    type: string
    properties: Record<string, any>
  }
}

export interface MCPToolCall {
  name: string
  arguments: Record<string, any>
}

export interface MCPResponse {
  content: string
  component?: ComponentData
  uiResource?: MCPResource
}

// User types
export interface User {
  id: string
  name: string
  email: string
  avatar?: string
  preferences?: UserPreferences
}

export interface UserPreferences {
  theme: 'light' | 'dark'
  language: string
  notifications: boolean
}

// Error types
export interface AppError {
  code: string
  message: string
  details?: any
}

// API types
export interface APIResponse<T = any> {
  success: boolean
  data?: T
  error?: AppError
}

// Component action types
export interface ComponentAction {
  type: string
  data: any
  timestamp: Date
}
