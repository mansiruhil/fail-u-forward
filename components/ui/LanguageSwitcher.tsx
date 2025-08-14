"use client";

import { useRouter } from "next/router";
import { useTranslation } from "next-i18next";
import { useState } from "react";

export default function LanguageSwitcher() {
  const router = useRouter();
  const { i18n } = useTranslation();
  const [lang, setLang] = useState(i18n.language || "en");

  const changeLanguage = (newLang: string) => {
    setLang(newLang);

    router.push(router.asPath, router.asPath, { locale: newLang });
  };

  return (
    <select
      value={lang}
      onChange={(e) => changeLanguage(e.target.value)}
      className="border rounded px-2 py-1 bg-white text-black"
    >
      <option value="en">English</option>
      <option value="hi">हिन्दी</option>
      <option value="fr">Spanish</option>
    </select>
  );
}
