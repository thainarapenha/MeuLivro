import { createContext, useEffect, useState } from "react";
import { getCurrentCustomer } from "@/services/authApi";
import {
  clearAuthSession,
  getAuthSession,
  saveAuthSession,
} from "@/services/authStorage";

export const loginContext = createContext({});

export function LoginProvider({ children }) {
  const [session, setSession] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    let active = true;
    const storedSession = getAuthSession();

    const finishLoading = () => {
      if (active) setAuthLoading(false);
    };

    if (!storedSession?.token) {
      clearAuthSession();
      finishLoading();
      return () => {
        active = false;
      };
    }

    getCurrentCustomer()
      .then((customer) => {
        if (active) setSession({ token: storedSession.token, customer });
      })
      .catch(() => {
        clearAuthSession();
        if (active) setSession(null);
      })
      .finally(finishLoading);

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    const handleAuthLogout = () => setSession(null);

    window.addEventListener("auth:logout", handleAuthLogout);
    return () => window.removeEventListener("auth:logout", handleAuthLogout);
  }, []);

  function login(authenticatedSession) {
    saveAuthSession(authenticatedSession);
    setSession(authenticatedSession);
  }

  function logout() {
    clearAuthSession();
    setSession(null);
  }

  return (
    <loginContext.Provider
      value={{
        logado: Boolean(session),
        isAuthenticated: Boolean(session),
        authLoading,
        customer: session?.customer || null,
        login,
        logout,
      }}
    >
      {children}
    </loginContext.Provider>
  );
}
