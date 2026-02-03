import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const protectedPaths = ['/sell', '/profile', '/favorites', '/admin']

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const token = request.cookies.get('token')?.value

  const isProtected = protectedPaths.some((p) => pathname === p || pathname.startsWith(p + '/'))

  if (isProtected && !token) {
    const loginUrl = new URL('/login', request.url)
    loginUrl.searchParams.set('redirect', pathname)
    return NextResponse.redirect(loginUrl)
  }

  if (pathname.startsWith('/admin') && token) {
    // Admin role is checked in the API; we only ensure they're logged in here
    // Full admin check happens in /api/admin/* and admin page
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/sell', '/sell/:path*', '/profile', '/profile/:path*', '/favorites', '/favorites/:path*', '/admin', '/admin/:path*'],
}
