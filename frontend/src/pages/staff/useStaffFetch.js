import { useState, useEffect, useCallback } from "react";
import { toast } from "react-toastify";
import API from "../../services/api";

const useStaffFetch = () => {
  const [staffs, setStaffs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [total, setTotal] = useState(0);
  const [sortField, setSortField] = useState("");
  const [sortOrder, setSortOrder] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  const totalPages = Math.ceil(total / limit) || 1;

  // DEBOUNCE SEARCH
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
      setPage(1);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  // FETCH STAFF
  const fetchStaff = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      params.append("offset", page - 1);
      params.append("limit", limit);
      if (sortField && sortOrder) {
        params.append("sortField", sortField);
        params.append("sortOrder", sortOrder);
      }
      if (debouncedSearch) params.append("search", debouncedSearch);
      if (fromDate) params.append("fromDate", fromDate);
      if (toDate) params.append("toDate", toDate);

      const res = await API.get(`/staff?${params.toString()}`);
      setStaffs(res.data.staffs || []);
      setTotal(res.data.total || 0);
    } catch (err) {
      console.log(err);
      toast.error("Failed to fetch staff");
    } finally {
      setLoading(false);
    }
  }, [page, limit, debouncedSearch, sortField, sortOrder, fromDate, toDate]);

  useEffect(() => { fetchStaff(); }, [fetchStaff]);

  // SORT
  const handleSort = (field) => {
    if (sortField !== field) { setSortField(field); setSortOrder("asc"); return; }
    if (sortOrder === "asc") { setSortOrder("desc"); return; }
    if (sortOrder === "desc") { setSortField(""); setSortOrder(""); return; }
    setSortField(field); setSortOrder("asc");
  };

  // SEARCH
  const handleSearch = (value) => { setSearchTerm(value); setPage(1); };

  return {
    staffs, setStaffs,
    loading,
    searchTerm, setSearchTerm, handleSearch,
    page, setPage,
    limit, setLimit,
    total, setTotal,        // ✅ exposed setTotal for count updates on delete/add
    totalPages,
    sortField, sortOrder, handleSort,
    fromDate, setFromDate,
    toDate, setToDate,
    refetch: fetchStaff,    // ✅ exposed for manual re-fetch after mutations
  };
};

export default useStaffFetch;