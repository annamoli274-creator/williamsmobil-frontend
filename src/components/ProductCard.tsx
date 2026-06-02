"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Maximize2, Zap, ShieldCheck, X } from "lucide-react";
import { addCartItem, parsePrice } from "@/lib/cart";

interface ProductCardProps {
  id: string;
  title: string;
  price: string;
  oldPrice?: string;
  discount?: string;
  image: string;
  specs: Record<string, string | string[]>;
  lang?: string;
  dict?: {
    product_detail?: {
      details?: string;
      add_to_cart?: string;
      added_to_cart_message?: string;
    };
  };
}

const formatSpecValue = (value?: string | string[]) =>
  Array.isArray(value) ? value.join(", ") : value;

const secureTexts: Record<
  string,
  { badge: string; title: string; desc: string; extra: string[] }
> = {
  fr: {
    badge: "Paiement Sécurisé",
    title: "Garantie Paiement Sécurisé",
    desc: "Nous vous garantissons une sécurité totale lors de vos transactions. De plus, vous bénéficiez d'une garantie de remboursement sous 7 jours en cas de non-livraison de votre commande.",
    extra: [
      "✓ Chiffrement SSL 256 bits hautement sécurisé",
      "✓ Protection de l'acheteur & livraison garantie",
      "✓ Remboursement intégral sous 7 jours",
    ],
  },
  es: {
    badge: "Pago Seguro",
    title: "Garantía de Pago Seguro",
    desc: "Le garantizamos total seguridad en sus transacciones. Además, se beneficia de una garantía de reembolso de 7 días en caso de no entrega de su pedido.",
    extra: [
      "✓ Encriptación SSL de 256 bits segura",
      "✓ Protección al comprador y entrega garantizada",
      "✓ Reembolso completo en 7 días",
    ],
  },
  en: {
    badge: "Secure Payment",
    title: "Secure Payment Guarantee",
    desc: "We guarantee complete security during your transactions. In addition, you benefit from a 7-day money-back guarantee in case of non-delivery of your order.",
    extra: [
      "✓ Highly secure 256-bit SSL encryption",
      "✓ Buyer protection & guaranteed delivery",
      "✓ Full refund within 7 days",
    ],
  },
};

