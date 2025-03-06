import { getLocales } from "expo-localization";
import { I18n } from "i18n-js";

// Import translation files
import en from "./en";
import ru from "./ru";
import he from "./he"; // Import Hebrew translations

// Set the key-value pairs for the supported languages
const i18n = new I18n({
  en: en,
  ru: ru,
  he: he, // Add Hebrew translations
});

// Set the locale once at the beginning of your app.
i18n.locale = getLocales()[0]?.languageCode || "en";

// When a value is missing from a language, it will fallback to another language with the key present.
i18n.fallbacks = true;

export default i18n;
