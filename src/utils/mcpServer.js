// MCP Server Implementation
import { createUIResource } from './mcpClient'

// Available MCP Tools
const MCP_TOOLS = {
  create_assessment: {
    name: 'create_assessment',
    description: 'Create an interactive assessment form',
    handler: createAssessmentTool,
  },
  generate_report: {
    name: 'generate_report',
    description: 'Generate a comprehensive analysis report',
    handler: generateReportTool,
  },
  list_dimensions: {
    name: 'list_dimensions',
    description: 'List available assessment dimensions',
    handler: listDimensionsTool,
  },
  export_data: {
    name: 'export_data',
    description: 'Export assessment or report data',
    handler: exportDataTool,
  },
}

// Tool Handlers
async function createAssessmentTool(params) {
  const { type = 'maturity', dimensions = [] } = params
  const assessmentId = Date.now()

  // Create assessment in database (simulated)
  const assessment = {
    id: assessmentId,
    type,
    dimensions: dimensions.length > 0 ? dimensions : getDefaultDimensions(),
    createdAt: new Date().toISOString(),
    status: 'active',
  }

  // Generate UI resource
  const uiResource = createUIResource({
    uri: `ui://assessment/${assessmentId}`,
    title: 'Interactive Assessment Form',
    mimeType: 'text/html',
    text: generateAssessmentHTML(assessment),
    frameSize: ['900px', '700px'],
    initialData: { type, assessmentId }
  })

  return {
    success: true,
    assessment,
    uiResource,
  }
}

async function generateReportTool(params) {
  const { format = 'html', assessmentId } = params
  const reportId = Date.now()

  // Generate report data (simulated)
  const reportData = {
    id: reportId,
    assessmentId,
    format,
    generatedAt: new Date().toISOString(),
    metrics: generateSampleMetrics(),
  }

  // Generate UI resource
  const uiResource = createUIResource({
    uri: `ui://report/${reportId}`,
    title: 'Dynamic Analytics Report',
    mimeType: 'text/html',
    text: generateReportHTML(reportData),
    frameSize: ['1000px', '800px'],
    initialData: { format, reportId }
  })

  return {
    success: true,
    report: reportData,
    uiResource,
  }
}

async function listDimensionsTool() {
  return {
    success: true,
    dimensions: getDefaultDimensions(),
  }
}

async function exportDataTool(params) {
  const { type, id, format = 'json' } = params

  // Simulate data export
  const exportedData = {
    type,
    id,
    exportedAt: new Date().toISOString(),
    format,
    data: {
      // Sample data
      metrics: generateSampleMetrics(),
      timestamp: new Date().toISOString(),
    }
  }

  return {
    success: true,
    exportedData,
  }
}

// Helper Functions
function getDefaultDimensions() {
  return [
    { id: 'content-strategy', name: 'Content Strategy', description: 'Evaluate content management and strategy' },
    { id: 'data-management', name: 'Data Management', description: 'Assess data handling and processing' },
    { id: 'automation', name: 'Automation', description: 'Review automation capabilities' },
    { id: 'ai-integration', name: 'AI Integration', description: 'Analyze AI and ML implementation' },
    { id: 'workflow', name: 'Workflow Management', description: 'Evaluate process automation' },
    { id: 'analytics', name: 'Analytics & Reporting', description: 'Assess data analysis capabilities' },
  ]
}

function generateSampleMetrics() {
  return {
    totalUsers: Math.floor(Math.random() * 10000) + 1000,
    activeUsers: Math.floor(Math.random() * 5000) + 500,
    conversionRate: (Math.random() * 30 + 15).toFixed(1) + '%',
    revenue: '$' + (Math.random() * 100000 + 20000).toFixed(0),
  }
}

