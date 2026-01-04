import { TrashIcon } from "../icons/TrashIcon";
import { Button } from "../ui/Button";

export const DeleteTaskButton = ({ onDelete }) => {
  return (
    <Button
      variant="icon"
      onClick={onDelete}
      aria-label="Delete task"
      className="opacity-0 transition-opacity duration-300 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 group-hover:opacity-100"
    >
      <TrashIcon />
    </Button>
  );
};
