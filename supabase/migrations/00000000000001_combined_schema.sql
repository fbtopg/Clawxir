-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- User Visualization Preferences
CREATE TABLE public.user_preferences (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users NOT NULL,
    theme_settings JSONB DEFAULT '{"background": "#1a1a1a", "grid": "#252525"}',
    visualization_config JSONB DEFAULT '{"animationSpeed": 1}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Bot configurations table
CREATE TABLE public.bot_configs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR NOT NULL,
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    config JSONB NOT NULL,
    is_public BOOLEAN DEFAULT false,
    owner_id UUID NOT NULL,
    circuit_layout JSONB
);

-- Circuit Templates
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

-- Circuit Nodes
CREATE TABLE public.circuit_nodes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    template_id UUID REFERENCES public.circuit_templates ON DELETE CASCADE,
    bot_id UUID REFERENCES public.bot_configs(id) ON DELETE CASCADE,
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
    bot_id UUID REFERENCES public.bot_configs(id) ON DELETE CASCADE,
    source_node UUID REFERENCES public.circuit_nodes(id) ON DELETE CASCADE,
    target_node UUID REFERENCES public.circuit_nodes(id) ON DELETE CASCADE,
    connection_type TEXT NOT NULL CHECK (connection_type IN ('data', 'call', 'response')),
    config JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Pattern Library
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

-- Bot tokens
CREATE TABLE public.bot_tokens (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users NOT NULL,
    token TEXT NOT NULL UNIQUE,
    description TEXT,
    last_used TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    expires_at TIMESTAMPTZ,
    CONSTRAINT token_length CHECK (char_length(token) >= 32)
);

-- Enable RLS
ALTER TABLE public.user_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bot_configs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.circuit_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.circuit_nodes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.circuit_connections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pattern_library ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bot_tokens ENABLE ROW LEVEL SECURITY;
-- Create basic policies
CREATE POLICY "Users can view own data" ON public.user_preferences FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Public bots are viewable by everyone" ON public.bot_configs FOR SELECT USING (is_public = true);
CREATE POLICY "Users can view their own bots" ON public.bot_configs FOR SELECT USING (owner_id = auth.uid());

-- Function to update timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers
CREATE TRIGGER update_user_preferences_updated_at BEFORE UPDATE ON public.user_preferences FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_bot_configs_updated_at BEFORE UPDATE ON public.bot_configs FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_circuit_templates_updated_at BEFORE UPDATE ON public.circuit_templates FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