// Minimal dynamic HTML for assessment UI
function generateAssessmentHTML(assessment) {
  const { id, type } = assessment
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8" />
  <title>Assessment</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; margin: 0; padding: 16px; }
    .card { max-width: 800px; margin: 0 auto; background: #fff; border: 1px solid #e5e7eb; border-radius: 12px; padding: 20px; }
    .btn { background: #3b82f6; color: #fff; border: none; padding: 10px 16px; border-radius: 8px; cursor: pointer; }
    .row { display: flex; gap: 8px; align-items: center; margin: 8px 0; }
    input[type=range] { width: 100%; }
    .stat { background:#f3f4f6; padding:8px 10px; border-radius: 8px; display:inline-block; margin-right:8px; }
  </style>
</head>
<body>
  <div class="card">
    <h2>🎯 ${type} Assessment (ID: ${id})</h2>
    <p>Adjust the sliders and submit to send results back to the host app.</p>
    <div id="dims"></div>
    <div style="margin:12px 0;">
      <span class="stat">Average: <span id="avg">0</span></span>
      <span class="stat">Completed: <span id="completed">0</span></span>
    </div>
    <button class="btn" id="submit">Submit Assessment</button>
  </div>
  <script>
    const dimNames = ['Content Strategy','Data Management','Automation','AI Integration','Workflow','Analytics'];
    const scores = new Array(dimNames.length).fill(3);
    const root = document.getElementById('dims');
    dimNames.forEach((name, i) => {
      const row = document.createElement('div');
      row.className = 'row';
      row.innerHTML = '<div style="width:200px;">' + name + '</div>' +
        '<input type="range" min="1" max="5" value="3"/>' +
        '<div style="width:50px;text-align:center;" id="v'+i+'">3</div>';
      const slider = row.querySelector('input');
      slider.addEventListener('input', (e) => { scores[i] = parseInt(e.target.value, 10); document.getElementById('v'+i).textContent = e.target.value; update(); });
      root.appendChild(row);
    });
    function update(){
      const avg = (scores.reduce((a,b)=>a+b,0)/scores.length).toFixed(1);
      const completed = scores.filter(s=>s>0).length;
      document.getElementById('avg').textContent = avg;
      document.getElementById('completed').textContent = completed;
    }
    update();
    document.getElementById('submit').addEventListener('click', ()=>{
      const payload = {
        type: 'mcp-ui-action',
        tool: 'submit_assessment',
        params: {
          assessmentId: ${id},
          type: '${type}',
          scores: scores,
          timestamp: new Date().toISOString(),
          averageScore: (scores.reduce((a,b)=>a+b,0)/scores.length).toFixed(1)
        }
      };
      if (window.parent && window.parent.postMessage) {
        window.parent.postMessage(payload, '*');
      }
      alert('Submitted! Average: ' + payload.params.averageScore);
    });
  </script>
  </body>
  </html>`
}

// Minimal dynamic HTML for report UI
function generateReportHTML(report) {
  const { id, format } = report
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8" />
  <title>Report</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; margin: 0; padding: 16px; }
    .card { max-width: 960px; margin: 0 auto; background: #fff; border: 1px solid #e5e7eb; border-radius: 12px; padding: 20px; }
    .btn { background: #10b981; color: #fff; border: none; padding: 10px 16px; border-radius: 8px; cursor: pointer; margin-right: 8px; }
    .grid { display:grid; grid-template-columns: repeat(4,1fr); gap: 12px; margin: 16px 0; }
    .tile { background:#f3f4f6; border-radius: 12px; padding: 12px; text-align:center; }
  </style>
</head>
<body>
  <div class="card">
    <h2>📊 Report (ID: ${id}) • Format: ${format}</h2>
    <div class="grid">
      <div class="tile"><div>Total Users</div><div id="totalUsers">-</div></div>
      <div class="tile"><div>Active Users</div><div id="activeUsers">-</div></div>
      <div class="tile"><div>Conversion</div><div id="conversionRate">-</div></div>
      <div class="tile"><div>Revenue</div><div id="revenue">-</div></div>
    </div>
    <button class="btn" id="refresh">Refresh Data</button>
    <button class="btn" id="export">Export</button>
  </div>
  <script>
    function random(){
      return {
        totalUsers: Math.floor(Math.random()*2000)+1000,
        activeUsers: Math.floor(Math.random()*1000)+500,
        conversionRate: (Math.random()*30+15).toFixed(1) + '%',
        revenue: '$' + (Math.random()*100000+20000).toFixed(0)
      }
    }
    function render(m){
      document.getElementById('totalUsers').textContent = m.totalUsers;
      document.getElementById('activeUsers').textContent = m.activeUsers;
      document.getElementById('conversionRate').textContent = m.conversionRate;
      document.getElementById('revenue').textContent = m.revenue;
    }
    function refresh(){
      const m = random();
      render(m);
      if (window.parent && window.parent.postMessage) {
        window.parent.postMessage({ type:'mcp-ui-action', tool:'refresh_report', params:{ reportId:${id}, timestamp:new Date().toISOString() } }, '*');
      }
    }
    document.getElementById('refresh').addEventListener('click', refresh);
    document.getElementById('export').addEventListener('click', ()=>{
      const metrics = {
        totalUsers: document.getElementById('totalUsers').textContent,
        activeUsers: document.getElementById('activeUsers').textContent,
        conversionRate: document.getElementById('conversionRate').textContent,
        revenue: document.getElementById('revenue').textContent,
      };
      if (window.parent && window.parent.postMessage) {
        window.parent.postMessage({ type:'mcp-ui-action', tool:'export_report', params:{ reportId:${id}, format:'${format}', timestamp:new Date().toISOString(), metrics } }, '*');
      }
      alert('Report exported!');
    });
    // initial render
    refresh();
  </script>
  </body>
  </html>`
}

// MCP Server Handler
export async function mcpServerHandler(req) {
  try {
    const { method, params } = req.body

    // Handle different methods
    switch (method) {
      case 'tools/list':
        return {
          success: true,
          tools: Object.values(MCP_TOOLS).map(({ name, description }) => ({
            name,
            description,
          }))
        }

      case 'tools/call':
        const { name, arguments: args } = params
        const tool = MCP_TOOLS[name]

        if (!tool) {
          throw new Error(`Unknown tool: ${name}`)
        }

        return await tool.handler(args)

      case 'resources/read':
        const { uri } = params
        // Implement resource reading logic here
        return {
          success: true,
          resource: {
            uri,
            mimeType: 'text/html',
            text: '<div>Resource content</div>'
          }
        }

      default:
        throw new Error(`Unknown method: ${method}`)
    }
  } catch (error) {
    console.error('MCP Server Error:', error)
    return {
      success: false,
      error: error.message || 'Internal server error',
    }
  }
}

// Export the server
export const MCPServer = {
  handler: mcpServerHandler,
  tools: MCP_TOOLS,
}
