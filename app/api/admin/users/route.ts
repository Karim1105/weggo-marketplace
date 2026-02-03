import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/db'
import User from '@/models/User'
import { requireAdmin } from '@/lib/auth'

async function handler(request: NextRequest) {
  try {
    await connectDB()

    const users = await User.find()
      .select('-password -resetPasswordToken -resetPasswordExpires')
      .sort({ createdAt: -1 })
      .lean()

    return NextResponse.json({
      success: true,
      users: users.map((u: any) => ({
        id: u._id.toString(),
        name: u.name,
        email: u.email,
        role: u.role,
        isVerified: u.isVerified,
        location: u.location,
        phone: u.phone,
        createdAt: u.createdAt,
      })),
    })
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to get users' },
      { status: 500 }
    )
  }
}

export const GET = requireAdmin(handler)
