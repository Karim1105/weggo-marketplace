import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/db'
import Review from '@/models/Review'
import Product from '@/models/Product'
import { requireAuth } from '@/lib/auth'

async function handler(request: NextRequest, user: any) {
  await connectDB()

  if (request.method === 'GET') {
    const { searchParams } = new URL(request.url)
    const sellerId = searchParams.get('sellerId')

    if (sellerId) {
      const reviews = await Review.find({ seller: sellerId })
        .populate('reviewer', 'name email avatar')
        .populate('product', 'title images')
        .sort({ createdAt: -1 })
        .lean()

      const avgRating =
        reviews.length > 0
          ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
          : 0

      return NextResponse.json({
        success: true,
        reviews,
        averageRating: avgRating,
        totalReviews: reviews.length,
      })
    }

    return NextResponse.json(
      { success: false, error: 'Seller ID is required' },
      { status: 400 }
    )
  }

  if (request.method === 'POST') {
    const body = await request.json()
    const { sellerId, productId, rating, comment } = body

    if (!sellerId || !productId || !rating) {
      return NextResponse.json(
        { success: false, error: 'Seller ID, product ID, and rating are required' },
        { status: 400 }
      )
    }

    if (rating < 1 || rating > 5) {
      return NextResponse.json(
        { success: false, error: 'Rating must be between 1 and 5' },
        { status: 400 }
      )
    }

    // Check if user already reviewed this product
    const existing = await Review.findOne({
      reviewer: user._id,
      product: productId,
    })

    if (existing) {
      return NextResponse.json(
        { success: false, error: 'You have already reviewed this product' },
        { status: 400 }
      )
    }

    // Verify product exists and belongs to seller
    const product = await Product.findById(productId)
    if (!product || product.seller.toString() !== sellerId) {
      return NextResponse.json(
        { success: false, error: 'Invalid product or seller' },
        { status: 400 }
      )
    }

    const review = await Review.create({
      reviewer: user._id,
      seller: sellerId,
      product: productId,
      rating,
      comment,
    })

    await review.populate([
      { path: 'reviewer', select: 'name email avatar' },
      { path: 'product', select: 'title images' },
    ])

    return NextResponse.json({
      success: true,
      review,
    })
  }

  return NextResponse.json(
    { success: false, error: 'Method not allowed' },
    { status: 405 }
  )
}

export const GET = requireAuth(handler)
export const POST = requireAuth(handler)


