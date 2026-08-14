"use client";

import React, { createContext, useContext, useMemo, useState } from "react";

interface GlobalContextType {
  chatOpen: boolean;
  setchatOpen: (value: boolean) => void;
}

const GlobalContext = createContext<GlobalContextType | undefined>(undefined);

export default function GlobalProvider({ children }: { children: React.ReactNode }) {
  const [chatOpen, setchatOpen] = useState(false);
  const value = useMemo(() => ({ chatOpen, setchatOpen }), [chatOpen]);

  return <GlobalContext.Provider value={value}>{children}</GlobalContext.Provider>;
}

export function useGlobalContext() {
  const context = useContext(GlobalContext);
  if (!context) {
    throw new Error("useGlobalContext must be used within GlobalProvider");
  }
  return context;
}
