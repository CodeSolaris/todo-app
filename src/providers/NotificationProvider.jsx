import { useState, useCallback } from "react";
import { NotificationContext } from "../contexts/NotificationContext";
import { motion as Motion, AnimatePresence } from "framer-motion";

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
        <AnimatePresence>
          {notifications.map((n) => (
            <Motion.div
              layout
              key={n.id}
              initial={{ opacity: 0, x: 50, scale: 0.9 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 20, scale: 0.95 }}
              className={`
                pointer-events-auto px-6 py-4 rounded-2xl shadow-2xl backdrop-blur-md border
                flex items-center gap-4 border-white/20 dark:border-white/10
                ${
                  n.type === "error"
                    ? "bg-red-500/20 text-red-600 dark:text-red-400"
                    : ""
                }
                ${
                  n.type === "success"
                    ? "bg-green-500/20 text-green-600 dark:text-green-400"
                    : ""
                }
                ${
                  n.type === "info"
                    ? "bg-blue-500/20 text-blue-600 dark:text-blue-400"
                    : ""
                }
              `}
            >
              <span className="text-xl">{getIcon(n.type)}</span>
              <span className="font-medium">{n.message}</span>
            </Motion.div>
          ))}
        </AnimatePresence>
      </div>
    </NotificationContext.Provider>
  );
};
