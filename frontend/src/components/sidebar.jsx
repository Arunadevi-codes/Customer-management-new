import { 
  LayoutDashboard, 
  Users, 
  Briefcase, 
  LogOut,
  X
} from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import logo from '../images/logo.png';
import logoIcon from '../images/logo-icon.png'; 

const Sidebar = ({ collapsed, setCollapsed, mobileOpen, setMobileOpen }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard', active: location.pathname === '/dashboard' },
    { icon: Users, label: 'Customers', path: '/customers', active: location.pathname === '/customers' },
    { icon: Briefcase, label: 'Staff', path: '/staff', active: location.pathname === '/staff' },
  ];

  const handleNavigation = (path) => {
    navigate(path);
    if (window.innerWidth < 768) {
      setMobileOpen(false);
    }
  };

  // Sidebar content (reused for both desktop and mobile)
  const SidebarContent = () => (
    <>
      <div className="px-0 pt-2 pb-0 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between w-full">
          {/* Logo - Shows different based on collapsed state */}
          <div className="flex items-center justify-center flex-1">
            <img 
              src={collapsed ? logoIcon : logo} 
              alt="Logo" 
              className={`${
                collapsed 
                  ? 'w-6 h-6'     
                  : 'w-14 h-14'  
              } object-contain`}
            />
          </div>

          {/* Mobile close button */}
          <button
            onClick={() => setMobileOpen(false)}
            className="md:hidden p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-200"
          >
            <X size={20} />
          </button>
        </div>
      </div>

      {/* Main Menu */}
<nav className="flex-1 overflow-y-auto py-4">
        <div className="space-y-1 px-2">
          {menuItems.map((item, idx) => (
            <button
              key={idx}
              onClick={() => handleNavigation(item.path)}
              className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg ${
                item.active
                  ? 'bg-indigo-50 dark:bg-gray-800 text-indigo-600 dark:text-indigo-400'
                  : 'text-gray-600 dark:text-gray-300 hover:bg-[#FFDAB9] dark:hover:bg-gray-800'
              } ${(collapsed && window.innerWidth >= 768) ? 'justify-center' : ''}`}
            >
              <item.icon size={20} className="flex-shrink-0" />
              {(!collapsed || window.innerWidth < 768) && (
                <span className="text-sm">{item.label}</span>
              )}
            </button>
          ))}
        </div>
      </nav>

      {/* Logout */}
      <div className="border-t border-gray-200 dark:border-gray-700 py-4">
        <div className="space-y-1 px-2">
          <button
            onClick={() => {
              localStorage.removeItem('user');
              localStorage.removeItem('token');
              navigate('/');
            }}
            className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-red-500 hover:bg-[#FFDAB9] dark:hover:bg-gray-800 ${
              (collapsed && window.innerWidth >= 768) ? 'justify-center' : ''
            }`}
          >
            <LogOut size={20} className="flex-shrink-0" />
            {(!collapsed || window.innerWidth < 768) && (
              <span className="text-sm">Logout</span>
            )}
          </button>
        </div>
      </div>
    </>
  );

  return (
    <>
      {/* Sidebar - Desktop */}
<div
  className={`hidden md:flex fixed top-0 left-0 z-40 flex-col h-screen bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 ${
    collapsed ? 'w-12' : 'w-48'
  }`}
>
  <SidebarContent />
</div>

      {/* Sidebar - Mobile (Slide-in) */}
      <div
      className={`md:hidden fixed top-0 left-0 h-full bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 border-t z-50  ${
        mobileOpen ? 'translate-x-0' : '-translate-x-full'
        } w-[75%] max-w-[240px]`}
      >
        <SidebarContent />
      </div>
    </>
  );
};

export default Sidebar;