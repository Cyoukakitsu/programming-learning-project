import { useState, useEffect } from "react";
function useThemeSwitcher() {
  const [currentTheme, setCurrentTheme] = useState("light");
  const toggleTheme = () => {
    setCurrentTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  useEffect(() => {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = `/themes/lara-${currentTheme}-cyan/theme.css`;
    document.head.appendChild(link);

    return () => {
      document.head.removeChild(link);
    };
  }, [currentTheme]);

  return {
    currentTheme,
    toggleTheme,
  };
}
export default useThemeSwitcher;
