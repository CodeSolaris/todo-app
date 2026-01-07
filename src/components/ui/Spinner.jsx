export const Spinner = ({ containerClassName = "h-20" }) => {
  return (
    <div className={`flex justify-center items-center ${containerClassName}`}>
      <div className="animate-spin rounded-full h-8 w-8 border-4 border-btn-light dark:border-btn-dark border-t-transparent"></div>
    </div>
  );
};
