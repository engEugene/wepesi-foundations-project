import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

type User = {
  id: number;
  username: string;
  email: string;
  avatar?: string;
  role: "volunteer" | "organization";
  is_org_onboarded?: boolean;
};

type AuthState = {
  user: User | null;
  role: User["role"] | null;
  isAuthenticated: boolean;
  is_org_onboarded: boolean;
  setUser: (user: User | null) => void;
  clearUser: () => void;
};

const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      role: null,
      isAuthenticated: false,
      is_org_onboarded: false,

      setUser: (user) => set({ user, role: user?.role, isAuthenticated: true, is_org_onboarded: user?.is_org_onboarded ?? false }),

      clearUser: () => set({ user: null, role: null, isAuthenticated: false, is_org_onboarded: false }),
    }),
    {
      name: "auth-user",
      storage: createJSONStorage(() => localStorage),
    }
  )
);

export default useAuthStore;