import { Button } from "./Button";

export const DeleteConfirmModal = ({
  onCancel,
  onConfirm,
  message,
  isOpen,
}) => {
  if (!isOpen) return null;
  return (
    <>
      <div className="fixed inset-0">
        <div className="absolute inset-0 bg-black/50 z-4 backdrop-blur-xs"></div>
        <div className="relative flex h-full items-center justify-center p-4 z-5">
          <div className="p-6 rounded-lg shadow-xl max-w-md w-full mx-4 bg-white text-gray-800 dark:bg-gray-800 dark:text-white">
            <h3 className="text-xl font-bold mb-4">Delete Confirmation</h3>
            <p className="mb-6">{message}</p>
            <div className="flex justify-end gap-3">
              <Button
                variant="outline"
                onClick={onCancel}
                className="bg-gray-200 hover:bg-gray-300 dark:bg-gray-600 dark:hover:bg-gray-700 border-none px-4 py-2"
              >
                Cancel
              </Button>
              <Button
                variant="danger"
                onClick={onConfirm}
                className="px-4 py-2"
              >
                Delete
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
