import { SaveIcon } from "../icons/SaveIcon";
import { DateInput } from "../ui/DateInput";
import { Button } from "../ui/Button";

export const TaskEditForm = ({
  innerRef,
  editText,
  setEditText,
  editDeadline,
  setEditDeadline,
  handleSave,
}) => {
  return (
    <div className="flex flex-col w-full gap-2 items-stretch" ref={innerRef}>
      <input
        type="text"
        value={editText}
        onChange={(e) => setEditText(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && handleSave()}
        className="w-full px-2 py-1 border-2 border-blue-500 rounded text-sm text-gray-700 dark:text-gray-300"
      />

      <div className="flex flex-col sm:flex-row gap-2 w-full">
        <DateInput
          value={editDeadline}
          onChange={(e) => setEditDeadline(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSave()}
          className="w-full sm:flex-1 px-2 py-1 border-2 border-blue-500 rounded text-sm text-gray-700 dark:text-gray-300"
        />
        <Button
          onClick={handleSave}
          className="px-2 py-1 sm:px-3 sm:py-1 text-green-600 hover:text-green-800 bg-white border-2 border-green-500 hover:bg-green-50 text-sm sm:text-base"
          title="Save"
        >
          <SaveIcon className="w-4 h-4 xs:w-5 xs:h-5 sm:mr-1" />
          <span className="sm:hidden">OK</span>
          <span className="hidden sm:inline">Save</span>
        </Button>
      </div>
    </div>
  );
};
