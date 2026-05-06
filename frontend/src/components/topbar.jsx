import React, { useState, useEffect } from "react";
import { Menu, X, Moon, Sun } from "lucide-react";

const Topbar = ({
  onMenuClick,
  collapsed,
  onMobileMenuToggle,
  isMobileMenuOpen,
}) => {
  const [userName, setUserName] = useState("");
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);

  // Theme State
  const [theme, setTheme] = useState(
    localStorage.getItem("theme") || "light"
  );

  useEffect(() => {
    // Get user data from localStorage
    const storedUser = localStorage.getItem("user");

    if (storedUser) {
      const user = JSON.parse(storedUser);
      setUserName(user.name || user.username || "User");
    }

    // Check screen size
    const checkScreenSize = () => {
      const width = window.innerWidth;
      setIsMobile(width < 768);
      setIsTablet(width >= 768 && width < 1024);
    };

    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);

    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  // Apply Theme
  useEffect(() => {
    localStorage.setItem("theme", theme);

    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [theme]);

  // Get initials for avatar
  const getInitials = (name) => {
    return name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const handleMenuClick = () => {
    if (isMobile || isTablet) {
      if (onMobileMenuToggle) {
        onMobileMenuToggle();
      }
    } else {
      if (onMenuClick) {
        onMenuClick();
      }
    }
  };

  return (
    <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 px-4 md:px-6 py-3 flex items-center justify-between relative z-10 shadow-sm">
      
      {/* Left side */}
      <div className="flex items-center space-x-4">
        <button
          onClick={handleMenuClick}
          className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          aria-label={
            isMobile || isTablet
              ? "Toggle mobile menu"
              : collapsed
              ? "Expand sidebar"
              : "Collapse sidebar"
          }
        >
          {(isMobile || isTablet) && isMobileMenuOpen ? (
            <X size={20} className="text-gray-600 dark:text-gray-300" />
          ) : (
            <Menu size={20} className="text-gray-600 dark:text-gray-300" />
          )}
        </button>

        <div className="flex items-center">
          <h1 className="text-base sm:text-lg md:text-xl font-semibold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            Customer Manager
          </h1>
        </div>
      </div>

      {/* Right side */}
      <div className="flex items-center space-x-3 md:space-x-4">
        
        {/* Theme Toggle */}
<button
  onClick={() =>
    setTheme(theme === "light" ? "dark" : "light")
  }
  title={theme === "light" ? "Switch to Dark Mode" : "Switch to Light Mode"}
  className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 "
>
  {theme === "light" ? (
    <Moon size={20} className="text-gray-700 dark:text-gray-200" />
  ) : (
    <Sun size={20} className="text-yellow-400" />
  )}
</button>

        {/* User Profile */}
        <div className="relative group">
          <button
            className="flex items-center space-x-2 p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            aria-label="User menu"
          >
            <div className="w-8 h-8 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold text-sm shadow-md">
              {getInitials(userName) || "U"}
            </div>

            <span className="hidden sm:inline text-sm font-medium text-gray-700 dark:text-gray-200">
              {userName || "Guest"}
            </span>
          </button>

          {/* Dropdown */}
          <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 opacity-0 invisible group-hover:opacity-100 group-hover:visible z-50">
            <div className="py-2">
              <div className="px-4 py-2 border-b border-gray-100 dark:border-gray-700">
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  {userName || "Guest"}
                </p>

                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Admin
                </p>
              </div>

              <button className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 ">
                Profile Settings
              </button>

              <button className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-50 dark:hover:bg-gray-700">
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Topbar;