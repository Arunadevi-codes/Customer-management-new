import React, { useState } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/authContext";
import { toast } from "react-toastify";
import { Eye, EyeOff, Lock, User } from "lucide-react";

const inputBase =
  "w-full pl-9 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-400";

const AdminForm = () => {
  const [username, setUsername]         = useState("");
  const [password, setPassword]         = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const navigate  = useNavigate();
  const { login } = useAuth();

  const handleAdminLogin = async (e) => {
    e.preventDefault();
    if (!username || !password) return toast.error("All fields are required");
    try {
      const res = await API.post("/auth/login", { username, password });
      if (res.data.token) {
        const userData = {
          name:     res.data.user?.name || username,
          username,
          role:     res.data.user?.role, // ✅ comes from response
        };
        login(userData, res.data.token);
        toast.success("Login Successful ✅");
        navigate("/dashboard");
      } else {
        toast.error("No token received ❌");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Invalid Credentials ❌");
    }
  };

  return (
    <form onSubmit={handleAdminLogin} className="space-y-4">

      {/* Username */}
      <div>
        <label className="text-sm font-medium text-gray-700">Username</label>
        <div className="relative mt-1">
          <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Enter username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
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
            type={showPassword ? "text" : "password"}
            placeholder="Enter password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
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

export default AdminForm;