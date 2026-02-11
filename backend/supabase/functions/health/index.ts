// Supabase Edge Function - Health Check
export async function handler() {
  return new Response(
    JSON.stringify({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      service: 'supabase-edge'
    }),
    {
      headers: { 'Content-Type': 'application/json' },
      status: 200
    }
  )
}