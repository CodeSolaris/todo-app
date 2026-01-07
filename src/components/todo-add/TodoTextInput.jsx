import { PlusIcon } from "../icons/PlusIcon";
import { Button } from "../ui/Button";

export const TodoTextInput = ({ value, onChange, disabled, children }) => {
  return (
    <div className="flex items-center bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden border border-gray-100 dark:border-gray-700 focus-within:ring-2 focus-within:ring-blue-500">
      <input
        className="min-w-0 flex-1 p-3 text-gray-700 dark:text-txt-dark bg-transparent outline-none placeholder-gray-400"
        type="text"
        value={value}
        placeholder="Add a task..."
        onChange={onChange}
      />

      <div className="flex items-center pl-3 pr-1 shrink-0">{children}</div>

      <Button
        type="submit"
        disabled={disabled}
        className="shrink-0 w-12 h-12 bg-btn-light hover:bg-btn-light-hv text-white dark:bg-btn-dark hover:dark:bg-btn-dark-hv flex items-center justify-center transition-colors"
      >
        <PlusIcon />
      </Button>
    </div>
  );
};
