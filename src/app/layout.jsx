import './globals.scss'
import ErrorBoundary from '../components/ErrorBoundary'

export const metadata = {
  title: 'Agentic UI - MCP Client',
  description: 'Interactive UI with MCP server integration for custom component rendering',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <ErrorBoundary>
          {children}
        </ErrorBoundary>
      </body>
    </html>
  )
}
