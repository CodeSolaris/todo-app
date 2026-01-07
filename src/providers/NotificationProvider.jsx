import { useState, useCallback } from "react";
import { NotificationContext } from "../contexts/NotificationContext";

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);

  const showNotification = useCallback((message, type = "info") => {
    setNotifications((prev) => {
      // CHECK: If the same message is already displayed, don't add a duplicate
      if (prev.some((n) => n.message === message && n.type === type))
        return prev;

      const id = `${Date.now()}-${Math.random()}`;

      // Automatic removal after 4 seconds
      setTimeout(() => {
        setNotifications((current) => current.filter((n) => n.id !== id));
      }, 4000);

      return [...prev, { id, message, type }];
    });
  }, []);

  const getIcon = (type) => {
    switch (type) {
      case "success":
        return "✅";
      case "error":
        return "❌";
      default:
        return "ℹ️";
    }
  };

  return (
    <NotificationContext.Provider value={{ showNotification }}>
      {children}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3 pointer-events-none">
        {notifications.map((n) => (
          <div
            key={n.id}
            className={`
              pointer-events-auto px-6 py-4 rounded-2xl shadow-2xl backdrop-blur-md border
              flex items-center gap-4 transition-all duration-500 animate-slide-in
              ${
                n.type === "error"
                  ? "bg-red-500/10 border-red-500/30 text-red-600 dark:text-red-400"
                  : ""
              }
              ${
                n.type === "success"
                  ? "bg-green-500/10 border-green-500/30 text-green-600 dark:text-green-400"
                  : ""
              }
              ${
                n.type === "info"
                  ? "bg-blue-500/10 border-blue-500/30 text-blue-600 dark:text-blue-400"
                  : ""
              }
            `}
          >
            <span className="text-xl">{getIcon(n.type)}</span>
            <span className="font-medium">{n.message}</span>
          </div>
        ))}
      </div>
    </NotificationContext.Provider>
  );
};
