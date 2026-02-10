import React, { createContext, useContext, useMemo, useState } from "react";
import { Platform } from "react-native";

type DrawerCtx = {
  isOpen: boolean;
  openDrawer: () => void;
  closeDrawer: () => void;
  toggleDrawer: () => void;
};

const DrawerContext = createContext<DrawerCtx | null>(null);

export function DrawerProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);

  const value = useMemo<DrawerCtx>(() => {
    const openDrawer = () => {
      if (Platform.OS === "web") return;
      setIsOpen(true);
    };
    const closeDrawer = () => setIsOpen(false);
    const toggleDrawer = () => {
      if (Platform.OS === "web") return;
      setIsOpen((p) => !p);
    };
    return { isOpen, openDrawer, closeDrawer, toggleDrawer };
  }, [isOpen]);

  return <DrawerContext.Provider value={value}>{children}</DrawerContext.Provider>;
}

export function useDrawer() {
  const ctx = useContext(DrawerContext);
  if (!ctx) throw new Error("useDrawer must be used inside DrawerProvider");
  return ctx;
}
