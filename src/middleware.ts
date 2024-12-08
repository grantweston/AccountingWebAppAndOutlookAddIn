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
      "default-src 'self' https://*.office.com https://*.microsoft.com https://*.vercel.app https://*.supabase.co",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://appsforoffice.microsoft.com https://res.cdn.office.net https://*.office.com https://*.microsoft.com",
      "style-src 'self' 'unsafe-inline' https://res.cdn.office.net",
      "img-src 'self' https: data:",
      "connect-src 'self' https://*.office.com https://*.microsoft.com https://*.office365.com https://*.outlook.com https://*.vercel.app https://*.supabase.co",
      "frame-src 'self' https://*.office.com https://*.microsoft.com https://*.office365.com https://*.outlook.com"
    ].join('; ')
  )

  return response
}

export const config = {
  matcher: '/:path*',
} 