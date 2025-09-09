import { NextResponse } from 'next/server'

// Mock user database (in production, use a real database)
let users = [
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

export async function POST(request) {
  try {
    const { name, email, password } = await request.json()

    if (!name || !email || !password) {
      return NextResponse.json(
        { error: 'Name, email, and password are required' },
        { status: 400 }
      )
    }

    // Check if user already exists
    const existingUser = users.find(u => u.email === email)
    if (existingUser) {
      return NextResponse.json(
        { error: 'User with this email already exists' },
        { status: 409 }
      )
    }

    // Validate password strength
    if (password.length < 8) {
      return NextResponse.json(
        { error: 'Password must be at least 8 characters long' },
        { status: 400 }
      )
    }

    // Create new user
    const newUser = {
      id: (users.length + 1).toString(),
      name,
      email,
      password, // In production, hash this password
      preferences: {
        theme: 'light',
        language: 'en',
        notifications: true
      }
    }

    users.push(newUser)

    // Create JWT token (in production, use proper JWT)
    const token = Buffer.from(JSON.stringify({ userId: newUser.id, email: newUser.email })).toString('base64')

    // Return user data without password
    const { password: _, ...userWithoutPassword } = newUser

    return NextResponse.json({
      success: true,
      token,
      user: userWithoutPassword
    })
  } catch (error) {
    console.error('Registration error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
