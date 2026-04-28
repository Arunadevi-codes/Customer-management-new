import React from 'react';
import { Upload, User } from 'lucide-react';

const CustomerImageUpload = ({ preview, handleFileChange }) => (
  <div className="flex flex-col items-center justify-center pb-2">
    <div className="relative group">
      <div className="w-24 h-24 rounded-full bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center overflow-hidden shadow-md ring-4 ring-white">
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
        className="absolute bottom-0 right-0 p-1.5 bg-white rounded-full shadow-md cursor-pointer hover:bg-gray-50 transition-colors border border-gray-200"
      >
        <Upload size={16} className="text-indigo-600" />
        <input 
          id="profile-image"
          type="file" 
          accept="image/*"
          onChange={handleFileChange} 
          className="hidden" 
        />
      </label>
    </div>
    <p className="text-xs text-gray-400 mt-2">Click camera to upload photo</p>
  </div>
);

export default CustomerImageUpload;