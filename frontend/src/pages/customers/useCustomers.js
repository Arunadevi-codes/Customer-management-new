import { useState, useEffect, useCallback} from 'react';
import { toast } from 'react-toastify';
import API from "../../services/api";

export const useCustomers = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState(null);
  const [selectedCustomerId, setSelectedCustomerId] = useState(null);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [total, setTotal] = useState(0);
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [showView, setShowView] = useState(false);
  const [sortField, setSortField] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState("desc");  

  const totalPages = Math.ceil(total / limit) || 1;

  // 🔍 Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
      setPage(1);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  // 📅 Reset page when date changes
  useEffect(() => {
    setPage(1);
  }, [fromDate, toDate]);

  // 📅 Clear search when date is selected
  useEffect(() => {
    if (fromDate || toDate) {
      setSearchTerm("");
      setDebouncedSearch("");
    }
  }, [fromDate, toDate]);

  // 📡 Fetch customers
  const fetchCustomers = useCallback(async () => {
    setLoading(true);
    try {
      const offset = page - 1

      const params = new URLSearchParams();
      params.append("offset", offset);
      params.append("limit", limit);
      params.append("sortField", sortField);
      params.append("sortOrder", sortOrder);

      // 📅 If date filter → ignore search
      if (fromDate || toDate) {
        if (fromDate) params.append("fromDate", fromDate);
        if (toDate) params.append("toDate", toDate);
      } 
      // 🔍 Only if no date → send search
      else if (debouncedSearch) {
        params.append("search", debouncedSearch);
      }

      const res = await API.get(`/customers?${params.toString()}`);

      setCustomers(res.data.customers);
      setTotal(res.data.total);

    } catch {
      toast.error("Failed to fetch customers");
    } finally {
      setLoading(false);
    }
  }, [page, limit, debouncedSearch, fromDate, toDate, sortField, sortOrder]);

  useEffect(() => {
    fetchCustomers();
  }, [fetchCustomers]);

  const handleAddClick = () => {
    setEditingCustomer(null);
    setIsModalOpen(true);
  };

  const handleEditClick = (customer) => {
    setEditingCustomer(customer);
    setIsModalOpen(true);
  };

  const handleDeleteClick = (id) => {
    setSelectedCustomerId(id);
    setIsDeleteModalOpen(true);
  };

  const handleSort = (field) => {
  if (sortField === field) {
    // toggle asc <-> desc
    setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
  } else {
    setSortField(field);
    setSortOrder("asc");
  }
};

  const handleView = async (id) => {
  
  try {
    const res = await API.get(`/customers/${id}`);
    console.log("DATA:", res.data); 
    setSelectedCustomer(res.data);
    setShowView(true);
  } catch (err) {
    console.error(err);
    toast.error("Failed to load customer details");
  }
};

  const handleSaveCustomer = async (formData) => {
    try {
      if (editingCustomer) {
        await API.put(`/customers/${editingCustomer._id}`, formData);
      } else {
        await API.post("/customers", formData);

      }
      fetchCustomers();
      setIsModalOpen(false);
      setEditingCustomer(null);
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
    }
  };

  const handleConfirmDelete = async () => {
    try {
      await API.delete(`/customers/${selectedCustomerId}`);
      toast.success("Customer deleted successfully!");
      fetchCustomers();
      setIsDeleteModalOpen(false);
      setSelectedCustomerId(null);
    } catch {
      toast.error("Delete failed");
    }
  };

  

  return {
    customers, loading, searchTerm, setSearchTerm, isModalOpen,
    setIsModalOpen, isDeleteModalOpen, setIsDeleteModalOpen, editingCustomer,
    page, setPage, limit, setLimit, total, totalPages, handleAddClick,
    handleEditClick, handleDeleteClick, handleSaveCustomer, handleConfirmDelete,
    fromDate, setFromDate, toDate, setToDate, handleView, selectedCustomer,
    showView, setShowView, sortField, sortOrder, handleSort
  };
};