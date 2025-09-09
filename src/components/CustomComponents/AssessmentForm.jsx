'use client'

import { useState } from 'react'
import styles from './AssessmentForm.module.scss'

export default function AssessmentForm({ data, onAction }) {
  const [selections, setSelections] = useState({})
  const [currentStage, setCurrentStage] = useState(1)

  const handleSelection = (dimensionId, maturity) => {
    setSelections(prev => ({
      ...prev,
      [dimensionId]: maturity
    }))
  }

  const handleSubmit = () => {
    const assessmentData = {
      selections,
      timestamp: new Date(),
      totalDimensions: data?.dimensions?.length || 0,
      completedDimensions: Object.keys(selections).length
    }
    
    onAction({
      type: 'assessment_submitted',
      data: assessmentData
    })
  }

  const getMaturityColor = (maturity) => {
    switch (maturity) {
      case 'beginner': return '#dc3545'
      case 'intermediate': return '#ffc107'
      case 'advanced': return '#28a745'
      default: return '#6c757d'
    }
  }

  const getMaturityLabel = (maturity) => {
    switch (maturity) {
      case 'beginner': return 'Beginner'
      case 'intermediate': return 'Intermediate'
      case 'advanced': return 'Advanced'
      default: return 'Not Selected'
    }
  }

  return (
    <div className={styles.assessmentForm}>
      <div className={styles.header}>
        <h2>Stage {currentStage}: {data?.title || 'Digital commerce maturity assessment guide'}</h2>
        <p>{data?.description || 'Select any assessment dimension and choose the level of maturity.'}</p>
      </div>

      <div className={styles.progressBar}>
        <div className={styles.progressStep}>
          <div className={`${styles.stepNumber} ${currentStage >= 1 ? styles.active : ''}`}>1</div>
          <span>Assessment</span>
        </div>
        <div className={styles.progressLine}></div>
        <div className={styles.progressStep}>
          <div className={`${styles.stepNumber} ${currentStage >= 2 ? styles.active : ''}`}>2</div>
          <span>Analysis</span>
        </div>
        <div className={styles.progressLine}></div>
        <div className={styles.progressStep}>
          <div className={`${styles.stepNumber} ${currentStage >= 3 ? styles.active : ''}`}>3</div>
          <span>Strategy</span>
        </div>
        <div className={styles.progressLine}></div>
        <div className={styles.progressStep}>
          <div className={`${styles.stepNumber} ${currentStage >= 4 ? styles.active : ''}`}>4</div>
          <span>Report</span>
        </div>
      </div>

      <div className={styles.dimensions}>
        {data?.dimensions?.map((dimension, index) => (
          <div key={dimension.id} className={styles.dimension}>
            <div className={styles.dimensionHeader}>
              <h3>{dimension.name}</h3>
              <div className={styles.dimensionNumber}>
                {String(index + 1).padStart(2, '0')}
              </div>
            </div>
            
            <div className={styles.maturityLevels}>
              {['beginner', 'intermediate', 'advanced'].map(level => (
                <button
                  key={level}
                  className={`${styles.maturityButton} ${
                    selections[dimension.id] === level ? styles.selected : ''
                  }`}
                  onClick={() => handleSelection(dimension.id, level)}
                  style={{
                    '--maturity-color': getMaturityColor(level)
                  }}
                >
                  <div className={styles.maturityIndicator}></div>
                  <span className={styles.maturityLabel}>
                    {getMaturityLabel(level)}
                  </span>
                  <span className={styles.maturityDescription}>
                    {level === 'beginner' && 'Basic implementation, limited automation'}
                    {level === 'intermediate' && 'Moderate automation, some optimization'}
                    {level === 'advanced' && 'Full automation, advanced optimization'}
                  </span>
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className={styles.summary}>
        <div className={styles.summaryStats}>
          <div className={styles.stat}>
            <span className={styles.statNumber}>{Object.keys(selections).length}</span>
            <span className={styles.statLabel}>Completed</span>
          </div>
          <div className={styles.stat}>
            <span className={styles.statNumber}>{data?.dimensions?.length || 0}</span>
            <span className={styles.statLabel}>Total Dimensions</span>
          </div>
          <div className={styles.stat}>
            <span className={styles.statNumber}>
              {data?.dimensions?.length ? Math.round((Object.keys(selections).length / data.dimensions.length) * 100) : 0}%
            </span>
            <span className={styles.statLabel}>Progress</span>
          </div>
        </div>
      </div>

      <div className={styles.actions}>
        <button className="btn btn-outline">
          Cancel
        </button>
        <button className="btn btn-secondary">
          Previous
        </button>
        <button 
          className="btn btn-primary"
          onClick={handleSubmit}
          disabled={Object.keys(selections).length === 0}
        >
          Next
        </button>
      </div>
    </div>
  )
}
