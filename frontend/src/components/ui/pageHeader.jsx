import React, { useState, useEffect } from 'react';
import { Plus, Users } from 'lucide-react';

const PageHeader = ({
  title,
  subtitle,
  addLabel,
  addLabelMob = 'Add',
  totalCount = 0,
  onAddClick,
  icon: Icon = Users,
}) => {
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);

  useEffect(() => {
    const checkResponsive = () => {
      const width = window.innerWidth;
      setIsMobile(width < 640);
      setIsTablet(width >= 640 && width < 1024);
    };

    checkResponsive();
    window.addEventListener('resize', checkResponsive);

    return () => window.removeEventListener('resize', checkResponsive);
  }, []);

  // Determine icon size based on screen size
  const getIconSize = () => {
    if (isMobile) return 18;
    if (isTablet) return 20;
    return 22;
  };

  // Determine button padding and text size
  const getButtonClasses = () => {
    const baseClasses = "flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white transition-all duration-200 shadow-md hover:shadow-lg active:scale-95";
    
    if (isMobile) {
      return `${baseClasses} w-full px-3 py-2 rounded-lg text-sm`;
    }
    if (isTablet) {
      return `${baseClasses} w-auto px-4 py-2.5 rounded-lg text-base`;
    }
    return `${baseClasses} w-auto px-5 py-3 rounded-xl text-base md:text-lg`;
  };

  // Determine title size classes
  const getTitleClasses = () => {
    if (isMobile) return "text-lg";
    if (isTablet) return "text-2xl";
    return "text-3xl md:text-4xl";
  };

  // Determine subtitle visibility
  const getSubtitleClasses = () => {
    const baseClasses = "text-gray-500 dark:text-gray-400";
    if (isMobile) return `${baseClasses} text-xs block sm:hidden`;
    if (isTablet) return `${baseClasses} text-sm block`;
    return `${baseClasses} text-base block`;
  };

  return (
    <div className="space-y-2 sm:space-y-3 md:space-y-4 lg:space-y-5 mb-2 sm:mb-3 md:mb-4 lg:mb-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4 md:gap-6">
        <div className="flex-1 w-full sm:w-auto">
          <div className="flex items-center gap-1.5 sm:gap-2 md:gap-3 mb-0.5 sm:mb-1">
            <Icon 
              size={getIconSize()} 
              className="text-indigo-600 flex-shrink-0" 
            />

            <h1 className={`${getTitleClasses()} font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent break-words`}>
              {title}
            </h1>

            {totalCount > 0 && (
              <span className="text-xs sm:text-sm md:text-base text-gray-500 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded-full flex-shrink-0">
                {totalCount}
              </span>
            )}
          </div>

          {/* Subtitle - responsive visibility and sizing */}
          {subtitle && (
            <>
              {/* Mobile version - always visible but smaller */}
              <p className="text-xs text-gray-500 dark:text-gray-400 block sm:hidden">
                {subtitle}
              </p>
              {/* Tablet and Desktop version */}
              <p className={`hidden sm:block ${getSubtitleClasses()}`}>
                {subtitle}
              </p>
            </>
          )}
        </div>

        {/* Only renders when onAddClick is provided (superadmin only) */}
        {onAddClick && (
          <button
            onClick={onAddClick}
            className={getButtonClasses()}
          >
            <Plus 
              size={getIconSize() - 2} 
              className="flex-shrink-0" 
            />

            <span className="font-medium whitespace-nowrap">
              {isMobile ? addLabelMob : addLabel}
            </span>
          </button>
        )}
      </div>
    </div>
  );
};

export default PageHeader;