import { getDictionary } from "@/get-dictionary";
import { Locale, i18n } from "@/i18n-config";

export function generateStaticParams() {
  return i18n.locales.map((locale) => ({ lang: locale }));
}

export default async function MentionsPage(props: {
  params: Promise<{ lang: Locale }>;
}) {
  const { lang } = await props.params;
  const dict = await getDictionary(lang);
  const content = dict.page_content?.mentions;
  const mentionsSections = [
    {
      title: content?.editor_title || "Éditeur du site",
      description: content?.editor_text ||
        "Williams MobilHome International\nSiège social : Avenida de America,  28002 Madrid, espanã : +48 453 981 043",
    },
    {
      title: content?.director_title || "Directeur de publication",
      description: content?.director_text || "Monsieur Williams ",
    },
    {
      title: content?.host_title || "Hébergeur",
      description: content?.host_text ||
        "Nom de l’hébergeur : OVHcloud\nAdresse : 2 rue Rodriguo, 59100 Espagne",
    },
  ];

  return (
    <div className="pt-20 pb-24 px-4 bg-white min-h-screen">
      <div className="max-w-6xl mx-auto space-y-10 text-zinc-700">
        <div className="space-y-6">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-black">
            {dict.footer.mentions || "Mentions légales"}
          </h1>
          <p className="text-base md:text-lg leading-8 max-w-3xl">
            {content?.intro ||
              "Informations légales et mentions obligatoires concernant Williams MobilHome International."}
          </p>
        </div>

        <section className="grid gap-6">
          {mentionsSections.map((section, index) => (
            <article
              key={index}
              className="rounded-3xl border border-zinc-200 bg-slate-50 p-8 shadow-sm"
            >
              <h2 className="text-3xl font-semibold mb-3 text-black">
                {section.title}
              </h2>
              <p className="whitespace-pre-line text-zinc-700 leading-7">
                {section.description}
              </p>
            </article>
          ))}
        </section>
      </div>
    </div>
  );
}
