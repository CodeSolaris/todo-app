import { Button } from "../ui/Button";

export const DeleteCompletedButton = ({
  openDeleteCompletedModal,
  hasCompletedTasks,
}) => {
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
