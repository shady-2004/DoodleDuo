import { useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import useAuth from "../contexts/useAuth";

function Login() {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  function handleChange(e) {
    const { id, value } = e.target;

    if (id === "password") {
      setPassword(value);
    }
    if (id === "email") {
      setEmail(value);
    }
  }
  function handleSubmit(e) {
    e.preventDefault();

    if (email === "" || password === "") {
      toast.error("Please provide email and password", {
        position: "top-center",
        autoClose: 3000,
        toastId: "missing info",
      });
      return;
    }
    if (password.length < 8) {
      toast.error("Password should be at least 8 characters", {
        position: "top-center",
        autoClose: 3000,
        toastId: "small password",
      });
      return;
    }
    login(email, password);
  }

  return (
    <div className="rounded-2xl p-6 border-2 border-gray-300 w-full max-w-sm mx-auto shadow-md bg-white">
      <form className="space-y-5" onSubmit={handleSubmit}>
        <h2 className="text-lg font-semibold text-center text-gray-800">
          Log In
        </h2>

        <div>
          <label htmlFor="email" className="text-xs text-gray-600 block mb-1">
            Email
          </label>
          <input
            id="email"
            type="email"
            onChange={handleChange}
            placeholder="you@example.com"
            className="p-2 w-full rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-400"
          />
        </div>

        <div>
          <label
            htmlFor="password"
            className="text-xs text-gray-600 block mb-1"
          >
            Password
          </label>
          <div className="relative">
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="********"
              onChange={handleChange}
              className="p-2 w-full rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-400 pr-10  hover:cursor-pointer"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 hover:cursor-pointer"
            >
              {showPassword ? <FaEyeSlash size={16} /> : <FaEye size={16} />}
            </button>
          </div>
        </div>

        <button
          type="submit"
          className="w-full bg-indigo-500 p-2 rounded-md text-white hover:bg-indigo-600 transition duration-200"
        >
          Log In
        </button>

        <p className="text-xs text-center text-gray-600">
          New user?{" "}
          <Link to="/signup" className="text-indigo-500 hover:underline">
            Create account
          </Link>
        </p>
      </form>
    </div>
  );
}

export default Login;
