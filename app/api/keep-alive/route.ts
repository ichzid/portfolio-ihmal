import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient';

export const dynamic = 'force-dynamic'; // Selalu jalankan di server, bukan dari cache

export async function GET() {
  try {
    // Ping Supabase dengan fetching 1 buah data project secara acak/limit 1
    const { data, error } = await supabase
      .from('projects')
      .select('id')
      .limit(1);

    if (error) {
      throw error;
    }

    return NextResponse.json(
      {
        success: true,
        message: 'Supabase pinged successfully to prevent auto-pause.',
        timestamp: new Date().toISOString(),
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Supabase ping error:', error);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}
