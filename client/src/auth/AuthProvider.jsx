import { createContext, useState, useContext } from "react";
import { jwtDecode } from "jwt-decode";

export const AuthContext = createContext(null)

export function AuthProvider({ children }){
    const [auth, setAuth] = useState(() => {
        const raw = localStorage.getItem("auth");
        return raw ? JSON.parse(raw) : {token: null, user: null}
    });

    const login = async (email, password) => {
        const res = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
        });
        if(!res.ok){throw new Error("Login failed");}
        const data = await res.json();

        const claims =  jwtDecode(data.token);
        const newAuth = {token: data.token, user: { ...data.user, ...claims}}

        setAuth(newAuth);
        localStorage.setItem("auth",JSON.stringify(newAuth));
        return newAuth.user;
    };

    const register = async (email, password) => {
    const res = await fetch("http://localhost:5000/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    if (!res.ok) throw new Error("Registration failed");
    const data = await res.json();

    const claims = jwtDecode(data.token);
    const newAuth = { token: data.token, user: { ...data.user, ...claims } };

    setAuth(newAuth);
    localStorage.setItem("auth", JSON.stringify(newAuth));
    return newAuth.user;
  };

    const logout = () => {
        setAuth({ token: null, user:null });
        localStorage.removeItem("auth");
    };

    const refreshProfile = async () =>{
        if (!auth.token){return null;}
        const res = await fetch("http://localhost:5000/api/auth/me", {
        headers: { Authorization: `Bearer ${auth.token}` },
        });
        if (!res.ok){throw new Error("Failed to refresh profile");}
        const data = await res.json();

        const newAuth = { token: auth.token, user: data.user };
        setAuth(newAuth);
        localStorage.setItem("auth", JSON.stringify(newAuth));
        return newAuth.user;
    };

    const value = {
    token: auth.token,
    user: auth.user,
    login,
    logout,
    refreshProfile,
    register,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);