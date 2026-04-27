import React from "react";
import { X, User, Mail, Phone, MapPin, Calendar } from "lucide-react";
import statesData from "../../data/statesData";

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

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex justify-center items-center z-50 p-2 sm:p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-lg mx-auto max-h-[90vh] sm:max-h-[85vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="relative bg-gradient-to-r from-indigo-600 to-purple-600 rounded-t-2xl p-4 sm:p-6 text-white sticky top-0 z-10">
          <button
            onClick={onClose}
            className="absolute top-3 right-3 sm:top-4 sm:right-4 hover:bg-white hover:bg-opacity-20 rounded-full p-1.5"
          >
            <X size={18} />
          </button>

          <div className="flex items-center gap-3">
            <div className="bg-white bg-opacity-20 rounded-full p-2 sm:p-3">
              <User size={22} />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-bold">
                Customer Details
              </h2>
              <p className="text-indigo-100 text-xs sm:text-sm">
                View complete information
              </p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-6 space-y-4">

          <Detail icon={<User size={18} />} label="Full Name" value={customer.name} />
          <Detail icon={<Mail size={18} />} label="Email Address" value={customer.email} />
          <Detail icon={<Phone size={18} />} label="Phone Number" value={customer.phone} />
          <Detail icon={<Calendar size={18} />} label="Created Date" value={formattedDate} />
          <Detail icon={<MapPin size={18} />} label="Street Address" value={customer.street} />

          {/* ✅ FIXED LOCATION */}
          <Detail
            icon={<MapPin size={18} />}
            label="Location"
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

        {/* Footer */}
        <div className="px-4 sm:px-6 py-3 sm:py-4 bg-gray-50 border-t flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg flex items-center gap-2"
          >
            <X size={16} />
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

const Detail = ({ icon, label, value }) => (
  <div className="flex items-start gap-3 pb-3 border-b border-gray-100">
    <div className="text-indigo-500 mt-0.5">{icon}</div>
    <div className="flex-1">
      <p className="text-xs text-gray-500 uppercase">{label}</p>
      <p className="text-gray-800 mt-0.5">{value || "—"}</p>
    </div>
  </div>
);

export default ViewCustomer;