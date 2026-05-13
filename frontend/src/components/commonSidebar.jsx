import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { LogOut, X } from "lucide-react";
import logoIcon from "../images/logo-icon.png";

const CommonSidebar = ({
  collapsed,
  mobileOpen,
  setMobileOpen,
  navItems,
  onLogout,
}) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    if (onLogout) {
      onLogout();
    } else {
      localStorage.removeItem("user");
      localStorage.removeItem("token");
      navigate("/");
    }

    setMobileOpen(false);
  };

  return (
    <>
      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-20 md:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      <aside
        className={`
          fixed top-0 left-0 h-full z-30
          bg-white dark:bg-gray-900
          border-r border-gray-200 dark:border-gray-800
          flex flex-col transition-all duration-150 shadow-sm
          ${collapsed ? "w-14" : "w-48"}
          ${mobileOpen ? "translate-x-0" : "-translate-x-full"}
          md:translate-x-0
        `}
      >
        {/* Logo */}
        <div className="flex items-center justify-between px-3 py-4 border-b border-gray-100 dark:border-gray-800 min-h-[57px]">
          {!collapsed ? (
            <div className="flex items-center gap-2">
              <img
                src={logoIcon}
                alt="Logo"
                className="w-7 h-7 rounded-lg object-contain"
              />

              <div className="leading-none">
                <p className="text-sm font-bold text-gray-800 dark:text-white">
                  InApp
                </p>

                <p className="text-[10px] text-gray-400 dark:text-gray-500">
                  Inventory.App
                </p>
              </div>
            </div>
          ) : (
            <img
              src={logoIcon}
              alt="Logo"
              className="w-7 h-7 rounded-lg object-contain mx-auto"
            />
          )}

          <button
            onClick={() => setMobileOpen(false)}
            className="md:hidden text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 p-1"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-2 py-2 space-y-0.5 overflow-y-auto">
          {navItems.map(({ label, icon: Icon, to }) => (
            <NavLink
              key={to}
              to={to}
              onClick={() => setMobileOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-sm font-medium transition-all duration-150
                ${
                  isActive
                    ? "bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400"
                    : "text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-gray-800 dark:hover:text-white"
                }`
              }
            >
              <Icon className="w-4 h-4 flex-shrink-0" />
              {!collapsed && <span>{label}</span>}
            </NavLink>
          ))}
        </nav>

        {/* Logout */}
        <div className="px-2 py-3 border-t border-gray-100 dark:border-gray-800">
          <button
            onClick={handleLogout}
            className="flex items-center gap-2.5 px-2.5 py-2 w-full rounded-lg text-sm font-medium
              text-gray-500 dark:text-gray-400
              hover:bg-red-50 dark:hover:bg-red-900/20
              hover:text-red-500 dark:hover:text-red-400
              transition-all duration-150"
          >
            <LogOut className="w-4 h-4 flex-shrink-0" />
            {!collapsed && <span>Logout</span>}
          </button>
        </div>
      </aside>
    </>
  );
};

export default CommonSidebar;