// MCP Client utilities for communicating with MCP servers

export class MCPClient {
  constructor(serverUrl = '/api/mcp-server', options = {}) {
    this.serverUrl = serverUrl
    this.options = {
      timeout: 30000,
      retries: 3,
      ...options
    }
    this.isConnected = false
    this.availableTools = []
  }

  async connect() {
    try {
      await this.listTools()
      this.isConnected = true
      return true
    } catch (error) {
      console.error('Failed to connect to MCP server:', error)
      this.isConnected = false
      return false
    }
  }

  async callTool(toolName, parameters = {}, retryCount = 0) {
    try {
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), this.options.timeout)

      const response = await fetch(this.serverUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          method: 'tools/call',
          params: {
            name: toolName,
            arguments: parameters
          }
        }),
        signal: controller.signal
      })

      clearTimeout(timeoutId)

      if (!response.ok) {
        throw new Error(`MCP server error: ${response.status} ${response.statusText}`)
      }

      const data = await response.json()
      return data.result
    } catch (error) {
      if (retryCount < this.options.retries && error.name !== 'AbortError') {
        console.warn(`MCP tool call failed, retrying... (${retryCount + 1}/${this.options.retries})`)
        await new Promise(resolve => setTimeout(resolve, 1000 * (retryCount + 1)))
        return this.callTool(toolName, parameters, retryCount + 1)
      }
      console.error('MCP tool call failed:', error)
      throw error
    }
  }

  async listTools() {
    try {
      const response = await fetch(this.serverUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          method: 'tools/list'
        })
      })

      if (!response.ok) {
        throw new Error(`MCP server error: ${response.status}`)
      }

      const data = await response.json()
      return data.result?.tools || []
    } catch (error) {
      console.error('Failed to list MCP tools:', error)
      return []
    }
  }

  async getResource(uri) {
    try {
      const response = await fetch(this.serverUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          method: 'resources/read',
          params: { uri }
        })
      })

      if (!response.ok) {
        throw new Error(`MCP server error: ${response.status}`)
      }

      const data = await response.json()
      return data.result
    } catch (error) {
      console.error('Failed to get MCP resource:', error)
      throw error
    }
  }
}

// Simulated MCP server responses for development
export const simulateMCPServerCall = async (message) => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000))

  // Simulate different responses based on message content
  if (message.toLowerCase().includes('assessment')) {
    return {
      content: `Planning to optimize your Product Content Automation Strategy in 4 stages:

1. Assessment guide
2. Current systems in place  
3. Strategies required
4. Detailed Analysis Report

Let's first start with a maturity assessment. I'll help you evaluate your organization across all 14 dimensions. Would you like to start with a specific dimension, or shall I guide you through them systematically?`,
      component: {
        type: 'assessment-form',
        data: {
          title: 'Digital commerce maturity assessment guide',
          description: 'Select any assessment dimension and choose the level of maturity',
          dimensions: [
            { id: 'content-strategy', name: 'Content Strategy', maturity: 'beginner' },
            { id: 'data-management', name: 'Data Management', maturity: 'intermediate' },
            { id: 'automation', name: 'Automation', maturity: 'advanced' },
            { id: 'ai-integration', name: 'AI Integration', maturity: 'beginner' },
            { id: 'workflow', name: 'Workflow Management', maturity: 'intermediate' },
            { id: 'analytics', name: 'Analytics & Reporting', maturity: 'beginner' },
            { id: 'integration', name: 'System Integration', maturity: 'intermediate' },
            { id: 'scalability', name: 'Scalability', maturity: 'beginner' },
            { id: 'security', name: 'Security & Compliance', maturity: 'advanced' },
            { id: 'performance', name: 'Performance Optimization', maturity: 'intermediate' },
            { id: 'user-experience', name: 'User Experience', maturity: 'beginner' },
            { id: 'content-quality', name: 'Content Quality', maturity: 'intermediate' },
            { id: 'governance', name: 'Content Governance', maturity: 'beginner' },
            { id: 'innovation', name: 'Innovation & Future Readiness', maturity: 'beginner' }
          ]
        }
      }
    }
  }

  if (message.toLowerCase().includes('step by step') || message.toLowerCase().includes('guide')) {
    return {
      content: 'I\'ll guide you through a comprehensive step-by-step process to optimize your Product Content Automation Strategy. Let me create a structured workflow for you.',
      component: {
        type: 'workflow-guide',
        data: {
          title: 'Product Content Automation Strategy Optimization',
          steps: [
            { id: 1, name: 'Current State Assessment', status: 'pending' },
            { id: 2, name: 'Gap Analysis', status: 'pending' },
            { id: 3, name: 'Strategy Development', status: 'pending' },
            { id: 4, name: 'Implementation Planning', status: 'pending' },
            { id: 5, name: 'Monitoring & Optimization', status: 'pending' }
          ]
        }
      }
    }
  }

  if (message.toLowerCase().includes('mcp') || message.toLowerCase().includes('ui resource')) {
    // Example of returning an MCP UI Resource
    return {
      content: 'Here\'s an interactive MCP UI resource that demonstrates external component rendering:',
      component: {
        type: 'mcp-resource',
        resource: {
          uri: 'ui://example/interactive-form',
          mimeType: 'text/uri-list',
          text: 'https://example.com/interactive-form',
          _meta: {
            title: 'Interactive Assessment Form',
            'mcpui.dev/ui-preferred-frame-size': ['800px', '600px'],
            'mcpui.dev/ui-initial-render-data': { 
              theme: 'light',
              mode: 'assessment'
            }
          }
        }
      }
    }
  }

  return {
    content: 'I understand you want to explore Product Content Automation Strategy. How can I help you get started? You can ask me about assessments, optimization strategies, or specific capabilities.',
    component: null
  }
}

