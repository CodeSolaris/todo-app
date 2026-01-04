import { formatDateTime } from "../../helpers/dateUtils";

const TimeDisplay = ({ date, label, isCompleted, isOverdueCheck = false }) => {
  if (!date) return null;

  const isOverdue =
    isOverdueCheck && !isCompleted && new Date(date) < new Date();

  const textColor = isCompleted
    ? "text-gray-400"
    : isOverdue
    ? "text-red-500"
    : "text-gray-500";

  return (
    <time dateTime={date} className={`text-sm ${textColor}`}>
      {label}: {formatDateTime(date)}
    </time>
  );
};

export const TaskContent = ({ task, onDoubleClick }) => {
  return (
    <div
      className={`flex flex-col w-full gap-1 text-sm cursor-pointer ${
        task.completed
          ? "line-through text-gray-400"
          : "text-gray-700 dark:text-gray-300"
      }`}
      onDoubleClick={onDoubleClick}
    >
      <p className="leading-tight mb-4">{task.text}</p>

      <TimeDisplay
        date={task.createdAt}
        label="Created"
        isCompleted={task.completed}
      />

      <TimeDisplay
        date={task.deadline}
        label="Due by"
        isCompleted={task.completed}
        isOverdueCheck={true}
      />
    </div>
  );
};
