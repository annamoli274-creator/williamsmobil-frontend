import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { i18n } from "@/i18n-config";
import { match as matchLocale } from "@formatjs/intl-localematcher";
import Negotiator from "negotiator";

async function getLocale() {
  const headersList: Record<string, string> = {};
  const headerMap = await headers();
  headerMap.forEach((value, key) => {
    headersList[key] = value;
  });
  const languages = new Negotiator({ headers: headersList }).languages([...i18n.locales]);
  return matchLocale(languages, [...i18n.locales], i18n.defaultLocale);
}

export default async function Page() {
  const locale = await getLocale();
  redirect(`/${locale}`);
}
