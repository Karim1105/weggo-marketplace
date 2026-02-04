import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/db'
import User from '@/models/User'

export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  try {
    // Security: require a secret header to prevent unauthorized admin creation
    const secret = request.headers.get('x-seed-admin-secret')
    if (secret !== process.env.SEED_ADMIN_SECRET) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    await connectDB()

    // Check if admin already exists
    const existingAdmin = await User.findOne({ role: 'admin' })
    if (existingAdmin) {
      return NextResponse.json(
        { success: false, error: 'Admin user already exists', admin: existingAdmin.name },
        { status: 400 }
      )
    }

    // Create admin user
    const adminUser = await User.create({
      name: 'not your average admin',
      email: 'admin@weggo.com',
      password: 'not your average admin', // Will be hashed by User model
      role: 'admin',
      sellerVerified: true,
      isVerified: true,
    })

    return NextResponse.json({
      success: true,
      message: 'Admin user created successfully',
      admin: {
        name: adminUser.name,
        email: adminUser.email,
        role: adminUser.role,
      },
    })
  } catch (error: any) {
    console.error('Seed admin error:', error)
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to create admin user' },
      { status: 500 }
    )
  }
}
