import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

type UserStore = {
  user: {
    name: string;
    email: string;
    role: string;
    token?: string;
  };
  setUser: (user: UserStore['user']) => void;
  logout: () => void;
  setRole: (role: string) => void;
};

const useUserStore = create<UserStore>()(
  persist(
    (set) => ({
      user: {
        name: '',
        email: '',
        role: '',
        token: '',
      },
      setUser: (user) => set({ user }),
      logout: () => set({ 
        user: { name: '', email: '', role: '', token: '' }
      }),
      setRole: (role) => set((state) => ({
        user: { ...state.user, role }
      })),
    }),
    {
      name: 'user-storage', // unique name for localStorage key
      storage: createJSONStorage(() => localStorage),
      // You can specify which parts of the state to persist
      partialize: (state) => ({ user: state.user }),
    }
  )
);

export default useUserStore;