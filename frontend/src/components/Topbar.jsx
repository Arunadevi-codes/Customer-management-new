import React, { useState, useEffect } from 'react';
import {Menu } from 'lucide-react';

const Topbar = ({ onMenuClick, collapsed }) => {
  const [userName, setUserName] = useState('');

  useEffect(() => {
    // Get user data from localStorage
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const user = JSON.parse(storedUser);
      setUserName(user.name || user.username || 'User');
    }
  }, []);

  // Get initials for avatar
  const getInitials = (name) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <header className="w-full bg-white border-b border-gray-200 px-4 md:px-6 py-3 flex items-center justify-between">
      {/* Left side - Menu Toggle Button & Page title */}
      <div className="flex items-center space-x-4">
        {/* ✅ Toggle Button - Now in Topbar */}
        <button 
          onClick={onMenuClick}
          className="p-2 rounded-lg hover:bg-gray-100"
          title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          <Menu size={20} />
        </button>
        {/* <h1 className="text-xl font-semibold text-gray-800">Dashboard</h1> */}
      </div>

      {/* Right side - Search and Notifications */}
      <div className="flex items-center space-x-3 md:space-x-4">
        {/* User Avatar with Dynamic Name */}
        <button className="flex items-center space-x-2 p-1 rounded-lg hover:bg-gray-100">
          <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
            {getInitials(userName) || 'U'}
          </div>
          <span className="hidden md:inline text-sm font-medium text-gray-700">
            {userName || 'Guest'}
          </span>
        </button>
      </div>
    </header>
  );
};

export default Topbar;