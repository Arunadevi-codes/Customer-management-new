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

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 640);

    checkMobile();
    window.addEventListener('resize', checkMobile);

    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return (
    <div className="space-y-2 mb-2 sm:mb-3 md:mb-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-0.5 sm:mb-1">
            <Icon size={isMobile ? 18 : 20} className="text-indigo-600" />

            <h1 className="text-lg sm:text-2xl md:text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              {title}
            </h1>

            {totalCount > 0 && (
              <span className="text-xs sm:text-sm text-gray-500 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded-full">
                {totalCount}
              </span>
            )}
          </div>

          {subtitle && (
            <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 hidden sm:block">
              {subtitle}
            </p>
          )}
        </div>

        <button
          onClick={onAddClick}
          className="w-full sm:w-auto flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-3 sm:px-4 md:px-5 py-2 sm:py-2.5 rounded-lg sm:rounded-xl transition-all duration-200 shadow-md hover:shadow-lg active:scale-95"
        >
          <Plus
            size={isMobile ? 14 : 16}
            className="sm:size-[18px] md:size-[20px]"
          />

          <span className="text-sm sm:text-base font-medium">
            {isMobile ? addLabelMob : addLabel}
          </span>
        </button>
      </div>
    </div>
  );
};

export default PageHeader;