"use client";

import { useState } from "react";
import { SessionProvider as NextAuthSessionProvider } from "next-auth/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

interface SessionProviderProps {
  children: React.ReactNode;
}

export function SessionProvider({ children }: SessionProviderProps) {
  // Keep a single QueryClient per browser session so the cache survives re-renders
  const [queryClient] = useState(() => new QueryClient());
  return (
    <NextAuthSessionProvider>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </NextAuthSessionProvider>
  );
}
