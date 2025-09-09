'use client'

import { useState, useEffect } from 'react'
import styles from './Dashboard.module.scss'

export default function Dashboard({ data, onAction }) {
  const [stats, setStats] = useState({
    totalAssessments: 0,
    completedAssessments: 0,
    averageScore: 0,
    lastActivity: null
  })

  const [recentActivity, setRecentActivity] = useState([])

  useEffect(() => {
    // Simulate loading dashboard data
    loadDashboardData()
  }, [])

  const loadDashboardData = async () => {
    // Simulate API call
    setTimeout(() => {
      setStats({
        totalAssessments: 12,
        completedAssessments: 8,
        averageScore: 75,
        lastActivity: new Date()
      })

      setRecentActivity([
        { id: 1, type: 'assessment', title: 'Content Strategy Assessment', date: new Date(), status: 'completed' },
        { id: 2, type: 'workflow', title: 'Automation Workflow', date: new Date(), status: 'in_progress' },
        { id: 3, type: 'report', title: 'Monthly Report', date: new Date(), status: 'completed' }
      ])
    }, 1000)
  }

  const handleQuickAction = (action) => {
    onAction({
      type: 'quick_action',
      data: { action, timestamp: new Date() }
    })
  }

  return (
    <div className={styles.dashboard}>
      <div className={styles.header}>
        <h2>Dashboard</h2>
        <p>Overview of your Product Content Automation Strategy</p>
      </div>

      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <div className={styles.statIcon}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M9 11H15M9 15H15M17 21H7C5.89543 21 5 20.1046 5 19V5C5 3.89543 5.89543 3 7 3H12.5858C12.851 3 13.1054 3.10536 13.2929 3.29289L19.7071 9.70711C19.8946 9.89464 20 10.149 20 10.4142V19C20 20.1046 19.1046 21 18 21H17ZM17 21V10H13V6H7V19H17Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <div className={styles.statContent}>
            <div className={styles.statNumber}>{stats.totalAssessments}</div>
            <div className={styles.statLabel}>Total Assessments</div>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statIcon}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M9 12L11 14L15 10M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <div className={styles.statContent}>
            <div className={styles.statNumber}>{stats.completedAssessments}</div>
            <div className={styles.statLabel}>Completed</div>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statIcon}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M13 2L3 14H12L11 22L21 10H12L13 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <div className={styles.statContent}>
            <div className={styles.statNumber}>{stats.averageScore}%</div>
            <div className={styles.statLabel}>Average Score</div>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statIcon}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M12 8V12L15 15M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <div className={styles.statContent}>
            <div className={styles.statNumber}>
              {stats.lastActivity ? '2h' : '--'}
            </div>
            <div className={styles.statLabel}>Last Activity</div>
          </div>
        </div>
      </div>

      <div className={styles.quickActions}>
        <h3>Quick Actions</h3>
        <div className={styles.actionButtons}>
          <button 
            className={styles.actionButton}
            onClick={() => handleQuickAction('new_assessment')}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M12 5V19M5 12H19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            New Assessment
          </button>
          <button 
            className={styles.actionButton}
            onClick={() => handleQuickAction('view_reports')}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M9 19V6L21 3V16M9 19C9 20.1046 8.10457 21 7 21C5.89543 21 5 20.1046 5 19C5 17.8954 5.89543 17 7 17C8.10457 17 9 17.8954 9 19ZM21 16C21 17.1046 20.1046 18 19 18C17.8954 18 17 17.1046 17 16C17 14.8954 17.8954 14 19 14C20.1046 14 21 14.8954 21 16ZM9 6L21 3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            View Reports
          </button>
          <button 
            className={styles.actionButton}
            onClick={() => handleQuickAction('start_workflow')}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M13 2L3 14H12L11 22L21 10H12L13 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Start Workflow
          </button>
        </div>
      </div>

      <div className={styles.recentActivity}>
        <h3>Recent Activity</h3>
        <div className={styles.activityList}>
          {recentActivity.map(activity => (
            <div key={activity.id} className={styles.activityItem}>
              <div className={styles.activityIcon}>
                {activity.type === 'assessment' && (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <path d="M9 11H15M9 15H15M17 21H7C5.89543 21 5 20.1046 5 19V5C5 3.89543 5.89543 3 7 3H12.5858C12.851 3 13.1054 3.10536 13.2929 3.29289L19.7071 9.70711C19.8946 9.89464 20 10.149 20 10.4142V19C20 20.1046 19.1046 21 18 21H17ZM17 21V10H13V6H7V19H17Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                )}
                {activity.type === 'workflow' && (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <path d="M13 2L3 14H12L11 22L21 10H12L13 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                )}
                {activity.type === 'report' && (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <path d="M9 19V6L21 3V16M9 19C9 20.1046 8.10457 21 7 21C5.89543 21 5 20.1046 5 19C5 17.8954 5.89543 17 7 17C8.10457 17 9 17.8954 9 19ZM21 16C21 17.1046 20.1046 18 19 18C17.8954 18 17 17.1046 17 16C17 14.8954 17.8954 14 19 14C20.1046 14 21 14.8954 21 16ZM9 6L21 3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                )}
              </div>
              <div className={styles.activityContent}>
                <div className={styles.activityTitle}>{activity.title}</div>
                <div className={styles.activityMeta}>
                  <span className={`${styles.status} ${styles[activity.status]}`}>
                    {activity.status.replace('_', ' ')}
                  </span>
                  <span className={styles.date}>
                    {activity.date.toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
