import { TaskEditForm } from "./TaskEditForm";
import { TaskContent } from "./TaskContent";

export const TaskBody = ({
  isEditing,
  editFormRef,
  editText,
  setEditText,
  editDeadline,
  setEditDeadline,
  handleSave,
  task,
  onEnableEdit,
}) => {
  if (isEditing) {
    return (
      <TaskEditForm
        innerRef={editFormRef}
        editText={editText}
        setEditText={setEditText}
        editDeadline={editDeadline}
        setEditDeadline={setEditDeadline}
        handleSave={handleSave}
      />
    );
  }

  return <TaskContent task={task} onDoubleClick={onEnableEdit} />;
};
