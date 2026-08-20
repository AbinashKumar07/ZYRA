import React, { useEffect, useState } from "react";
import { Sun, Moon } from "lucide-react"; // Using your existing icon library!

export default function ThemeToggle() {
  const [theme, setTheme] = useState("light");

  useEffect(() => {
    const savedTheme = localStorage.getItem("zyra-theme") || "light";
    setTheme(savedTheme);
    document.documentElement.setAttribute("data-theme", savedTheme);
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    localStorage.setItem("zyra-theme", newTheme);
    document.documentElement.setAttribute("data-theme", newTheme);
  };

  return (
    <button
      onClick={toggleTheme}
      aria-label="Toggle Theme"
      className="relative inline-flex h-[28px] w-[52px] shrink-0 items-center rounded-full transition-colors duration-500 focus:outline-none"
      style={{
        backgroundColor: theme === "light" ? "#60A5FA" : "#18181B", // Day sky vs Night sky
        border: "1px solid var(--z-border)"
      }}
    >
      <span
        className="flex h-6 w-6 transform items-center justify-center rounded-full shadow-md transition-transform duration-500"
        style={{
          transform: theme === "light" ? "translateX(2px)" : "translateX(22px)",
          backgroundColor: theme === "light" ? "#FDE047" : "#D4D4D8", // Sun vs Moon color
        }}
      >
        {theme === "light" ? (
          <Sun size={14} className="text-yellow-700" strokeWidth={2.5} />
        ) : (
          <Moon size={14} className="text-gray-900" strokeWidth={2.5} />
        )}
      </span>
    </button>
  );
}