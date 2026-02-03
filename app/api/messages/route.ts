import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/db'
import Message from '@/models/Message'
import { requireAuth } from '@/lib/auth'

async function handler(request: NextRequest, user: any) {
  await connectDB()

  if (request.method === 'GET') {
    const { searchParams } = new URL(request.url)
    const conversationId = searchParams.get('conversationId')
    const otherUserId = searchParams.get('otherUserId')
    const productId = searchParams.get('productId')

    if (conversationId) {
      // Get messages for a specific conversation
      const messages = await Message.find({ conversationId })
        .populate('sender', 'name email avatar')
        .populate('receiver', 'name email avatar')
        .populate('product', 'title price images')
        .sort({ createdAt: 1 })
        .lean()

      // Mark as read
      await Message.updateMany(
        { conversationId, receiver: user._id, read: false },
        { read: true }
      )

      return NextResponse.json({
        success: true,
        messages,
      })
    }

    // Get all conversations for user
    const conversations = await Message.aggregate([
      {
        $match: {
          $or: [{ sender: user._id }, { receiver: user._id }],
        },
      },
      {
        $sort: { createdAt: -1 },
      },
      {
        $group: {
          _id: '$conversationId',
          lastMessage: { $first: '$$ROOT' },
          unreadCount: {
            $sum: {
              $cond: [{ $eq: ['$receiver', user._id] }, { $cond: ['$read', 0, 1] }, 0],
            },
          },
        },
      },
    ])

    const conversationIds = conversations.map((c) => c._id)
    const messages = await Message.find({ conversationId: { $in: conversationIds } })
      .populate('sender', 'name email avatar')
      .populate('receiver', 'name email avatar')
      .populate('product', 'title price images')
      .sort({ createdAt: -1 })
      .lean()

    return NextResponse.json({
      success: true,
      conversations: conversations.map((conv) => ({
        conversationId: conv._id,
        lastMessage: messages.find((m) => m.conversationId === conv._id),
        unreadCount: conv.unreadCount,
      })),
    })
  }

  if (request.method === 'POST') {
    const body = await request.json()
    const { receiverId, productId, content } = body

    if (!receiverId || !content) {
      return NextResponse.json(
        { success: false, error: 'Receiver ID and content are required' },
        { status: 400 }
      )
    }

    // Generate conversation ID (sorted to ensure consistency)
    const userIds = [user._id.toString(), receiverId].sort()
    const conversationId = `${userIds[0]}_${userIds[1]}${productId ? `_${productId}` : ''}`

    const message = await Message.create({
      conversationId,
      sender: user._id,
      receiver: receiverId,
      product: productId,
      content,
    })

    await message.populate([
      { path: 'sender', select: 'name email avatar' },
      { path: 'receiver', select: 'name email avatar' },
      { path: 'product', select: 'title price images' },
    ])

    return NextResponse.json({
      success: true,
      message,
    })
  }

  return NextResponse.json(
    { success: false, error: 'Method not allowed' },
    { status: 405 }
  )
}

export const GET = requireAuth(handler)
export const POST = requireAuth(handler)


