import { getDictionary } from "@/get-dictionary";
import { Locale, i18n } from "@/i18n-config";

export function generateStaticParams() {
  return i18n.locales.map((locale) => ({ lang: locale }));
}

export default async function TechPage(props: {
  params: Promise<{ lang: Locale }>;
}) {
  const { lang } = await props.params;
  const dict = await getDictionary(lang);
  const content = dict.page_content?.tech;

  return (
    <div className="pt-20 pb-24 px-4 bg-white min-h-screen">
      <div className="max-w-6xl mx-auto space-y-10">
        <div className="space-y-6">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-black">
            {dict.footer.tech || "Technologie & Matériaux"}
          </h1>
          <p className="text-zinc-700 max-w-3xl text-base md:text-lg leading-8">
            {content?.intro || "Nous utilisons des matériaux soigneusement sélectionnés pour offrir robustesse, isolation et légèreté dans chaque modèle."}
          </p>
        </div>

        <section className="grid gap-6 md:grid-cols-3">
          <article className="rounded-3xl border border-zinc-200 p-8 bg-slate-50 shadow-sm">
            <h2 className="text-2xl font-semibold mb-4">
              {content?.materials_title || "Matériaux performants"}
            </h2>
            <p className="text-zinc-700 leading-7">
              {content?.materials_desc || "Châssis acier renforcé, ossature aluminium et panneaux isolants haute performance garantissent une structure stable et durable, tout en limitant le poids pour le transport."}
            </p>
          </article>

          <article className="rounded-3xl border border-zinc-200 p-8 bg-slate-50 shadow-sm">
            <h2 className="text-2xl font-semibold mb-4">
              {content?.isolation_title || "Isolation et confort"}
            </h2>
            <p className="text-zinc-700 leading-7">
              {content?.isolation_p1 || "L’isolation thermique et acoustique est optimisée pour maintenir une température agréable en toutes saisons et réduire les nuisances extérieures."}
            </p>
            <p className="mt-4 text-zinc-700 leading-7">
              {content?.isolation_p2 || "Nos solutions intègrent des systèmes de chauffage, de ventilation et d’éclairage à haut rendement énergétique."}
            </p>
          </article>

          <article className="rounded-3xl border border-zinc-200 p-8 bg-slate-50 shadow-sm">
            <h2 className="text-2xl font-semibold mb-4">
              {content?.finish_title || "Finition & entretien"}
            </h2>
            <p className="text-zinc-700 leading-7">
              {content?.finish_desc || "Chaque mobile-home est livré avec des finitions soignées, des revêtements résistants et des équipements faciles à entretenir pour une utilisation durable et sereine."}
            </p>
          </article>
        </section>
      </div>
    </div>
  );
}
