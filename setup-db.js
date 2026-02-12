const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  'https://tfvhifjsfwtlwgqmoklu.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRmdmhpZmpzZnd0bHdncW1va2x1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA4MzAzMTUsImV4cCI6MjA4NjQwNjMxNX0.kY88E3rutWaGY9TptmZRL88WYK5VgoVDCNmnDTAO19Q'
);

async function setupDatabase() {
  const { data, error } = await supabase
    .rpc('exec_sql', {
      query: `
        CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

        CREATE TABLE public.circuit_sessions (
            id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
            bot_id TEXT NOT NULL,
            created_at TIMESTAMPTZ DEFAULT NOW(),
            last_active_at TIMESTAMPTZ DEFAULT NOW(),
            metadata JSONB DEFAULT '{}'::jsonb
        );

        CREATE TABLE public.bot_states (
            id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
            session_id UUID REFERENCES public.circuit_sessions ON DELETE CASCADE,
            state_type TEXT NOT NULL,
            state_data JSONB NOT NULL,
            created_at TIMESTAMPTZ DEFAULT NOW()
        );

        CREATE TABLE public.circuit_events (
            id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
            session_id UUID REFERENCES public.circuit_sessions ON DELETE CASCADE,
            event_type TEXT NOT NULL,
            event_data JSONB NOT NULL,
            created_at TIMESTAMPTZ DEFAULT NOW()
        );

        CREATE INDEX idx_circuit_sessions_bot_id ON public.circuit_sessions(bot_id);
        CREATE INDEX idx_bot_states_session_id ON public.bot_states(session_id);
        CREATE INDEX idx_circuit_events_session_id ON public.circuit_events(session_id);

        ALTER TABLE public.circuit_sessions ENABLE ROW LEVEL SECURITY;
        ALTER TABLE public.bot_states ENABLE ROW LEVEL SECURITY;
        ALTER TABLE public.circuit_events ENABLE ROW LEVEL SECURITY;

        CREATE POLICY "Allow all" ON public.circuit_sessions FOR ALL USING (true);
        CREATE POLICY "Allow all" ON public.bot_states FOR ALL USING (true);
        CREATE POLICY "Allow all" ON public.circuit_events FOR ALL USING (true);
      `
    });

  if (error) {
    console.error('Error:', error);
  } else {
    console.log('Success:', data);
  }
}

setupDatabase();