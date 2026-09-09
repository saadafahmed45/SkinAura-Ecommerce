"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import api from "../lib/api";
import { auth, googleProvider, signInWithPopup } from "../lib/firebase";

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
        } else {
          setUser(null);
        }
      } catch {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  // Email/Password Login
  const login = async (email, password) => {
    const res = await api.post("/auth/login", { email, password });
    if (res.data?.success && res.data?.user) {
      if (res.data.token) {
        localStorage.setItem("skinaura_token", res.data.token);
      }
      setUser(res.data.user);
      return res.data.user;
    }
    throw new Error(res.data?.message || "Login failed");
  };

  // Register with optional role
  const register = async (userData) => {
    const res = await api.post("/auth/register", userData);
    if (res.data?.success && res.data?.user) {
      if (res.data.token) {
        localStorage.setItem("skinaura_token", res.data.token);
      }
      setUser(res.data.user);
      return res.data.user;
    }
    throw new Error(res.data?.message || "Registration failed");
  };

  // Google OAuth Login / Register via Firebase
  const loginWithGoogle = async (role = "customer") => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const gUser = result.user;

      const res = await api.post("/auth/google", {
        name: gUser.displayName || gUser.email?.split("@")[0],
        email: gUser.email,
        avatar: gUser.photoURL,
        googleId: gUser.uid,
        role: role === "admin" ? "admin" : "customer",
      });

      if (res.data?.success && res.data?.user) {
        if (res.data.token) {
          localStorage.setItem("skinaura_token", res.data.token);
        }
        setUser(res.data.user);
        return res.data.user;
      }
      throw new Error(res.data?.message || "Google authentication failed");
    } catch (err) {
      if (err.code === "auth/popup-closed-by-user") {
        throw new Error("Sign-in popup was cancelled.");
      }
      if (
        err.code === "auth/invalid-api-key" ||
        err.code === "auth/api-key-not-valid" ||
        err.message?.includes("API key not valid")
      ) {
        throw new Error(
          "Firebase API Key not configured. Please add your credentials in .env.local to enable live Google Sign-In."
        );
      }
      throw new Error(err.response?.data?.message || err.message || "Google authentication failed.");
    }
  };

  // Logout
  const logout = async () => {
    try {
      await api.post("/auth/logout");
    } catch {
      // Ignore logout request error
    } finally {
      if (typeof window !== "undefined") {
        localStorage.removeItem("skinaura_token");
      }
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
        loginWithGoogle,
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
