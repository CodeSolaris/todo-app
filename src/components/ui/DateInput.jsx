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
      className={`p-2 text-sm rounded-md border border-gray-200 dark:border-gray-600 bg-transparent text-gray-700 dark:text-txt-dark outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer [&::-webkit-calendar-picker-indicator]:cursor-pointer ${className}`}
      {...props}
    />
  );
};
