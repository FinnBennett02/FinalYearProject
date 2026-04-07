import { createContext, useContext, useState } from "react";

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  const [isDark, setIsDark] = useState(false);
  const [chatKey, setChatKey] = useState(0);

  const toggleTheme = () => setIsDark(prev => !prev);
  const newChat = () => setChatKey(prev => prev + 1);

  return (
    <ThemeContext.Provider value={{ isDark, toggleTheme, chatKey, newChat }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
