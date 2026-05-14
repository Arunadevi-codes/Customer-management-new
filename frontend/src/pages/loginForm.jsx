import React, { useState, useRef } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/authContext";
import { toast } from "react-toastify";
import { Eye, EyeOff, Lock, Mail, User } from "lucide-react";

const inputBase =
  "w-full pl-9 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-400";

// role: "admin" | "staff"
const LoginForm = ({ role }) => {
  const isAdmin = role === "admin";

  const [identifier, setIdentifier] = useState(""); // username (admin) or email (staff)
  const [password, setPassword]     = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const identifierRef = useRef(null);
  const passwordRef   = useRef(null);

  const navigate  = useNavigate();
  const { login } = useAuth();

  const handleLogin = async (e) => {
    e.preventDefault();

    const trimmedIdentifier = (identifierRef.current?.value || identifier).trim();
    const trimmedPassword   = (passwordRef.current?.value   || password).trim();

    if (!trimmedIdentifier || !trimmedPassword)
      return toast.error("All fields are required");

    try {
      let res;

      if (isAdmin) {
        // Admin login — username + password
        res = await API.post("/auth/login", {
          username: trimmedIdentifier,
          password: trimmedPassword,
        });
      } else {
        // Staff login — email + password
        res = await API.post("/auth/staff-login", {
          email:    trimmedIdentifier,
          password: trimmedPassword,
        });
      }

      if (res.data.token) {
        const userData = isAdmin
          ? {
              name:     res.data.user?.name || trimmedIdentifier,
              username: trimmedIdentifier,
              role:     res.data.user?.role,
            }
          : {
              name:         res.data.user?.name,
              email:        res.data.user?.email,
              role:         res.data.user?.role,
              employeeId:   res.data.user?.employeeId,
              profileImage: res.data.user?.profileImage,
            };

        login(userData, res.data.token);
        toast.success("Login Successful ✅");
        navigate(isAdmin ? "/dashboard" : "/staff-dashboard");
      } else {
        toast.error("No token received ❌");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Invalid Credentials ❌");
    }
  };

  return (
    <form onSubmit={handleLogin} className="space-y-4">

      {/* Username / Email */}
      <div>
        <label className="text-sm font-medium text-gray-700">
          {isAdmin ? "Username" : "Email"}
        </label>
        <div className="relative mt-1">
          {isAdmin
            ? <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            : <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          }
          <input
            ref={identifierRef}
            type={isAdmin ? "text" : "email"}
            placeholder={isAdmin ? "Enter username" : "Enter email"}
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
            autoComplete={isAdmin ? "username" : "email"}
            className={inputBase}
          />
        </div>
      </div>

      {/* Password */}
      <div>
        <label className="text-sm font-medium text-gray-700">Password</label>
        <div className="relative mt-1">
          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            ref={passwordRef}
            type={showPassword ? "text" : "password"}
            placeholder="Enter password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
            className={`${inputBase} pr-10`}
          />
          <span
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-gray-400"
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </span>
        </div>
      </div>

      <button
        type="submit"
        className="w-full bg-orange-500 hover:bg-orange-600 text-white py-2 rounded-md font-semibold transition duration-200"
      >
        Sign in
      </button>

    </form>
  );
};

export default LoginForm;