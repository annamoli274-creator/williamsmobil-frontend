import { i18n } from "@/i18n-config";
import CheckoutPage from "@/components/CheckoutPage";

export function generateStaticParams() {
  return i18n.locales.map((locale) => ({ lang: locale }));
}

export default async function LocalizedCheckoutPage(props: {
  params: Promise<{ lang: typeof i18n.locales[number] }>;
}) {
  const { lang } = await props.params;
  return <CheckoutPage lang={lang} />;
}
