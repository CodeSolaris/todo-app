import { DateInput } from "../ui/DateInput";
import { Button } from "../ui/Button";

export const DeadlineSelector = ({
  deadline,
  setDeadline,
  showDeadlineInput,
  setShowDeadlineInput,
}) => {
  if (!showDeadlineInput) {
    return (
      <Button
        variant="link"
        onClick={() => setShowDeadlineInput(true)}
        className="mt-2 text-md"
      >
        Add deadline
      </Button>
    );
  }

  return (
    <div className="mt-3 p-3 bg-white dark:bg-gray-800 rounded-lg border border-gray-100 dark:border-gray-700 shadow-sm flex items-center gap-3">
      <label
        htmlFor="deadline-input"
        className="text-sm text-gray-700 dark:text-txt-dark whitespace-nowrap"
      >
        Deadline:
      </label>

      <DateInput
        id="deadline-input"
        name="deadline"
        value={deadline}
        onChange={(e) => setDeadline(e.target.value)}
        className="flex-1"
      />

      <Button
        variant="text"
        onClick={() => {
          setDeadline("");
          setShowDeadlineInput(false);
        }}
        className="text-sm px-2"
      >
        Cancel
      </Button>
    </div>
  );
};
