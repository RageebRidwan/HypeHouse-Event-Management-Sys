"use client";

import { useRef, useEffect } from "react";
import { Provider } from "react-redux";
import { makeStore, AppStore } from "@/store/store";
import { setupListeners } from "@reduxjs/toolkit/query";
import { loadAuthFromLocalStorage } from "@/store/slices/authSlice";

export function Providers({ children }: { children: React.ReactNode }) {
  const storeRef = useRef<AppStore | null>(null);

  if (!storeRef.current) {
    // Create the store instance the first time this renders
    storeRef.current = makeStore();
    // Setup listeners for RTK Query
    setupListeners(storeRef.current.dispatch);
  }

  // Hydrate auth state from localStorage on client mount
  useEffect(() => {
    if (storeRef.current) {
      storeRef.current.dispatch(loadAuthFromLocalStorage());
    }
  }, []);

  return <Provider store={storeRef.current}>{children}</Provider>;
}
