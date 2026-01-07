import { Button } from "../ui/Button";
import { useTodo } from "../../hooks/useTodo";

export const DeleteCompletedButton = () => {
  const { openDeleteCompletedModal, hasCompletedTasks } = useTodo();

  if (!hasCompletedTasks) return null;
  return (
    <Button
      variant="danger"
      onClick={openDeleteCompletedModal}
      className="mt-4"
    >
      Delete completed tasks
    </Button>
  );
};
