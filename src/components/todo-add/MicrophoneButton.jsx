import micIcon from "../../assets/mic.png";

export const MicrophoneButton = ({ isListening, onToggle, disabled }) => {
  const title = isListening ? "Stop recording" : "Start recording";

  return (
    <button
      type="button"
      onClick={onToggle}
      disabled={disabled}
      title={title}
      className={`
        w-7 h-7 min-[425px]:w-9 min-[425px]:h-9 sm:w-10 sm:h-10 rounded-full shrink-0 aspect-square
        bg-page-light dark:bg-page-dark
        border-2 border-gray-200 dark:border-gray-600
        cursor-pointer transition-all duration-300
        flex items-center justify-center
        hover:scale-110 hover:border-blue-400 dark:hover:border-blue-500
        disabled:opacity-50 disabled:cursor-not-allowed
        ${
          isListening
            ? "border-red-500 animate-border-pulse bg-red-50 dark:bg-red-900/40"
            : ""
        }
      `}
    >
      <img src={micIcon} alt="Microphone" className="w-4 h-4 sm:w-5 h-5" />
    </button>
  );
};
