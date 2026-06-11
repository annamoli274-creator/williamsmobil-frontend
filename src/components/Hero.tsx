"use client";

import React from "react";
import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight, Play, Users, Map, Star } from "lucide-react";
import Link from "next/link";

interface HeroProps {
  subtitle: string;
  title: string;
  description: string;
  ctaPrimary: string;
  ctaSecondary: string;
  lang: string;
}

const Hero = ({
  subtitle,
  title,
  description,
  ctaPrimary,
  ctaSecondary,
  lang,
}: HeroProps) => {
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 500], [0, 200]);

  return (
    <section className="relative min-h-[60vh] w-screen overflow-hidden bg-white pt-12">
      {/* Background Image with Parallax */}
      <motion.div style={{ y: y1 }} className="absolute inset-0 z-0">
        <Image
          src="/images/hero.png"
          alt="Premium Mobile Home"
          width={1920}
          height={1080}
          sizes="100vw"
          className="object-cover w-full h-full"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/75 via-black/45 to-white backdrop-blur-[1.5px]" />
      </motion.div>

      <div className="relative z-10 w-full px-6 text-center text-white pt-8 pb-12">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-2 bg-primary/10 backdrop-blur-md border border-primary/25 px-4.5 py-2 rounded-full mb-8 text-xs uppercase tracking-widest font-extrabold text-primary shadow-sm"
          >
            <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
            {subtitle}
          </motion.div>

          <h1 className="text-2xl md:text-3xl lg:text-4xl font-normal leading-tight tracking-wide font-serif mb-4 max-w-4xl mx-auto">
            {title.split(" ").map((word, i) => (
              <span
                key={i}
                className={
                  word === "Compromis" || word === "Compromise"
                    ? "text-gradient block md:inline font-bold"
                    : ""
                }
              >
                {word}{" "}
              </span>
            ))}
          </h1>

          <p className="text-sm md:text-base text-slate-300 max-w-3xl mx-auto mb-8 leading-relaxed font-light tracking-wide">
            {description}
          </p>

          <div className="flex flex-col md:flex-row items-center justify-center gap-4 mb-16">
            <Link href={`/${lang}/catalog`} className="inline-block">
              <motion.span
                whileHover={{
                  scale: 1.03,
                  boxShadow: "0 0 25px rgba(255, 255, 255, 0.2)",
                }}
                whileTap={{ scale: 0.98 }}
                className="premium-gradient text-white px-6 py-3.5 rounded-2xl font-black text-[11px] uppercase tracking-widest flex items-center gap-2 transition-all shadow-xl font-sans cursor-pointer inline-flex"
              >
                {ctaPrimary} <ArrowRight className="w-4 h-4 ml-1" />
              </motion.span>
            </Link>
          </div>

          {/* Dynamic Stats in Premium Glass */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-8 border-t border-black/5 max-w-3xl mx-auto">
            <div className="flex flex-col items-center bg-zinc-50 border border-zinc-200 p-4 rounded-2xl shadow-inner">
              <p className="text-xl md:text-2xl font-black text-gradient font-serif">
                250+
              </p>
              <p className="text-zinc-700 text-[9px] flex items-center gap-1.5 mt-1 font-bold uppercase tracking-wider">
                <Users className="w-3.5 h-3.5 text-primary" /> Clients
              </p>
            </div>
            <div className="flex flex-col items-center bg-zinc-50 border border-zinc-200 p-4 rounded-2xl shadow-inner">
              <p className="text-xl md:text-2xl font-black text-gradient font-serif">
                12
              </p>
              <p className="text-zinc-700 text-[9px] flex items-center gap-1.5 mt-1 font-bold uppercase tracking-wider">
                <Map className="w-3.5 h-3.5 text-primary" /> Pays
              </p>
            </div>
            <div className="flex flex-col items-center bg-zinc-50 border border-zinc-200 p-4 rounded-2xl shadow-inner">
              <p className="text-xl md:text-2xl font-black text-gradient font-serif">
                4.9/5
              </p>
              <p className="text-zinc-700 text-[9px] flex items-center gap-1.5 mt-1 font-bold uppercase tracking-wider">
                <Star className="w-3.5 h-3.5 fill-primary text-primary" /> Avis
              </p>
            </div>
            <div className="flex flex-col items-center bg-zinc-50 border border-zinc-200 p-4 rounded-2xl shadow-inner">
              <p className="text-xl md:text-2xl font-black text-gradient font-serif">
                24/7
              </p>
              <p className="text-zinc-700 text-[9px] font-bold uppercase tracking-wider mt-1.5">
                Support
              </p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2"
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <span className="text-[9px] uppercase tracking-[0.25em] text-zinc-700 font-bold">
          Découvrir
        </span>
        <div className="w-5 h-8 border border-zinc-300 rounded-full flex justify-center pt-1.5">
          <motion.div
            animate={{ height: [3, 9, 3] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="w-0.5 bg-primary rounded-full"
          />
        </div>
      </motion.div>
    </section>
  );
};

export default Hero;
