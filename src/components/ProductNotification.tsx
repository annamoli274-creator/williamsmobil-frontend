"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { ShoppingBag, X, MapPin, Eye } from "lucide-react";
import { products } from "../lib/products";
import { Dictionary } from "@/lib/types";

interface ProductNotificationProps {
  dict: Dictionary;
}

interface NotificationData {
  name: string;
  city: string;
  product: string;
  image: string;
  id: string;
}

const names = [
  "Alejandro",
  "Isabella",
  "Carlos",
  "Sofía",
  "Mateo",
  "Lucía",
  "Diego",
  "Carmen",
  "Javier",
  "Elena",
];
const cities = [
  "Madrid",
  "Barcelona",
  "Valencia",
  "Sevilla",
  "Zaragoza",
  "Málaga",
  "Murcia",
  "Palma",
  "Bilbao",
  "Alicante",
];

const ProductNotification = ({ dict }: ProductNotificationProps) => {
  const [currentNotification, setCurrentNotification] = useState<NotificationData | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const showRandomNotification = () => {
      const randomProduct =
        products[Math.floor(Math.random() * products.length)];
      const randomName = names[Math.floor(Math.random() * names.length)];
      const randomCity = cities[Math.floor(Math.random() * cities.length)];

      setCurrentNotification({
        name: randomName,
        city: randomCity,
        product: randomProduct.title,
        image: randomProduct.image,
        id: randomProduct.id,
      });
      setIsVisible(true);

      setTimeout(() => {
        setIsVisible(false);
      }, 9000);
    };

    const initialTimer = setTimeout(showRandomNotification, 8000);

    const interval = setInterval(() => {
      showRandomNotification();
    }, 25000);

    return () => {
      clearTimeout(initialTimer);
      clearInterval(interval);
    };
  }, []);

  return (
    <AnimatePresence>
      {isVisible && currentNotification && (
        <motion.div
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: -50, opacity: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="fixed bottom-6 left-6 z-[90] w-[340px] pointer-events-auto"
        >
          <div className="glass p-4 rounded-[1.75rem] flex flex-col gap-4 border border-primary/20 shadow-2xl relative group overflow-hidden bg-background/95 backdrop-blur-xl">
            {/* Animated shine effect */}
            <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/15 to-transparent -translate-x-full group-hover:animate-[shimmer_2s_infinite] pointer-events-none" />

            <div className="flex items-center gap-4">
              <div className="relative w-16 h-16 rounded-xl overflow-hidden shrink-0 border border-primary/10 shadow-inner bg-black">
                <Image
                  src={currentNotification.image}
                  alt={currentNotification.product}
                  width={100}
                  height={100}
                  sizes="100px"
                  className="object-cover transition-transform duration-500 group-hover:scale-105 w-full h-full"
                />
              </div>

              <div className="flex-1 min-w-0 pr-4">
                <div className="flex items-center gap-1.5 mb-1.5 text-primary">
                  <ShoppingBag className="w-3.5 h-3.5" />
                  <span className="text-[9px] font-bold uppercase tracking-[0.2em] font-sans">
                    Achat Récent
                  </span>
                </div>

                <div className="flex flex-col gap-0.5">
                  <p className="text-xs text-foreground font-semibold leading-tight truncate font-serif">
                    <span>
                      {currentNotification.name}
                    </span>
                    <span className="text-primary mx-1.5">•</span>
                    <span className="inline-flex items-center gap-0.5 text-muted-foreground font-sans text-[10px] font-bold uppercase tracking-wider">
                      <MapPin className="w-2.5 h-2.5 text-primary/60" />
                      {currentNotification.city}
                    </span>
                  </p>
                  <p className="text-[11px] text-muted-foreground leading-tight line-clamp-1 mt-0.5 font-sans">
                    {dict.notifications?.recent_purchase || "Acheté"}{" "}
                    <span className="text-primary font-bold">
                      {currentNotification.product}
                    </span>
                  </p>
                </div>
              </div>
            </div>

            <Link
              href={`/catalog/${currentNotification.id}`}
              className="flex items-center justify-center gap-2 w-full py-2.5 bg-primary/10 hover:bg-primary hover:text-black text-primary rounded-xl text-xs font-bold transition-all border border-primary/20 uppercase tracking-wider font-sans cursor-pointer shadow-sm"
            >
              <Eye className="w-4 h-4" />
              Voir le produit
            </Link>

            <button
              onClick={() => setIsVisible(false)}
              className="absolute top-3 right-3 text-muted-foreground hover:text-foreground p-1 rounded-full hover:bg-primary/15 transition-all cursor-pointer"
              aria-label="Close"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ProductNotification;
