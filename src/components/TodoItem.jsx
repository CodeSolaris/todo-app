export const TodoItem = ({ task, onDelete, onToggleComplete }) => {
  return (
    <li className="group flex items-center justify-between gap-3 rounded-lg border border-gray-100 dark:border-gray-700 bg-white dark:bg-page-dark p-3 shadow-sm transition-shadow duration-300 hover:shadow-md">
      <div className="flex items-start gap-3">
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

        <div
          className={`flex flex-col gap-1 text-sm  ${
            task.completed
              ? "line-through text-gray-400"
              : "text-gray-700 dark:text-gray-300"
          }`}
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
