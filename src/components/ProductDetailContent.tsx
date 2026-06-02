"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  MessageCircle,
  Send,
  User,
  Phone,
  Mail,
  MapPin,
  MessageSquare,
  Maximize2,
  ShieldCheck,
  ChevronLeft,
  ChevronRight,
  X,
  Star,
  StarHalf,
  StarOff,
} from "lucide-react";
import ProductCard from "./ProductCard";
import { addCartItem, parsePrice } from "@/lib/cart";
import { Product, Dictionary, Review as ReviewType } from "@/lib/types";

interface ProductDetailContentProps {
  product: Product;
  dict: Dictionary;
  relatedProducts: Product[];
  lang: string;
}

const ProductDetailContent = ({
  product,
  dict,
  relatedProducts,
  lang,
}: ProductDetailContentProps) => {
  const router = useRouter();
  const localePrefix = `/${lang}`;
  const [activeImage, setActiveImage] = useState(0);
  const [isDescModalOpen, setIsDescModalOpen] = useState(false);
  const images =
    product.gallery && product.gallery.length > 0
      ? product.gallery
      : [product.image];

  return (
    <div className="pt-28 pb-24 px-4 bg-white min-h-screen">
      <div className="max-w-5xl mx-auto">
        {/* Navigation / Breadcrumbs */}
        <Link
          href={`${localePrefix}/catalog`}
          className="inline-flex items-center gap-2 text-primary/80 hover:text-primary transition-colors mb-12 group font-semibold uppercase tracking-wider text-xs"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1.5 transition-transform" />
          {dict.product_detail.back}
        </Link>

        {/* Main Product Info Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-start mb-24">
          {/* Gallery Section */}
          <div className="lg:col-span-7 space-y-6 group relative">
            <div className="relative aspect-[4/3] rounded-[2.5rem] overflow-hidden shadow-2xl border border-primary/10 bg-black">
              <Image
                src={images[activeImage]}
                alt={product.title}
                width={1000}
                height={750}
                sizes="(max-width: 1024px) 100vw, 600px"
                className="object-cover w-full h-full"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent pointer-events-none" />

              <div className="absolute inset-x-6 top-1/2 -translate-y-1/2 flex items-center justify-between pointer-events-none opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-300">
                <button
                  onClick={() =>
                    setActiveImage((prev) =>
                      prev > 0 ? prev - 1 : images.length - 1,
                    )
                  }
                  className="w-12 h-12 rounded-full glass border border-white/20 text-white flex items-center justify-center hover:bg-white/20 transition-all pointer-events-auto active:scale-90 shadow-lg cursor-pointer"
                >
                  <ChevronLeft className="w-6 h-6 text-primary-light" />
                </button>
                <button
                  onClick={() =>
                    setActiveImage((prev) =>
                      prev < images.length - 1 ? prev + 1 : 0,
                    )
                  }
                  className="w-12 h-12 rounded-full glass border border-white/20 text-white flex items-center justify-center hover:bg-white/20 transition-all pointer-events-auto active:scale-90 shadow-lg cursor-pointer"
                >
                  <ChevronRight className="w-6 h-6 text-primary-light" />
                </button>
              </div>
            </div>

            {/* Thumbnails */}
            <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-thin">
              {images.map((img: string, idx: number) => (
                <button
                  key={idx}
                  onClick={() => setActiveImage(idx)}
                  className={`relative w-24 h-24 rounded-2xl overflow-hidden border-2 transition-all shrink-0 cursor-pointer ${
                    activeImage === idx
                      ? "border-primary scale-105 shadow-lg shadow-primary/20"
                      : "border-primary/10 opacity-60 hover:opacity-100 hover:scale-102"
                  }`}
                >
                  <Image
                    src={img}
                    alt={`${product.title} ${idx}`}
                    width={200}
                    height={200}
                    sizes="(max-width: 640px) 100px, 150px"
                    className="object-cover w-full h-full"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Info Section */}
          <div className="lg:col-span-5">
            <div className="flex items-center gap-3 mb-6">
              <span className="px-3 py-1 bg-primary/10 text-primary border border-primary/20 rounded-full text-xs font-bold uppercase tracking-widest">
                {dict.product_detail.ref}: {product.id.toUpperCase()}
              </span>
              <span className="px-3 py-1 bg-secondary text-secondary-foreground rounded-full text-xs font-bold uppercase tracking-widest border border-primary/10">
                PREMIUM
              </span>
            </div>

            <h1 className="text-xl md:text-2xl font-bold font-serif mb-4 tracking-tight leading-tight text-gradient">
              {product.title}
            </h1>

            <div className="flex flex-col sm:flex-row sm:items-baseline gap-3 mb-6">
              <div>
                <p className="text-xl md:text-2xl font-black text-primary font-serif">
                  {product.price}
                </p>
                {product.oldPrice && (
                  <p className="text-xs text-muted-foreground line-through">
                    {product.oldPrice}
                  </p>
                )}
              </div>
              {product.discount && (
                <span className="px-3 py-1 rounded-full bg-primary/20 border border-primary/30 text-primary text-sm font-semibold">
                  -{product.discount}
                </span>
              )}
              <span className="text-xs text-muted-foreground font-medium uppercase tracking-wider">
                {dict.product_detail.tax_info}
              </span>
            </div>

            <div className="p-4 glass rounded-2xl mb-8 flex items-center gap-4 border border-primary/10">
              <div className="w-10 h-10 rounded-xl premium-gradient flex items-center justify-center text-black">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <p className="text-sm font-semibold text-primary">
                {dict.product_detail.secure_payment}
              </p>
            </div>

            <div className="mb-8">
              <p className="text-sm text-muted-foreground leading-relaxed inline">
                {product.description.length > 150
                  ? `${product.description.substring(0, 150)}...`
                  : product.description}
              </p>
              {product.description.length > 150 && (
                <button
                  onClick={() => setIsDescModalOpen(true)}
                  className="text-primary font-bold hover:underline inline-flex items-center gap-1 text-sm ml-2 font-sans transition-all active:scale-95 cursor-pointer uppercase tracking-wider"
                >
                  {dict.product_detail.view_more}
                </button>
              )}
            </div>

            {/* Full Description Glassmorphic Modal */}
            <AnimatePresence>
              {isDescModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                  {/* Backdrop */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={() => setIsDescModalOpen(false)}
                    className="absolute inset-0 bg-black/85 backdrop-blur-md"
                  />

                  {/* Modal Container */}
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 30 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 30 }}
                    transition={{ type: "spring", damping: 25, stiffness: 350 }}
                    className="relative w-full max-w-2xl bg-[#0a0a0a]/95 dark:bg-black/95 border border-primary/20 rounded-[2.5rem] p-8 md:p-12 shadow-2xl text-white max-h-[85vh] flex flex-col backdrop-blur-xl"
                  >
                    {/* Close Button */}
                    <button
                      onClick={() => setIsDescModalOpen(false)}
                      className="absolute top-6 right-6 w-12 h-12 rounded-full bg-primary/10 border border-primary/20 hover:bg-primary hover:text-black text-primary transition-all flex items-center justify-center shadow-lg active:scale-95 cursor-pointer"
                      aria-label={dict.product_detail.close}
                    >
                      <X className="w-5 h-5" />
                    </button>

                    {/* Header */}
                    <div className="mb-6 flex items-center gap-3">
                      <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-xs font-bold uppercase tracking-widest border border-primary/20">
                        {dict.product_detail.ref}: {product.id.toUpperCase()}
                      </span>
                      <span className="px-3 py-1 bg-slate-800 text-slate-300 rounded-full text-xs font-bold uppercase tracking-widest border border-slate-700">
                        {dict.product_detail.full_description}
                      </span>
                    </div>

                    <h3 className="text-lg md:text-xl font-bold font-serif mb-4 tracking-tight text-white leading-tight">
                      {product.title}
                    </h3>

                    {/* Divider */}
                    <div className="h-[1px] w-full bg-gradient-to-r from-primary/30 to-transparent mb-8" />

                    {/* Scrollable Description Body */}
                    <div className="flex-1 overflow-y-auto pr-2 scrollbar-thin">
                      <p className="text-slate-200 text-sm md:text-base leading-relaxed whitespace-pre-line">
                        {product.description}
                      </p>
                    </div>
                  </motion.div>
                </div>
              )}
            </AnimatePresence>

            {/* Technical Specifications Grid */}
            <div className="bg-secondary/15 dark:bg-white/5 rounded-2xl p-6 mb-6 border border-primary/10">
              <h3 className="font-bold text-sm mb-4 flex items-center gap-2 font-serif text-primary-light border-b border-primary/5 pb-2">
                <Maximize2 className="w-4 h-4 text-primary" />
                {dict.product_detail.specs_title}
              </h3>
              <div className="grid grid-cols-2 gap-y-4 gap-x-4">
                {Object.entries(product.specs).map(([key, value]) => {
                  if (!value) return null;
                  const label =
                    (dict.product_detail as Record<string, string>)[key] || key;
                  const displayValue = Array.isArray(value)
                    ? value.join(", ")
                    : value;
                  return (
                    <div key={key} className="border-b border-primary/5 pb-1">
                      <p className="text-[9px] text-muted-foreground uppercase font-bold tracking-widest mb-1 font-sans">
                        {label}
                      </p>
                      <p className="font-bold text-xs md:text-sm text-foreground font-serif">
                        {displayValue}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">

              <button
                type="button"
                onClick={async () => {
                  await addCartItem({
                    id: product.id,
                    name: product.title,
                    price: parsePrice(product.price),
                    quantity: 1,
                  });
                  window.dispatchEvent(new Event("cartUpdated"));
                }}
                className="flex items-center justify-center gap-2 py-3 rounded-xl border border-primary/30 text-primary font-bold hover:bg-primary hover:text-white transition-all text-sm uppercase tracking-wider cursor-pointer"
              >
                Ajouter au panier
              </button>
            </div>
          </div>
        </div>

        {/* Request Form Section - Inquiry Suite */}
        <section className="mb-16 py-10 px-6 md:px-8 bg-secondary/15 dark:bg-white/5 rounded-2xl border border-primary/10 shadow-lg">
          <div className="max-w-3xl mx-auto text-center mb-8">
            <h2 className="text-2xl md:text-3xl font-bold font-serif mb-2 text-gradient">
              {dict.product_detail.request_title}
            </h2>
            <p className="text-muted-foreground font-sans text-sm">
              {dict.product_detail.request_form_description}
            </p>
          </div>
          <form className="max-w-3xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs uppercase tracking-wider text-primary font-bold ml-2">
                {dict.form.name}
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-primary/60" />
                <input
                  type="text"
                  placeholder="Juan García"
                  className="w-full pl-10 pr-3 py-2 rounded-lg bg-background border border-zinc-300 focus:border-primary focus:ring-1 focus:ring-primary/20 outline-none transition-all duration-300 font-sans text-sm text-zinc-900"
                />
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-xs uppercase tracking-wider text-primary font-bold ml-2">
                {dict.form.phone}
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-primary/60" />
                <input
                  type="tel"
                  placeholder="+34 610 70 69 19"
                  className="w-full pl-10 pr-3 py-2 rounded-lg bg-background border border-zinc-300 focus:border-primary focus:ring-1 focus:ring-primary/20 outline-none transition-all duration-300 font-sans text-sm text-zinc-900"
                />
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-xs uppercase tracking-wider text-primary font-bold ml-2">
                {dict.form.email}
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-primary/60" />
                <input
                  type="email"
                  placeholder="juan@ejemplo.com"
                  className="w-full pl-10 pr-3 py-2 rounded-lg bg-background border border-zinc-300 focus:border-primary focus:ring-1 focus:ring-primary/20 outline-none transition-all duration-300 font-sans text-sm text-zinc-900"
                />
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-xs uppercase tracking-wider text-primary font-bold ml-2">
                {dict.form.province}
              </label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-primary/60" />
                <input
                  type="text"
                  placeholder="Madrid"
                  className="w-full pl-10 pr-3 py-2 rounded-lg bg-background border border-zinc-300 focus:border-primary focus:ring-1 focus:ring-primary/20 outline-none transition-all duration-300 font-sans text-sm text-zinc-900"
                />
              </div>
            </div>
            <div className="md:col-span-2 space-y-1">
              <label className="text-xs uppercase tracking-wider text-primary font-bold ml-2">
                {dict.form.message}
              </label>
              <div className="relative">
                <MessageSquare className="absolute left-3 top-4 w-4 h-4 text-primary/60" />
                <textarea
                  rows={3}
                  placeholder={dict.product_detail.message_placeholder}
                  className="w-full pl-10 pr-3 py-2 rounded-lg bg-background border border-zinc-300 focus:border-primary focus:ring-1 focus:ring-primary/20 outline-none transition-all duration-300 font-sans resize-none text-sm text-zinc-900"
                />
              </div>
            </div>
            <div className="md:col-span-2 mt-2">
              <button
                type="submit"
                className="w-full py-3 rounded-lg premium-gradient text-white font-bold text-sm hover:scale-[1.01] transition-all shadow-lg shadow-primary/15 uppercase tracking-wider cursor-pointer"
              >
                {dict.form.submit}
              </button>
            </div>
          </form>
        </section>

        {/* Related Products Section */}
        <section>
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-lg md:text-xl font-serif font-bold tracking-tight text-gradient">
              {dict.product_detail.related_title}
            </h2>
            <Link
              href={`${localePrefix}/catalog`}
              className="text-primary font-bold hover:underline uppercase tracking-wider text-xs font-sans"
            >
              {dict.product_detail.see_all}
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {relatedProducts.map((p) => (
              <ProductCard key={p.id} lang={lang} dict={dict} {...p} />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default ProductDetailContent;
