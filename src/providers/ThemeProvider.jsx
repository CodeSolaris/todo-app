import { useState } from "react";
import { ThemeContext } from "../contexts/ThemeContext";
import { getInitialTheme, rotateTheme } from "../helpers/themeUtils";

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(getInitialTheme());

  const handleToggleTheme = () => {
    setTheme((prev) => rotateTheme(prev));
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme: handleToggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
