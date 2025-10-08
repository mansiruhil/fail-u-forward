"use client"; // must be first

import "../../i18n"; // safe in client
import { useTranslation } from "react-i18next";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

const languages = [
  { code: "en", label: "English" },
  { code: "hi", label: "हिन्दी" },
  { code: "fr", label: "Français" },
  { code: "es", label: "Español" },
];

export default function LanguageSwitcher() {
  const { i18n } = useTranslation();
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    i18n.changeLanguage(e.target.value); // updates language globally
  };

  if (!mounted) {
    return null;
  }

  return (
    <select
      value={i18n.language}
      onChange={handleChange}
      className={`px-2 py-1 rounded border ${
        theme === "dark" ? "bg-gray-800 text-white border-gray-800"
        : "bg-white text-black border-gray-300"
      }`}
      
    >
      {languages.map((lang) => (
        <option 
          key={lang.code} 
          value={lang.code}
        >
          {lang.label}
        </option>
      ))}
    </select>
  );
}
