import { useState } from "react";
import { toast } from "react-toastify";
import API from "../../services/api";
import useStaffFetch from "./useStaffFetch";

export const useStaff = () => {
  const fetch = useStaffFetch();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStaff, setEditingStaff] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedStaffId, setSelectedStaffId] = useState(null);
  const [viewStaff, setViewStaff] = useState(null);

  // MODAL ACTIONS
  const handleAddClick = () => { setEditingStaff(null); setIsModalOpen(true); };
  const handleEditClick = (staff) => { setEditingStaff(staff); setIsModalOpen(true); };
  const handleViewClick = (staff) => { setViewStaff(staff); };
  const handleDeleteClick = (id) => { setSelectedStaffId(id); setIsDeleteModalOpen(true); };

  // DELETE
  const handleConfirmDelete = async () => {
    try {
      await API.delete(`/staff/${selectedStaffId}`);
      fetch.setStaffs((prev) => prev.filter((s) => s._id !== selectedStaffId));
      fetch.setTotal((prev) => prev - 1);
      toast.success("Staff deleted successfully");
      setIsDeleteModalOpen(false);
      setSelectedStaffId(null);
    } catch (err) {
      console.error("Delete error:", err.response?.status, err.response?.data);
      toast.error("Delete failed");
    }
  };

  // SAVE (ADD / EDIT)
  const handleSaveStaff = async (formData, id) => {
    try {
      const res = id
        ? await API.put(`/staff/${id}`, formData)
        : await API.post("/staff", formData);

      const savedStaff = res.data?.staff || res.data;

      fetch.setStaffs((prev) =>
        id
          ? prev.map((s) => (s._id === id ? { ...s, ...savedStaff } : s))
          : [savedStaff, ...prev]
      );

      if (!id) fetch.setTotal((prev) => prev + 1);

      toast.success(id ? "Staff updated" : "Staff added");
      setIsModalOpen(false);
      setEditingStaff(null);
    } catch (err) {
      console.log(err.response?.data);
      toast.error(err.response?.data?.message || "Something went wrong");
    }
  };

  return {
    // from fetch
    ...fetch,

    // modal state
    isModalOpen, setIsModalOpen,
    editingStaff,
    isDeleteModalOpen, setIsDeleteModalOpen,
    viewStaff, setViewStaff,

    // handlers
    handleAddClick,
    handleEditClick,
    handleViewClick,
    handleDeleteClick,
    handleConfirmDelete,
    handleSaveStaff,
  };
};