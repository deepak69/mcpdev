'use client'

import { useState } from 'react'
import MCPRenderer from './MCPRenderer'
import AssessmentForm from './CustomComponents/AssessmentForm'
import WorkflowGuide from './CustomComponents/WorkflowGuide'
import Dashboard from './CustomComponents/Dashboard'
import styles from './ComponentRenderer.module.scss'

export default function ComponentRenderer({ component, onComponentAction }) {
  const [activeTab, setActiveTab] = useState('Assessment')

  if (!component) {
    return (
      <div className={styles.emptyState}>
        <div className={styles.emptyContent}>
          <div className={styles.emptyIcon}>
            <svg width="64" height="64" viewBox="0 0 24 24" fill="none">
              <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <h3>Welcome to Agentic UI</h3>
          <p>Start a conversation to see interactive components and assessments.</p>
          <div className={styles.sampleActions}>
            <button className="btn btn-primary">
              Start Assessment
            </button>
            <button className="btn btn-outline">
              View Examples
            </button>
          </div>
        </div>
      </div>
    )
  }

  // Handle MCP UI Resources
  if (component.type === 'mcp-resource') {
    return <MCPRenderer resource={component.resource} onAction={onComponentAction} />
  }

  // Handle custom components
  const renderCustomComponent = () => {
    switch (component.type) {
      case 'assessment-form':
        return (
          <AssessmentForm 
            data={component.data} 
            onAction={onComponentAction}
          />
        )
      case 'workflow-guide':
        return (
          <WorkflowGuide 
            data={component.data} 
            onAction={onComponentAction}
          />
        )
      case 'dashboard':
        return (
          <Dashboard 
            data={component.data} 
            onAction={onComponentAction}
          />
        )
      default:
        return (
          <div className={styles.unknownComponent}>
            <h3>Unknown Component Type</h3>
            <p>Component type: {component.type}</p>
            <pre>{JSON.stringify(component, null, 2)}</pre>
          </div>
        )
    }
  }

  return (
    <div className={styles.componentContainer}>
      <div className={styles.componentHeader}>
        <div className={styles.headerContent}>
          <div className={styles.titleSection}>
            <h1>my optimization 01</h1>
            <p>Click to rename this Product Content Automation Strategy Optimizer</p>
          </div>
          <div className={styles.headerActions}>
            <div className={styles.badge}>AI</div>
            <button className={styles.actionButton} title="Download">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path d="M21 15V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <polyline points="7,10 12,15 17,10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <line x1="12" y1="15" x2="12" y2="3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
            <button className={styles.actionButton} title="Share">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <circle cx="18" cy="5" r="3" stroke="currentColor" strokeWidth="2"/>
                <circle cx="6" cy="12" r="3" stroke="currentColor" strokeWidth="2"/>
                <circle cx="18" cy="19" r="3" stroke="currentColor" strokeWidth="2"/>
                <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" stroke="currentColor" strokeWidth="2"/>
                <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" stroke="currentColor" strokeWidth="2"/>
              </svg>
            </button>
            <button className={styles.actionButton} title="Full screen">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path d="M8 3H5C4.46957 3 3.96086 3.21071 3.58579 3.58579C3.21071 3.96086 3 4.46957 3 5V8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M21 8V5C21 4.46957 20.7893 3.96086 20.4142 3.58579C20.0391 3.21071 19.5304 3 19 3H16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M16 21H19C19.5304 21 20.0391 20.7893 20.4142 20.4142C20.7893 20.0391 21 19.5304 21 19V16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M3 16V19C3 19.5304 3.21071 20.0391 3.58579 20.4142C3.96086 20.7893 4.46957 21 5 21H8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
            <button className={styles.actionButton} title="Close">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <line x1="18" y1="6" x2="6" y2="18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <line x1="6" y1="6" x2="18" y2="18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>
        </div>
        
        <div className={styles.tabs}>
          <button 
            className={`${styles.tab} ${activeTab === 'Assessment' ? styles.active : ''}`}
            onClick={() => setActiveTab('Assessment')}
          >
            Assessment
          </button>
          <button 
            className={`${styles.tab} ${activeTab === 'Systems' ? styles.active : ''}`}
            onClick={() => setActiveTab('Systems')}
          >
            Systems
          </button>
          <button 
            className={`${styles.tab} ${activeTab === 'Usages' ? styles.active : ''}`}
            onClick={() => setActiveTab('Usages')}
          >
            Usages
          </button>
          <button 
            className={`${styles.tab} ${activeTab === 'Review' ? styles.active : ''}`}
            onClick={() => setActiveTab('Review')}
          >
            Review
          </button>
        </div>
      </div>

      <div className={styles.componentContent}>
        {renderCustomComponent()}
      </div>
    </div>
  )
}