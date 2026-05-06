import React from "react";
import { createPortal } from "react-dom";
import { X, User, Mail, Phone, MapPin, Calendar } from "lucide-react";
import statesData from "../../data/statesData";
import "@fontsource/poppins/400.css";
import "@fontsource/poppins/500.css";
import "@fontsource/poppins/600.css";

const ViewCustomer = ({ customer, onClose }) => {
  if (!customer) return null;

  const getStateName = (stateId) => {
    return statesData[stateId]?.name || "—";
  };

  const getCityName = (stateId, cityId) => {
    const state = statesData[stateId];
    if (!state) return "—";
    const city = state.cities.find(c => String(c.id) === String(cityId));
    return city ? city.name : "—";
  };

  const stateName = getStateName(customer.state);
  const cityName = getCityName(customer.state, customer.city);

  const formattedDate = customer.createdAt
    ? new Date(customer.createdAt).toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
    : "—";

  const imageUrl = customer.image
    ? `http://localhost:5000/uploads/${customer.image}`
    : null;

  return createPortal(
    <div
      className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex justify-center items-end sm:items-center z-[999] p-2 sm:p-4 font-[Poppins]"
      onClick={onClose}
    >
      <div
        className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-[95%] sm:w-full max-w-sm sm:max-w-md md:max-w-lg mx-auto max-h-[85vh] overflow-y-auto [&::-webkit-scrollbar]:hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="relative bg-gradient-to-r from-indigo-600 to-purple-600 rounded-t-2xl p-3 sm:p-5 md:p-6 text-white sticky top-0 z-10">
          <button
            onClick={onClose}
            className="absolute top-3 right-3 sm:top-4 sm:right-4 hover:bg-white hover:bg-opacity-20 dark:hover:bg-gray-700 rounded-full p-1.5"
          >
            <X size={18} />
          </button>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 rounded-full overflow-hidden bg-white/20 flex items-center justify-center">
              {imageUrl ? (
                <img src={imageUrl} alt="profile" className="w-full h-full object-cover" />
              ) : (
                <User size={22} />
              )}
            </div>
            <div>
              <h2 className="text-lg sm:text-xl md:text-2xl font-bold">Customer Details</h2>
              <p className="text-[10px] sm:text-xs md:text-sm text-indigo-100">View complete information</p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-3 sm:p-5 md:p-6 space-y-3 sm:space-y-4">
          <Detail icon={<User size={18} />}     label="Full Name"      value={customer.name} />
          <Detail icon={<Mail size={18} />}     label="Email Address"  value={customer.email} />
          <Detail icon={<Phone size={18} />}    label="Phone Number"   value={customer.phone} />
          <Detail icon={<Calendar size={18} />} label="Created Date"   value={formattedDate} />
          <Detail icon={<MapPin size={18} />}   label="Street Address" value={customer.street} />
          <Detail
            icon={<MapPin size={18} />}
            label="State and City"
            value={
              cityName !== "—" && stateName !== "—"
                ? `${cityName}, ${stateName}`
                : cityName !== "—"
                ? cityName
                : stateName !== "—"
                ? stateName
                : "—"
            }
          />
          <Detail icon={<MapPin size={18} />} label="PIN Code" value={customer.pincode} />
        </div>
      </div>
    </div>,
    document.body
  );
};

const Detail = ({ icon, label, value }) => (
  <div className="flex items-start gap-2 sm:gap-3 pb-2 sm:pb-3 border-b border-gray-100 dark:border-gray-700">
    <div className="text-indigo-500 mt-0.5">{icon}</div>
    <div className="flex-1">
      <p className="text-xs text-gray-500 dark:text-gray-400 uppercase">{label}</p>
      <p className="text-gray-800 dark:text-white mt-0.5">{value || "—"}</p>
    </div>
  </div>
);

export default ViewCustomer;