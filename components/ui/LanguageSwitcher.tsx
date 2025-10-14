"use client";

import "../../i18n";
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
    i18n.changeLanguage(e.target.value);
  };

  if (!mounted) {
    return null;
  }

  return (
    <select
      value={i18n.language}
      onChange={handleChange}
      className="px-2 py-1 rounded border"
      style={{
        backgroundColor: theme === 'dark' ? '#1f2937' : '#ffffff',
        color: theme === 'dark' ? '#ffffff' : '#000000',
        border: `1px solid ${theme === 'dark' ? '#374151' : '#d1d5db'}`
      }}
    >
      {languages.map((lang) => (
        <option 
          key={lang.code} 
          value={lang.code}
          style={{
            backgroundColor: theme === 'dark' ? '#1f2937' : '#ffffff',
            color: theme === 'dark' ? '#ffffff' : '#000000'
          }}
        >
          {lang.label}
        </option>
      ))}
    </select>
  );
}
