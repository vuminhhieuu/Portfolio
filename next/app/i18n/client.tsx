"use client";

import { ReactNode } from "react";
import i18n from "i18next";
import { initReactI18next, I18nextProvider } from "react-i18next";

const resources = {
  en: {
    common: {
      hello: "Hello",
    },
  },
  vi: {
    common: {
      hello: "Xin chào",
    },
  },
};

if (!i18n.isInitialized) {
  i18n.use(initReactI18next).init({
    resources,
    lng: "en",
    fallbackLng: "en",
    interpolation: { escapeValue: false },
    defaultNS: "common",
  });
}

export function I18nProvider({ children }: { children: ReactNode }) {
  return <I18nextProvider i18n={i18n}>{children}</I18nextProvider>;
} 