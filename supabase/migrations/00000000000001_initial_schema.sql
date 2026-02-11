-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Create bot configurations table
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

-- Create circuit nodes table
CREATE TABLE public.circuit_nodes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    bot_id UUID REFERENCES public.bot_configs(id) ON DELETE CASCADE,
    node_type VARCHAR NOT NULL CHECK (node_type IN ('model', 'tool', 'memory', 'process')),
    name VARCHAR NOT NULL,
    position JSONB NOT NULL,
    config JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create circuit connections table
CREATE TABLE public.circuit_connections (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    bot_id UUID REFERENCES public.bot_configs(id) ON DELETE CASCADE,
    from_node UUID REFERENCES public.circuit_nodes(id) ON DELETE CASCADE,
    to_node UUID REFERENCES public.circuit_nodes(id) ON DELETE CASCADE,
    connection_type VARCHAR NOT NULL CHECK (connection_type IN ('data', 'call', 'response')),
    config JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create activity logs table
CREATE TABLE public.activity_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    bot_id UUID REFERENCES public.bot_configs(id) ON DELETE CASCADE,
    node_id UUID REFERENCES public.circuit_nodes(id) ON DELETE CASCADE,
    event_type VARCHAR NOT NULL,
    event_data JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.bot_configs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.circuit_nodes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.circuit_connections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activity_logs ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Public bots are viewable by everyone" 
    ON public.bot_configs FOR SELECT 
    USING (is_public = true);

CREATE POLICY "Users can view their own bots" 
    ON public.bot_configs FOR SELECT 
    USING (owner_id = auth.uid());

CREATE POLICY "Users can create their own bots" 
    ON public.bot_configs FOR INSERT 
    WITH CHECK (owner_id = auth.uid());

CREATE POLICY "Users can update their own bots" 
    ON public.bot_configs FOR UPDATE 
    USING (owner_id = auth.uid());

-- Node policies
CREATE POLICY "Users can view nodes of public bots" 
    ON public.circuit_nodes FOR SELECT 
    USING (
        EXISTS (
            SELECT 1 FROM public.bot_configs 
            WHERE id = bot_id AND (is_public = true)
        )
    );

CREATE POLICY "Users can view nodes of their own bots" 
    ON public.circuit_nodes FOR SELECT 
    USING (
        EXISTS (
            SELECT 1 FROM public.bot_configs 
            WHERE id = bot_id AND owner_id = auth.uid()
        )
    );

-- Connection policies
CREATE POLICY "Users can view connections of public bots" 
    ON public.circuit_connections FOR SELECT 
    USING (
        EXISTS (
            SELECT 1 FROM public.bot_configs 
            WHERE id = bot_id AND (is_public = true)
        )
    );

CREATE POLICY "Users can view connections of their own bots" 
    ON public.circuit_connections FOR SELECT 
    USING (
        EXISTS (
            SELECT 1 FROM public.bot_configs 
            WHERE id = bot_id AND owner_id = auth.uid()
        )
    );

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for bot_configs
CREATE TRIGGER update_bot_configs_updated_at
    BEFORE UPDATE ON public.bot_configs
    FOR EACH ROW
    EXECUTE PROCEDURE update_updated_at_column();