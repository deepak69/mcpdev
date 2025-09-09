# Agentic UI with MCP Integration

A Next.js application that demonstrates an agentic UI with a reusable chat interface and custom component rendering using MCP-UI. It includes a fully working local MCP server implemented via a Next.js API route that returns MCP UI resources (text/html) rendered with `@mcp-ui/client`.

## 🏗️ Architecture

```
┌─────────────────┬─────────────────────────────────┐
│   Chat Interface │     Component Renderer Area     │
│   (Left Side)   │        (Right Side)             │
│                 │                                 │
│ • Reusable      │ • MCP-UI Client Integration     │
│ • Message Flow  │ • Custom Component Rendering    │
│ • Sample Prompts│ • Dynamic UI Resources          │
│ • User Input    │ • Interactive Components        │
└─────────────────┴─────────────────────────────────┘
                           │
                    ┌─────────────┐
                    │ MCP Server  │
                    │ (Backend)   │
                    │             │
                    │ • Tools     │
                    │ • UI Resources│
                    │ • Data API  │
                    └─────────────┘
```

## 🚀 Features

- **Reusable Chat Interface**: Left sidebar with message handling, sample prompts, and user input
- **Component Renderer**: Right side area for rendering custom components and MCP UI resources
- **MCP Integration**: Full integration with MCP-UI for interactive component rendering
- **Custom Components**: Assessment forms, workflow guides, and interactive elements
- **Responsive Design**: Works on desktop and mobile devices
- **SCSS Styling**: Modern, clean UI with custom styling

## 📁 Project Structure

```
src/
├── app/
│   ├── layout.jsx              # Root layout
│   ├── page.jsx                # Main page with agentic UI
│   ├── globals.scss            # Global styles
│   ├── page.module.scss        # Page-specific styles
│   └── api/
│       └── mcp-server/
│           └── route.js        # MCP server API endpoint (POST tools/* & resources/read)
├── components/
│   ├── ChatInterface.jsx       # Reusable chat component
│   ├── ChatInterface.module.scss
│   ├── ComponentRenderer.jsx   # Switches between custom components and MCP UI
│   ├── ComponentRenderer.module.scss
│   ├── MCPRenderer.jsx         # Wrapper that renders <HtmlResource /> and wires onUiAction
│   ├── MCPRenderer.module.scss
│   └── CustomComponents/
│       ├── AssessmentForm.jsx  # Assessment form component
│       ├── AssessmentForm.module.scss
│       ├── WorkflowGuide.jsx   # Workflow guide component
│       └── WorkflowGuide.module.scss
└── utils/
    ├── mcpClient.js            # (legacy sim + helper to create UI resources)
    └── mcpServer.js            # Local MCP server: tools, uiResource generation, HTML generators
```

## 🛠️ Installation

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start development server:**
   ```bash
   npm run dev
   ```

3. **Open your browser:**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🎯 Usage

### Chat Interface
- The left sidebar provides a reusable chat interface
- Users can type messages or click sample prompts
- Messages are displayed with timestamps and sender information
- Loading states and typing indicators are included

### Component Rendering
- The right side renders custom components based on chat interactions
- Supports both custom React components and MCP UI resources
- Components are dynamically loaded based on user input

### MCP Integration
- Local MCP server implemented at `src/utils/mcpServer.js` and exposed via `src/app/api/mcp-server/route.js`.
- Returns MCP UI resources with `mimeType: text/html` and inline HTML strings; rendered securely in an iframe.
- Frontend uses `HtmlResource` from `@mcp-ui/client`; UI actions are emitted via `onUiAction` and fed back into the chat.

## 🔧 Customization

### Adding New Components
1. Create a new component in `src/components/CustomComponents/`
2. Add the component type to the `ComponentRenderer.jsx` switch statement
3. Update the MCP server simulation to return the new component type

### Styling
- Global styles are in `src/app/globals.scss`
- Component-specific styles use CSS modules
- SCSS is configured for easy customization

### MCP Server Integration
- The `mcpClient.js` utility provides MCP server communication
- API routes handle MCP protocol requests
- Easy to extend with real MCP server connections

## 📚 MCP-UI Integration (Client)

This project renders MCP UI resources using `HtmlResource`:

```jsx
import { HtmlResource } from '@mcp-ui/client'

<HtmlResource
  resource={mcpResource}
  onUiAction={(tool, params) => {
    // Forward UI actions from the iframe back to chat/app logic
    handleComponentAction({ tool, params })
  }}
/>
```

