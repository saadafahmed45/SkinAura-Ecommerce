"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import api from "../lib/api";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check current session on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await api.get("/auth/me");
        if (res.data?.success && res.data?.user) {
          setUser(res.data.user);
        }
      } catch {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  // Login
  const login = async (email, password) => {
    const res = await api.post("/auth/login", { email, password });
    if (res.data?.success && res.data?.user) {
      setUser(res.data.user);
      return res.data.user;
    }
    throw new Error(res.data?.message || "Login failed");
  };

  // Register
  const register = async (userData) => {
    const res = await api.post("/auth/register", userData);
    if (res.data?.success && res.data?.user) {
      setUser(res.data.user);
      return res.data.user;
    }
    throw new Error(res.data?.message || "Registration failed");
  };

  // Logout
  const logout = async () => {
    try {
      await api.post("/auth/logout");
    } finally {
      setUser(null);
    }
  };

  // Update Profile
  const updateProfile = async (data) => {
    const res = await api.patch("/auth/profile", data);
    if (res.data?.success && res.data?.user) {
      setUser(res.data.user);
      return res.data.user;
    }
  };

  const isAdmin = user?.role === "admin";

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
        updateProfile,
        isAdmin,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
