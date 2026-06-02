import React from "react";
import { getDictionary } from "@/get-dictionary";
import { Locale, i18n } from "@/i18n-config";
import ProductDetailContent from "@/components/ProductDetailContent";
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

  const product = products.find(p => p.id === id) || products[0];
  
  // Get other products for related section
  const relatedProducts = products
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
