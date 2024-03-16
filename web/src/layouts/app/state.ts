import { create } from "zustand";

export const useActiveMenu = create((set) => ({
  activeMenu: "dashboard",
  updateActiveMenu: (menu: string) => set({ activeMenu: menu })
}));
