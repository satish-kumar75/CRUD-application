import React from "react";
import PropTypes from "prop-types";
import Button from "./Button";

const DeleteDialog = ({ isOpen, onClose, onConfirm }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/60 flex items-center justify-center z-50 backdrop-blur-sm">
      <div className="bg-slate-800 rounded-lg p-6 max-w-sm w-full mx-4 border border-slate-700/50">
        <h2 className="text-xl font-semibold text-slate-200 mb-4">
          Confirm Delete
        </h2>
        <p className="text-slate-400 mb-6">
          Are you sure you want to delete this application? This action cannot
          be undone.
        </p>
        <div className="flex justify-end gap-4">
          <Button onClick={onClose} variant="secondary" size="sm">
            Cancel
          </Button>
          <Button onClick={onConfirm} variant="danger" size="sm">
            Delete
          </Button>
        </div>
      </div>
    </div>
  );
};

DeleteDialog.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onConfirm: PropTypes.func.isRequired,
};

export default DeleteDialog;
