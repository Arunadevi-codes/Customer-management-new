import React from 'react';
import DeleteConfirmModal from '../../components/ui/deleteConfirm';

const DeleteCustomers = ({ onConfirm, onClose }) => (
  <DeleteConfirmModal
    title="Delete Customer"
    message="Are you sure you want to delete this customer?"
    onConfirm={onConfirm}
    onClose={onClose}
  />
);

export default DeleteCustomers;