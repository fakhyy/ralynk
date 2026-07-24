"use client";

import { createContext, useContext, useEffect, useState } from "react";
import type { Session } from "@/lib/auth";

type SessionContextType = {
  session: Session["session"] | null;
  user: Session["user"] | null;
  isLoading: boolean;
};

const SessionContext = createContext<SessionContextType>({
  session: null,
  user: null,
  isLoading: true,
});

export function useSession() {
  return useContext(SessionContext);
}

export function SessionProvider({ children }: { children: React.ReactNode }) {
  const [data, setData] = useState<SessionContextType>({
    session: null,
    user: null,
    isLoading: true,
  });

  useEffect(() => {
    async function fetchSession() {
      try {
        const res = await fetch("/api/auth/get-session");
        if (res.ok) {
          const json = await res.json();
          setData({
            session: json.session ?? null,
            user: json.user ?? null,
            isLoading: false,
          });
        } else {
          setData({ session: null, user: null, isLoading: false });
        }
      } catch {
        setData({ session: null, user: null, isLoading: false });
      }
    }
    fetchSession();
  }, []);

  return (
    <SessionContext.Provider value={data}>{children}</SessionContext.Provider>
  );
}
