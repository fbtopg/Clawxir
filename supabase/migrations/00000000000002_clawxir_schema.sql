-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- User Visualization Preferences
CREATE TABLE public.user_preferences (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users NOT NULL,
    theme_settings JSONB DEFAULT '{
        "background": "#1a1a1a",
        "grid": "#252525",
        "text": "#e0e0e0",
        "nodes": {
            "model": "#7c3aed",
            "tool": "#2563eb",
            "memory": "#059669",
            "process": "#dc2626"
        },
        "connections": {
            "data": "#60a5fa",
            "call": "#34d399",
            "response": "#fbbf24"
        }
    }',
    visualization_config JSONB DEFAULT '{
        "animationSpeed": 1,
        "showLabels": true,
        "gridSize": 20,
        "snapToGrid": true
    }',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Circuit Templates (Shareable Layouts)
CREATE TABLE public.circuit_templates (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    description TEXT,
    creator_id UUID REFERENCES auth.users NOT NULL,
    is_public BOOLEAN DEFAULT false,
    template_data JSONB NOT NULL,
    tags TEXT[] DEFAULT '{}',
    likes_count INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Circuit Nodes (Components of Templates)
CREATE TABLE public.circuit_nodes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    template_id UUID REFERENCES public.circuit_templates ON DELETE CASCADE,
    node_type TEXT NOT NULL CHECK (node_type IN ('model', 'tool', 'memory', 'process')),
    name TEXT NOT NULL,
    description TEXT,
    position JSONB NOT NULL,
    config JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Circuit Connections
CREATE TABLE public.circuit_connections (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    template_id UUID REFERENCES public.circuit_templates ON DELETE CASCADE,
    source_node UUID REFERENCES public.circuit_nodes ON DELETE CASCADE,
    target_node UUID REFERENCES public.circuit_nodes ON DELETE CASCADE,
    connection_type TEXT NOT NULL CHECK (connection_type IN ('data', 'call', 'response')),
    config JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Pattern Library (Reusable Components)
CREATE TABLE public.pattern_library (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    description TEXT,
    creator_id UUID REFERENCES auth.users NOT NULL,
    is_public BOOLEAN DEFAULT false,
    pattern_type TEXT NOT NULL,
    pattern_data JSONB NOT NULL,
    tags TEXT[] DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Anonymous Usage Stats (No Personal Data)
CREATE TABLE public.anonymous_stats (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    event_type TEXT NOT NULL,
    anonymous_data JSONB NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS Policies

-- User Preferences Policies
ALTER TABLE public.user_preferences ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own preferences"
    ON public.user_preferences FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can update own preferences"
    ON public.user_preferences FOR UPDATE
    USING (auth.uid() = user_id);

-- Circuit Templates Policies
ALTER TABLE public.circuit_templates ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view public templates"
    ON public.circuit_templates FOR SELECT
    USING (is_public = true);

CREATE POLICY "Users can view own templates"
    ON public.circuit_templates FOR SELECT
    USING (auth.uid() = creator_id);

CREATE POLICY "Users can create templates"
    ON public.circuit_templates FOR INSERT
    WITH CHECK (auth.uid() = creator_id);

CREATE POLICY "Users can update own templates"
    ON public.circuit_templates FOR UPDATE
    USING (auth.uid() = creator_id);

-- Pattern Library Policies
ALTER TABLE public.pattern_library ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view public patterns"
    ON public.pattern_library FOR SELECT
    USING (is_public = true);

CREATE POLICY "Users can view own patterns"
    ON public.pattern_library FOR SELECT
    USING (auth.uid() = creator_id);

-- Functions

-- Auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create updated_at triggers
CREATE TRIGGER handle_user_preferences_updated_at
    BEFORE UPDATE ON public.user_preferences
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER handle_circuit_templates_updated_at
    BEFORE UPDATE ON public.circuit_templates
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER handle_pattern_library_updated_at
    BEFORE UPDATE ON public.pattern_library
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();