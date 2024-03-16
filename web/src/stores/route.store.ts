import { create } from "zustand";

export const orcaStore = create((set) => ({
  appActiveMenu: "dashboard",
  setAppActiveMenu: (menu: string) => set({ appActiveMenu: menu })
}));


