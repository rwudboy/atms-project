"use client";

import React, { createContext, useState, useEffect, useContext } from 'react';
import { getUserDetail } from "@/interface-adapters/usecases/token/getUserDetail";

// 1. Create the context
const AuthContext = createContext(null);

// 2. Create the Provider component
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const { data } = await getUserDetail();
        if (data?.user) {
          // Store the entire user object
          setUser(data.user);
        }
      } catch (error) {
        console.error("AuthContext: Error fetching user detail:", error);
        setUser(null); // Ensure user is null on error
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  const value = { user, loading };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

// 3. Create a custom hook for easy access
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};