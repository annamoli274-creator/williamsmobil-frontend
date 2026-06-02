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

  return (
    <div className="pt-20 pb-24 px-4 bg-white min-h-screen">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold mb-4">
          {dict.footer.tech || "Technologie"}
        </h1>
        <p className="text-zinc-700 max-w-3xl">
          {dict.legal_pages?.concept_description || "Tech placeholder."}
        </p>
      </div>
    </div>
  );
}
