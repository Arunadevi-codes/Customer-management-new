import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { toast } from 'react-toastify';
import API from "../../../services/api";

import CustomerFormHeader from './customerFormHeader';
import CustomerImageUpload from './customerImageUpload';
import CustomerBasicFields from './customerBasicFields';
import CustomerAddressFields from './customerAddressField';
import CustomerFormActions from './customerFormAction';

const CustomerForm = ({ customer, onSave, onClose }) => {
  const isEdit = !!customer;

  const [formData, setFormData] = useState({
    name: customer?.name || '',
    email: customer?.email || '',
    phone: customer?.phone || '',
    street: customer?.street || '',
    state: customer?.state || '',
    city: customer?.city || '',
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

  useEffect(() => {
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
    document.body.style.overflow = "hidden";
    document.body.style.paddingRight = `${scrollbarWidth}px`;
    return () => {
      document.body.style.overflow = "";
      document.body.style.paddingRight = "";
    };
  }, []);

  useEffect(() => {
    return () => {
      if (preview && preview.startsWith("blob:")) {
        URL.revokeObjectURL(preview);
      }
    };
  }, [preview]);

  useEffect(() => {
    loadStates();
  }, []);

  useEffect(() => {
    if (formData.state) {
      loadCities(formData.state);
    }
  }, [formData.state]);

  const loadStates = async () => {
    setLoading(prev => ({ ...prev, states: true }));
    try {
      const res = await API.get("/states");
      const data = res.data;
      if (data.success) setStates(data.states);
      else if (Array.isArray(data)) setStates(data);
    } catch {
      toast.error("Failed to load states");
    } finally {
      setLoading(prev => ({ ...prev, states: false }));
    }
  };

  const loadCities = async (stateId) => {
    if (!stateId) return setCities([]);
    setLoading(prev => ({ ...prev, cities: true }));
    try {
      const res = await API.get(`/cities?stateId=${stateId}`);
      const data = res.data;
      if (data.success) setCities(data.cities);
      else if (Array.isArray(data)) setCities(data);
      else setCities([]);
    } catch {
      toast.error("Failed to load cities");
      setCities([]);
    } finally {
      setLoading(prev => ({ ...prev, cities: false }));
    }
  };

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
    if (file) setPreview(URL.createObjectURL(file));
  };

  const handleStateChange = async (e) => {
    const stateId = e.target.value;
    setFormData(prev => ({ ...prev, state: stateId, city: '' }));
    if (stateId) await loadCities(stateId);
    else setCities([]);
  };

  const validatePhone = (phone) => /^[0-9]{10}$/.test(phone);
  const validatePincode = (pincode) => !pincode || /^[0-9]{6}$/.test(pincode);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.email || !formData.phone)
      return toast.error("Please fill all required fields");

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
      return toast.error("Invalid email format");

    if (!validatePhone(formData.phone))
      return toast.error("Enter valid 10-digit mobile number");

    if (!formData.state) return toast.error("Please select a state");
    if (!formData.city) return toast.error("Please select a city");

    if (formData.pincode && !validatePincode(formData.pincode))
      return toast.error("Enter valid 6-digit pincode");

    setLoading(prev => ({ ...prev, submitting: true }));

    try {
      const data = new FormData();
      Object.keys(formData).forEach((key) => {
        if (formData[key]) data.append(key, formData[key]);
      });

      if (isEdit) await onSave(data, customer._id);
      else await onSave(data);

      toast.success(isEdit ? "Customer updated successfully!" : "Customer added successfully!");
      onClose();
    } catch {
      toast.error("Failed to save customer");
    } finally {
      setLoading(prev => ({ ...prev, submitting: false }));
    }
  };

  return createPortal(
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[999] p-4">
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-md max-h-[95vh] flex flex-col transition-colors duration-300">

        <CustomerFormHeader isEdit={isEdit} onClose={onClose} />

        <form onSubmit={handleSubmit} className="overflow-y-auto flex-1 [&::-webkit-scrollbar]:hidden">
          <div className="p-5 space-y-5">

            <CustomerImageUpload preview={preview} handleFileChange={handleFileChange} />

            <CustomerBasicFields formData={formData} handleInputChange={handleInputChange} />

            <CustomerAddressFields
              formData={formData}
              states={states}
              cities={cities}
              loading={loading}
              handleInputChange={handleInputChange}
              handleStateChange={handleStateChange}
            />

          </div>

          <CustomerFormActions
            isEdit={isEdit}
            loading={loading}
            onClose={onClose}
          />
        </form>
      </div>
    </div>,
    document.body
  );
};

export default CustomerForm;