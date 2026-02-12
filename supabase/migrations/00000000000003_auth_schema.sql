-- Bot tokens table
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

-- Index for token lookups
CREATE INDEX idx_bot_tokens_token ON public.bot_tokens(token);

-- Enable Row Level Security
ALTER TABLE public.bot_tokens ENABLE ROW LEVEL SECURITY;

-- Policies for bot_tokens
CREATE POLICY "Users can view own tokens"
    ON public.bot_tokens FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can create tokens"
    ON public.bot_tokens FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own tokens"
    ON public.bot_tokens FOR DELETE
    USING (auth.uid() = user_id);

-- Function to update last_used timestamp
CREATE OR REPLACE FUNCTION update_bot_token_last_used()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE public.bot_tokens
    SET last_used = NOW()
    WHERE token = NEW.token;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;