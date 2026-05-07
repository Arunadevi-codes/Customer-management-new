import React from 'react';
import DeleteConfirmModal from '../../components/ui/deleteConfirm';

const DeleteStaff = ({ onConfirm, onClose }) => (
  <DeleteConfirmModal
    title="Delete Staff"
    message="Are you sure you want to delete this staff member?"
    onConfirm={onConfirm}
    onClose={onClose}
  />
);

export default DeleteStaff;