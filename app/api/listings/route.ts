import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/db'
import Product from '@/models/Product'
import { getAuthUser } from '@/lib/auth'
import { rateLimit } from '@/lib/rateLimit'
import { getCache, setCache } from '@/lib/cache'
import { handleImageUpload } from '@/lib/imageUpload'

export async function GET(request: NextRequest) {
  try {
    await connectDB()
    const searchParams = request.nextUrl.searchParams
    
    const category = searchParams.get('category')
    const subcategory = searchParams.get('subcategory')
    const location = searchParams.get('location')
    const minPrice = searchParams.get('minPrice')
    const maxPrice = searchParams.get('maxPrice')
    const search = searchParams.get('search')
    const sellerMe = searchParams.get('seller') === 'me'
    const sortBy = searchParams.get('sortBy') || 'newest'
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    const skip = (page - 1) * limit

    // Build query
    const query: any = { status: 'active' }

    if (sellerMe) {
      const user = await getAuthUser(request)
      if (!user) {
        return NextResponse.json(
          { success: false, error: 'Unauthorized' },
          { status: 401 }
        )
      }
      query.seller = user._id
    }

    if (category && category !== 'all') {
      query.category = category
    }
    if (subcategory && subcategory !== 'all') {
      query.subcategory = subcategory
    }

    if (location) {
      query.location = { $regex: location, $options: 'i' }
    }

    if (minPrice || maxPrice) {
      query.price = {}
      if (minPrice) query.price.$gte = parseInt(minPrice)
      if (maxPrice) query.price.$lte = parseInt(maxPrice)
    }

    if (search && search.trim()) {
      const term = search.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
      query.$or = [
        { title: { $regex: term, $options: 'i' } },
        { description: { $regex: term, $options: 'i' } },
      ]
    }

    // Build sort
    let sort: any = { createdAt: -1 }
    if (sortBy === 'price-low') sort = { price: 1 }
    if (sortBy === 'price-high') sort = { price: -1 }
    if (sortBy === 'oldest') sort = { createdAt: 1 }

    // Check cache (skip for "my listings")
    const cacheKey = sellerMe ? null : `listings_${JSON.stringify(query)}_${sortBy}_${page}_${limit}`
    const cached = cacheKey ? getCache(cacheKey) : null
    if (cached) {
      return NextResponse.json(cached)
    }

    const [products, total] = await Promise.all([
      Product.find(query)
        .populate('seller', 'name email avatar isVerified')
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .lean(),
      Product.countDocuments(query),
    ])

    const result = {
      success: true,
      listings: products,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    }

    if (cacheKey) setCache(cacheKey, result, 300) // Cache for 5 minutes

    return NextResponse.json(result)
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch listings' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  // Rate limiting
  const rateLimitResponse = rateLimit(10, 15 * 60 * 1000)(request)
  if (rateLimitResponse) return rateLimitResponse

  try {
    const user = await getAuthUser(request)
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const u = user as any
    if (u.banned) {
      return NextResponse.json(
        { success: false, error: 'Your account is banned from listing.' },
        { status: 403 }
      )
    }
    if (!u.sellerVerified) {
      return NextResponse.json(
        { success: false, error: 'You must be a verified seller to list items. Upload your government-issued ID in your profile first.', code: 'VERIFICATION_REQUIRED' },
        { status: 403 }
      )
    }

    await connectDB()

    const formData = await request.formData()
    const title = formData.get('title') as string
    const description = formData.get('description') as string
    const category = formData.get('category') as string
    const subcategory = (formData.get('subcategory') as string) || undefined
    const condition = formData.get('condition') as string
    const price = parseFloat(formData.get('price') as string)
    const location = formData.get('location') as string

    if (!title || !description || !category || !condition || !price || !location) {
      return NextResponse.json(
        { success: false, error: 'All fields are required' },
        { status: 400 }
      )
    }

    // Handle image upload
    const images = await handleImageUpload(formData, user._id.toString())

    if (images.length === 0) {
      return NextResponse.json(
        { success: false, error: 'At least one image is required' },
        { status: 400 }
      )
    }

    const product = await Product.create({
      title,
      description,
      category,
      subcategory: subcategory || undefined,
      condition,
      price,
      location,
      images,
      seller: user._id,
    })

    await product.populate('seller', 'name email avatar isVerified')

    return NextResponse.json({
      success: true,
      listing: product,
      message: 'Listing created successfully',
    })
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to create listing' },
      { status: 500 }
    )
  }
}
