import { CheckIcon } from "../icons/CheckIcon";
import { motion as Motion, AnimatePresence } from "framer-motion";

export const ToggleCompleteButton = ({ isCompleted, onToggle }) => {
  return (
    <Motion.button
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      type="button"
      onClick={onToggle}
      className={`mt-0.5 flex h-6 w-6 items-center justify-center rounded-full border-2 transition-colors duration-300 cursor-pointer ${
        isCompleted
          ? "border-green-500 bg-green-500"
          : "border-gray-300 hover:border-gray-400"
      }`}
    >
      <AnimatePresence>
        {isCompleted && (
          <Motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
          >
            <CheckIcon className="h-4 w-4 text-white" />
          </Motion.div>
        )}
      </AnimatePresence>
    </Motion.button>
  );
};
