import { createContext } from "react";

export type Language = "fr" | "en";

export type LanguageContextType = {
  lang: Language;
  setLang: ((lang: Language) => void) | undefined;
};

export const LanguageContext = createContext<LanguageContextType>({
  lang: "fr",
  setLang: undefined,
});

export const LanguageProvider = LanguageContext.Provider;

export const LanguageConsumer = LanguageContext.Consumer;
