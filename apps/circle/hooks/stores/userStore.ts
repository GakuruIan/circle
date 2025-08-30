import { create } from "zustand";
import { User } from "@circle/prisma";
import { MMKV } from "react-native-mmkv";
import { persist, createJSONStorage } from "zustand/middleware";

const mmkv = new MMKV();

type FrontendUser = Pick<
  User,
  | "id"
  | "firebaseId"
  | "name"
  | "phoneNumber"
  | "about"
  | "profileImage"
  | "hasCompletedSetup"
>;

interface UserStore {
  user: FrontendUser | null;
  setUser: (user: FrontendUser) => void;
  updateUser: (fields: Partial<FrontendUser>) => void;
  clearUser: () => void;
}

export const useUserStore = create<UserStore>()(
  persist(
    (set) => ({
      user: null,
      setUser: (user) => set({ user }),
      updateUser: (fields) =>
        set((state) => ({
          user: state.user ? { ...state.user, ...fields } : null,
        })),
      clearUser: () => set({ user: null }),
    }),
    {
      name: "user-store",
      storage: createJSONStorage(() => ({
        setItem: (name, value) => mmkv.set(name, value),
        getItem: (name) => mmkv.getString(name) ?? null,
        removeItem: (name) => mmkv.delete(name),
      })),
    }
  )
);

export const useUser = useUserStore;
