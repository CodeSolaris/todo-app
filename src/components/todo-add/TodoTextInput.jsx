import { PlusIcon } from "../icons/PlusIcon";
import { Button } from "../ui/Button";

export const TodoTextInput = ({ value, onChange, disabled }) => {
  return (
    <div className="flex items-center bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden border border-gray-100 dark:border-gray-700 focus-within:ring-2 focus-within:ring-blue-500">
      <input
        className="flex-1 p-3 text-gray-700 dark:text-txt-dark bg-transparent outline-none placeholder-gray-400"
        type="text"
        value={value}
        placeholder="Add a task..."
        onChange={onChange}
      />

      <Button
        type="submit"
        disabled={disabled}
        className="p-3 w-12 h-12 bg-btn-light hover:bg-btn-light-hv text-white dark:bg-btn-dark hover:dark:bg-btn-dark-hv rounded-none disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:transform-none flex items-center justify-center"
      >
        <PlusIcon />
      </Button>
    </div>
  );
};
