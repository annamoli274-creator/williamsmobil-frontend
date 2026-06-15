import { getDictionary } from "@/get-dictionary";
import { Locale, i18n } from "@/i18n-config";

export function generateStaticParams() {
  return i18n.locales.map((locale) => ({ lang: locale }));
}

export default async function ConceptPage(props: {
  params: Promise<{ lang: Locale }>;
}) {
  const { lang } = await props.params;
  const dict = await getDictionary(lang);
  const content = dict.page_content?.concept;

  return (
    <div className="pt-20 pb-24 px-4 bg-white min-h-screen">
      <div className="max-w-6xl mx-auto space-y-10">
        <div className="space-y-6">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-black">
            {dict.footer.concept}
          </h1>
          <p className="text-zinc-700 max-w-3xl text-base md:text-lg leading-8">
            {content?.intro || dict.legal_pages.concept_description}
          </p>
        </div>

        <section className="grid gap-6 md:grid-cols-2">
          <article className="rounded-3xl border border-zinc-200 p-8 bg-slate-50 shadow-sm">
            <h2 className="text-2xl font-semibold mb-4">
              {content?.card1_title || "Design modulable"}
            </h2>
            <p className="text-zinc-700 leading-7">
              {content?.card1_desc || "Des espaces optimisés, un aménagement flexible et des finitions haut de gamme qui s’adaptent à vos usages."}
            </p>
          </article>
          <article className="rounded-3xl border border-zinc-200 p-8 bg-slate-50 shadow-sm">
            <h2 className="text-2xl font-semibold mb-4">
              {content?.card2_title || "Mobilité maîtrisée"}
            </h2>
            <p className="text-zinc-700 leading-7">
              {content?.card2_desc || "Des structures étudiées pour le transport routier, le montage rapide et l’installation sur site sans compromis sur le confort."}
            </p>
          </article>
        </section>

        <section className="space-y-6 text-zinc-700">
          <h2 className="text-3xl font-semibold">
            {content?.why_title || "Pourquoi choisir Williams MobilHome ?"}
          </h2>
          <div className="grid gap-4 md:grid-cols-3">
            {[content?.why1, content?.why2, content?.why3].map(
              (item, index) =>
                item && (
                  <div
                    key={index}
                    className="rounded-3xl border border-zinc-200 p-6 bg-white shadow-sm"
                  >
                    <p className="text-zinc-700 leading-7">{item}</p>
                  </div>
                ),
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
