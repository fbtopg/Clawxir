-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Error Logs Table
CREATE TABLE IF NOT EXISTS public.error_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    error_message TEXT NOT NULL,
    stack_trace TEXT,
    context JSONB DEFAULT '{}'::jsonb,
    user_id UUID REFERENCES auth.users(id),
    path TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Analytics Events Table
CREATE TABLE IF NOT EXISTS public.analytics_events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    event_name TEXT NOT NULL,
    event_data JSONB DEFAULT '{}'::jsonb,
    user_id UUID REFERENCES auth.users(id),
    session_id TEXT,
    path TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS error_logs_user_id_idx ON public.error_logs(user_id);
CREATE INDEX IF NOT EXISTS error_logs_created_at_idx ON public.error_logs(created_at);
CREATE INDEX IF NOT EXISTS analytics_events_user_id_idx ON public.analytics_events(user_id);
CREATE INDEX IF NOT EXISTS analytics_events_created_at_idx ON public.analytics_events(created_at);

-- Enable RLS (Row Level Security)
ALTER TABLE public.error_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.analytics_events ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Admins can see all errors" ON public.error_logs
    FOR SELECT USING (
        auth.uid() IN (
            SELECT user_id FROM public.user_preferences WHERE is_admin = true
        )
    );

CREATE POLICY "Users can see their own errors" ON public.error_logs
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Allow insert errors for all" ON public.error_logs
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Admins can see all analytics" ON public.analytics_events
    FOR SELECT USING (
        auth.uid() IN (
            SELECT user_id FROM public.user_preferences WHERE is_admin = true
        )
    );

CREATE POLICY "Users can see their own analytics" ON public.analytics_events
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Allow insert analytics for all" ON public.analytics_events
    FOR INSERT WITH CHECK (true);