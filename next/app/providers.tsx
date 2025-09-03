"use client";

import { ReactNode } from "react";
import { Analytics } from "@vercel/analytics/react";
import { I18nProvider } from "./i18n/client";

export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <I18nProvider>
      {children}
      <Analytics />
    </I18nProvider>
  );
} 