import { useState } from "react";

export const AddTodo = ({ onAddTodo }) => {
  const [text, setText] = useState("");
  const [deadline, setDeadline] = useState("");
  const [showDeadlineInput, setShowDeadlineInput] = useState(false);

  const handleSubmit = (event) => {
    event.preventDefault();
    onAddTodo(text, deadline);
    setText("");
    setDeadline("");
    setShowDeadlineInput(false);
  };

  return (
    <form onSubmit={handleSubmit} className="mb-6">
      <div className="flex items-center bg-white dark:bg-page-dark rounded-lg shadow-sm overflow-hidden border border-gray-100 dark:border-gray-700 focus-within:ring-2 focus-within:ring-blue-500">
        <input
          className="flex-1 p-3 text-gray-700 dark:text-txt-dark bg-transparent outline-none placeholder-gray-400"
          type="text"
          value={text}
          placeholder="Add a task..."
          onChange={(e) => setText(e.target.value)}
        />

        <button
          type="submit"
          className="p-3 bg-btn-light hover:bg-btn-light-hv text-white dark:bg-btn-dark hover:dark:bg-btn-dark-hv transition-colors duration-300 cursor-pointer"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 4v16m8-8H4"
            />
          </svg>
        </button>
      </div>

      {!showDeadlineInput && (
        <button
          type="button"
          onClick={() => setShowDeadlineInput(true)}
          className="mt-2 text-md text-blue-500 hover:text-blue-700 transition"
        >
          Add deadline
        </button>
      )}

      {showDeadlineInput && (
        <div className="mt-3 p-3 bg-white dark:bg-page-dark rounded-lg border border-gray-100 dark:border-gray-700 shadow-sm flex items-center gap-3">
          <label
            htmlFor="deadline-input"
            className="text-sm text-gray-700 dark:text-txt-dark whitespace-nowrap"
          >
            Deadline:
          </label>

          <input
            id="deadline-input"
            name="deadline"
            type="datetime-local"
            value={deadline}
            onChange={(e) => setDeadline(e.target.value)}
            className="flex-1 p-2 text-sm rounded-md border border-gray-200 dark:border-gray-600 bg-transparent text-gray-700 dark:text-txt-dark outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer [&::-webkit-calendar-picker-indicator]:cursor-pointer"
          />

          <button
            type="button"
            onClick={() => {
              setDeadline("");
              setShowDeadlineInput(false);
            }}
            className="text-sm text-gray-700 dark:text-txt-dark cursor-pointer"
          >
            Cancel
          </button>
        </div>
      )}
    </form>
  );
};
