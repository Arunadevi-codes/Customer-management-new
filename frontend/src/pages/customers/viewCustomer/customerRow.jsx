import React from "react";
import { Edit, Trash2, Eye } from "lucide-react";
import statesData from "../../../data/statesData";

const getStateName = (stateId) => statesData[stateId]?.name || "—";

const getCityName = (stateId, cityId) => {
  const state = statesData[stateId];
  if (!state) return "—";

  const city = state.cities.find(
    (c) => String(c.id) === String(cityId)
  );

  return city ? city.name : "—";
};

const CustomerRow = ({ customer, onEdit, onDelete, onView }) => (
  <tr className="hover:bg-gray-50 transition-colors duration-200 border-b border-gray-100 divide-x divide-gray-100">

    {/* NAME */}
    <td className="px-3 sm:px-4 py-2 sm:py-3">
      <div className="flex items-center gap-2 sm:gap-3">
        <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full overflow-hidden border shadow-sm flex-shrink-0">
          {customer.image ? (
            <img
              src={`http://localhost:5000/uploads/${customer.image}`}
              alt={customer.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <span className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white w-full h-full flex items-center justify-center text-[10px] sm:text-xs font-medium">
              {customer.name?.charAt(0)?.toUpperCase() || "C"}
            </span>
          )}
        </div>

        <div
          className="truncate max-w-[120px] sm:max-w-[150px] text-xs sm:text-sm font-medium text-gray-800"
          title={customer.name}
        >
          {customer.name}
        </div>
      </div>
    </td>

    {/* EMAIL */}
<td className="px-3 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm text-gray-600 relative group">

  {/* Visible truncated text */}
  <div className="truncate max-w-[140px]">
    {customer.email || "—"}
  </div>

  {/* Tooltip */}
  {customer.email && (
    <div className="absolute left-0 top-full mt-1 hidden group-hover:block z-50 bg-gray-500 text-white text-xs rounded-lg p-2 shadow-lg w-max max-w-[250px]">
      <div className="font-medium">Email </div>
      <div className="break-all">
        {customer.email}
      </div>
    </div>
  )}
</td>

    {/* PHONE */}
    <td className="px-3 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm text-gray-600">
      <div className="truncate max-w-[120px]" title={customer.phone}>
        {customer.phone || "—"}
      </div>
    </td>

    {/* ADDRESS */}
    <td className="px-3 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm text-gray-600 relative group">

  {/* Visible truncated text */}
  <div className="truncate max-w-[180px]">
    {customer.street ? (
      <>
        {customer.street}, {getCityName(customer.state, customer.city)},{" "}
        {getStateName(customer.state)}
        {customer.pincode && ` - ${customer.pincode}`}
      </>
    ) : (
      "—"
    )}
  </div>

  {/* Tooltip */}
  {customer.street && (
    <div className="absolute left-0 top-full mt-1 hidden group-hover:block z-50 bg-gray-500 text-white text-xs rounded-lg p-2 shadow-lg w-max max-w-[250px]">
      <div className="font-medium">Full Address</div>
      <div>
        {customer.street}, {getCityName(customer.state, customer.city)}
      </div>
      <div>
        {getStateName(customer.state)} {customer.pincode && `- ${customer.pincode}`}
      </div>
    </div>
  )}
</td>

    {/* CREATED */}
    <td className="px-3 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm text-gray-600">
      <div className="truncate max-w-[120px]" title={customer.createdAt}>
        {customer.createdAt
          ? new Date(customer.createdAt).toLocaleDateString("en-IN")
          : "—"}
      </div>
    </td>

    {/* ACTIONS */}
    <td className="px-3 sm:px-4 py-2 sm:py-3">
      <div className="flex gap-1.5 sm:gap-2">
        <button
          onClick={() => onView(customer._id)}
          className="p-1.5 sm:p-1 text-green-600 hover:bg-green-50 rounded-lg transition"
          title="View customer"
        >
          <Eye size={16} />
        </button>

        <button
          onClick={() => onEdit(customer)}
          className="p-1.5 sm:p-1 text-blue-600 hover:bg-blue-50 rounded-lg transition"
          title="Edit customer"
        >
          <Edit size={16} />
        </button>

        <button
          onClick={() => onDelete(customer._id)}
          className="p-1.5 sm:p-1 text-red-600 hover:bg-red-50 rounded-lg transition"
          title="Delete customer"
        >
          <Trash2 size={16} />
        </button>
      </div>
    </td>
  </tr>
);

export default CustomerRow;