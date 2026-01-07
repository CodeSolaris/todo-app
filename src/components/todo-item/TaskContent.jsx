import { useRef } from "react";
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
  const lastTapRef = useRef(0);

  const handleTouchEnd = () => {
    const now = Date.now();
    const delay = now - lastTapRef.current;

    if (delay < 300 && delay > 0) {
      onDoubleClick();
      lastTapRef.current = 0;
    } else {
      lastTapRef.current = now;
    }
  };

  return (
    <div
      className={`flex flex-col w-full gap-1 text-sm cursor-pointer select-none ${
        task.completed
          ? "line-through text-gray-400"
          : "text-gray-700 dark:text-gray-300"
      }`}
      onDoubleClick={onDoubleClick}
      onTouchEnd={handleTouchEnd}
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

      {task.synced === false && (
        <div
          className="mt-2 text-[10px] font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400 flex items-center gap-1.5 shadow-sm w-fit bg-amber-50 dark:bg-amber-950/30 px-2 py-0.5 rounded-full border border-amber-100 dark:border-amber-900"
          title="This task is only saved on this device"
        >
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
          </span>
          Awaiting synchronization
        </div>
      )}
    </div>
  );
};
