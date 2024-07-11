import { i18n } from "@lingui/core";
import { en, es, zh, ru, ja, fr } from "make-plural/plurals";
import { LANGUAGE_LOCALSTORAGE_KEY } from "config/localStorage";
import { isDevelopment } from "./legacy";

export const locales = {
  en: "English",
  es: "Spanish",
  zh: "Chinese",
  ru: "Russian",
  ja: "Japanese",
  fr: "French",
};

export const defaultLocale = "en";

i18n.loadLocaleData({
  en: { plurals: en },
  es: { plurals: es },
  zh: { plurals: zh },
  ru: { plurals: ru },
  ja: { plurals: ja },
  fr: { plurals: fr },
  ...(isDevelopment() && { pseudo: { plurals: en } }),
});

export function isTestLanguage(locale) {
  return locale === "pseudo";
}

export async function dynamicActivate(locale) {
  const { messages } = await import(`@lingui/loader!locales/${locale}/messages.po`);
  if (!isTestLanguage(locale)) {
    localStorage.setItem(LANGUAGE_LOCALSTORAGE_KEY, locale);
  }
  i18n.load(locale, messages);
  i18n.activate(locale);
}
