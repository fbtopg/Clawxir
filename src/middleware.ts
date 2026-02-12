import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { createClient } from '@supabase/supabase-js'

// Initialize Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_ROLE_KEY || ''
)

// Rate limiting map
const rateLimit = new Map()

export async function middleware(request: NextRequest) {
  // Get IP
  const ip = request.ip || '127.0.0.1'
  
  // Check rate limit
  const now = Date.now()
  const windowSize = parseInt(process.env.RATE_LIMIT_WINDOW_MS || '60000')
  const maxRequests = parseInt(process.env.RATE_LIMIT_REQUESTS || '100')
  
  // Get existing requests for this IP
  const requests = rateLimit.get(ip) || []
  const recentRequests = requests.filter(time => now - time < windowSize)
  
  if (recentRequests.length >= maxRequests) {
    // Log rate limit hit
    await supabase.from('anonymous_stats').insert({
      event_type: 'rate_limit',
      anonymous_data: {
        ip_hash: Buffer.from(ip).toString('base64'),
        path: request.nextUrl.pathname
      }
    })
    
    return new NextResponse('Too Many Requests', {
      status: 429,
      headers: {
        'Retry-After': Math.ceil(windowSize / 1000).toString()
      }
    })
  }
  
  // Update rate limit tracking
  recentRequests.push(now)
  rateLimit.set(ip, recentRequests)
  
  // Add cache control headers
  const response = NextResponse.next()
  const maxAge = process.env.CACHE_MAX_AGE || '3600'
  const staleWhileRevalidate = process.env.STALE_WHILE_REVALIDATE || '7200'
  
  response.headers.set(
    'Cache-Control',
    `public, max-age=${maxAge}, stale-while-revalidate=${staleWhileRevalidate}`
  )
  
  return response
}

export const config = {
  matcher: [
    '/api/:path*',
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
}