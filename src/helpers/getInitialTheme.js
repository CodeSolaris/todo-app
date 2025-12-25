export const getInitialTheme = () => {
  const savedTheme = localStorage.getItem("theme");
  const preferredDarkTheme = window.matchMedia("(prefers-color-scheme: dark)");
  const hours = new Date().getHours();
  const isNightTime = hours >= 18 || hours < 6;
  return savedTheme || preferredDarkTheme || isNightTime ? "dark" : "light";
};
