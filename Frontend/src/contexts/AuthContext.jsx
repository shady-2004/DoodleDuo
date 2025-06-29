import { useEffect, useState } from "react";
import AuthContext from "./AuthContextCreate";
import axios from "axios";
import { toast } from "react-toastify";
const apiUrl = import.meta.env.VITE_API_URL;

function AuthProvider({ children }) {
  const [user, setUser] = useState({});

  const [token, setToken] = useState("");

  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const savedToken = localStorage.getItem("token-DoodleDuo");
    const savedUser = localStorage.getItem("user-DoodleDuo");

    if (savedToken && savedUser) {
      try {
        const parsedUser = JSON.parse(savedUser);
        setToken(savedToken);
        setUser(parsedUser);
        setIsAuthenticated(true);
      } catch (error) {
        console.error("Failed to parse user from localStorage:", error);
        localStorage.removeItem("user-DoodleDuo");
        localStorage.removeItem("token-DoodleDuo");
      }
    }

    setIsLoading(false);
  }, []);

  async function login(email, password) {
    setIsLoading(true);

    try {
      const res = await axios.post(`${apiUrl}/users/login`, {
        email,
        password,
      });

      const { token } = res.data;
      const { user } = res.data.data;

      localStorage.setItem("token-DoodleDuo", token);
      localStorage.setItem("user-DoodleDuo", JSON.stringify(user));

      setToken(token);
      setUser(user);
      setIsAuthenticated(true);
    } catch (error) {
      if (error.response?.status === 401) {
        toast.error(error.response.data.message, {
          position: "top-center",
          autoClose: 3000,
          toastId: "missing info",
        });
      } else {
        toast.error("Request Failed", {
          position: "top-center",
          autoClose: 3000,
          toastId: "missing info",
        });
      }
    }
    setIsLoading(false);
  }
  function logout() {
    localStorage.removeItem("token-DoodleDuo");
    localStorage.removeItem("user-DoodleDuo");
    setUser(null);
    setToken(null);
    setIsAuthenticated(false);
  }

  async function signup(firstName, lastName, email, password) {
    console.log(email);
    setIsLoading(true);
    try {
      const res = await axios.post(`${apiUrl}/users/signup`, {
        firstName,
        lastName,
        email,
        password,
      });

      const { token } = res.data;
      const { user } = res.data.data;

      // Save to localStorage
      localStorage.setItem("token-DoodleDuo", token);
      localStorage.setItem("user-DoodleDuo", JSON.stringify(user));

      // Update state
      setToken(token);
      setUser(user);
      setIsAuthenticated(true);
    } catch (error) {
      if (error.response?.status === 400) {
        toast.error(error.response.data.message, {
          position: "top-center",
          autoClose: 3000,
          toastId: "missing info",
        });
      } else {
        toast.error("Request Failed", {
          position: "top-center",
          autoClose: 3000,
          toastId: "missing info",
        });
      }
    }
    setIsLoading(false);
  }

  return (
    <AuthContext.Provider
      value={{ user, token, isAuthenticated, login, logout, signup, isLoading }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export default AuthProvider;
