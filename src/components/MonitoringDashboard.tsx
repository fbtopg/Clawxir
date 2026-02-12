import { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export function MonitoringDashboard() {
  const [stats, setStats] = useState({
    activeUsers: 0,
    totalEvents: 0,
    errorCount: 0,
    avgLoadTime: 0
  });

  useEffect(() => {
    const fetchStats = async () => {
      const now = new Date();
      const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
      const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

      // Active users in last 24h
      const { count: activeUsers } = await supabase
        .from('analytics_events')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', oneDayAgo.toISOString())
        .not('user_id', 'is', null);

      // Total events in last 30 days
      const { count: totalEvents } = await supabase
        .from('analytics_events')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', thirtyDaysAgo.toISOString());

      // Error count in last 24h
      const { count: errorCount } = await supabase
        .from('error_logs')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', oneDayAgo.toISOString());

      // Average load time in last 24h
      const { data: performanceData } = await supabase
        .from('analytics_events')
        .select('event_data')
        .eq('event_name', 'performance_metric')
        .eq('event_data->metric', 'LCP')
        .gte('created_at', oneDayAgo.toISOString());

      const avgLoadTime = performanceData
        ? performanceData.reduce((acc, curr) => acc + (curr.event_data.value || 0), 0) / performanceData.length
        : 0;

      setStats({
        activeUsers: activeUsers || 0,
        totalEvents: totalEvents || 0,
        errorCount: errorCount || 0,
        avgLoadTime: Math.round(avgLoadTime || 0)
      });
    };

    fetchStats();
    const interval = setInterval(fetchStats, 60000); // Update every minute
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <div className="bg-gray-800 rounded-lg p-6">
        <h3 className="text-lg font-medium text-gray-200">Active Users (24h)</h3>
        <p className="text-3xl font-bold mt-2">{stats.activeUsers}</p>
      </div>

      <div className="bg-gray-800 rounded-lg p-6">
        <h3 className="text-lg font-medium text-gray-200">Total Events (30d)</h3>
        <p className="text-3xl font-bold mt-2">{stats.totalEvents}</p>
      </div>

      <div className="bg-gray-800 rounded-lg p-6">
        <h3 className="text-lg font-medium text-gray-200">Errors (24h)</h3>
        <p className="text-3xl font-bold mt-2">{stats.errorCount}</p>
      </div>

      <div className="bg-gray-800 rounded-lg p-6">
        <h3 className="text-lg font-medium text-gray-200">Avg Load Time</h3>
        <p className="text-3xl font-bold mt-2">{stats.avgLoadTime}ms</p>
      </div>
    </div>
  );
}