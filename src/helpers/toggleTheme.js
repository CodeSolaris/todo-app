export const toggleTheme = (setTheme) => {
  setTheme((prevTheme) => {
    const newTheme = prevTheme === "dark" ? "light" : "dark";
    localStorage.setItem("theme", newTheme);
    return newTheme;
  });
};
