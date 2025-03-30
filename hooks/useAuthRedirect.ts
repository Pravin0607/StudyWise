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
      if(user.role ==='teacher')
      {
        router.replace('/teacher/dashboard');
      }else{
        router.replace('/student/dashboard');
      }
    }
  }, [router, user.token]);
  
  return { isAuthenticated: !!user.token };
}