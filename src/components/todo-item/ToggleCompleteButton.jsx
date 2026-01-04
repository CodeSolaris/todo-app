import { CheckIcon } from "../icons/CheckIcon";

export const ToggleCompleteButton = ({ isCompleted, onToggle }) => {
  return (
    <button
      type="button"
      onClick={onToggle}
      className={`mt-0.5 flex h-6 w-6 items-center justify-center rounded-full border-2 transition-colors duration-300 cursor-pointer ${
        isCompleted
          ? "border-green-500 bg-green-500"
          : "border-gray-300 hover:border-gray-400"
      }`}
    >
      <CheckIcon
        className={`h-4 w-4 ${isCompleted ? "text-white" : "text-transparent"}`}
      />
    </button>
  );
};
