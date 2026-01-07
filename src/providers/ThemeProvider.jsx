import { useState } from "react";
import { ThemeContext } from "../contexts/ThemeContext";
import { getInitialTheme } from "../helpers/getInitialTheme";
import { toggleTheme } from "../helpers/toggleTheme";

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(getInitialTheme());

  const handleToggleTheme = () => {
    toggleTheme(setTheme);
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme: handleToggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
