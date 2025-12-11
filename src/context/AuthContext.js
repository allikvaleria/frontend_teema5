import { createContext, useState } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem("token") || null);
  const [role, setRole] = useState(localStorage.getItem("role") || null);
  const [name, setName] = useState(localStorage.getItem("name") || null);

  const login = (t, r, n) => {
    localStorage.setItem("token", t);
    localStorage.setItem("role", r);
    localStorage.setItem("name", n);
    setToken(t);
    setRole(r);
    setName(n);
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("name");
    setToken(null);
    setRole(null);
    setName(null);
  };

  return (
    <AuthContext.Provider value={{ token, role, name, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};