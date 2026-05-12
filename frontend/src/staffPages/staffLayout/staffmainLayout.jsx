import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import StaffSidebar from "./staffSidebar";
import StaffTopbar from "./staffTopbar";

const StaffMainLayout = () => {
  const [collapsed, setCollapsed]   = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const toggleSidebar      = () => setCollapsed((prev) => !prev);
  const toggleMobileMenu   = () => setMobileOpen((prev) => !prev);

  return (
    <div className="flex min-h-screen bg-white dark:bg-gray-950 overflow-hidden">
      <StaffSidebar
        collapsed={collapsed}
        setCollapsed={setCollapsed}
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
      />

      <div
        className={`flex-1 flex flex-col min-h-0 transition-all duration-300 ${
          collapsed ? "md:ml-14" : "md:ml-48"
        }`}
      >
        <StaffTopbar
          onMenuClick={toggleSidebar}
          collapsed={collapsed}
          onMobileMenuToggle={toggleMobileMenu}
          isMobileMenuOpen={mobileOpen}
        />

        <main className="flex-1 overflow-y-auto overflow-x-hidden p-4 md:p-6 bg-gray-50 dark:bg-gray-950">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default StaffMainLayout;