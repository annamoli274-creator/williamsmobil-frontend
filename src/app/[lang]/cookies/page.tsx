import { getDictionary } from "@/get-dictionary";
import { Locale, i18n } from "@/i18n-config";

export function generateStaticParams() {
  return i18n.locales.map((locale) => ({ lang: locale }));
}

export default async function CookiesPage(props: {
  params: Promise<{ lang: Locale }>;
}) {
  const { lang } = await props.params;
  const dict = await getDictionary(lang);
  const content = dict.page_content?.cookies;
  const cookieSections = [
    {
      title: content?.technical_title || "Cookies techniques",
      description:
        content?.technical_desc ||
        "Ces cookies sont indispensables au bon fonctionnement du site : gestion du panier, sécurité et comportement de base de la navigation.",
    },
    {
      title: content?.analytics_title || "Cookies analytiques",
      description:
        content?.analytics_desc ||
        "Nous utilisons des cookies analytiques pour mesurer l’audience, identifier les pages les plus visitées et améliorer en continu notre service.",
    },
    {
      title: content?.preferences_title || "Gestion des préférences",
      description:
        content?.preferences_desc ||
        "Vous pouvez accepter ou refuser les cookies via le bandeau de cookie ou en ajustant les paramètres de votre navigateur.",
    },
  ];

  return (
    <div className="pt-20 pb-24 px-4 bg-white min-h-screen">
      <div className="max-w-6xl mx-auto space-y-10 text-zinc-700">
        <div className="space-y-6">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-black">
            {dict.footer.cookies || "Gestion des cookies"}
          </h1>
          <p className="text-base md:text-lg leading-8 max-w-3xl">
            {content?.intro ||
              "Nous utilisons des cookies pour améliorer votre navigation, analyser les performances du site et personnaliser votre expérience."}
          </p>
        </div>

        <section className="grid gap-6 md:grid-cols-3">
          {cookieSections.map((section, index) => (
            <article
              key={index}
              className="rounded-3xl border border-zinc-200 bg-slate-50 p-8 shadow-sm"
            >
              <h2 className="text-2xl font-semibold mb-3 text-black">
                {section.title}
              </h2>
              <p className="text-zinc-700 leading-7">{section.description}</p>
            </article>
          ))}
        </section>
      </div>
    </div>
  );
}
