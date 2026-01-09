import { create } from "zustand";
import { User } from "@supabase/supabase-js";

interface UserState {
  user: User | null;
  subscription: Record<string, unknown> | null;
  setUser: (user: User | null) => void;
  setSubscription: (sub: Record<string, unknown> | null) => void;
}

export const useUserStore = create<UserState>((set) => ({
  user: null,
  subscription: null,
  setUser: (user) => set({ user }),
  setSubscription: (subscription) => set({ subscription }),
}));