const ProductCard = ({
  id,
  title,
  price,
  oldPrice,
  discount,
  image,
  specs,
  lang,
  dict,
}: ProductCardProps) => {
  const router = useRouter();
  const localePrefix = lang ? `/${lang}` : "";
  const [showPopup, setShowPopup] = React.useState(false);

  const currentLang =
    lang === "es" || lang === "en" || lang === "fr" ? lang : "fr";
  const text = secureTexts[currentLang];

  return (
    <motion.div
      whileHover={{ y: -8 }}
      className="group bg-card text-card-foreground rounded-[2rem] border border-primary/10 hover:border-primary/30 shadow-lg hover:shadow-primary/10 overflow-hidden transition-all duration-500 flex flex-col h-full relative"
    >
      <div className="relative h-56 sm:h-64 overflow-hidden w-full shrink-0">
        <Image
          src={image}
          alt={title}
          width={500}
          height={320}
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover transition-transform duration-[1200ms] group-hover:scale-105 w-full h-full"
        />
        {/* Secure Payment Badge */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            e.preventDefault();
            setShowPopup(true);
          }}
          onTouchStart={(e) => {
            e.stopPropagation();
            setShowPopup(true);
          }}
          className="absolute top-3 left-3 bg-[#0a0a0a]/85 backdrop-blur-md px-2.5 py-1.5 rounded-xl shadow-lg border border-white/20 text-white text-[10px] font-bold flex items-center gap-1 hover:bg-[#0a0a0a] hover:border-white/40 transition-all z-20 cursor-pointer"
        >
          <ShieldCheck className="w-3.5 h-3.5 text-white" />
          <span>{text.badge}</span>
        </button>
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none" />
        <div className="absolute top-3 right-3 bg-[#0a0a0a]/90 backdrop-blur-md px-3 py-1.5 rounded-xl shadow-lg border border-primary/20 text-right">
          {oldPrice ? (
            <>
              <span className="block text-[10px] text-muted-foreground line-through font-medium">
                {oldPrice}
              </span>
              <span className="block text-lg font-bold text-white font-serif">
                {price}
              </span>
            </>
          ) : (
            <span className="block text-lg font-bold text-white font-serif">
              {price}
            </span>
          )}
          {discount && (
            <span className="mt-1 inline-flex items-center justify-center rounded-full bg-primary/20 px-2 py-0.5 text-[10px] font-semibold text-primary border border-primary/30">
              -{discount}
            </span>
          )}
        </div>
      </div>

      <div className="p-4 flex flex-col flex-grow justify-between">
        <div>
          <h3 className="text-base md:text-lg font-bold font-serif mb-3 line-clamp-1 group-hover:text-primary transition-colors tracking-tight">
            {title}
          </h3>

          <div className="grid grid-cols-3 gap-2 py-2 border-t border-b border-primary/5 bg-secondary/15 dark:bg-white/5 rounded-2xl px-2 mb-5">
            <div className="flex flex-col items-center gap-1.5 text-muted-foreground text-center">
              <Maximize2 className="w-4 h-4 text-primary" />
              <span className="text-[10px] font-semibold tracking-tight">
                {formatSpecValue(specs.area) ||
                  formatSpecValue(specs.dimensions) ||
                  "-"}
              </span>
            </div>
            <div className="flex flex-col items-center gap-1.5 text-muted-foreground text-center">
              <Zap className="w-4 h-4 text-primary" />
              <span className="text-[10px] font-semibold tracking-tight">
                {formatSpecValue(specs.energy) ||
                  formatSpecValue(specs.status) ||
                  "-"}
              </span>
            </div>
            <div className="flex flex-col items-center gap-1.5 text-muted-foreground text-center">
              <ShieldCheck className="w-4 h-4 text-primary" />
              <span className="text-[10px] font-semibold tracking-tight">
                {formatSpecValue(specs.warranty) ||
                  formatSpecValue(specs.payload) ||
                  "-"}
              </span>
            </div>
          </div>
        </div>

        <div className="flex gap-2 items-center">
          <Link
            href={`${localePrefix}/catalog/${id}`}
            className="flex-1 py-2 rounded-lg border border-primary/30 text-primary hover:border-primary font-bold hover:bg-primary hover:text-white transition-all text-center flex items-center justify-center text-xs tracking-wider uppercase font-sans"
          >
            {dict?.product_detail?.details ?? "Détails"}
          </Link>
          <button
            onClick={async () => {
              await addCartItem({
                id,
                name: title,
                price: parsePrice(price),
                quantity: 1,
              });
              // Notify navbar of cart update
              window.dispatchEvent(new Event("cartUpdated"));
            }}
            className="flex-1 py-2 rounded-lg bg-primary text-white font-bold hover:bg-primary-light transition-all text-center flex items-center justify-center text-xs tracking-wider uppercase font-sans cursor-pointer"
          >
            {dict?.product_detail?.add_to_cart ?? "Ajouter"}
          </button>
        </div>
      </div>
      <AnimatePresence>
        {showPopup && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-[#0a0a0a]/90 backdrop-blur-md z-30 p-5 flex flex-col justify-between text-left rounded-[2rem]"
            onClick={() => setShowPopup(false)}
            onMouseLeave={() => setShowPopup(false)}
          >
            <div>
              <div className="flex justify-between items-center mb-3">
                <h4 className="text-white font-bold text-sm flex items-center gap-1.5 font-serif">
                  <ShieldCheck className="w-4 h-4 text-white" />
                  {text.title}
                </h4>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    e.preventDefault();
                    setShowPopup(false);
                  }}
                  className="text-muted-foreground hover:text-white transition-colors cursor-pointer p-1 rounded-full hover:bg-white/10"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed mb-4 font-sans">
                {text.desc}
              </p>
              <div className="space-y-2">
                {text.extra.map((line, idx) => (
                  <p
                    key={idx}
                    className="text-[11px] text-white/95 font-medium font-sans flex items-center gap-1"
                  >
                    {line}
                  </p>
                ))}
              </div>
            </div>
            <div className="text-[9px] text-muted-foreground mt-4 border-t border-white/5 pt-2 font-sans">
              {lang === "es"
                ? "Williams Mobilhome España — Avenida de América, Madrid"
                : lang === "en"
                  ? "Williams Mobilhome Spain — Avenida de América, Madrid"
                  : "Williams Mobilhome Espagne — Avenida de América, Madrid"}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default ProductCard;
