import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/db'
import Report from '@/models/Report'
import { getAuthUser } from '@/lib/auth'

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getAuthUser(request)
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Please log in to report' },
        { status: 401 }
      )
    }

    await connectDB()
    const body = await request.json()
    const { reason } = body

    if (!reason || typeof reason !== 'string' || reason.trim().length === 0) {
      return NextResponse.json(
        { success: false, error: 'Please provide a reason' },
        { status: 400 }
      )
    }

    await Report.create({
      listing: params.id,
      reporter: user._id,
      reason: reason.trim(),
    })

    return NextResponse.json({
      success: true,
      message: 'Report submitted. Thank you.',
    })
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to submit report' },
      { status: 500 }
    )
  }
}
