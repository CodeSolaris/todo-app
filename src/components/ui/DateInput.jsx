export const DateInput = ({
  value,
  onChange,
  onKeyDown,
  className = "",
  ...props
}) => {
  return (
    <input
      type="datetime-local"
      value={value}
      onChange={onChange}
      onKeyDown={onKeyDown}
      style={{
        colorScheme:
          document.documentElement.dataset.theme === "dark" ? "dark" : "light",
      }}
      className={`p-3 text-base sm:text-sm rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-700 dark:text-txt-dark outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer [&::-webkit-calendar-picker-indicator]:cursor-pointer ${className}`}
      {...props}
    />
  );
};
