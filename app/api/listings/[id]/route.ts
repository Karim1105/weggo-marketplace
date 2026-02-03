import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/db'
import Product from '@/models/Product'
import ViewHistory from '@/models/ViewHistory'
import { getAuthUser } from '@/lib/auth'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB()
    const product = await Product.findById(params.id)
      .populate('seller', 'name email avatar isVerified phone location')
      .lean()

    if (!product || product.status !== 'active') {
      return NextResponse.json(
        { success: false, error: 'Product not found' },
        { status: 404 }
      )
    }

    // Increment views
    await Product.findByIdAndUpdate(params.id, { $inc: { views: 1 } })

    // Track view history if user is logged in
    const user = await getAuthUser(request)
    if (user && user._id.toString() !== product.seller._id.toString()) {
      await ViewHistory.findOneAndUpdate(
        { user: user._id, product: params.id },
        { viewedAt: new Date() },
        { upsert: true, new: true }
      )
    }

    return NextResponse.json({
      success: true,
      product,
    })
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch product' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getAuthUser(request)
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    await connectDB()
    const product = await Product.findById(params.id)

    if (!product) {
      return NextResponse.json(
        { success: false, error: 'Product not found' },
        { status: 404 }
      )
    }

    if (product.seller.toString() !== user._id.toString() && user.role !== 'admin') {
      return NextResponse.json(
        { success: false, error: 'Forbidden' },
        { status: 403 }
      )
    }

    product.status = 'deleted'
    await product.save()

    return NextResponse.json({
      success: true,
      message: 'Product deleted successfully',
    })
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to delete product' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getAuthUser(request)
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    await connectDB()
    const product = await Product.findById(params.id)

    if (!product || product.status === 'deleted') {
      return NextResponse.json(
        { success: false, error: 'Product not found' },
        { status: 404 }
      )
    }

    if (product.seller.toString() !== user._id.toString() && user.role !== 'admin') {
      return NextResponse.json(
        { success: false, error: 'Forbidden' },
        { status: 403 }
      )
    }

    const body = await request.json()
    const {
      title,
      description,
      price,
      category,
      subcategory,
      condition,
      location,
    } = body

    if (title !== undefined) product.title = title
    if (description !== undefined) product.description = description
    if (price !== undefined) product.price = price
    if (category !== undefined) product.category = category
    if (subcategory !== undefined) product.subcategory = subcategory || undefined
    if (condition !== undefined) product.condition = condition
    if (location !== undefined) product.location = location

    await product.save()

    return NextResponse.json({
      success: true,
      listing: product,
      message: 'Product updated successfully',
    })
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to update product' },
      { status: 500 }
    )
  }
}


