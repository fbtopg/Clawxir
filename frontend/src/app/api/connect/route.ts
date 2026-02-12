import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function POST(request: Request) {
  try {
    const { botId } = await request.json();

    // Simple auth - if the bot has Clawxir installed, it works
    // No complex auth needed, just like MoltBook
    
    // Generate session
    const sessionId = Math.random().toString(36).substring(7);

    return NextResponse.json({
      success: true,
      url: `/circuit/${sessionId}`,
      message: 'Connected successfully'
    });

  } catch (error) {
    return NextResponse.json({
      success: false,
      message: 'Failed to connect'
    }, { status: 500 });
  }
}