// Utility function to create MCP UI Resources
export const createUIResource = (config) => {
  return {
    uri: config.uri,
    mimeType: config.mimeType || 'text/uri-list',
    text: config.text || config.iframeUrl,
    _meta: {
      title: config.title || 'Interactive Component',
      'mcpui.dev/ui-preferred-frame-size': config.frameSize || ['800px', '600px'],
      'mcpui.dev/ui-initial-render-data': config.initialData || {},
      ...config.meta
    }
  }
}

// Generate dynamic HTML for assessment form
const generateAssessmentHTML = (id, type) => {
  const dimensions = [
    { name: 'Content Strategy', current: 2, target: 4 },
    { name: 'Data Management', current: 3, target: 5 },
    { name: 'Automation', current: 1, target: 4 },
    { name: 'AI Integration', current: 2, target: 5 },
    { name: 'Workflow Management', current: 3, target: 4 },
    { name: 'Analytics & Reporting', current: 2, target: 5 }
  ]

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Dynamic Assessment Form</title>
  <style>
    body { 
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; 
      margin: 0; 
      padding: 20px; 
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: #333;
    }
    .container { 
      max-width: 800px; 
      margin: 0 auto; 
      background: white; 
      border-radius: 12px; 
      padding: 30px; 
      box-shadow: 0 10px 30px rgba(0,0,0,0.1);
    }
    .header { 
      text-align: center; 
      margin-bottom: 30px; 
      border-bottom: 2px solid #f0f0f0; 
      padding-bottom: 20px;
    }
    .header h1 { 
      color: #2c3e50; 
      margin: 0; 
      font-size: 28px;
    }
    .header p { 
      color: #7f8c8d; 
      margin: 10px 0 0 0;
    }
    .dimension { 
      margin: 20px 0; 
      padding: 20px; 
      border: 1px solid #e1e8ed; 
      border-radius: 8px; 
      background: #f8f9fa;
    }
    .dimension h3 { 
      margin: 0 0 15px 0; 
      color: #2c3e50;
    }
    .progress-container { 
      display: flex; 
      align-items: center; 
      gap: 15px; 
      margin: 10px 0;
    }
    .progress-bar { 
      flex: 1; 
      height: 20px; 
      background: #ecf0f1; 
      border-radius: 10px; 
      overflow: hidden;
    }
    .progress-fill { 
      height: 100%; 
      background: linear-gradient(90deg, #3498db, #2ecc71); 
      transition: width 0.3s ease;
    }
    .slider { 
      width: 100%; 
      height: 8px; 
      border-radius: 4px; 
      background: #ddd; 
      outline: none; 
      margin: 10px 0;
    }
    .slider::-webkit-slider-thumb { 
      appearance: none; 
      width: 20px; 
      height: 20px; 
      border-radius: 50%; 
      background: #3498db; 
      cursor: pointer;
    }
    .score { 
      font-weight: bold; 
      color: #2c3e50; 
      min-width: 60px;
    }
    .submit-btn { 
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
      color: white; 
      border: none; 
      padding: 15px 30px; 
      border-radius: 8px; 
      font-size: 16px; 
      cursor: pointer; 
      margin-top: 20px; 
      width: 100%;
      transition: transform 0.2s ease;
    }
    .submit-btn:hover { 
      transform: translateY(-2px); 
    }
    .stats { 
      display: grid; 
      grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); 
      gap: 15px; 
      margin: 20px 0;
    }
    .stat-card { 
      background: #f8f9fa; 
      padding: 15px; 
      border-radius: 8px; 
      text-align: center;
    }
    .stat-value { 
      font-size: 24px; 
      font-weight: bold; 
      color: #3498db;
    }
    .stat-label { 
      font-size: 12px; 
      color: #7f8c8d; 
      margin-top: 5px;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>🎯 Dynamic Assessment Form</h1>
      <p>Interactive ${type} assessment - ID: ${id}</p>
    </div>
    
    <div class="stats">
      <div class="stat-card">
        <div class="stat-value" id="avgScore">0</div>
        <div class="stat-label">Average Score</div>
      </div>
      <div class="stat-card">
        <div class="stat-value" id="completed">0</div>
        <div class="stat-label">Completed</div>
      </div>
      <div class="stat-card">
        <div class="stat-value" id="total">${dimensions.length}</div>
        <div class="stat-label">Total Dimensions</div>
      </div>
    </div>

    ${dimensions.map((dim, index) => `
      <div class="dimension">
        <h3>${dim.name}</h3>
        <div class="progress-container">
          <span class="score">Current: ${dim.current}/5</span>
          <div class="progress-bar">
            <div class="progress-fill" style="width: ${(dim.current/5)*100}%"></div>
          </div>
        </div>
        <input type="range" class="slider" min="1" max="5" value="${dim.current}" 
               onchange="updateScore(${index}, this.value)" 
               oninput="updateProgress(${index}, this.value)">
        <div style="display: flex; justify-content: space-between; font-size: 12px; color: #7f8c8d;">
          <span>Beginner</span>
          <span>Expert</span>
        </div>
      </div>
    `).join('')}

    <button class="submit-btn" onclick="submitAssessment()">
      🚀 Submit Assessment & Generate Report
    </button>
  </div>

  <script>
    const dimensions = ${JSON.stringify(dimensions)};
    let scores = dimensions.map(d => d.current);
    
    function updateScore(index, value) {
      scores[index] = parseInt(value);
      updateStats();
    }
    
    function updateProgress(index, value) {
      const progressFill = document.querySelectorAll('.progress-fill')[index];
      progressFill.style.width = (value/5)*100 + '%';
    }
    
    function updateStats() {
      const avgScore = (scores.reduce((a, b) => a + b, 0) / scores.length).toFixed(1);
      const completed = scores.filter(s => s > 0).length;
      
      document.getElementById('avgScore').textContent = avgScore;
      document.getElementById('completed').textContent = completed;
    }
    
    function submitAssessment() {
      const data = {
        assessmentId: ${id},
        type: '${type}',
        scores: scores,
        timestamp: new Date().toISOString(),
        averageScore: (scores.reduce((a, b) => a + b, 0) / scores.length).toFixed(1)
      };
      
      // Send data back to parent
      if (window.parent && window.parent.postMessage) {
        window.parent.postMessage({
          type: 'mcp-ui-action',
          tool: 'submit_assessment',
          params: data
        }, '*');
      }
      
      alert('Assessment submitted! Average score: ' + data.averageScore + '/5');
    }
    
    // Initialize stats
    updateStats();
    
    // Simulate real-time updates
    setInterval(() => {
      const randomIndex = Math.floor(Math.random() * dimensions.length);
      const newScore = Math.floor(Math.random() * 5) + 1;
      if (Math.random() > 0.7) { // 30% chance to update
        updateScore(randomIndex, newScore);
        document.querySelectorAll('.slider')[randomIndex].value = newScore;
        updateProgress(randomIndex, newScore);
      }
    }, 3000);
  </script>
</body>
</html>`
}

// Generate dynamic HTML for analytics report
const generateReportHTML = (id, format) => {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Dynamic Analytics Report</title>
  <style>
    body { 
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; 
      margin: 0; 
      padding: 20px; 
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: #333;
    }
    .container { 
      max-width: 1000px; 
      margin: 0 auto; 
      background: white; 
      border-radius: 12px; 
      padding: 30px; 
      box-shadow: 0 10px 30px rgba(0,0,0,0.1);
    }
    .header { 
      text-align: center; 
      margin-bottom: 30px; 
      border-bottom: 2px solid #f0f0f0; 
      padding-bottom: 20px;
    }
    .header h1 { 
      color: #2c3e50; 
      margin: 0; 
      font-size: 28px;
    }
    .metrics-grid { 
      display: grid; 
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); 
      gap: 20px; 
      margin: 30px 0;
    }
    .metric-card { 
      background: #f8f9fa; 
      padding: 20px; 
      border-radius: 8px; 
      text-align: center; 
      border-left: 4px solid #3498db;
    }
    .metric-value { 
      font-size: 32px; 
      font-weight: bold; 
      color: #2c3e50; 
      margin: 10px 0;
    }
    .metric-label { 
      color: #7f8c8d; 
      font-size: 14px;
    }
    .chart-container { 
      background: #f8f9fa; 
      padding: 20px; 
      border-radius: 8px; 
      margin: 20px 0; 
      height: 300px; 
      display: flex; 
      align-items: center; 
      justify-content: center;
    }
    .chart { 
      width: 100%; 
      height: 100%; 
      background: linear-gradient(45deg, #3498db, #2ecc71, #f39c12, #e74c3c); 
      border-radius: 8px; 
      display: flex; 
      align-items: center; 
      justify-content: center; 
      color: white; 
      font-size: 18px; 
      font-weight: bold;
    }
    .data-table { 
      width: 100%; 
      border-collapse: collapse; 
      margin: 20px 0;
    }
    .data-table th, .data-table td { 
      padding: 12px; 
      text-align: left; 
      border-bottom: 1px solid #e1e8ed;
    }
    .data-table th { 
      background: #f8f9fa; 
      font-weight: bold; 
      color: #2c3e50;
    }
    .status-badge { 
      padding: 4px 8px; 
      border-radius: 4px; 
      font-size: 12px; 
      font-weight: bold;
    }
    .status-good { background: #d4edda; color: #155724; }
    .status-warning { background: #fff3cd; color: #856404; }
    .status-danger { background: #f8d7da; color: #721c24; }
    .refresh-btn { 
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
      color: white; 
      border: none; 
      padding: 10px 20px; 
      border-radius: 6px; 
      cursor: pointer; 
      margin: 10px 5px;
    }
    .refresh-btn:hover { 
      transform: translateY(-1px); 
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>📊 Dynamic Analytics Report</h1>
      <p>Real-time insights and metrics - Report ID: ${id} | Format: ${format}</p>
      <button class="refresh-btn" onclick="refreshData()">🔄 Refresh Data</button>
      <button class="refresh-btn" onclick="exportReport()">📥 Export Report</button>
    </div>
    
    <div class="metrics-grid">
      <div class="metric-card">
        <div class="metric-value" id="totalUsers">1,247</div>
        <div class="metric-label">Total Users</div>
      </div>
      <div class="metric-card">
        <div class="metric-value" id="activeUsers">892</div>
        <div class="metric-label">Active Users</div>
      </div>
      <div class="metric-card">
        <div class="metric-value" id="conversionRate">23.4%</div>
        <div class="metric-label">Conversion Rate</div>
      </div>
      <div class="metric-card">
        <div class="metric-value" id="revenue">$45,678</div>
        <div class="metric-label">Revenue</div>
      </div>
    </div>

    <div class="chart-container">
      <div class="chart" id="mainChart">
        📈 Interactive Chart Area<br>
        <small>Real-time data visualization</small>
      </div>
    </div>

    <table class="data-table">
      <thead>
        <tr>
          <th>Metric</th>
          <th>Current Value</th>
          <th>Previous Value</th>
          <th>Change</th>
          <th>Status</th>
        </tr>
      </thead>
      <tbody id="dataTableBody">
        <tr>
          <td>Page Views</td>
          <td id="pageViews">12,456</td>
          <td>11,234</td>
          <td>+10.9%</td>
          <td><span class="status-badge status-good">Good</span></td>
        </tr>
        <tr>
          <td>Bounce Rate</td>
          <td id="bounceRate">34.2%</td>
          <td>38.1%</td>
          <td>-10.2%</td>
          <td><span class="status-badge status-good">Good</span></td>
        </tr>
        <tr>
          <td>Session Duration</td>
          <td id="sessionDuration">4m 32s</td>
          <td>3m 45s</td>
          <td>+20.9%</td>
          <td><span class="status-badge status-good">Good</span></td>
        </tr>
        <tr>
          <td>Error Rate</td>
          <td id="errorRate">2.1%</td>
          <td>1.8%</td>
          <td>+16.7%</td>
          <td><span class="status-badge status-warning">Warning</span></td>
        </tr>
      </tbody>
    </table>
  </div>

  <script>
    function refreshData() {
      // Simulate data refresh
      const metrics = {
        totalUsers: Math.floor(Math.random() * 2000) + 1000,
        activeUsers: Math.floor(Math.random() * 1000) + 500,
        conversionRate: (Math.random() * 30 + 15).toFixed(1) + '%',
        revenue: '$' + (Math.random() * 100000 + 20000).toFixed(0),
        pageViews: Math.floor(Math.random() * 20000) + 10000,
        bounceRate: (Math.random() * 20 + 25).toFixed(1) + '%',
        sessionDuration: Math.floor(Math.random() * 3 + 2) + 'm ' + Math.floor(Math.random() * 60) + 's',
        errorRate: (Math.random() * 3 + 1).toFixed(1) + '%'
      };
      
      Object.keys(metrics).forEach(key => {
        const element = document.getElementById(key);
        if (element) {
          element.textContent = metrics[key];
        }
      });
      
      // Update chart
      const chart = document.getElementById('mainChart');
      chart.innerHTML = \`📈 Updated Chart<br><small>Last updated: \${new Date().toLocaleTimeString()}</small>\`;
      
      // Send update to parent
      if (window.parent && window.parent.postMessage) {
        window.parent.postMessage({
          type: 'mcp-ui-action',
          tool: 'refresh_report',
          params: { reportId: ${id}, timestamp: new Date().toISOString() }
        }, '*');
      }
    }
    
    function exportReport() {
      const data = {
        reportId: ${id},
        format: '${format}',
        timestamp: new Date().toISOString(),
        metrics: {
          totalUsers: document.getElementById('totalUsers').textContent,
          activeUsers: document.getElementById('activeUsers').textContent,
          conversionRate: document.getElementById('conversionRate').textContent,
          revenue: document.getElementById('revenue').textContent
        }
      };
      
      // Send export request to parent
      if (window.parent && window.parent.postMessage) {
        window.parent.postMessage({
          type: 'mcp-ui-action',
          tool: 'export_report',
          params: data
        }, '*');
      }
      
      alert('Report exported successfully!');
    }
    
    // Auto-refresh every 5 seconds
    setInterval(refreshData, 5000);
    
    // Initial data load
    setTimeout(refreshData, 1000);
  </script>
</body>
</html>`
}

// Example MCP server API endpoint (for Next.js API routes)
export const mcpServerHandler = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { method, params } = req.body

  try {
    switch (method) {
      case 'tools/list':
        return res.json({
          result: {
            tools: [
              {
                name: 'create_assessment',
                description: 'Create an interactive assessment form',
                inputSchema: {
                  type: 'object',
                  properties: {
                    type: { type: 'string', enum: ['maturity', 'capability'] },
                    dimensions: { type: 'array', items: { type: 'string' } }
                  }
                }
              },
              {
                name: 'generate_report',
                description: 'Generate a comprehensive analysis report',
                inputSchema: {
                  type: 'object',
                  properties: {
                    assessmentData: { type: 'object' },
                    format: { type: 'string', enum: ['pdf', 'html', 'json'] }
                  }
                }
              }
            ]
          }
        })

      case 'tools/call':
        const { name, arguments: args } = params
        
        if (name === 'create_assessment') {
          const assessmentId = Date.now()
          const uiResource = createUIResource({
            uri: `ui://assessment/${assessmentId}`,
            title: 'Interactive Assessment Form',
            mimeType: 'text/html',
            text: generateAssessmentHTML(assessmentId, args.type || 'maturity'),
            frameSize: ['900px', '700px'],
            initialData: { type: args.type || 'maturity' }
          })
          
          return res.json({
            result: {
              content: '🎯 Interactive Assessment Form Created! This dynamic form will help you evaluate your organization across key dimensions.',
              uiResource
            }
          })
        }

        if (name === 'generate_report') {
          const reportId = Date.now()
          const uiResource = createUIResource({
            uri: `ui://report/${reportId}`,
            title: 'Dynamic Analytics Report',
            mimeType: 'text/html',
            text: generateReportHTML(reportId, args.format || 'html'),
            frameSize: ['1000px', '800px'],
            initialData: { format: args.format || 'html' }
          })
          
          return res.json({
            result: {
              content: '📊 Dynamic Analytics Report Generated! This interactive dashboard shows real-time data and insights.',
              uiResource
            }
          })
        }
        
        return res.json({ result: { content: 'Tool executed successfully' } })

      case 'resources/read':
        const { uri } = params
        return res.json({
          result: {
            uri,
            mimeType: 'text/html',
            text: '<div>Resource content</div>'
          }
        })

      default:
        return res.status(400).json({ error: 'Unknown method' })
    }
  } catch (error) {
    console.error('MCP server error:', error)
    return res.status(500).json({ error: 'Internal server error' })
  }
}
