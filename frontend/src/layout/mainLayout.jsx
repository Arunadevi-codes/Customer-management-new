import React, { useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";

import {
  LayoutDashboard,
  Users,
  Briefcase,
} from "lucide-react";

import CommonSidebar from "../components/commonSidebar";
import CommonTopbar from "../components/commonTopbar";

const MainLayout = () => {
  const navigate = useNavigate();

  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const toggleSidebar = () => {
    setCollapsed((prev) => !prev);
  };

  const toggleMobileMenu = () => {
    setMobileOpen((prev) => !prev);
  };

  const adminNavItems = [
    {
      label: "Dashboard",
      icon: LayoutDashboard,
      to: "/dashboard",
    },
    {
      label: "Customers",
      icon: Users,
      to: "/customers",
    },
    {
      label: "Staff",
      icon: Briefcase,
      to: "/staff",
    },
  ];

  const AdminRight = (
    <div className="flex items-center gap-2">
      <div className="w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center text-white text-sm font-semibold">
        A
      </div>

      <div className="hidden sm:block leading-tight">
        <p className="text-sm font-medium text-gray-800 dark:text-white">
          Admin
        </p>

        <p className="text-[11px] text-gray-400">
          Super Admin
        </p>
      </div>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-white dark:bg-gray-950 overflow-hidden">

      <CommonSidebar
        collapsed={collapsed}
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
        navItems={adminNavItems}
        onLogout={() => {
          localStorage.removeItem("user");
          localStorage.removeItem("token");
          navigate("/");
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
          rightContent={AdminRight}
        />

        <main className="flex-1 overflow-y-auto overflow-x-hidden p-4 md:p-6 bg-white dark:bg-gray-950">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default MainLayout;