import React, { useState } from "react";
import LoginForm from "./loginForm";
import logo     from "../images/logo.png";
import customer from "../images/customer.jpeg";

const Login = () => {
  const [loginType, setLoginType] = useState("admin");

  return (
    <div className="min-h-screen flex flex-col md:flex-row">

      {/* LEFT — Form */}
      <div className="w-full md:w-1/2 flex items-center justify-center bg-gray-50 p-2 md:p-3">
        <div className="w-full max-w-md">

          {/* Logo */}
          <div className="flex flex-col items-center mb-6">
            <img src={logo} alt="logo" className="w-28 md:w-32 lg:w-40 mb-2" />
            <p className="text-gray-500 text-xs md:text-sm text-center">
              Sign in to your account
            </p>
          </div>

          {/* Card */}
          <div className="w-full max-w-md bg-white shadow-lg rounded-xl p-6 md:p-8">

            {/* Toggle */}
            <div className="flex rounded-lg border border-gray-200 p-1 mb-6 bg-gray-50">
              {["admin", "staff"].map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setLoginType(type)}
                  className={`flex-1 py-2 rounded-md text-sm font-semibold capitalize transition-all duration-200 ${
                    loginType === type
                      ? "bg-orange-500 text-white shadow-sm"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </button>
              ))}
            </div>

            {/* Single form — role prop drives the logic */}
            <LoginForm role={loginType} />

          </div>
        </div>
      </div>

      {/* RIGHT — Image */}
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