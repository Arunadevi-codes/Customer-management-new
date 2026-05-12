import React, { useRef } from 'react';
import { Upload, User, X } from 'lucide-react';

const CustomerImageUpload = ({
  preview,
  handleFileChange,
  setPreview,
  setFormData
}) => {

  const fileInputRef = useRef(null);

  const handleRemoveImage = () => {
  setPreview(null);

  // Tell backend to remove existing image
  setFormData((prev) => ({
    ...prev,
    image: null,
    removeImage: true,
  }));

  if (fileInputRef.current) {
    fileInputRef.current.value = "";
  }
};

  return (
    <div className="flex flex-col items-center justify-center pb-2">
      <div className="relative group">

        <div className="w-24 h-24 rounded-full bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-gray-700 dark:to-gray-800 flex items-center justify-center overflow-hidden shadow-md ring-4 ring-white dark:ring-gray-900">
          {preview ? (
            <img
              src={preview}
              alt="Profile preview"
              className="w-full h-full object-cover"
            />
          ) : (
            <User size={40} className="text-indigo-400" />
          )}
        </div>

        <label
          htmlFor="profile-image"
          className="absolute bottom-0 right-0 p-1.5 bg-white dark:bg-gray-800 rounded-full shadow-md cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors border border-gray-200 dark:border-gray-700"
        >
          <Upload size={16} className="text-indigo-600" />

          <input
            ref={fileInputRef}
            id="profile-image"
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />
        </label>

        {preview && (
          <button
            type="button"
            onClick={handleRemoveImage}
            className="absolute top-0 right-0 w-6 h-6 flex items-center justify-center rounded-full bg-red-500 text-white shadow-md hover:bg-red-600 transition"
          >
            <X size={14} />
          </button>
        )}

      </div>

      <p className="text-xs text-gray-400 dark:text-gray-500 mt-2">
        Click camera to upload photo
      </p>
    </div>
  );
};

export default CustomerImageUpload;