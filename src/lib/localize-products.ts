import { products } from "@/lib/products";

const translationCache = new Map<string, Promise<string>>();

async function translateText(text: string, targetLang: string): Promise<string> {
  if (!text || targetLang === "fr") return text;

  const cacheKey = `${targetLang}:${text}`;
  const cached = translationCache.get(cacheKey);
  if (cached) return cached;

  const promise = fetch(
    `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=fr|${targetLang}`,
    {
      next: { revalidate: 86400 },
    },
  )
    .then(async (res) => {
      if (!res.ok) {
        throw new Error(`Translation request failed with ${res.status}`);
      }

      const json = await res.json();
      return json?.responseData?.translatedText || text;
    })
    .catch(() => text);

  translationCache.set(cacheKey, promise);
  return promise;
}

export async function getLocalizedProducts(lang: string) {
  if (!lang || lang === "fr") return products;

  const localized = await Promise.all(
    products.map(async (product) => ({
      ...product,
      title: await translateText(product.title, lang),
    })),
  );

  return localized;
}
