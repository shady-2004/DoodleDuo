import { createContext, useState } from "react";
const AuthContext = createContext();
import axios from "axios";
function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("user-DoodleDuo");
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const [token, setToken] = useState(
    () => localStorage.getItem("token-DoodleDuo") || null
  );

  const [isAuthenticated, setIsAuthenticated] = useState(!!user);

  async function login(email, password) {
    try {
      const res = await axios.post(
        "http://127.0.0.1:3000/DoodleDuo/api/user/login",
        {
          email,
          password,
        }
      );
      const { token, user } = res.data;

      localStorage.setItem("token-DoodleDuo", token);
      localStorage.setItem("user-DoodleDuo", JSON.stringify(user));

      setToken(token);
      setUser(user);
      setIsAuthenticated(true);
    } catch (error) {
      if (error.response?.status === 401) {
        console.log("Invalid credentials");
      } else {
        console.error("Login error:", error);
      }
    }
  }
  function logout() {
    localStorage.removeItem("token-DoodleDuo");
    localStorage.removeItem("user-DoodleDuo");
    setUser(null);
    setToken(null);
    setIsAuthenticated(false);
  }

  async function signup(name, email, password) {
    try {
      const res = await axios.post(
        "http://127.0.0.1:3000/DoodleDuo/api/user/signup",
        { name, email, password }
      );

      const { token, user } = res.data;

      // Save to localStorage
      localStorage.setItem("token-DoodleDuo", token);
      localStorage.setItem("user-DoodleDuo", JSON.stringify(user));

      // Update state
      setToken(token);
      setUser(user);
      setIsAuthenticated(true);
    } catch (error) {
      if (error.response?.status === 400) {
        console.log("Signup failed: Bad data");
      } else {
        console.error("Signup error:", error);
      }
    }
  }

  return (
    <AuthContext.Provider
      value={{ user, token, isAuthenticated, login, logout, signup }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export default AuthProvider;
