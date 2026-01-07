import { motion as Motion } from "framer-motion";

export const TodoFilter = ({ filter, setFilter }) => {
  const tabs = [
    { id: "all", label: "All" },
    { id: "active", label: "Active" },
    { id: "completed", label: "Completed" },
  ];

  return (
    <div className="flex p-1 bg-gray-100 dark:bg-gray-800/50 rounded-xl relative">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => setFilter(tab.id)}
          className={`relative flex-1 py-2 text-sm font-medium transition-colors duration-200 z-10 ${
            filter === tab.id
              ? "text-blue-600 dark:text-blue-400"
              : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          }`}
        >
          {tab.label}
          {filter === tab.id && (
            <Motion.div
              layoutId="activeTab"
              className="absolute inset-0 bg-white dark:bg-gray-700 rounded-lg shadow-sm z-[-1]"
              transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
            />
          )}
        </button>
      ))}
    </div>
  );
};
