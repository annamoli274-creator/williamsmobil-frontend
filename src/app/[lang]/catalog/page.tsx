import React from "react";
import Link from "next/link";
import ProductCard from "@/components/ProductCard";
import { getDictionary } from "@/get-dictionary";
import { Locale, i18n } from "@/i18n-config";
import { products } from "@/lib/products";
import { cn } from "@/lib/utils";

export function generateStaticParams() {
  return i18n.locales.map((locale) => ({ lang: locale }));
}

export default async function CatalogPage(props: {
  params: Promise<{ lang: Locale }>;
  searchParams: Promise<{ category?: string }>;
}) {
  const { lang } = await props.params;
  const { category } = await props.searchParams;
  const dict = await getDictionary(lang);

  const activeCategory = category || "all";

  const filteredProducts =
    activeCategory !== "all"
      ? products.filter((p) => p.category === activeCategory)
      : products;

  const categoryList = [
    { id: "all", label: dict.categories.all },
    { id: "conteneur", label: dict.categories.conteneur },
    { id: "caravane", label: dict.categories.caravane },
    { id: "mobile-home", label: dict.categories["mobile-home"] },
  ];

  return (
    <div className="pt-20 pb-14 px-4 bg-white">
      <div className="max-w-6xl mx-auto">
        <div className="mb-10">
          <h1 className="text-3xl md:text-4xl font-bold mb-3 text-black">
            {dict.catalog.title}
          </h1>
          <p className="text-zinc-650 max-w-xl text-sm md:text-base">
            {dict.catalog.description}
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-2 mb-8">
          {categoryList.map((cat) => (
            <Link
              key={cat.id}
              href={`/${lang}/catalog${cat.id === "all" ? "" : `?category=${cat.id}`}`}
              className={cn(
                "px-4 py-2 rounded-full border transition-all font-semibold text-xs tracking-wide",
                activeCategory === cat.id
                  ? "premium-gradient text-white border-transparent shadow-md scale-105"
                  : "border-zinc-200 hover:border-black text-zinc-700 hover:text-black hover:bg-zinc-50",
              )}
            >
              {cat.label}
            </Link>
          ))}
        </div>

        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredProducts.map((product, index) => (
              <ProductCard key={index} lang={lang} dict={dict} {...product} />
            ))}
          </div>
        ) : (
          <div className="py-20 text-center">
            <p className="text-xl text-zinc-600">{dict.catalog.no_results}</p>
          </div>
        )}
      </div>
    </div>
  );
}
