import React from 'react';
import { Edit, Trash2, Users, Eye } from 'lucide-react';
import statesData from "../../data/statesData";

const ViewCustomers = ({ customers = [], onEdit, onDelete, onView }) => {
  const safeCustomers = customers || [];

  if (safeCustomers.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
        <div className="flex flex-col items-center justify-center text-gray-500">
          <Users size={64} className="mb-4 text-gray-300" />
          <p className="text-lg font-medium text-gray-700">No customers found</p>
          <p className="text-sm text-gray-400 mt-1">
            Click the "Add Customer" button to create your first customer
          </p>
        </div>
      </div>
    );
  }

  const getStateName = (stateId) => {
  return statesData[stateId]?.name || "—";
};

const getCityName = (stateId, cityId) => {
  const state = statesData[stateId];
  if (!state) return "—";

  const city = state.cities.find(
    (c) => String(c.id) === String(cityId)
  );

  return city ? city.name : "—";
};

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">

          {/* HEADER */}
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Customer</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Phone</th>
              <th className="hidden sm:table-cell px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Address</th>
              <th className="hidden lg:table-cell px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Created</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>

          {/* BODY */}
          <tbody className="divide-y divide-gray-200">
            {safeCustomers.map((customer) => {
            
  return (
    <tr key={customer._id} className="hover:bg-gray-50">

      {/* NAME */}
      <td className="px-4 py-2">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full overflow-hidden border">
            {customer.image ? (
              <img
                src={`http://localhost:5000/uploads/${customer.image}`}
                alt={customer.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="bg-indigo-500 text-white w-full h-full flex items-center justify-center text-sm">
                {customer.name?.charAt(0)?.toUpperCase() || 'C'}
              </span>
            )}
          </div>
          <p className="text-sm font-medium">{customer.name}</p>
        </div>
      </td>

      {/* EMAIL */}
      <td className="px-4 py-2 text-sm text-gray-600">
        {customer.email || '—'}
      </td>

      {/* PHONE */}
      <td className="px-4 py-2 text-sm text-gray-600">
        {customer.phone || '—'}
      </td>

      <td className="hidden sm:table-cell px-4 py-2 text-sm text-gray-600">
  {customer.street || '—'}, 
{getCityName(customer.state, customer.city)}, 
{getStateName(customer.state)} 
- {customer.pincode || '—'}
</td>

      {/* DATE */}
      <td className="hidden lg:table-cell px-4 py-2 text-sm text-gray-600">
        {customer.createdAt
          ? new Date(customer.createdAt).toLocaleDateString('en-IN')
          : '—'}
      </td>

      {/* ACTIONS */}
      <td className="px-4 py-2">
        <div className="flex gap-2">
          <button onClick={() => onView(customer._id)} className="p-1 text-green-600 hover:bg-green-50 rounded">
            <Eye size={18} />
          </button>
          <button onClick={() => onEdit(customer)} className="p-1 text-blue-600 hover:bg-blue-50 rounded">
            <Edit size={18} />
          </button>
          <button onClick={() => onDelete(customer._id)} className="p-1 text-red-600 hover:bg-red-50 rounded">
            <Trash2 size={18} />
          </button>
        </div>
      </td>

    </tr>
  );
})}
          </tbody>
        </table>
      </div>
      <div className="px-6 py-3 bg-gray-50 border-t border-gray-200">
        <p className="text-sm text-gray-500">
          Showing {safeCustomers.length} customer{safeCustomers.length !== 1 ? 's' : ''}
        </p>
      </div>
    </div>
  );
};

export default ViewCustomers;