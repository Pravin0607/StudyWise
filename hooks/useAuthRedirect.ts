'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import useUserStore from '@/store/userStore';

export function useAuthRedirect() {
  const router = useRouter();
  const user = useUserStore(state => state.user);
  
  useEffect(() => {
    // Check if user has a token (is logged in)
    if (user.token) {
      // Redirect to home page
      router.replace('/home');
    }
  }, [router, user.token]);
  
  return { isAuthenticated: !!user.token };
}