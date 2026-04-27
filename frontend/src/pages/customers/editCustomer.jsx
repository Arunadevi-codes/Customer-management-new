// editCustomer.jsx
import React, { useState, useEffect } from 'react';
import { X, Check, Upload, User, Mail, Phone, MapPin, Building, Globe, Home } from 'lucide-react';
import { toast } from 'react-toastify';
import API from "../../services/api";

const EditCustomer = ({ customer, onSave, onClose }) => {
  const [formData, setFormData] = useState({
    name: customer?.name || '',
    email: customer?.email || '',
    phone: customer?.phone || '',
    street: customer?.street || '',
    state: customer?.state || customer?.state || '',
    city: customer?.city || customer?.city || '',
    pincode: customer?.pincode || '',
    image: null
  });

  const [preview, setPreview] = useState(
    customer?.image 
      ? `http://localhost:5000/uploads/${customer.image}` 
      : null
  );
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [loading, setLoading] = useState({
    states: false,
    cities: false,
    submitting: false
  });

  // Cleanup preview
  useEffect(() => {
    return () => {
      if (preview && preview.startsWith("blob:")) {
        URL.revokeObjectURL(preview);
      }
    };
  }, [preview]);

  // Load states on component mount
  useEffect(() => {
    loadStates();
  }, []);

  // Load cities if state is pre-selected (for edit mode)
  useEffect(() => {
    if (formData.state && states.length > 0) {
      loadCities(formData.state);
    }
  }, [formData.state, states]);

  const loadStates = async () => {
    setLoading(prev => ({ ...prev, states: true }));
    try {
      const response = await API.get('/states');
      if (response.data.success) {
        setStates(response.data.states);
      } else {
        toast.error('Failed to load states');
      }
    } catch (err) {
      console.error("Error loading states:", err);
      toast.error("Failed to load states");
    } finally {
      setLoading(prev => ({ ...prev, states: false }));
    }
  };

  const loadCities = async (stateId) => {
    if (!stateId) {
      setCities([]);
      return;
    }
    
    setLoading(prev => ({ ...prev, cities: true }));
    try {
      const response = await API.get(`/cities?stateId=${stateId}`);
      if (response.data.success) {
        setCities(response.data.cities);
      } else {
        setCities([]);
        toast.error(response.data.message || 'Failed to load cities');
      }
    } catch (err) {
      console.error("Error loading cities:", err);
      toast.error("Failed to load cities");
      setCities([]);
    } finally {
      setLoading(prev => ({ ...prev, cities: false }));
    }
  };

  const validatePhone = (phone) => /^[0-9]{10}$/.test(phone);
  const validatePincode = (pincode) => !pincode || /^[0-9]{6}$/.test(pincode);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.size > 5 * 1024 * 1024) {
      toast.error("Image size should be less than 5MB");
      return;
    }
    setFormData({ ...formData, image: file });
    if (file) {
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleStateChange = async (e) => {
    const stateId = e.target.value;
    setFormData((prev) => ({
      ...prev,
      state: stateId,
      city: ''
    }));
    
    // Fetch cities based on state
    if (stateId) {
      await loadCities(stateId);
    } else {
      setCities([]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (!formData.name || !formData.email || !formData.phone) {
      toast.error('Please fill all required fields');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast.error('Invalid email format');
      return;
    }

    if (!validatePhone(formData.phone)) {
      toast.error('Enter valid 10-digit mobile number');
      return;
    }

    if (!formData.state) {
      toast.error("Please select a state");
      return;
    }

    if (!formData.city) {
      toast.error("Please select a city");
      return;
    }

    if (formData.pincode && !validatePincode(formData.pincode)) {
      toast.error("Enter valid 6-digit pincode");
      return;
    }

    setLoading(prev => ({ ...prev, submitting: true }));

    try {
      const data = new FormData();
      data.append("name", formData.name);
      data.append("email", formData.email);
      data.append("phone", formData.phone);
      data.append("street", formData.street);
      data.append("state", formData.state);
      data.append("city", formData.city);
      data.append("pincode", formData.pincode);

      // Only send image if user selects new one
      if (formData.image) {
        data.append("image", formData.image);
      }

      await onSave(data);
      onClose();
    } catch (error) {
      console.error("Error updating customer:", error);
      toast.error(error.response?.data?.message || "Failed to update customer");
    } finally {
      setLoading(prev => ({ ...prev, submitting: false }));
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        
        {/* Header */}
        <div className="sticky top-0 bg-white z-10 flex justify-between items-center p-6 border-b border-gray-200 rounded-t-2xl">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">
              Edit Customer
            </h2>
            <p className="text-sm text-gray-500 mt-1">Update customer details below</p>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            disabled={loading.submitting}
          >
            <X size={20} className="text-gray-500" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <div className="p-6 space-y-6">
            
            {/* Profile Image Upload */}
            <div className="flex flex-col items-center space-y-3 pb-4 border-b border-gray-100">
              <div className="relative">
                {preview ? (
                  <img 
                    src={preview} 
                    alt="Customer preview" 
                    className="w-28 h-28 rounded-full object-cover border-4 border-indigo-100 shadow-md"
                  />
                ) : (
                  <div className="w-28 h-28 rounded-full bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center border-4 border-indigo-100 shadow-md">
                    <User size={45} className="text-indigo-400" />
                  </div>
                )}
                <label className="absolute bottom-0 right-0 p-2 bg-indigo-600 rounded-full cursor-pointer hover:bg-indigo-700 transition-colors shadow-lg">
                  <Upload size={14} className="text-white" />
                  <input 
                    type="file" 
                    accept="image/*" 
                    onChange={handleFileChange} 
                    className="hidden"
                  />
                </label>
              </div>
              <p className="text-xs text-gray-500">
                Click on camera icon to change photo (Max 5MB)
              </p>
            </div>

            {/* Basic Information Section */}
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <User size={20} className="text-indigo-600" />
                Basic Information
              </h3>
              <div className="space-y-4">
                {/* Name Field */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <input 
                    name="name" 
                    value={formData.name} 
                    onChange={handleInputChange} 
                    placeholder="Enter customer name" 
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                    disabled={loading.submitting}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Email Field */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      <Mail size={16} className="inline mr-1 text-indigo-600" />
                      Email Address <span className="text-red-500">*</span>
                    </label>
                    <input 
                      name="email" 
                      type="email"
                      value={formData.email} 
                      onChange={handleInputChange} 
                      placeholder="customer@example.com" 
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                      disabled={loading.submitting}
                    />
                  </div>

                  {/* Phone Field */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      <Phone size={16} className="inline mr-1 text-indigo-600" />
                      Phone Number <span className="text-red-500">*</span>
                    </label>
                    <input 
                      name="phone" 
                      value={formData.phone} 
                      onChange={handleInputChange} 
                      placeholder="1234567890" 
                      maxLength="10"
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                      disabled={loading.submitting}
                    />
                    <p className="text-xs text-gray-500 mt-1">Enter 10-digit mobile number</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Address Information Section */}
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <MapPin size={20} className="text-indigo-600" />
                Address Information
              </h3>
              <div className="space-y-4">
                {/* Street Address */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    <Home size={16} className="inline mr-1 text-indigo-600" />
                    Street Address
                  </label>
                  <textarea 
                    name="street" 
                    value={formData.street} 
                    onChange={handleInputChange} 
                    placeholder="House number, street name" 
                    rows="2"
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all resize-none"
                    disabled={loading.submitting}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* State Dropdown */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      <Globe size={16} className="inline mr-1 text-indigo-600" />
                      State <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="state"
                      value={formData.state}
                      onChange={handleStateChange}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all bg-white"
                      disabled={loading.states || loading.submitting}
                    >
                      <option value="">
                        {loading.states ? "Loading states..." : "Select State"}
                      </option>
                      {states.map((state) => (
                        <option key={state.id} value={state.id}>
                          {state.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* City Dropdown */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      <Building size={16} className="inline mr-1 text-indigo-600" />
                      City <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all bg-white"
                      disabled={!formData.state || loading.cities || loading.submitting}
                    >
                      <option value="">
                        {!formData.state 
                          ? "Select state first" 
                          : loading.cities 
                          ? "Loading cities..." 
                          : cities.length === 0
                          ? "No cities available"
                          : "Select City"}
                      </option>
                      {cities.map((city) => (
                        <option key={city.id} value={city.id}>
                          {city.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Pincode */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    PIN Code (Optional)
                  </label>
                  <input 
                    name="pincode" 
                    type="text"
                    value={formData.pincode} 
                    onChange={handleInputChange} 
                    placeholder="Enter 6-digit PIN code" 
                    maxLength="6"
                    className="w-full md:w-1/2 px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                    disabled={loading.submitting}
                  />
                  <p className="text-xs text-gray-500 mt-1">Enter 6-digit pincode (optional)</p>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="sticky bottom-0 bg-white border-t border-gray-200 p-6 rounded-b-2xl">
            <div className="flex gap-3">
              <button 
                type="button"
                onClick={onClose}
                className="flex-1 px-5 py-2.5 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors"
                disabled={loading.submitting}
              >
                Cancel
              </button>
              <button 
                type="submit" 
                className="flex-1 px-5 py-2.5 bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white rounded-lg font-medium flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={loading.submitting}
              >
                {loading.submitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Updating...</span>
                  </>
                ) : (
                  <>
                    <Check size={18} />
                    <span>Update Customer</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditCustomer;