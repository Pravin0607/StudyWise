import { useEffect } from 'react';
import useUserStore from '@/store/userStore';
import axios from 'axios';
import { base_url } from '@/lib/constants';
import { useRouter } from 'next/router';

export function useAuth() {
  const user = useUserStore(state => state.user);
  const setUser = useUserStore(state => state.setUser);
  const logout = useUserStore(state => state.logout);

  useEffect(() => {
    // Only validate the token if one exists
    if (user.token) {
      const validateToken = async () => {
        try {
          const response = await axios.get(`${base_url}/auth/me`, {
            headers: {
              Authorization: `Bearer ${user.token}`
            }
          });
          
          if (response.status === 200) {
            // Update user information from server if needed
            setUser({
              ...user,
              name: `${response.data.firstName} ${response.data.lastName}`,
              email: response.data.email,
              role: response.data.role
            });
          } else {
            logout();
          }
        } catch (error) {
          // Token validation failed
          logout();
        }
      };
      
      validateToken();
    }
  }, [user.token]); // Only re-run when token changes

  return { isAuthenticated: !!user.token, user };
}
