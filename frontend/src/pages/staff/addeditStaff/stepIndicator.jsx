import React from 'react';
import { User, Briefcase, LogIn, FileText, Check, X } from 'lucide-react';

const StepIndicator = ({ step, onClose }) => {
  const steps = [
    { number: 1, label: "Personal", icon: User },
    { number: 2, label: "Job", icon: Briefcase },
    { number: 3, label: "Login", icon: LogIn },
    { number: 4, label: "Documents", icon: FileText },
  ];

  return (
    <div className="relative w-full bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 px-6 py-4">
      {/* Close Button */}
      <button
        onClick={onClose}
        className="absolute right-4 top-4 z-10 p-1.5 rounded-lg text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200"
        aria-label="Close"
      >
        <X className="w-4 h-4" />
      </button>

      {/* Title */}
      <p className="text-xs font-semibold uppercase tracking-widest text-indigo-500 dark:text-indigo-400 mb-4 text-center">
        Staff Registration
      </p>

      {/* Desktop Step Indicator */}
      <div className="hidden sm:flex items-center justify-center gap-0 max-w-lg mx-auto">
        {steps.map((item, index) => {
          const isActive = step === item.number;
          const isCompleted = step > item.number;
          const Icon = item.icon;

          return (
            <React.Fragment key={item.number}>
              <div className="flex flex-col items-center">
                {/* Circle */}
                <div
                  className={`
                    relative flex items-center justify-center w-9 h-9 rounded-full font-semibold text-sm
                    transition-all duration-300 ring-2
                    ${isActive
                      ? 'bg-indigo-600 text-white ring-indigo-200 dark:ring-indigo-900 shadow-lg shadow-indigo-200 dark:shadow-indigo-900/40 scale-110'
                      : isCompleted
                        ? 'bg-indigo-600 text-white ring-indigo-100 dark:ring-indigo-900/50'
                        : 'bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-500 ring-gray-200 dark:ring-gray-700'
                    }
                  `}
                >
                  {isCompleted ? <Check className="w-4 h-4" strokeWidth={3} /> : <Icon className="w-4 h-4" />}
                </div>

                {/* Label */}
                <span
                  className={`mt-1.5 text-[10px] font-semibold tracking-wide uppercase
                    ${isActive
                      ? 'text-indigo-600 dark:text-indigo-400'
                      : isCompleted
                        ? 'text-indigo-500 dark:text-indigo-500'
                        : 'text-gray-400 dark:text-gray-600'
                    }
                  `}
                >
                  {item.label}
                </span>
              </div>

              {/* Connector */}
              {index < steps.length - 1 && (
                <div className="flex-1 h-0.5 mx-2 mb-5 rounded-full overflow-hidden bg-gray-200 dark:bg-gray-700">
                  <div
                    className="h-full bg-indigo-500 rounded-full transition-all duration-500"
                    style={{ width: step > item.number ? '100%' : '0%' }}
                  />
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>

      {/* Mobile Step Indicator */}
      <div className="sm:hidden">
        <div className="flex items-center gap-3">
          {/* Mini dots */}
          <div className="flex gap-1.5">
            {steps.map((item) => (
              <div
                key={item.number}
                className={`rounded-full transition-all duration-300 ${
                  step === item.number
                    ? 'w-5 h-2 bg-indigo-600'
                    : step > item.number
                      ? 'w-2 h-2 bg-indigo-400'
                      : 'w-2 h-2 bg-gray-300 dark:bg-gray-700'
                }`}
              />
            ))}
          </div>
          <span className="text-xs text-gray-500 dark:text-gray-400">
            Step {step} of 4 —{' '}
            <span className="font-semibold text-indigo-600 dark:text-indigo-400">
              {steps[step - 1]?.label}
            </span>
          </span>
        </div>
      </div>
    </div>
  );
};

export default StepIndicator;