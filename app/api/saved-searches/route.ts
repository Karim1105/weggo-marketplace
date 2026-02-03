import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/db'
import { requireAuth } from '@/lib/auth'
import SavedSearch from '@/models/SavedSearch'

async function handler(request: NextRequest, user: any) {
  await connectDB()

  if (request.method === 'GET') {
    const searches = await SavedSearch.find({ user: user._id })
      .sort({ createdAt: -1 })
      .limit(50)
      .lean()

    return NextResponse.json({ success: true, searches })
  }

  if (request.method === 'POST') {
    const body = await request.json()
    const { name, params } = body || {}

    if (!name || typeof name !== 'string') {
      return NextResponse.json(
        { success: false, error: 'Name is required' },
        { status: 400 }
      )
    }
    if (!params || typeof params !== 'object') {
      return NextResponse.json(
        { success: false, error: 'Params are required' },
        { status: 400 }
      )
    }

    const safeParams: Record<string, string> = {}
    for (const [k, v] of Object.entries(params)) {
      if (typeof v === 'string' && v.trim()) safeParams[k] = v
    }

    const search = await SavedSearch.create({
      user: user._id,
      name: name.trim().slice(0, 80),
      params: safeParams,
    })

    return NextResponse.json({ success: true, search })
  }

  if (request.method === 'DELETE') {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    if (!id) {
      return NextResponse.json(
        { success: false, error: 'id is required' },
        { status: 400 }
      )
    }
    await SavedSearch.deleteOne({ _id: id, user: user._id })
    return NextResponse.json({ success: true })
  }

  return NextResponse.json(
    { success: false, error: 'Method not allowed' },
    { status: 405 }
  )
}

export const GET = requireAuth(handler)
export const POST = requireAuth(handler)
export const DELETE = requireAuth(handler)

