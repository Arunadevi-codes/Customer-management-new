import React, { useState, useEffect, useRef } from "react";
import { Users, Edit, Trash2, Eye, UserCheck, ChevronDown, X } from "lucide-react";

import GenericTable from "../../components/ui/genericTable";
import statesData from "../../data/statesData";
import { useAuth } from "../../contexts/authContext";
import API from "../../services/api";

// ── helpers ────────────────────────────────────────────────────
const getStateName = (stateId) => statesData[stateId]?.name || "—";

const getCityName = (stateId, cityId) => {
  const state = statesData[stateId];
  if (!state) return "—";
  const city = state.cities.find((c) => String(c.id) === String(cityId));
  return city ? city.name : "—";
};

// ── ReassignDropdown ───────────────────────────────────────────
const ReassignDropdown = ({ customer, staffList, onReassign }) => {
  const [open, setOpen]       = useState(false);
  const [saving, setSaving]   = useState(false);
  const ref                   = useRef(null);

  useEffect(() => {
    if (!open) return;
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const handler = (e) => { if (e.key === "Escape") setOpen(false); };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [open]);

  const handleSelect = async (staffId) => {
    setSaving(true);
    try {
      await onReassign(customer._id, staffId);
    } finally {
      setSaving(false);
      setOpen(false);
    }
  };

  const current = customer.assignedTo;

  return (
    <div ref={ref} className="relative inline-block">
      <button
        onClick={() => setOpen((v) => !v)}
        disabled={saving}
        title="Click to reassign"
        className={`
          inline-flex items-center gap-1.5 px-2 py-1 rounded-lg text-xs font-medium
          transition-all duration-150 select-none max-w-[110px]
          ${current
            ? "bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-700 hover:bg-indigo-100 dark:hover:bg-indigo-900/50"
            : "bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 border border-dashed border-gray-300 dark:border-gray-600 hover:bg-gray-200 dark:hover:bg-gray-700"
          }
          ${saving ? "opacity-60 cursor-wait" : "cursor-pointer"}
        `}
      >
        <UserCheck size={11} className="flex-shrink-0" />
        <span className="truncate">
          {saving ? "Saving…" : current ? current.fullName : "Unassigned"}
        </span>
        <ChevronDown
          size={11}
          className={`flex-shrink-0 transition-transform duration-150 ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && (
        <div
          className="
            absolute z-[999] mt-1.5 w-52
            bg-white dark:bg-gray-900
            border border-gray-200 dark:border-gray-700
            rounded-xl shadow-xl overflow-hidden
            animate-in fade-in slide-in-from-top-1 duration-100
          "
          style={{ top: "100%", left: 0 }}
        >
          <div className="flex items-center justify-between px-3 py-2 border-b border-gray-100 dark:border-gray-800">
            <span className="text-[11px] font-semibold uppercase tracking-wide text-gray-400 dark:text-gray-500">
              Assign to
            </span>
            <button
              onClick={() => setOpen(false)}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded transition"
            >
              <X size={12} />
            </button>
          </div>

          <button
            onClick={() => handleSelect("")}
            className={`
              w-full flex items-center gap-2 px-3 py-2 text-xs text-left
              hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors
              ${!current ? "bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 font-medium" : "text-gray-500 dark:text-gray-400"}
            `}
          >
            <span className="w-5 h-5 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center flex-shrink-0">
              <X size={9} />
            </span>
            Unassigned
          </button>

          <div className="max-h-48 overflow-y-auto [&::-webkit-scrollbar]:hidden">
            {staffList.length === 0 ? (
              <p className="px-3 py-3 text-xs text-gray-400 dark:text-gray-500 text-center">
                No active staff found
              </p>
            ) : (
              staffList.map((s) => {
                const isSelected = current?._id === s._id;
                return (
                  <button
                    key={s._id}
                    onClick={() => handleSelect(s._id)}
                    className={`
                      w-full flex items-center gap-2 px-3 py-2 text-xs text-left
                      hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors
                      ${isSelected
                        ? "bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 font-medium"
                        : "text-gray-700 dark:text-gray-300"}
                    `}
                  >
                    <span
                      className={`
                        w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-semibold flex-shrink-0
                        ${isSelected
                          ? "bg-indigo-500 text-white"
                          : "bg-gradient-to-br from-indigo-400 to-purple-500 text-white"}
                      `}
                    >
                      {s.fullName?.charAt(0)?.toUpperCase() || "S"}
                    </span>
                    <div className="min-w-0">
                      <div className="truncate">{s.fullName}</div>
                      <div className="text-[10px] text-gray-400 dark:text-gray-500 truncate">
                        {s.employeeId}
                      </div>
                    </div>
                    {isSelected && (
                      <span className="ml-auto text-indigo-500 flex-shrink-0">✓</span>
                    )}
                  </button>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
};

// ── Column width definitions (used via colgroup in the table) ──
// These are injected as inline styles via a style tag approach,
// but since GenericTable uses table-fixed, we control widths from
// the header cells. We set them via the COLUMNS config using a
// `width` property that SortableTh / StaticTh should forward.
// If your StaticTh/SortableTh don't support `style`, add it there,
// or use the colgroup approach described at the bottom.

// ── renderCustomerRow ──────────────────────────────────────────
const renderCustomerRow = (customer, { onEdit, onDelete, onView, isAdmin, staffList, onReassign }) => (
  <tr
    key={customer._id}
    className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors duration-200 border-b border-gray-100 dark:border-gray-700 divide-x divide-gray-100 dark:divide-gray-700"
  >
    {/* NAME */}
    <td className="px-2 py-2 sm:py-3">
      <div className="flex items-center gap-1.5">
        <div className="w-7 h-7 rounded-full overflow-hidden border shadow-sm flex-shrink-0">
          {customer.image ? (
            <img
              src={`http://localhost:5000/uploads/${customer.image}`}
              alt={customer.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <span className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white w-full h-full flex items-center justify-center text-[10px] font-medium">
              {customer.name?.charAt(0)?.toUpperCase() || "C"}
            </span>
          )}
        </div>
        <div className="truncate text-xs font-medium text-gray-800 dark:text-white min-w-0" title={customer.name}>
          {customer.name}
        </div>
      </div>
    </td>

    {/* EMAIL */}
    <td className="px-2 py-2 sm:py-3 relative group">
      <div className="truncate text-xs text-gray-600 dark:text-gray-300 min-w-0" title={customer.email}>
        {customer.email || "—"}
      </div>
      {customer.email && (
        <div className="absolute left-0 top-full mt-1 hidden group-hover:block z-50 bg-gray-700 dark:bg-gray-800 text-white text-xs rounded-lg p-2 shadow-lg w-max max-w-[240px]">
          <div className="break-all">{customer.email}</div>
        </div>
      )}
    </td>

    {/* PHONE */}
    <td className="px-2 py-2 sm:py-3">
      <div className="truncate text-xs text-gray-600 dark:text-gray-300 min-w-0" title={customer.phone}>
        {customer.phone || "—"}
      </div>
    </td>

    {/* ADDRESS */}
    <td className="px-2 py-2 sm:py-3 relative group">
      {(() => {
        const fullAddress = [
          customer.street,
          getCityName(customer.state, customer.city),
          getStateName(customer.state),
          customer.pincode,
        ].filter(Boolean).join(", ");
        return (
          <>
            <div className="truncate text-xs text-gray-600 dark:text-gray-300" title={fullAddress}>
              {fullAddress || "—"}
            </div>
            {fullAddress && (
              <div className="absolute left-0 top-full mt-1 hidden group-hover:block z-50 bg-gray-700 dark:bg-gray-800 text-white text-xs rounded-lg p-2 shadow-lg w-max max-w-[240px] whitespace-normal">
                {fullAddress}
              </div>
            )}
          </>
        );
      })()}
    </td>

    {/* ASSIGNED TO — admin only */}
    {isAdmin && (
      <td className="px-1 py-2 sm:py-3">
        <div className="flex justify-center">
          <ReassignDropdown
            customer={customer}
            staffList={staffList}
            onReassign={onReassign}
          />
        </div>
      </td>
    )}

    {/* CREATED — compact date */}
    <td className="px-2 py-2 sm:py-3">
      <div className="truncate text-xs text-gray-600 dark:text-gray-300">
        {customer.createdAt
          ? new Date(customer.createdAt).toLocaleDateString("en-IN")
          : "—"}
      </div>
    </td>

    {/* ACTIONS */}
    <td className="px-1 py-2 sm:py-3">
      <div className="flex gap-0.5 justify-center">
        <button
          onClick={() => onView(customer._id)}
          className="p-1 text-green-600 hover:bg-green-50 dark:hover:bg-gray-800 rounded-lg transition"
          title="View customer"
        >
          <Eye size={14} />
        </button>
        {isAdmin && onEdit && (
          <button
            onClick={() => onEdit(customer)}
            className="p-1 text-blue-600 hover:bg-blue-50 dark:hover:bg-gray-800 rounded-lg transition"
            title="Edit customer"
          >
            <Edit size={14} />
          </button>
        )}
        {isAdmin && onDelete && (
          <button
            onClick={() => onDelete(customer._id)}
            className="p-1 text-red-600 hover:bg-red-50 dark:hover:bg-gray-800 rounded-lg transition"
            title="Delete customer"
          >
            <Trash2 size={14} />
          </button>
        )}
      </div>
    </td>
  </tr>
);

// ── ViewCustomers ──────────────────────────────────────────────
const ViewCustomers = ({
  customers = [],
  onEdit,
  onDelete,
  onView,
  onSort,
  sortField,
  sortOrder,
  onReassign,
}) => {
  const { user }      = useAuth();
  const isAdmin       = user?.role === "superadmin";

  const [staffList, setStaffList] = useState([]);

  useEffect(() => {
    if (!isAdmin) return;
    const loadStaff = async () => {
      try {
        const res  = await API.get("/staff?status=active&limit=200");
        const data = res.data;
        const list = Array.isArray(data)
          ? data
          : Array.isArray(data.staffs)    ? data.staffs
          : Array.isArray(data.staff)     ? data.staff
          : Array.isArray(data.staffList) ? data.staffList
          : Array.isArray(data.data)      ? data.data
          : [];
        setStaffList(list);
      } catch (err) {
        console.error("Failed to load staff list:", err);
      }
    };
    loadStaff();
  }, [isAdmin]);

  // Column definitions — width strings are passed as style to th elements.
  // With table-fixed these percentages carve up 100% of the container width.
  // Adjust as needed; totals don't have to equal 100% exactly (browser balances).
  const COLUMNS = [
    { field: "name",      label: "Name",        sortable: true,  style: { width: "18%" } },
    {                     label: "Email",                         style: { width: "20%" } },
    {                     label: "Phone",                         style: { width: "13%" } },
    {                     label: "Address",                       style: { width: "22%" } },
    ...(isAdmin ? [{ label: "Assigned To",                        style: { width: "13%" } }] : []),
    { field: "createdAt", label: "Created",     sortable: true,  style: { width: "8%"  } },
    {                     label: "Actions",                       style: { width: "6%"  } },
  ];

  const [localCustomers, setLocalCustomers] = useState(customers);

  useEffect(() => {
    setLocalCustomers(customers);
  }, [customers]);

  const handleReassign = async (customerId, staffId) => {
    if (onReassign) {
      await onReassign(customerId, staffId);
      return;
    }
    try {
      const formData = new FormData();
      formData.append("assignedTo", staffId);
      const res = await API.put(`/customers/${customerId}`, formData);
      const updated = res.data;
      setLocalCustomers((prev) =>
        prev.map((c) => (c._id === customerId ? updated : c))
      );
    } catch (err) {
      console.error("Reassign failed:", err);
    }
  };

  return (
    <GenericTable
      rows={localCustomers}
      columns={COLUMNS}
      renderRow={(customer) =>
        renderCustomerRow(customer, {
          onEdit,
          onDelete,
          onView,
          isAdmin,
          staffList,
          onReassign: handleReassign,
        })
      }
      onSort={onSort}
      sortField={sortField}
      sortOrder={sortOrder}
      emptyIcon={Users}
      emptyTitle="No customers found"
      emptySubtitle={isAdmin ? 'Click "Add Customer" to create your first customer' : 'No customers have been assigned to you yet'}
      footerLabel="customer"
    />
  );
};

export default ViewCustomers;