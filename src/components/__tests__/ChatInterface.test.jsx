import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import ChatInterface from '../ChatInterface'

const mockMessages = [
  {
    id: 1,
    type: 'assistant',
    content: 'Hello! How can I help you?',
    timestamp: new Date('2024-01-01T10:00:00Z'),
    samplePrompts: ['Test prompt 1', 'Test prompt 2']
  },
  {
    id: 2,
    type: 'user',
    content: 'Hello there!',
    timestamp: new Date('2024-01-01T10:01:00Z')
  }
]

describe('ChatInterface', () => {
  const mockOnSendMessage = jest.fn()

  beforeEach(() => {
    mockOnSendMessage.mockClear()
  })

  it('renders messages correctly', () => {
    render(
      <ChatInterface 
        messages={mockMessages}
        onSendMessage={mockOnSendMessage}
        isLoading={false}
      />
    )

    expect(screen.getByText('Hello! How can I help you?')).toBeInTheDocument()
    expect(screen.getByText('Hello there!')).toBeInTheDocument()
  })

  it('renders sample prompts', () => {
    render(
      <ChatInterface 
        messages={mockMessages}
        onSendMessage={mockOnSendMessage}
        isLoading={false}
      />
    )

    expect(screen.getByText('Test prompt 1')).toBeInTheDocument()
    expect(screen.getByText('Test prompt 2')).toBeInTheDocument()
  })

  it('calls onSendMessage when sample prompt is clicked', () => {
    render(
      <ChatInterface 
        messages={mockMessages}
        onSendMessage={mockOnSendMessage}
        isLoading={false}
      />
    )

    fireEvent.click(screen.getByText('Test prompt 1'))
    expect(mockOnSendMessage).toHaveBeenCalledWith('Test prompt 1')
  })

  it('calls onSendMessage when form is submitted', async () => {
    render(
      <ChatInterface 
        messages={mockMessages}
        onSendMessage={mockOnSendMessage}
        isLoading={false}
      />
    )

    const input = screen.getByPlaceholderText('Type something...')
    const sendButton = screen.getByRole('button', { name: /send message/i })

    fireEvent.change(input, { target: { value: 'Test message' } })
    fireEvent.click(sendButton)

    expect(mockOnSendMessage).toHaveBeenCalledWith('Test message')
  })

  it('shows loading state', () => {
    render(
      <ChatInterface 
        messages={mockMessages}
        onSendMessage={mockOnSendMessage}
        isLoading={true}
      />
    )

    expect(screen.getByPlaceholderText('Type something...')).toBeDisabled()
  })

  it('does not send empty messages', () => {
    render(
      <ChatInterface 
        messages={mockMessages}
        onSendMessage={mockOnSendMessage}
        isLoading={false}
      />
    )

    const sendButton = screen.getByRole('button', { name: /send message/i })
    fireEvent.click(sendButton)

    expect(mockOnSendMessage).not.toHaveBeenCalled()
  })
})
