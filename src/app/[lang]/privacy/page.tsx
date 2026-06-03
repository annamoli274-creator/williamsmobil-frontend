import { getDictionary } from "@/get-dictionary";
import { Locale, i18n } from "@/i18n-config";

export function generateStaticParams() {
  return i18n.locales.map((locale) => ({ lang: locale }));
}

export default async function PrivacyPage(props: {
  params: Promise<{ lang: Locale }>;
}) {
  const { lang } = await props.params;
  const dict = await getDictionary(lang);
  const content = dict.page_content?.privacy;
  const privacySections = [
    {
      title: content?.data_title || "Données collectées",
      description:
        content?.data_desc ||
        "Lors de votre commande ou de votre contact, nous recueillons des informations comme votre nom, votre adresse e-mail, votre adresse postale et vos coordonnées de livraison.",
    },
    {
      title: content?.purpose_title || "Finalité",
      description:
        content?.purpose_desc ||
        "Ces données servent à traiter les commandes, gérer les livraisons, répondre aux demandes clients et assurer le suivi administratif et commercial.",
    },
    {
      title: content?.retention_title || "Conservation des données",
      description:
        content?.retention_desc ||
        "Nous conservons vos informations uniquement pendant la durée nécessaire à la gestion de votre commande et conformément aux obligations légales.",
    },
    {
      title: content?.security_title || "Sécurité",
      description:
        content?.security_desc ||
        "Nous mettons en place des mesures de sécurité techniques et organisationnelles pour protéger vos données contre tout accès non autorisé.",
    },
  ];

  return (
    <div className="pt-20 pb-24 px-4 bg-white min-h-screen">
      <div className="max-w-6xl mx-auto space-y-10 text-zinc-700">
        <div className="space-y-6">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-black">
            {dict.footer.privacy}
          </h1>
          <p className="text-base md:text-lg leading-8 max-w-3xl">
            {content?.intro ||
              "Nous collectons uniquement les données nécessaires pour traiter vos demandes, préparer vos commandes et améliorer votre expérience sur le site."}
          </p>
        </div>

        <section className="grid gap-6">
          {privacySections.map((section, index) => (
            <article
              key={index}
              className="rounded-3xl border border-zinc-200 bg-slate-50 p-8 shadow-sm"
            >
              <h2 className="text-3xl font-semibold mb-3 text-black">
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
