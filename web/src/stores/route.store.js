import { create } from "zustand";

export const routeStore = create((set) => ({
  appActiveMenu: "dashboard",
  setAppActiveMenu: (menu) => set({ appActiveMenu: menu })
}));


