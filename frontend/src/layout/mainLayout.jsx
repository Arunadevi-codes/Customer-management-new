import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/sidebar';
import Topbar from '../components/topbar';

const MainLayout = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const toggleSidebar = () => {
    setCollapsed(!collapsed);
  };

  const toggleMobileMenu = () => {
    setMobileOpen(!mobileOpen);
  };

  return (
    <div className="flex h-screen bg-white dark:bg-gray-950">
      <Sidebar 
        collapsed={collapsed}
        setCollapsed={setCollapsed}
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
      />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <Topbar 
          onMenuClick={toggleSidebar}
          collapsed={collapsed}
          onMobileMenuToggle={toggleMobileMenu}
          isMobileMenuOpen={mobileOpen}
        />
        
        <main className="flex-1 overflow-y-auto p-4 md:p-6 bg-white dark:bg-gray-950">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default MainLayout;