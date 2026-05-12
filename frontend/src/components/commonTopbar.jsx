import React, { useState, useEffect } from "react";
import { Menu, Moon, Sun } from "lucide-react";

const CommonTopbar = ({
  onMenuClick,
  onMobileMenuToggle,
  user,
  rightContent,
}) => {
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

  return (
    <header className="sticky top-0 h-[57px] bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between px-4 shadow-sm z-50 flex-shrink-0">

      {/* Left */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => {
            if (window.innerWidth < 768) {
              onMobileMenuToggle();
            } else {
              onMenuClick();
            }
          }}
          className="flex items-center justify-center w-8 h-8 rounded-lg border border-gray-200 dark:border-gray-700 text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-800 transition"
        >
          <Menu className="w-4 h-4" />
        </button>
      </div>

      {/* Right */}
      <div className="flex items-center gap-3">

        {/* Theme */}
        <button
          onClick={() =>
            setTheme(theme === "light" ? "dark" : "light")
          }
          className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 transition"
        >
          {theme === "light" ? (
            <Moon className="w-4 h-4" />
          ) : (
            <Sun className="w-4 h-4 text-yellow-400" />
          )}
        </button>

        {rightContent}
      </div>
    </header>
  );
};

export default CommonTopbar;