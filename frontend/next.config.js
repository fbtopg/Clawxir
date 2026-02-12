/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      'tfvhifjsfwtlwgqmoklu.supabase.co',
      'avatars.githubusercontent.com',
      'githubusercontent.com'
    ],
    minimumCacheTTL: 60,
    formats: ['image/webp']
  },
  env: {
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  }
}

module.exports = nextConfig