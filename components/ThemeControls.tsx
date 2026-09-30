"use client";

import { useEffect, useState } from "react";

type Theme = "light" | "dark";

export default function ThemeControls() {
  const [theme, setTheme] = useState<Theme>("light");

  useEffect(() => {
    const savedTheme = document.cookie
      .split("; ")
      .find((cookie) => cookie.startsWith("theme="))
      ?.split("=")[1] as Theme | undefined;

    if (savedTheme === "light" || savedTheme === "dark") {
      setTheme(savedTheme);
      document.documentElement.setAttribute("data-theme", savedTheme);
    }
  }, []);

  function changeTheme(newTheme: Theme) {
    setTheme(newTheme);

    document.documentElement.setAttribute("data-theme", newTheme);

    document.cookie =
      `theme=${newTheme}; path=/; max-age=${60 * 60 * 24 * 365}; SameSite=Lax`;
  }

  return (
    <div className="theme-options">
      <button
        type="button"
        className={`theme-button ${theme === "light" ? "selected" : ""}`}
        onClick={() => changeTheme("light")}
        aria-pressed={theme === "light"}
      >
        Light
      </button>

      <button
        type="button"
        className={`theme-button ${theme === "dark" ? "selected" : ""}`}
        onClick={() => changeTheme("dark")}
        aria-pressed={theme === "dark"}
      >
        Dark
      </button>
    </div>
  );
}