import { useState, useRef, useCallback, useEffect } from "react";

export const useTodoItem = (task, onUpdateTask) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(task.text);
  const [editDeadline, setEditDeadline] = useState(task.deadline || "");
  const editFormRef = useRef(null);

  const handleSave = useCallback(() => {
    if (editText.trim()) {
      onUpdateTask(task.id, editText, editDeadline);
    }
    setIsEditing(false);
  }, [editText, editDeadline, onUpdateTask, task.id]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (editFormRef.current && !editFormRef.current.contains(e.target)) {
        handleSave();
      }
    };

    if (isEditing) {
      document.addEventListener("click", handleClickOutside);
    }

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [isEditing, handleSave]);

  return {
    isEditing,
    setIsEditing,
    editText,
    setEditText,
    editDeadline,
    setEditDeadline,
    editFormRef,
    handleSave,
  };
};
