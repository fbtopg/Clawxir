import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://tfvhifjsfwtlwgqmoklu.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRmdmhpZmpzZnd0bHdncW1va2x1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA4MzAzMTUsImV4cCI6MjA4NjQwNjMxNX0.kY88E3rutWaGY9TptmZRL88WYK5VgoVDCNmnDTAO19Q'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Utility function to check connection
export async function checkSupabaseConnection() {
  try {
    const { data, error } = await supabase.from('health_check').select('*').limit(1)
    if (error) throw error
    return { status: 'connected', timestamp: new Date().toISOString() }
  } catch (error) {
    console.error('Supabase connection error:', error)
    return { status: 'error', error: String(error) }
  }
}