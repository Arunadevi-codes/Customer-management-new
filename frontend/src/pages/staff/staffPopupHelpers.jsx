import React from "react";
import statesData from "../../data/statesData";

// LOCATION HELPERS
export const getStateName = (stateId) =>
  statesData[stateId]?.name || "—";

export const getCityName = (stateId, cityId) => {
  const state = statesData[stateId];
  if (!state) return "—";
  const city = state.cities.find((c) => String(c.id) === String(cityId));
  return city ? city.name : "—";
};

// DATE FORMATTER
export const formatDate = (dateStr) =>
  dateStr
    ? new Date(dateStr).toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
    : "—";

// SECTION LABEL
export const SectionLabel = ({ label }) => (
  <div className="flex items-center gap-2 pt-3 pb-1">
    <span className="text-[10px] font-bold uppercase tracking-widest text-indigo-500 dark:text-indigo-400 whitespace-nowrap">
      {label}
    </span>
    <div className="flex-1 h-px bg-indigo-100 dark:bg-indigo-900/40" />
  </div>
);

// DETAIL ROW — fixed: use nullish check instead of || so "0" and numeric strings display correctly
export const Detail = ({ icon, label, value }) => (
  <div className="flex items-start gap-3 py-2 border-b border-gray-100 dark:border-gray-800 last:border-0">
    <div className="text-indigo-500 dark:text-indigo-400 mt-0.5 flex-shrink-0">{icon}</div>
    <div className="flex-1 min-w-0">
      <p className="text-[10px] font-semibold uppercase tracking-wide text-gray-400 dark:text-gray-500">
        {label}
      </p>
      <p className="text-sm text-gray-800 dark:text-white mt-0.5 break-words">
        {value !== undefined && value !== null && value !== "" ? value : "—"}
      </p>
    </div>
  </div>
);