import { NextResponse } from 'next/server';

export const runtime = 'edge';

export async function GET(request: Request) {
  // Vérifier que la requête vient bien de Vercel Cron
  const authHeader = request.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    // Ping Supabase Auth — léger, pas besoin de connaître les tables
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_SUPABASE_URL}/auth/v1/settings`,
      {
        headers: {
          apikey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        },
      }
    );

    if (!res.ok) throw new Error(`Supabase responded ${res.status}`);

    console.log('[keep-alive] Supabase ping OK —', new Date().toISOString());
    return NextResponse.json({ ok: true, timestamp: new Date().toISOString() });

  } catch (err: any) {
    console.error('[keep-alive] Erreur :', err.message);
    return NextResponse.json({ ok: false, error: err.message }, { status: 500 });
  }
}
