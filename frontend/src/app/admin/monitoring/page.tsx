import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { MonitoringDashboard } from '@/components/MonitoringDashboard'

export default async function MonitoringPage() {
  const supabase = createServerComponentClient({ cookies })
  const { data: { session } } = await supabase.auth.getSession()

  // Check if user is admin
  const { data: user } = await supabase
    .from('user_preferences')
    .select('is_admin')
    .eq('user_id', session?.user?.id)
    .single()

  if (!session || !user?.is_admin) {
    redirect('/')
  }

  return (
    <div className="min-h-screen bg-gray-900 p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-8">System Monitoring</h1>
        <MonitoringDashboard />
      </div>
    </div>
  )
}