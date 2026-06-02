import type { Locale } from "./i18n-config";
import type { Dictionary } from "./lib/types";

const dictionaries = {
  en: () => import("./dictionaries/en.json").then((module) => module.default),
  fr: () => import("./dictionaries/fr.json").then((module) => module.default),
  es: () => import("./dictionaries/es.json").then((module) => module.default),
  de: () => import("./dictionaries/en.json").then((module) => module.default),
  it: () => import("./dictionaries/en.json").then((module) => module.default),
};

export const getDictionary = async (locale: Locale): Promise<Dictionary> => {
  return (await dictionaries[locale]()) as Dictionary;
};
