import React, { useState } from "react";
import { Outlet, NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  ChevronDown,
  Settings,
} from "lucide-react";

import CommonSidebar from "../../components/commonSidebar";
import CommonTopbar from "../../components/commonTopbar";

import { useAuth } from "../../contexts/authContext";

const StaffMainLayout = () => {
  const { user, logout } = useAuth();

  const navigate = useNavigate();

  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const [dropdownOpen, setDropdownOpen] = useState(false);

  const toggleSidebar = () => {
    setCollapsed((prev) => !prev);
  };

  const toggleMobileMenu = () => {
    setMobileOpen((prev) => !prev);
  };

  const staffNavItems = [
    {
      label: "Dashboard",
      icon: LayoutDashboard,
      to: "/staff-dashboard",
    },
  ];

  const getInitials = (name = "") =>
    name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);

  const StaffDropdown = (
    <div className="relative">
      <button
        onClick={() => setDropdownOpen((prev) => !prev)}
        className="flex items-center gap-2 rounded-xl px-2 py-1.5 hover:bg-gray-50 dark:hover:bg-gray-800 transition"
      >
        <div className="w-8 h-8 rounded-full overflow-hidden bg-indigo-100 dark:bg-indigo-900/40 flex items-center justify-center">
          <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400">
            {getInitials(user?.name)}
          </span>
        </div>

        <div className="hidden sm:block text-left">
          <p className="text-xs font-semibold text-gray-800 dark:text-white">
            {user?.name || "Staff"}
          </p>

          <p className="text-[10px] text-gray-400 dark:text-gray-500">
            {user?.email || ""}
          </p>
        </div>

        <ChevronDown className="w-3.5 h-3.5 text-gray-400 hidden sm:block" />
      </button>

      {dropdownOpen && (
        <div className="absolute right-0 top-full mt-2 w-52 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg py-2 z-50">

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
  );

  return (
    <div className="flex min-h-screen bg-white dark:bg-gray-950 overflow-hidden">

      <CommonSidebar
        collapsed={collapsed}
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
        navItems={staffNavItems}
        onLogout={() => {
          logout();
          navigate("/login");
        }}
      />

      <div
        className={`flex-1 flex flex-col h-screen transition-all duration-300 ${
          collapsed ? "md:ml-14" : "md:ml-48"
        }`}
      >
        <CommonTopbar
          onMenuClick={toggleSidebar}
          onMobileMenuToggle={toggleMobileMenu}
          rightContent={StaffDropdown}
        />

        <main className="flex-1 overflow-y-auto overflow-x-hidden p-4 md:p-6 bg-gray-50 dark:bg-gray-950">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default StaffMainLayout;