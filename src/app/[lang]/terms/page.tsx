import { getDictionary } from "@/get-dictionary";
import { Locale, i18n } from "@/i18n-config";

export function generateStaticParams() {
  return i18n.locales.map((locale) => ({ lang: locale }));
}

export default async function TermsPage(props: {
  params: Promise<{ lang: Locale }>;
}) {
  const { lang } = await props.params;
  const dict = await getDictionary(lang);
  const content = dict.page_content?.terms;
  const termsSections = [
    {
      title: content?.order_title || "Commande et paiement",
      description:
        content?.order_desc ||
        "La validation de votre commande intervient après confirmation du paiement. Les délais de livraison sont précisés lors de la commande et peuvent varier selon la destination.",
    },
    {
      title: content?.cancel_title || "Annulation et retour",
      description:
        content?.cancel_desc ||
        "Toute annulation doit être demandée rapidement. En fonction de l’état d’avancement de la production, des frais peuvent s’appliquer.",
    },
    {
      title: content?.liability_title || "Responsabilité",
      description:
        content?.liability_desc ||
        "Williams Mobil s’engage à fournir des produits conformes. La responsabilité reste limitée aux obligations prévues par le droit de la consommation et la réglementation applicable.",
    },
  ];

  return (
    <div className="pt-20 pb-24 px-4 bg-white min-h-screen">
      <div className="max-w-6xl mx-auto space-y-10 text-zinc-700">
        <div className="space-y-6">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-black">
            {dict.footer.terms}
          </h1>
          <p className="text-base md:text-lg leading-8 max-w-3xl">
            {content?.intro ||
              "En utilisant notre site, vous acceptez les conditions générales de vente, les modalités de paiement et les engagements de service associés à nos offres."}
          </p>
        </div>

        <section className="grid gap-6">
          {termsSections.map((section, index) => (
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
