import React from "react";
import { getDictionary } from "@/get-dictionary";
import { Locale, i18n } from "@/i18n-config";
import ProductDetailContent from "@/components/ProductDetailContent";
import { getLocalizedProducts } from "@/lib/localize-products";
import { products } from "@/lib/products";

export function generateStaticParams() {
  const params = [];
  for (const locale of i18n.locales) {
    for (const product of products) {
      params.push({
        lang: locale,
        id: product.id,
      });
    }
  }
  return params;
}

export default async function ProductDetailPage(props: {
  params: Promise<{ lang: Locale; id: string }>;
}) {
  const { lang, id } = await props.params;
  const dict = await getDictionary(lang);
  const localizedProducts = await getLocalizedProducts(lang);

  const product = localizedProducts.find((p) => p.id === id) || localizedProducts[0];

  const relatedProducts = localizedProducts
    .filter(p => p.id !== product.id)
    .slice(0, 3);

  return (
    <ProductDetailContent 
      product={product} 
      dict={dict} 
      relatedProducts={relatedProducts} 
      lang={lang}
    />
  );
}
