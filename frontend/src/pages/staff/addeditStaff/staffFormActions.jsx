import React from 'react';
import { ChevronLeft, ChevronRight, Save, Loader2 } from 'lucide-react';

const StaffFormActions = ({ step, nextStep, prevStep, submit, loading, isEdit }) => {
  return (
    <div className="sticky bottom-0 z-10 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-t border-gray-100 dark:border-gray-800 px-6 py-4">
      <div className="max-w-lg mx-auto flex justify-between items-center">

        {/* Back Button */}
        {step > 1 ? (
          <button
            onClick={prevStep}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold
              text-gray-600 dark:text-gray-400
              bg-gray-100 dark:bg-gray-800
              hover:bg-gray-200 dark:hover:bg-gray-700
              border border-gray-200 dark:border-gray-700
              transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-gray-400"
          >
            <ChevronLeft className="w-4 h-4" />
            Back
          </button>
        ) : (
          <div />
        )}

        {/* Step pills */}
        <div className="hidden sm:flex gap-1.5">
          {[1, 2, 3, 4].map((s) => (
            <div
              key={s}
              className={`rounded-full transition-all duration-300 ${
                s === step
                  ? 'w-4 h-1.5 bg-indigo-600'
                  : s < step
                    ? 'w-1.5 h-1.5 bg-indigo-400'
                    : 'w-1.5 h-1.5 bg-gray-300 dark:bg-gray-700'
              }`}
            />
          ))}
        </div>

        {/* Next / Submit */}
        {step < 4 ? (
          <button
            onClick={nextStep}
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-semibold
              text-white bg-indigo-600 hover:bg-indigo-700
              shadow-md shadow-indigo-200 dark:shadow-indigo-900/40
              transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2
              active:scale-95"
          >
            Next
            <ChevronRight className="w-4 h-4" />
          </button>
        ) : (
          <button
            onClick={submit}
            disabled={loading}
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-semibold
              text-white bg-indigo-600 hover:bg-indigo-700
              shadow-md shadow-indigo-200 dark:shadow-indigo-900/40
              disabled:opacity-50 disabled:cursor-not-allowed
              transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2
              active:scale-95"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                {isEdit ? 'Update Staff' : 'Create Staff'}
              </>
            )}
          </button>
        )}
      </div>
    </div>
  );
};

export default StaffFormActions;