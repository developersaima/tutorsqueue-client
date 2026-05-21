"use client";
import { useEffect, useState } from "react";
import { LuSun, LuMoon } from "react-icons/lu";

export default function ThemeController() {
  const [theme, setTheme] = useState("light");

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") || "light";
    setTheme(savedTheme);
    document.documentElement.setAttribute("data-theme", savedTheme);
  }, []);

  const handleThemeChange = (e) => {
    const newTheme = e.target.checked ? "dark" : "light";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
    document.documentElement.setAttribute("data-theme", newTheme);
  };

  return (
    <label className="swap swap-rotate">
      <input 
        type="checkbox" 
        onChange={handleThemeChange} 
        checked={theme === "dark"} 
      />
      <LuSun className="swap-off w-6 h-6" />
      <LuMoon className="swap-on w-6 h-6" />
    </label>
  );
}