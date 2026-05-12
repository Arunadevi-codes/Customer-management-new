import React, { useState, useRef, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { useAuth } from "../../contexts/authContext";
import { Menu, ChevronDown, Settings, Sun, Moon } from "lucide-react";

const StaffTopbar = ({ onMenuClick, collapsed, onMobileMenuToggle }) => {
  const { user } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Theme — same pattern as admin Topbar
  const [theme, setTheme] = useState(
    localStorage.getItem("theme") || "light"
  );

  useEffect(() => {
    localStorage.setItem("theme", theme);
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [theme]);

  const toggleTheme = () =>
    setTheme((prev) => (prev === "light" ? "dark" : "light"));

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const getInitials = (name = "") =>
    name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);

  return (
    <header className="h-[57px] bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between px-4 shadow-sm z-10 flex-shrink-0">

      {/* Left — sidebar toggle */}
      <div className="flex items-center gap-2">
        <button
          onClick={onMenuClick}
          className="hidden md:flex items-center justify-center w-8 h-8 rounded-lg border border-gray-200 dark:border-gray-700 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition"
          aria-label="Toggle sidebar"
        >
          <Menu className="w-4 h-4" />
        </button>
        <button
          onClick={onMobileMenuToggle}
          className="md:hidden flex items-center justify-center w-8 h-8 rounded-lg border border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400"
          aria-label="Open menu"
        >
          <Menu className="w-4 h-4" />
        </button>
      </div>

      {/* Right — theme toggle + notifications + user */}
      <div className="flex items-center gap-3">

        {/* Dark mode toggle */}
        <button
          onClick={toggleTheme}
          title={theme === "light" ? "Switch to Dark Mode" : "Switch to Light Mode"}
          className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-gray-700 dark:hover:text-gray-200 transition"
        >
          {theme === "light" ? (
            <Moon className="w-4 h-4" />
          ) : (
            <Sun className="w-4 h-4 text-yellow-400" />
          )}
        </button>

        {/* User dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setDropdownOpen((prev) => !prev)}
            className="flex items-center gap-2 rounded-xl px-2 py-1.5 hover:bg-gray-50 dark:hover:bg-gray-800 transition"
          >
            <div className="w-8 h-8 rounded-full overflow-hidden flex-shrink-0 bg-indigo-100 dark:bg-indigo-900/40 flex items-center justify-center">
              {user?.profileImage ? (
                <img
                  src={`http://localhost:5000/${user.profileImage}`}
                  alt="avatar"
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400">
                  {getInitials(user?.name)}
                </span>
              )}
            </div>
            <div className="hidden sm:block text-left">
              <p className="text-xs font-semibold text-gray-800 dark:text-white leading-none">
                {user?.name || "Staff"}
              </p>
              <p className="text-[10px] text-gray-400 dark:text-gray-500 mt-0.5 leading-none">
                {user?.email || ""}
              </p>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-gray-400 hidden sm:block" />
          </button>

          {/* Dropdown */}
          {dropdownOpen && (
            <div className="absolute right-0 top-full mt-2 w-52 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg py-2 z-50">
              {/* User info header */}
              <div className="flex items-center gap-2.5 px-4 py-2.5 border-b border-gray-100 dark:border-gray-800 mb-1">
                <div className="w-9 h-9 rounded-full overflow-hidden flex-shrink-0 bg-indigo-100 dark:bg-indigo-900/40 flex items-center justify-center">
                  {user?.profileImage ? (
                    <img
                      src={`http://localhost:5000/${user.profileImage}`}
                      alt="avatar"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400">
                      {getInitials(user?.name)}
                    </span>
                  )}
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-800 dark:text-white leading-none">
                    {user?.name || "Staff"}
                  </p>
                  <p className="text-[11px] text-gray-400 dark:text-gray-500 mt-0.5">
                    @{user?.email?.split("@")[0] || ""}
                  </p>
                </div>
              </div>

              {/* Account Settings */}
              <NavLink
                to="/staff-account"
                onClick={() => setDropdownOpen(false)}
                className="flex items-center gap-2 px-4 py-2 text-sm text-orange-500 hover:bg-orange-50 dark:hover:bg-orange-900/10 transition"
              >
                <Settings className="w-4 h-4" />
                Account Settings
              </NavLink>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default StaffTopbar;