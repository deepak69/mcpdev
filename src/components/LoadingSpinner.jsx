'use client'

import styles from './LoadingSpinner.module.scss'

export default function LoadingSpinner({ 
  size = 'medium', 
  text = 'Loading...', 
  fullScreen = false 
}) {
  const sizeClass = styles[size] || styles.medium

  if (fullScreen) {
    return (
      <div className={styles.fullScreen}>
        <div className={styles.loadingContent}>
          <div className={`${styles.spinner} ${sizeClass}`}></div>
          {text && <p className={styles.loadingText}>{text}</p>}
        </div>
      </div>
    )
  }

  return (
    <div className={styles.container}>
      <div className={`${styles.spinner} ${sizeClass}`}></div>
      {text && <p className={styles.loadingText}>{text}</p>}
    </div>
  )
}
