# Agentic UI with MCP Integration

A Next.js application that demonstrates an agentic UI with a reusable chat interface and custom component rendering using MCP-UI.

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
│           └── route.js        # MCP server API endpoint
├── components/
│   ├── ChatInterface.jsx       # Reusable chat component
│   ├── ChatInterface.module.scss
│   ├── ComponentRenderer.jsx   # Component renderer with MCP-UI
│   ├── ComponentRenderer.module.scss
│   └── CustomComponents/
│       ├── AssessmentForm.jsx  # Assessment form component
│       ├── AssessmentForm.module.scss
│       ├── WorkflowGuide.jsx   # Workflow guide component
│       └── WorkflowGuide.module.scss
└── utils/
    └── mcpClient.js            # MCP client utilities
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
- Full integration with MCP-UI client library
- Supports rendering UI resources from MCP servers
- Handles UI actions and component interactions
- Secure iframe rendering for external components

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

## 📚 MCP-UI Integration

This project demonstrates how to integrate MCP-UI for interactive component rendering:

```jsx
import { UIResourceRenderer } from '@mcp-ui/client'

// Render MCP UI resources
<UIResourceRenderer
  resource={mcpResource}
  onUIAction={(action) => {
    console.log('UI Action:', action)
    // Handle user interactions
  }}
/>
```

### MCP UI Resource Structure
```javascript
const uiResource = {
  uri: 'ui://example/component',
  mimeType: 'text/uri-list',
  text: 'https://example.com/component',
  _meta: {
    title: 'Interactive Component',
    'mcpui.dev/ui-preferred-frame-size': ['800px', '600px'],
    'mcpui.dev/ui-initial-render-data': { theme: 'light' }
  }
}
```

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
