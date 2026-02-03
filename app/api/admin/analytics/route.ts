import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/db'
import User from '@/models/User'
import Product from '@/models/Product'
import Message from '@/models/Message'
import Review from '@/models/Review'
import ViewHistory from '@/models/ViewHistory'
import Wishlist from '@/models/Wishlist'
import { requireAdmin } from '@/lib/auth'
import { getCache, setCache } from '@/lib/cache'

async function handler(request: NextRequest, user: any) {
  try {
    await connectDB()

    // Check cache
    const cacheKey = 'admin_analytics'
    const cached = getCache(cacheKey)
    if (cached) {
      return NextResponse.json(cached)
    }

    // Get all stats
    const [
      totalUsers,
      totalProducts,
      activeProducts,
      soldProducts,
      totalMessages,
      totalReviews,
      totalViews,
      totalWishlists,
      recentUsers,
      recentProducts,
      topCategories,
      topLocations,
    ] = await Promise.all([
      User.countDocuments(),
      Product.countDocuments(),
      Product.countDocuments({ status: 'active' }),
      Product.countDocuments({ status: 'sold' }),
      Message.countDocuments(),
      Review.countDocuments(),
      ViewHistory.countDocuments(),
      Wishlist.countDocuments(),
      User.find().sort({ createdAt: -1 }).limit(10).select('name email createdAt').lean(),
      Product.find()
        .sort({ createdAt: -1 })
        .limit(10)
        .populate('seller', 'name email')
        .select('title price category createdAt')
        .lean(),
      Product.aggregate([
        { $match: { status: 'active' } },
        { $group: { _id: '$category', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 10 },
      ]),
      Product.aggregate([
        { $match: { status: 'active' } },
        { $group: { _id: '$location', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 10 },
      ]),
    ])

    // Calculate average rating
    const reviews = await Review.find().lean()
    const avgRating =
      reviews.length > 0
        ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
        : 0

    // Get products by status
    const productsByStatus = await Product.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } },
    ])

    // Get users by month (last 6 months)
    const sixMonthsAgo = new Date()
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6)

    const usersByMonth = await User.aggregate([
      { $match: { createdAt: { $gte: sixMonthsAgo } } },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' },
          },
          count: { $sum: 1 },
        },
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } },
    ])

    const productsByMonth = await Product.aggregate([
      { $match: { createdAt: { $gte: sixMonthsAgo } } },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' },
          },
          count: { $sum: 1 },
        },
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } },
    ])

    const result = {
      success: true,
      analytics: {
        overview: {
          totalUsers,
          totalProducts,
          activeProducts,
          soldProducts,
          totalMessages,
          totalReviews,
          totalViews,
          totalWishlists,
          averageRating: Math.round(avgRating * 10) / 10,
        },
        recentUsers,
        recentProducts,
        topCategories,
        topLocations,
        productsByStatus,
        usersByMonth,
        productsByMonth,
      },
    }

    setCache(cacheKey, result, 300) // Cache for 5 minutes

    return NextResponse.json(result)
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to get analytics' },
      { status: 500 }
    )
  }
}

export const GET = requireAdmin(handler)


