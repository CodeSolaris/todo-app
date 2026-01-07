import React from "react";
import { motion as Motion } from "framer-motion";

export const Button = ({
  children,
  onClick,
  type = "button",
  variant = "primary", // primary, danger, text, icon, outline
  className = "",
  title,
  whileHover = { scale: 1.02 },
  whileTap = { scale: 0.98 },
  ...props
}) => {
  const baseStyles =
    "cursor-pointer transition-all duration-300 flex items-center justify-center rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-1 disabled:opacity-50 disabled:cursor-not-allowed";

  const variants = {
    primary:
      "bg-btn-light hover:bg-btn-light-hv dark:bg-btn-dark dark:hover:bg-btn-dark-hv text-white px-4 py-2 shadow-sm hover:shadow-md",
    secondary:
      "bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 px-4 py-2",
    danger: "bg-red-500 hover:bg-red-600 text-white px-4 py-2 shadow-sm",
    outline:
      "border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:border-gray-400 dark:hover:border-gray-500 bg-transparent px-3 py-1.5",
    text: "text-gray-700 dark:text-txt-dark hover:text-gray-900 dark:hover:text-white bg-transparent p-2",
    link: "text-blue-500 hover:text-blue-700 p-0 shadow-none",
    icon: "p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full",
  };

  return (
    <Motion.button
      whileHover={whileHover}
      whileTap={whileTap}
      type={type}
      className={`${baseStyles} ${
        variants[variant] || variants.primary
      } ${className}`}
      onClick={onClick}
      title={title}
      {...props}
    >
      {children}
    </Motion.button>
  );
};
