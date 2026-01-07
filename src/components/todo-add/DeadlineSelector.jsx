import { DateInput } from "../ui/DateInput";
import { Button } from "../ui/Button";
import { PlusIcon } from "../icons/PlusIcon";

export const DeadlineSelector = ({
  deadline,
  setDeadline,
  showDeadlineInput,
  setShowDeadlineInput,
}) => {
  if (!showDeadlineInput) {
    return (
      <button
        type="button"
        onClick={() => setShowDeadlineInput(true)}
        className="mt-2 text-sm text-blue-500 hover:text-blue-600 dark:text-blue-400 font-medium flex items-center gap-1.5 px-1 py-1"
      >
        <PlusIcon className="w-4 h-4" />
        Add deadline
      </button>
    );
  }

  return (
    <div className="mt-2 flex flex-col gap-1.5 animate-in fade-in slide-in-from-top-2 duration-300">
      <div className="flex items-center justify-between px-1">
        <label
          htmlFor="deadline-input"
          className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400"
        >
          Select Deadline:
        </label>
        <button
          type="button"
          onClick={() => {
            setDeadline("");
            setShowDeadlineInput(false);
          }}
          className="text-xs text-red-500 hover:text-red-600 font-medium"
        >
          Clear & Close
        </button>
      </div>

      <DateInput
        id="deadline-input"
        name="deadline"
        value={deadline}
        onChange={(e) => setDeadline(e.target.value)}
        className="w-full shadow-sm"
      />
    </div>
  );
};
