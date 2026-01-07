import { Button } from "./Button";
import { motion as Motion } from "framer-motion";

export const DeleteConfirmModal = ({ onCancel, onConfirm, message }) => {
  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center p-4">
      {/* Backdrop */}
      <Motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onCancel}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
      />

      {/* Modal Content */}
      <Motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        className="relative p-6 rounded-2xl shadow-2xl max-w-md w-full mx-4 bg-white text-gray-800 dark:bg-gray-900 dark:text-white border border-gray-100 dark:border-gray-800"
      >
        <h3 className="text-xl font-bold mb-4">Delete Confirmation</h3>
        <p className="text-gray-600 dark:text-gray-400 mb-8 leading-relaxed">
          {message}
        </p>
        <div className="flex justify-end gap-3">
          <Button
            variant="secondary"
            onClick={onCancel}
            className="px-5 py-2.5 font-medium"
          >
            Cancel
          </Button>
          <Button
            variant="danger"
            onClick={onConfirm}
            className="px-5 py-2.5 font-medium"
          >
            Delete
          </Button>
        </div>
      </Motion.div>
    </div>
  );
};
