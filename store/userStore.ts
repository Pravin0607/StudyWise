import {create} from 'zustand';

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

const useUserStore = create<UserStore>()((set) => ({
    user: {
        name: '',
        email: '',
        role: '',
        token: '',
    },
    setUser: (user) => set({user}),
    logout: () => set({user: {name: '', email: '', role: '', token: ''}}),
    setRole: (role) => set((state) => ({user: {...state.user, role}})),
}));

export default useUserStore;