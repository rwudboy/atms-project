"use client";

import React, { createContext, useState, useEffect, useContext } from "react";
import { getUserDetail } from "@/framework-drivers/api/token/getUserDetail";

// Create Context
const AuthContext = createContext(null);

// AuthProvider Component
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch User Detail on Initial Load
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const { data } = await getUserDetail();
        setUser(data?.user ?? null);
      } catch {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  // Context Value
  const value = { user, loading };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

// Hook to Access AuthContext
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};