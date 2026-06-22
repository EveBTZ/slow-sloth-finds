import i18n from "i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import { initReactI18next } from "react-i18next";

import { en } from "./locales/en";
import { fr } from "./locales/fr";

let initialized = false;

export function initI18n() {
  if (initialized) return i18n;
  initialized = true;

  const instance = i18n.use(initReactI18next);
  if (typeof window !== "undefined") {
    instance.use(LanguageDetector);
  }
  instance.init({
    resources: {
      en: { translation: en },
      fr: { translation: fr },
    },
    fallbackLng: "fr",
    supportedLngs: ["en", "fr"],
    interpolation: { escapeValue: false },
    detection: {
      order: ["localStorage", "navigator"],
      caches: ["localStorage"],
      lookupLocalStorage: "sw-lang",
    },
  });

  return i18n;
}

export default i18n;
