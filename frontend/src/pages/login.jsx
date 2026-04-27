import React, { useState } from "react";
import API from "../services/api";
import { setToken } from "../utils/auth";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Eye, EyeOff } from "lucide-react";

import logo from "../images/logo.png";
import customer from "../images/customer.jpeg";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!username || !password) {
      toast.error("All fields are required");
      return;
    }

    try {
  const res = await API.post("/auth/login", { username, password });

  if (res.data.token) {
    localStorage.setItem("token", res.data.token);
    setToken(res.data.token);

    localStorage.setItem("user", JSON.stringify({
      name: res.data.user?.name || username,
      email: res.data.user?.email || `${username}@example.com`,
      username,
      role: res.data.user?.role || 'admin'
    }));

    toast.success("Login Successful ✅");
    navigate("/dashboard"); // no need for setTimeout
  } else {
    toast.error("No token received ❌");
  }
} catch (error) {
  toast.error("Invalid Credentials ❌");
}

  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* LEFT SIDE LOGIN - Shows first on mobile */}
      <div className="w-full md:w-1/2 flex items-center justify-center bg-gray-50 p-2 md:p-3">
        <div className="w-full max-w-md bg-white shadow-lg rounded-xl p-6 md:p-8">
          {/* LOGO */}
          <div className="flex flex-col items-center mb-4 md:mb-6">
            <img
              src={logo}
              alt="logo"
              className="w-28 md:w-32 lg:w-40 mb-2"
            />
            <p className="text-gray-500 text-xs md:text-sm text-center">
              Sign in to your account
            </p>
          </div>

          {/* FORM */}
          <form onSubmit={handleLogin} className="space-y-4 md:space-y-5">
            {/* USERNAME */}
            <div>
              <label className="text-sm font-medium text-gray-700">
                Username
              </label>
              <input
                type="text"
                placeholder="Enter username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-400"
                required
              />
            </div>

            {/* PASSWORD */}
            <div>
  <div className="flex justify-between">
    <label className="text-sm font-medium text-gray-700">
      Password
    </label>
  </div>

  <div className="relative">
    <input
      type={showPassword ? "text" : "password"}
      placeholder="Enter password"
      value={password}
      onChange={(e) => setPassword(e.target.value)}
      className="mt-1 w-full px-3 py-2 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-400"
      required
    />

    {/* Eye Icon */}
    <span
      onClick={() => setShowPassword(!showPassword)}
      className="absolute right-3 top-3 cursor-pointer text-gray-500"
    >
      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
    </span>
  </div>
</div>

            {/* BUTTON */}
            <button
              type="submit"
              className="w-full bg-orange-500 hover:bg-orange-600 text-white py-2 rounded-md font-semibold transition duration-200"
            >
              Sign in
            </button>
          </form>
        </div>
      </div>

      {/* RIGHT SIDE IMAGE */}
      <div className="w-full md:w-1/2 flex justify-center items-center bg-gray-100 p-2 md:p-3">
        <img
          src={customer}
          alt="login"
          className="w-full max-w-sm md:max-w-md h-48 sm:h-56 md:h-[400px] lg:h-[500px] object-cover rounded-xl md:rounded-2xl shadow-lg"
        />
      </div>
    </div>
  );
};

export default Login;