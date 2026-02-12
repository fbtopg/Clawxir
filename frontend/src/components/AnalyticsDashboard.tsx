import { useEffect, useState } from 'react'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export default function AnalyticsDashboard() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeUsers: 0,
    totalCircuits: 0,
    errorRate: 0,
    pageViews: 0,
    avgLoadTime: 0
  })

  useEffect(() => {
    const fetchStats = async () => {
      const now = new Date()
      const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)

      // Get total users
      const { count: totalUsers } = await supabase
        .from('user_preferences')
        .select('*', { count: 'exact' })

      // Get active users (last 30 days)
      const { count: activeUsers } = await supabase
        .from('analytics_events')
        .select('user_id', { count: 'exact', head: true })
        .gte('created_at', thirtyDaysAgo.toISOString())
        .not('user_id', 'is', null)

      // Get total circuits
      const { count: totalCircuits } = await supabase
        .from('circuit_templates')
        .select('*', { count: 'exact' })

      // Get error rate
      const { count: totalErrors } = await supabase
        .from('error_logs')
        .select('*', { count: 'exact' })
        .gte('created_at', thirtyDaysAgo.toISOString())

      // Get page views
      const { count: pageViews } = await supabase
        .from('analytics_events')
        .select('*', { count: 'exact' })
        .eq('event_name', 'page_view')
        .gte('created_at', thirtyDaysAgo.toISOString())

      // Get average load time
      const { data: performanceData } = await supabase
        .from('analytics_events')
        .select('event_data')
        .eq('event_name', 'performance_metric')
        .eq('event_data->metric', 'LCP')
        .gte('created_at', thirtyDaysAgo.toISOString())

      const avgLoadTime = performanceData
        ? performanceData.reduce((acc, curr) => acc + (curr.event_data.value || 0), 0) / performanceData.length
        : 0

      setStats({
        totalUsers: totalUsers || 0,
        activeUsers: activeUsers || 0,
        totalCircuits: totalCircuits || 0,
        errorRate: totalErrors || 0,
        pageViews: pageViews || 0,
        avgLoadTime: Math.round(avgLoadTime || 0)
      })
    }

    fetchStats()
    const interval = setInterval(fetchStats, 60000) // Update every minute

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="bg-gray-800 rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-2">Users</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-400">Total</p>
            <p className="text-2xl font-bold">{stats.totalUsers}</p>
          </div>
          <div>
            <p className="text-sm text-gray-400">Active (30d)</p>
            <p className="text-2xl font-bold">{stats.activeUsers}</p>
          </div>
        </div>
      </div>

      <div className="bg-gray-800 rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-2">Circuits</h3>
        <p className="text-sm text-gray-400">Total Created</p>
        <p className="text-2xl font-bold">{stats.totalCircuits}</p>
      </div>

      <div className="bg-gray-800 rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-2">Performance</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-400">Errors (30d)</p>
            <p className="text-2xl font-bold">{stats.errorRate}</p>
          </div>
          <div>
            <p className="text-sm text-gray-400">Avg Load Time</p>
            <p className="text-2xl font-bold">{stats.avgLoadTime}ms</p>
          </div>
        </div>
      </div>

      <div className="bg-gray-800 rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-2">Traffic</h3>
        <p className="text-sm text-gray-400">Page Views (30d)</p>
        <p className="text-2xl font-bold">{stats.pageViews}</p>
      </div>
    </div>
  )
}