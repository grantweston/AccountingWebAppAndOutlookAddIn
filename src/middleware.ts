import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const response = NextResponse.next()
  
  // Remove X-Frame-Options completely
  response.headers.delete('X-Frame-Options')
  
  // Set CSP header
  response.headers.set(
    'Content-Security-Policy',
    "frame-ancestors 'self' https://*.office.com https://*.office365.com https://*.outlook.com https://*.live.com;"
  )

  return response
}

export const config = {
  matcher: '/:path*',
} 