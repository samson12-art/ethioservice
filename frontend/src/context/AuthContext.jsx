import { createContext, useContext, useState, useEffect } from "react";
import API from "../services/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);

  useEffect(() => {
    if (token) {
      loadUser();
    } else {
      setInitialLoading(false);
    }
  }, []);

  const loadUser = async () => {
    try {
      const { data } = await API.get("/auth/me");
      setUser(data.user);
    } catch {
      localStorage.removeItem("token");
      setToken("");
    } finally {
      setInitialLoading(false);
    }
  };

  const login = async (email, password) => {
    const { data } = await API.post("/auth/login", { email, password });
    localStorage.setItem("token", data.token);
    setToken(data.token);
    setUser(data.user);
    return data;
  };

  const register = async (userData) => {
    const { data } = await API.post("/auth/register", userData);
    localStorage.setItem("token", data.token);
    setToken(data.token);
    setUser(data.user);
    return data;
  };

  const registerProvider = async (formData) => {
    const { data } = await API.post("/auth/register-provider", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    localStorage.setItem("token", data.token);
    setToken(data.token);
    setUser(data.user);
    return data;
  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken("");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{
      user, token, loading, initialLoading,
      login, register, registerProvider, logout, setUser, setLoading
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
}
