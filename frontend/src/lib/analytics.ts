import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

// Generate a session ID
const generateSessionId = () => {
  if (typeof window === 'undefined') return null
  let sessionId = localStorage.getItem('session_id')
  if (!sessionId) {
    sessionId = Math.random().toString(36).substring(2) + Date.now().toString(36)
    localStorage.setItem('session_id', sessionId)
  }
  return sessionId
}

// Track events
export async function trackEvent(eventName: string, eventData: any = {}) {
  try {
    const { data: { session } } = await supabase.auth.getSession()
    const sessionId = generateSessionId()
    
    await supabase.from('analytics_events').insert({
      event_name: eventName,
      event_data: eventData,
      user_id: session?.user?.id,
      session_id: sessionId,
      path: typeof window !== 'undefined' ? window.location.pathname : null
    })
  } catch (error) {
    console.error('Failed to track event:', error)
  }
}

// Log errors
export async function logError(error: Error, context: any = {}) {
  try {
    const { data: { session } } = await supabase.auth.getSession()
    
    await supabase.from('error_logs').insert({
      error_message: error.message,
      stack_trace: error.stack,
      context: {
        ...context,
        userAgent: typeof window !== 'undefined' ? window.navigator.userAgent : null,
        timestamp: new Date().toISOString()
      },
      user_id: session?.user?.id,
      path: typeof window !== 'undefined' ? window.location.pathname : null
    })
  } catch (e) {
    console.error('Failed to log error:', e)
  }
}

// Track page views
export function trackPageView() {
  trackEvent('page_view', {
    url: typeof window !== 'undefined' ? window.location.href : null,
    referrer: typeof window !== 'undefined' ? document.referrer : null
  })
}

// Performance monitoring
export function trackPerformance() {
  if (typeof window === 'undefined') return

  // First Contentful Paint
  new PerformanceObserver((entryList) => {
    for (const entry of entryList.getEntries()) {
      trackEvent('performance_metric', {
        metric: 'FCP',
        value: entry.startTime,
        path: window.location.pathname
      })
    }
  }).observe({ type: 'paint', buffered: true })

  // Largest Contentful Paint
  new PerformanceObserver((entryList) => {
    for (const entry of entryList.getEntries()) {
      trackEvent('performance_metric', {
        metric: 'LCP',
        value: entry.startTime,
        path: window.location.pathname
      })
    }
  }).observe({ type: 'largest-contentful-paint', buffered: true })

  // First Input Delay
  new PerformanceObserver((entryList) => {
    for (const entry of entryList.getEntries()) {
      trackEvent('performance_metric', {
        metric: 'FID',
        value: entry.processingStart - entry.startTime,
        path: window.location.pathname
      })
    }
  }).observe({ type: 'first-input', buffered: true })
}