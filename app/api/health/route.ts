import { NextResponse } from 'next/server'
import connectDB from '@/lib/db'

export async function GET() {
  try {
    await connectDB()
    return NextResponse.json({ success: true, status: 'ok', database: 'connected' })
  } catch (error: any) {
    return NextResponse.json(
      { success: false, status: 'error', database: 'disconnected', error: error.message },
      { status: 503 }
    )
  }
}
