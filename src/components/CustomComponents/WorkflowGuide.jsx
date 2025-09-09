'use client'

import { useState } from 'react'
import styles from './WorkflowGuide.module.scss'

export default function WorkflowGuide({ data, onAction }) {
  const [currentStep, setCurrentStep] = useState(0)
  const [completedSteps, setCompletedSteps] = useState(new Set())

  const handleStepComplete = (stepId) => {
    setCompletedSteps(prev => new Set([...prev, stepId]))
    onAction({
      type: 'step_completed',
      data: { stepId, timestamp: new Date() }
    })
  }

  const handleNextStep = () => {
    if (currentStep < data?.steps?.length - 1) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handlePrevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const getStepStatus = (step) => {
    if (completedSteps.has(step.id)) return 'completed'
    if (currentStep === step.id - 1) return 'current'
    if (currentStep > step.id - 1) return 'available'
    return 'locked'
  }

  return (
    <div className={styles.workflowGuide}>
      <div className={styles.header}>
        <h2>{data?.title || 'Workflow Guide'}</h2>
        <p>Follow the step-by-step process to optimize your strategy</p>
      </div>

      <div className={styles.progressOverview}>
        <div className={styles.progressBar}>
          <div 
            className={styles.progressFill}
            style={{ 
              width: `${((currentStep + 1) / (data?.steps?.length || 1)) * 100}%` 
            }}
          ></div>
        </div>
        <div className={styles.progressText}>
          Step {currentStep + 1} of {data?.steps?.length || 0}
        </div>
      </div>

      <div className={styles.stepsContainer}>
        <div className={styles.stepsList}>
          {data?.steps?.map((step, index) => {
            const status = getStepStatus(step)
            return (
              <div 
                key={step.id} 
                className={`${styles.stepItem} ${styles[status]}`}
                onClick={() => status !== 'locked' && setCurrentStep(index)}
              >
                <div className={styles.stepIndicator}>
                  {status === 'completed' ? (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                      <path d="M20 6L9 17L4 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  ) : (
                    <span>{step.id}</span>
                  )}
                </div>
                <div className={styles.stepContent}>
                  <h3>{step.name}</h3>
                  <p>
                    {status === 'completed' && 'Step completed successfully'}
                    {status === 'current' && 'Currently working on this step'}
                    {status === 'available' && 'Ready to start'}
                    {status === 'locked' && 'Complete previous steps first'}
                  </p>
                </div>
              </div>
            )
          })}
        </div>

        <div className={styles.currentStep}>
          {data?.steps?.[currentStep] && (
            <div className={styles.stepDetail}>
              <h3>{data.steps[currentStep].name}</h3>
              <div className={styles.stepDescription}>
                {currentStep === 0 && (
                  <div>
                    <p>Begin by assessing your current Product Content Automation Strategy. This involves:</p>
                    <ul>
                      <li>Evaluating existing content management systems</li>
                      <li>Analyzing current automation tools and processes</li>
                      <li>Identifying pain points and inefficiencies</li>
                      <li>Documenting current workflows</li>
                    </ul>
                  </div>
                )}
                {currentStep === 1 && (
                  <div>
                    <p>Perform a comprehensive gap analysis to identify areas for improvement:</p>
                    <ul>
                      <li>Compare current state with industry best practices</li>
                      <li>Identify missing capabilities and tools</li>
                      <li>Analyze resource allocation and team skills</li>
                      <li>Document improvement opportunities</li>
                    </ul>
                  </div>
                )}
                {currentStep === 2 && (
                  <div>
                    <p>Develop a comprehensive strategy for optimization:</p>
                    <ul>
                      <li>Define clear objectives and success metrics</li>
                      <li>Create implementation roadmap</li>
                      <li>Identify required resources and budget</li>
                      <li>Establish governance and oversight processes</li>
                    </ul>
                  </div>
                )}
                {currentStep === 3 && (
                  <div>
                    <p>Create detailed implementation plans:</p>
                    <ul>
                      <li>Develop project timelines and milestones</li>
                      <li>Assign roles and responsibilities</li>
                      <li>Plan training and change management</li>
                      <li>Establish monitoring and evaluation processes</li>
                    </ul>
                  </div>
                )}
                {currentStep === 4 && (
                  <div>
                    <p>Implement continuous monitoring and optimization:</p>
                    <ul>
                      <li>Track key performance indicators</li>
                      <li>Conduct regular reviews and assessments</li>
                      <li>Implement feedback loops and improvements</li>
                      <li>Scale successful initiatives</li>
                    </ul>
                  </div>
                )}
              </div>
              
              <div className={styles.stepActions}>
                <button 
                  className="btn btn-outline"
                  onClick={handlePrevStep}
                  disabled={currentStep === 0}
                >
                  Previous
                </button>
                <button 
                  className="btn btn-primary"
                  onClick={() => handleStepComplete(data.steps[currentStep].id)}
                >
                  Mark Complete
                </button>
                <button 
                  className="btn btn-secondary"
                  onClick={handleNextStep}
                  disabled={currentStep === data.steps.length - 1}
                >
                  Next Step
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className={styles.workflowSummary}>
        <h4>Workflow Summary</h4>
        <div className={styles.summaryStats}>
          <div className={styles.stat}>
            <span className={styles.statNumber}>{completedSteps.size}</span>
            <span className={styles.statLabel}>Completed</span>
          </div>
          <div className={styles.stat}>
            <span className={styles.statNumber}>{data?.steps?.length || 0}</span>
            <span className={styles.statLabel}>Total Steps</span>
          </div>
          <div className={styles.stat}>
            <span className={styles.statNumber}>
              {data?.steps?.length ? Math.round((completedSteps.size / data.steps.length) * 100) : 0}%
            </span>
            <span className={styles.statLabel}>Progress</span>
          </div>
        </div>
      </div>
    </div>
  )
}
