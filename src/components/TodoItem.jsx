import { useCallback, useEffect, useRef, useState } from "react";

export const TodoItem = ({
  task,
  onDelete,
  onToggleComplete,
  onUpdateTask,
}) => {
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
  return (
    <li className="group flex items-center justify-between gap-3 rounded-lg border border-gray-100 dark:border-gray-700 bg-white dark:bg-page-dark p-3 shadow-sm transition-shadow duration-300 hover:shadow-md">
      <button
        type="button"
        onClick={() => onToggleComplete(task.id)}
        className={`mt-0.5 flex h-6 w-6 items-center justify-center rounded-full border-2 transition-colors duration-300 cursor-pointer ${
          task.completed
            ? "border-green-500 bg-green-500"
            : "border-gray-300 hover:border-gray-400"
        }`}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className={`h-4 w-4 ${
            task.completed ? "text-white" : "text-transparent"
          }`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M5 13l4 4L19 7"
          />
        </svg>
      </button>
      <div className="flex items-start gap-3 w-full">
        {isEditing ? (
          <div
            className="flex flex-col w-full gap-2 items-stretch"
            ref={editFormRef}
          >
            <input
              type="text"
              value={editText}
              onChange={(e) => setEditText(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSave()}
              className="w-full px-2 py-1 border-2 border-blue-500 rounded text-sm text-gray-700 dark:text-gray-300"
            />

            <div className="flex flex-col sm:flex-row gap-2 w-full">
              <input
                type="datetime-local"
                value={editDeadline}
                onChange={(e) => setEditDeadline(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSave()}
                className="w-full sm:flex-1 px-2 py-1 border-2 border-blue-500 rounded text-sm text-gray-700 dark:text-gray-300"
              />
              <button
                className="flex items-center justify-center gap-1 px-2 py-1 sm:px-3 sm:py-1 text-green-600 hover:text-green-800 cursor-pointer bg-white border-2 border-green-500 rounded hover:bg-green-50 transition-color text-sm sm:text-base"
                onClick={handleSave}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="none"
                  stroke="currentColor"
                  className="w-4 h-4 xs:w-5 xs:h-5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2.5}
                    d="M5 10l4 4 8-8"
                  />
                </svg>
                <span className="sm:hidden">OK</span>
                <span className="hidden sm:inline">Save</span>
              </button>
            </div>
          </div>
        ) : (
          <div
            className={`flex flex-col w-full gap-1 text-sm cursor-pointer ${
              task.completed
                ? "line-through text-gray-400"
                : "text-gray-700 dark:text-gray-300"
            }`}
            onDoubleClick={() => setIsEditing(true)}
          >
            <p className="leading-tight mb-4">{task.text}</p>

            {task.createdAt && (
              <time
                dateTime={task.createdAt}
                className={`text-sm ${
                  task.completed
                    ? "text-gray-400"
                    : new Date(task.deadline) < new Date()
                    ? "text-red-500"
                    : "text-grey-500"
                }`}
              >
                Created:{" "}
                {new Date(task.createdAt).toLocaleString("en-US", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </time>
            )}
            {task.deadline && (
              <time
                dateTime={task.deadline}
                className={`text-sm ${
                  task.completed
                    ? "text-gray-400"
                    : new Date(task.deadline) < new Date()
                    ? "text-red-500"
                    : "text-grey-500"
                }`}
              >
                Due by:{" "}
                {new Date(task.deadline).toLocaleString("en-US", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </time>
            )}
          </div>
        )}
      </div>

      <button
        type="button"
        onClick={() => onDelete(task.id)}
        aria-label="Delete task"
        className="opacity-0 transition-all duration-300 cursor-pointer text-gray-400 hover:text-red-500 group-hover:opacity-100"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
          />
        </svg>
      </button>
    </li>
  );
};
