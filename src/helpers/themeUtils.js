/**
 * Theme Utility Functions
 * Handles initial theme detection and persistence.
 */

export const getInitialTheme = () => {
  const savedTheme = localStorage.getItem("theme");
  if (savedTheme) return savedTheme;

  const preferredDarkTheme = window.matchMedia("(prefers-color-scheme: dark)");
  if (preferredDarkTheme.matches) return "dark";

  const hours = new Date().getHours();
  const isNightTime = hours >= 18 || hours < 6;

  return isNightTime ? "dark" : "light";
};

export const rotateTheme = (currentTheme) => {
  const newTheme = currentTheme === "dark" ? "light" : "dark";
  localStorage.setItem("theme", newTheme);
  return newTheme;
};
