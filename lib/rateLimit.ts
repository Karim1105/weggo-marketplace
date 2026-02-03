import { NextRequest, NextResponse } from 'next/server'

interface RateLimitStore {
  [key: string]: {
    count: number
    resetTime: number
  }
}

const store: RateLimitStore = {}

export function rateLimit(
  maxRequests: number = 100,
  windowMs: number = 15 * 60 * 1000 // 15 minutes
) {
  return (req: NextRequest): NextResponse | null => {
    const ip = req.headers.get('x-forwarded-for') || 
               req.headers.get('x-real-ip') || 
               'unknown'
    
    const key = `rate_limit_${ip}`
    const now = Date.now()
    
    if (!store[key] || now > store[key].resetTime) {
      store[key] = {
        count: 1,
        resetTime: now + windowMs,
      }
      return null
    }
    
    store[key].count++
    
    if (store[key].count > maxRequests) {
      return NextResponse.json(
        { success: false, error: 'Too many requests, please try again later' },
        { status: 429 }
      )
    }
    
    return null
  }
}

// Clean up old entries periodically
setInterval(() => {
  const now = Date.now()
  Object.keys(store).forEach(key => {
    if (store[key].resetTime < now) {
      delete store[key]
    }
  })
}, 60000) // Clean every minute


