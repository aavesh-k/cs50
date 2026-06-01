import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { api } from "./api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!localStorage.getItem("crowdfaq_token")) {
      setLoading(false);
      return;
    }
    api("/auth/me")
      .then(({ user: restoredUser }) => setUser(restoredUser))
      .catch(() => localStorage.removeItem("crowdfaq_token"))
      .finally(() => setLoading(false));
  }, []);

  const value = useMemo(() => ({
    user,
    loading,
    isAuthenticated: Boolean(user),
    isAdmin: user?.role === "admin",
    login(token, loggedInUser) {
      localStorage.setItem("crowdfaq_token", token);
      setUser(loggedInUser);
    },
    logout() {
      localStorage.removeItem("crowdfaq_token");
      setUser(null);
    },
    updateUser(updatedUser) {
      setUser(updatedUser);
    },
  }), [loading, user]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
