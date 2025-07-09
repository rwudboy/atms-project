"use client";

import React, { createContext, useState, useEffect, useContext } from 'react';
import { getUserDetail } from "@/application-business-layer/usecases/token/getUserDetail";

const AuthContext = createContext(null);


export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const { data } = await getUserDetail();
        if (data?.user) {
          setUser(data.user);
        }
      } catch (error) {
        console.error("AuthContext: Error fetching user detail:", error);
        setUser(null);
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


export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};