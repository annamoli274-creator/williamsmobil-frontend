import { getDictionary } from "@/get-dictionary";
import { Locale, i18n } from "@/i18n-config";

export function generateStaticParams() {
  return i18n.locales.map((locale) => ({ lang: locale }));
}

export default async function FaqPage(props: {
  params: Promise<{ lang: Locale }>;
}) {
  const { lang } = await props.params;
  const dict = await getDictionary(lang);
  const content = dict.page_content?.faq;
  const faqs = [
    {
      question: content?.q1 || "Comment se déroule la livraison ?",
      answer:
        content?.a1 ||
        "Nous coordonnons la livraison directement sur site. Le modèle est transporté par camion, puis installé avec une équipe dédiée pour assurer une mise en place sécurisée.",
    },
    {
      question: content?.q2 || "Faut-il un permis de construire ?",
      answer:
        content?.a2 ||
        "Selon la surface et le type d’habitation, une déclaration préalable ou un permis peut être nécessaire. Nous vous accompagnons dans les démarches administratives.",
    },
    {
      question: content?.q3 || "Quels types de sols sont compatibles ?",
      answer:
        content?.a3 ||
        "Nos structures peuvent être installées sur terrain préparé, dalle béton, plots ou terrain stabilisé. Un diagnostic préalable permet de valider la meilleure configuration.",
    },
    {
      question: content?.q4 || "Peut-on personnaliser l’intérieur ?",
      answer:
        content?.a4 ||
        "Oui, nous proposons des options d’aménagement, de couleurs et d’équipements pour adapter chaque modèle à votre usage personnel ou professionnel.",
    },
    {
      question: content?.q5 || "Quel est le délai de fabrication ?",
      answer:
        content?.a5 ||
        "Les délais varient selon le modèle et les spécificités. En général, la fabrication et la préparation prennent quelques semaines avant la livraison.",
    },
  ];

  return (
    <div className="pt-20 pb-24 px-4 bg-white min-h-screen">
      <div className="max-w-6xl mx-auto space-y-10">
        <div className="space-y-6">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-black">
            {dict.footer.faq || "FAQ"}
          </h1>
          <p className="text-zinc-700 max-w-3xl text-base md:text-lg leading-8">
            {content?.intro ||
              "Retrouvez les réponses aux questions les plus courantes sur nos habitats modulaires, la livraison et les conditions d’achat."}
          </p>
        </div>

        <section className="grid gap-6">
          {faqs.map((item, index) => (
            <article
              key={index}
              className="rounded-3xl border border-zinc-200 bg-slate-50 p-8 shadow-sm"
            >
              <h2 className="text-2xl font-semibold mb-3 text-black">
                {item.question}
              </h2>
              <p className="text-zinc-700 leading-7">{item.answer}</p>
            </article>
          ))}
        </section>
      </div>
    </div>
  );
}
