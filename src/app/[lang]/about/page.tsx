import { getDictionary } from "@/get-dictionary";
import { Locale, i18n } from "@/i18n-config";
import AboutContent from "@/components/AboutContent";

export function generateStaticParams() {
  return i18n.locales.map((locale) => ({ lang: locale }));
}

export default async function AboutPage(props: {
  params: Promise<{ lang: Locale }>;
}) {
  const { lang } = await props.params;
  const dict = await getDictionary(lang);

  return <AboutContent lang={lang} dict={dict} />;
}
