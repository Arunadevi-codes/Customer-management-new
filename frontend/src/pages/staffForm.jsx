import React, { useState } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/authContext";
import { toast } from "react-toastify";
import { Eye, EyeOff, Lock, Mail } from "lucide-react";

const inputBase =
  "w-full pl-9 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-400";

const StaffForm = () => {
  const [email, setEmail]               = useState("");
  const [password, setPassword]         = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const navigate  = useNavigate();
  const { login } = useAuth();

  // ✅ Catch browser autofill — autofill triggers animationstart on the input,
  // read the value directly from the DOM element at submit time instead of state
  const emailRef    = React.useRef(null);
  const passwordRef = React.useRef(null);

  const handleStaffLogin = async (e) => {
    e.preventDefault();

    const trimmedEmail = (emailRef.current?.value    || email).trim();
    const trimmedPassword = (passwordRef.current?.value || password).trim();

    if (!trimmedEmail || !trimmedPassword) return toast.error("All fields are required");

    try {
      const res = await API.post("/auth/staff-login", {
        email:    trimmedEmail,
        password: trimmedPassword,
      });

      if (res.data.token) {
        const userData = {
          name:         res.data.user?.name,
          email:        res.data.user?.email,
          role:         res.data.user?.role,
          employeeId:   res.data.user?.employeeId,
          profileImage: res.data.user?.profileImage,
        };

        login(userData, res.data.token);
        toast.success("Login Successful ✅");
        navigate("/staff-dashboard");
      } else {
        toast.error("No token received ❌");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Invalid Credentials ❌");
    }
  };

  return (
    <form onSubmit={handleStaffLogin} className="space-y-4">

      {/* Email */}
      <div>
        <label className="text-sm font-medium text-gray-700">Email</label>
        <div className="relative mt-1">
          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            ref={emailRef}
            type="email"
            placeholder="Enter email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"           // ✅ tells browser what to autofill
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
            autoComplete="current-password" // ✅ tells browser what to autofill
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

export default StaffForm;