### MCP UI Resource Structure
```javascript
const uiResource = {
  uri: 'ui://assessment/123',
  mimeType: 'text/html',
  text: '<!DOCTYPE html>... (inline HTML with postMessage to parent) ...',
  _meta: {
    title: 'Interactive Assessment Form',
    'mcpui.dev/ui-preferred-frame-size': ['900px', '700px'],
    'mcpui.dev/ui-initial-render-data': { type: 'maturity' }
  }
}
```

## 🧩 MCP Server (Local)

- Location: `src/utils/mcpServer.js`
- Exposed via: `src/app/api/mcp-server/route.js`
- Supported methods:
  - `tools/list` → returns available tools
  - `tools/call` → executes tool and returns `{ result: { content, uiResource } }`
  - `resources/read` → returns resource content

### Tools implemented
- `create_assessment` → returns an interactive assessment UI (text/html)
- `generate_report` → returns an interactive analytics report UI (text/html)
- `list_dimensions` → returns assessment dimensions
- `export_data` → returns exported sample data

### Response shapes
- tools/list
```json
{
  "result": { "tools": [{ "name": "create_assessment", "description": "..." }, ...] }
}
```

- tools/call (example)
```json
{
  "result": {
    "content": "Tool executed successfully",
    "uiResource": {
      "uri": "ui://assessment/<id>",
      "mimeType": "text/html",
      "text": "<!DOCTYPE html>...",
      "_meta": {
        "title": "Interactive Assessment Form",
        "mcpui.dev/ui-preferred-frame-size": ["900px","700px"],
        "mcpui.dev/ui-initial-render-data": { "type": "maturity" }
      }
    }
  }
}
```

## ✅ How to verify locally

1. Start dev server
```bash
npm run dev
```

2. Verify API endpoints
```bash
# List tools
curl -s -X POST http://localhost:3000/api/mcp-server \
  -H 'Content-Type: application/json' \
  -d '{"method":"tools/list"}'

# Call create_assessment (should return result.uiResource)
curl -s -X POST http://localhost:3000/api/mcp-server \
  -H 'Content-Type: application/json' \
  -d '{"method":"tools/call","params":{"name":"create_assessment","arguments":{"type":"maturity"}}}'
```

3. UI checks
- Open `http://localhost:3000`
- Type “assessment” or “report” in chat → interactive iframe appears
- Click inside the iframe:
  - Assessment → “Submit Assessment” sends `submit_assessment` back to chat
  - Report → “Refresh Data” sends `refresh_report`; “Export” sends `export_report`

## 🧪 What’s working now
- Local MCP server with 4 tools
- Dynamic inline HTML for MCP UI resources
- Secure rendering via `HtmlResource` (iframe)
- Bi-directional messaging (iframe → parent via `postMessage`; parent reacts in chat)
- Network requests visible for `/api/mcp-server` in DevTools

## ⚠️ Notes / next steps
- Current MCP server is in-process via Next.js API; for production, point to a real MCP server if needed.
- Add authentication if your MCP server requires it.

## 🎨 Sample Interactions

### Assessment Form
- Type "assessment" or click the assessment sample prompt
- Interactive maturity assessment with 14 dimensions
- Real-time progress tracking and completion status

### Workflow Guide
- Type "step by step" or "guide" 
- Multi-step workflow with progress tracking
- Interactive step completion and navigation

### MCP UI Resources
- Type "mcp" or "ui resource"
- Demonstrates external component rendering
- Shows MCP-UI integration capabilities

## 🔒 Security

- All external components render in sandboxed iframes
- MCP-UI provides secure component isolation
- No direct access to host application from rendered components

## 📱 Responsive Design

- Desktop: Side-by-side chat and component areas
- Mobile: Stacked layout with collapsible sections
- Touch-friendly interface elements

## 🚀 Deployment

1. **Build the application:**
   ```bash
   npm run build
   ```

2. **Start production server:**
   ```bash
   npm start
   ```

3. **Deploy to your preferred platform:**
   - Vercel (recommended for Next.js)
   - Netlify
   - AWS Amplify
   - Any Node.js hosting platform

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🔗 Resources

- [MCP-UI Documentation](https://mcpui.dev/)
- [Next.js Documentation](https://nextjs.org/docs)
- [MCP Protocol Specification](https://modelcontextprotocol.io/)
- [React Documentation](https://react.dev/)

## 🆘 Support

For questions or issues:
1. Check the documentation
2. Search existing issues
3. Create a new issue with detailed information
4. Join the MCP community discussions
