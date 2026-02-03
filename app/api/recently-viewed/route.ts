import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/db'
import ViewHistory from '@/models/ViewHistory'
import Product from '@/models/Product'
import { requireAuth } from '@/lib/auth'

async function handler(request: NextRequest, user: any) {
  await connectDB()

  const recentViews = await ViewHistory.find({ user: user._id })
    .sort({ viewedAt: -1 })
    .limit(20)
    .populate('product')
    .lean()

  const products = recentViews
    .map((v: any) => v.product)
    .filter((p: any) => p && p.status === 'active')

  return NextResponse.json({
    success: true,
    products,
  })
}

export const GET = requireAuth(handler)


