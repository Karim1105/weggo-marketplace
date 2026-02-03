import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/db'
import User from '@/models/User'
import { generateToken } from '@/lib/auth'
import { rateLimit } from '@/lib/rateLimit'

const DEFAULT_ADMIN_USERNAME = 'not your average admin'
const DEFAULT_ADMIN_PASSWORD = 'not your average admin'
const DEFAULT_ADMIN_EMAIL = 'admin@weggo.local'

export async function POST(request: NextRequest) {
  // Rate limiting
  const rateLimitResponse = rateLimit(5, 15 * 60 * 1000)(request)
  if (rateLimitResponse) return rateLimitResponse

  try {
    await connectDB()
    const body = await request.json()
    const { username, email, password } = body

    if ((!username && !email) || !password) {
      return NextResponse.json(
        { success: false, error: 'Username and password required' },
        { status: 400 }
      )
    }

    // Allow admin login by username (name) OR by email (backwards compat)
    let user = null as any
    if (typeof username === 'string' && username.trim()) {
      user = await User.findOne({ name: username.trim(), role: 'admin' })
    } else if (typeof email === 'string' && email.trim()) {
      user = await User.findOne({ email: email.toLowerCase().trim() })
    }

    // Bootstrap: if the requested default admin doesn't exist yet, create it *only*
    // when the correct username+password are provided.
    if (
      !user &&
      typeof username === 'string' &&
      username.trim() === DEFAULT_ADMIN_USERNAME &&
      password === DEFAULT_ADMIN_PASSWORD
    ) {
      const existingByEmail = await User.findOne({ email: DEFAULT_ADMIN_EMAIL })
      if (!existingByEmail) {
        user = await User.create({
          name: DEFAULT_ADMIN_USERNAME,
          email: DEFAULT_ADMIN_EMAIL,
          password: DEFAULT_ADMIN_PASSWORD,
          role: 'admin',
          isVerified: true,
          sellerVerified: true,
          banned: false,
        })
      } else if (existingByEmail.role === 'admin') {
        // If an admin exists at that email, set its name/password to match requested defaults
        existingByEmail.name = DEFAULT_ADMIN_USERNAME
        existingByEmail.password = DEFAULT_ADMIN_PASSWORD
        await existingByEmail.save()
        user = existingByEmail
      }
    }

    if (!user || user.role !== 'admin') {
      return NextResponse.json(
        { success: false, error: 'Invalid credentials' },
        { status: 401 }
      )
    }

    const match = await user.comparePassword(password)
    if (!match) {
      return NextResponse.json(
        { success: false, error: 'Invalid credentials' },
        { status: 401 }
      )
    }

    const token = generateToken(user)
    const response = NextResponse.json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      token,
    })
    response.cookies.set('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7,
    })
    return response
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: 'Login failed' },
      { status: 500 }
    )
  }
}


