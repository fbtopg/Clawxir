-- Seed data for development
INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at, raw_user_meta_data)
VALUES 
  ('00000000-0000-0000-0000-000000000000', 
   'test@example.com',
   crypt('password123', gen_salt('bf')),
   now(),
   jsonb_build_object(
     'username', 'testuser',
     'full_name', 'Test User',
     'avatar_url', 'https://api.dicebear.com/7.x/avataaars/svg?seed=testuser'
   )
) ON CONFLICT DO NOTHING;

-- The trigger will automatically create the profile