import React, { useState } from "react";
import { Outlet, useNavigate, NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  Briefcase,
  ChevronDown,
  Settings,
} from "lucide-react";

import CommonSidebar from "../components/commonSidebar";
import CommonTopbar  from "../components/commonTopbar";
import { useAuth }   from "../contexts/authContext";

const MainLayout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [collapsed,    setCollapsed]    = useState(false);
  const [mobileOpen,   setMobileOpen]   = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  // ✅ Anyone who is NOT superadmin is treated as staff
  const isStaff = user?.role !== "superadmin";

  const adminNavItems = [
    { label: "Dashboard", icon: LayoutDashboard, to: "/dashboard" },
    { label: "Customers", icon: Users, to: "/customers" },
    { label: "Staff", icon: Briefcase, to: "/staff"     },
  ];

  const staffNavItems = [
    { label: "Dashboard", icon: LayoutDashboard, to: "/staff-dashboard"  },
    { label: "Customers", icon: Users, to: "/staff-customers"        },
    { label: "Staff Directory", icon: Briefcase, to: "/staff-directory"  },
  ];

  const navItems = isStaff ? staffNavItems : adminNavItems;

  const getInitials = (name = "") =>
    name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);

  const StaffRight = (
    <div className="relative">
      <button
        onClick={() => setDropdownOpen((prev) => !prev)}
        className="flex items-center gap-2 rounded-xl px-2 py-1.5 hover:bg-gray-50 dark:hover:bg-gray-800 transition"
      >
        <div className="w-8 h-8 rounded-full overflow-hidden bg-gray-200 dark:bg-gray-700 flex items-center justify-center flex-shrink-0">
          {user?.profileImage ? (
            <img
              src={`http://localhost:5000/${user.profileImage.replace(/\\/g, "/")}`}
              alt={user?.name || "Profile"}
              className="w-full h-full object-cover"
            />
          ) : (
            <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400">
              {getInitials(user?.name)}
            </span>
          )}
        </div>
        <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
      </button>

      {dropdownOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setDropdownOpen(false)} />
          <div className="absolute right-0 top-full mt-2 w-56 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg z-50 overflow-hidden">
            <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-800">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full overflow-hidden bg-gray-200 dark:bg-gray-700 flex items-center justify-center flex-shrink-0">
                  {user?.profileImage ? (
                    <img
                      src={`http://localhost:5000/${user.profileImage.replace(/\\/g, "/")}`}
                      alt={user?.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400">
                      {getInitials(user?.name)}
                    </span>
                  )}
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-gray-800 dark:text-white truncate">
                    {user?.name || "Staff"}
                  </p>
                  <p className="text-[11px] text-gray-400 dark:text-gray-500 truncate">
                    {user?.email || ""}
                  </p>
                </div>
              </div>
            </div>
            <div className="py-1">
              <NavLink
                to="/staff-account"
                onClick={() => setDropdownOpen(false)}
                className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-indigo-600 dark:hover:text-indigo-400 transition"
              >
                <Settings className="w-4 h-4 flex-shrink-0" />
                Account Settings
              </NavLink>
            </div>
          </div>
        </>
      )}
    </div>
  );

  const AdminRight = (
    <div className="flex items-center gap-2">
      <div className="w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center text-white text-sm font-semibold">
        A
      </div>
      <div className="hidden sm:block leading-tight">
        <p className="text-sm font-medium text-gray-800 dark:text-white">Admin</p>
        <p className="text-[11px] text-gray-400">Super Admin</p>
      </div>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-white dark:bg-gray-950 overflow-hidden">

      <CommonSidebar
        collapsed={collapsed}
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
        navItems={navItems}
        onLogout={() => { logout(); navigate("/"); }}
      />
      <div
        className={`flex-1 flex flex-col h-screen min-w-0 transition-all duration-300 ${
          collapsed ? "md:ml-14" : "md:ml-48"
        }`}
      >
        <CommonTopbar
          onMenuClick={() => setCollapsed((prev) => !prev)}
          onMobileMenuToggle={() => setMobileOpen((prev) => !prev)}
          rightContent={isStaff ? StaffRight : AdminRight}
        />

        <main className="flex-1 overflow-y-auto p-4 md:p-6 bg-white dark:bg-gray-950">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default MainLayout;