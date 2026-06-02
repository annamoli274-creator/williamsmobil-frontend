import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { i18n, type Locale } from "@/i18n-config";
import { getDictionary } from "@/get-dictionary";
import CookieConsent from "@/components/CookieConsent";
import ProductNotification from "@/components/ProductNotification";

export async function generateStaticParams() {
  return i18n.locales.map((locale) => ({ lang: locale }));
}

export default async function LocaleLayout(props: {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}) {
  const params = await props.params;
  const lang = params.lang as Locale;
  const dict = await getDictionary(lang);

  return (
    <>
      <Navbar lang={lang} dict={dict} />
      <main className="min-h-screen w-full overflow-x-hidden pt-14">
        {props.children}
      </main>
      <Footer lang={lang} dict={dict} />
      <CookieConsent dict={dict} />
      <ProductNotification dict={dict} />
    </>
  );
}
