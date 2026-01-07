import micIcon from "../../assets/mic.png";

export const MicrophoneButton = ({ isListening, onToggle, disabled }) => {
  const title = isListening ? "Остановить запись" : "Начать запись";

  return (
    <button
      type="button"
      onClick={onToggle}
      disabled={disabled}
      title={title}
      className={`
        p-3 rounded-full 
        bg-page-light dark:bg-page-dark
        border-2 border-gray-300 dark:border-gray-700
        cursor-pointer transition-all duration-300
        flex items-center justify-center
        hover:scale-105 hover:border-btn-light dark:hover:border-btn-dark
        disabled:opacity-50 disabled:cursor-not-allowed
        ${isListening ? "border-red-600 animate-border-pulse" : ""}
      `}
    >
      <img src={micIcon} alt="Microphone" className="w-5 h-5" />
    </button>
  );
};
