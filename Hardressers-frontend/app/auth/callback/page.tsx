'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/utils/supabase/client';

export default function AuthCallbackPage() {
  const router = useRouter();

  useEffect(() => {
    const handleAuth = async () => {
      // récupère la session après confirmation email
      const { data, error } = await supabase.auth.getSession();

      if (error) {
        console.error('Auth callback error:', error.message);
      }

      router.replace('/?email_confirmed=true');
    };

    handleAuth();
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white">
      <p className="text-lg">Confirmation en cours...</p>
    </div>
  );
}