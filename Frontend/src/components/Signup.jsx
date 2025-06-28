import { useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import useAuth from "../contexts/useAuth";

function Signup() {
  const { signup } = useAuth();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  function handleChange(e) {
    const { id, value } = e.target;

    if (id === "firstName") {
      setFirstName(value);
    }
    if (id === "lastName") {
      setLastName(value);
    }
    if (id === "email") {
      setEmail(value);
      console.log(value);
    }
    if (id === "password") {
      setPassword(value);
    }
    if (id === "confirmPassword") {
      setConfirmPassword(value);
    }
  }
  function handleSubmit(e) {
    e.preventDefault();
    if (
      firstName === "" ||
      lastName === "" ||
      email === "" ||
      password === "" ||
      confirmPassword === ""
    ) {
      toast.error("Please fill in all fields", {
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
    if (password !== confirmPassword) {
      toast.error("Passwords do not match", {
        position: "top-center",
        autoClose: 3000,
        toastId: "password mismatch",
      });
      return;
    }
    signup(firstName, lastName, email, password);
  }

  return (
    <div className="rounded-2xl p-6 border-2 border-gray-300 w-full max-w-sm mx-auto shadow-md bg-white">
      <form className="space-y-5" onSubmit={handleSubmit}>
        <h2 className="text-lg font-semibold text-center text-gray-800">
          Create Account
        </h2>

        <div className="flex space-x-3">
          <div className="flex-1">
            <label
              htmlFor="firstName"
              className="text-xs text-gray-600 block mb-1"
            >
              First Name
            </label>
            <input
              id="firstName"
              type="text"
              onChange={handleChange}
              placeholder="John"
              className="p-2 w-full rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />
          </div>
          <div className="flex-1">
            <label
              htmlFor="lastName"
              className="text-xs text-gray-600 block mb-1"
            >
              Last Name
            </label>
            <input
              id="lastName"
              type="text"
              onChange={handleChange}
              placeholder="Doe"
              className="p-2 w-full rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />
          </div>
        </div>

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
              className="p-2 w-full rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-400 pr-10"
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

        <div>
          <label
            htmlFor="confirmPassword"
            className="text-xs text-gray-600 block mb-1"
          >
            Confirm Password
          </label>
          <div className="relative">
            <input
              id="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              placeholder="********"
              onChange={handleChange}
              className="p-2 w-full rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-400 pr-10"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 hover:cursor-pointer"
            >
              {showConfirmPassword ? (
                <FaEyeSlash size={16} />
              ) : (
                <FaEye size={16} />
              )}
            </button>
          </div>
        </div>

        <button
          type="submit"
          className="w-full bg-indigo-500 p-2 rounded-md text-white hover:bg-indigo-600 transition duration-200"
        >
          Sign Up
        </button>

        <p className="text-xs text-center text-gray-600">
          Already have an account?{" "}
          <Link to="/login" className="text-indigo-500 hover:underline">
            Log in
          </Link>
        </p>
      </form>
    </div>
  );
}

export default Signup;
