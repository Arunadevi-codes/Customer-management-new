import React from 'react';
import { Check, Loader2 } from 'lucide-react';

const CustomerFormActions = ({ isEdit, loading, onClose }) => (
  <div className="sticky bottom-0 bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm border-t border-gray-100 dark:border-gray-700 p-5 flex gap-3">
    <button 
      type="button"
      onClick={onClose}
      className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-200 font-medium hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors text-sm"
    >
      Cancel
    </button>
    <button 
      type="submit"
      disabled={loading.submitting}
      className="flex-1 px-4 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-medium hover:from-indigo-700 hover:to-purple-700 transition-all shadow-md hover:shadow-lg disabled:opacity-70 disabled:cursor-not-allowed text-sm"
    >
      {loading.submitting ? (
        <div className="flex items-center justify-center gap-2">
          <Loader2 size={16} className="animate-spin" />
          <span>{isEdit ? "Updating..." : "Saving..."}</span>
        </div>
      ) : (
        <div className="flex items-center justify-center gap-2">
          <Check size={16} />
          <span>{isEdit ? "Update" : "Save"}</span>
        </div>
      )}
    </button>
  </div>
);

export default CustomerFormActions;