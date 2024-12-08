import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const response = NextResponse.next()
  
  // Remove X-Frame-Options completely
  response.headers.delete('X-Frame-Options')
  
  // Set comprehensive CSP header for Office add-in
  response.headers.set(
    'Content-Security-Policy',
    [
      "frame-ancestors *",
      "default-src 'self' https://*.office.com https://*.microsoft.com",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://appsforoffice.microsoft.com https://res.cdn.office.net https://*.office.com https://*.microsoft.com",
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' https: data:",
      "connect-src 'self' https://*.office.com https://*.microsoft.com https://*.office365.com https://*.outlook.com",
      "frame-src 'self' https://*.office.com https://*.microsoft.com https://*.office365.com https://*.outlook.com"
    ].join('; ')
  )

  return response
}

export const config = {
  matcher: '/:path*',
} 