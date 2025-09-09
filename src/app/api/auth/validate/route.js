import { NextResponse } from 'next/server'

// Mock user database (in production, use a real database)
const users = [
  {
    id: '1',
    name: 'John Doe',
    email: 'john@example.com',
    password: 'password123', // In production, this would be hashed
    preferences: {
      theme: 'light',
      language: 'en',
      notifications: true
    }
  }
]

export async function GET(request) {
  try {
    const authHeader = request.headers.get('authorization')
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'No token provided' },
        { status: 401 }
      )
    }

    const token = authHeader.substring(7) // Remove 'Bearer ' prefix

    try {
      // Decode token (in production, use proper JWT verification)
      const tokenData = JSON.parse(Buffer.from(token, 'base64').toString())
      
      // Find user
      const user = users.find(u => u.id === tokenData.userId && u.email === tokenData.email)
      
      if (!user) {
        return NextResponse.json(
          { error: 'Invalid token' },
          { status: 401 }
        )
      }

      // Return user data without password
      const { password: _, ...userWithoutPassword } = user

      return NextResponse.json({
        success: true,
        user: userWithoutPassword
      })
    } catch (tokenError) {
      return NextResponse.json(
        { error: 'Invalid token format' },
        { status: 401 }
      )
    }
  } catch (error) {
    console.error('Token validation error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
