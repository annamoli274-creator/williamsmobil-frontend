"use client";

import React from "react";
import Image from "next/image";

interface BrandMarqueeProps {
  dict: {
    home: {
      brand_marquee_title: string;
      brand_marquee_subtitle: string;
    };
  };
}

const logos = [
  "/images/compagnie/674914534_988661453558289_531063966373152426_n.jpg",
  "/images/compagnie/675030614_1983157722452695_8159148179413759754_n.jpg",
  "/images/compagnie/675030614_2428008694346404_268919716698048339_n.jpg",
  "/images/compagnie/679018149_1353434053363095_6357322520931798057_n.jpg",
  "/images/compagnie/679348751_952576180952606_7800211955551886109_n.jpg",
  "/images/compagnie/690891341_956255840620770_6573969918608647335_n.jpg",
  "/images/compagnie/690950383_1430951455715840_8649521235160521252_n.jpg",
  "/images/compagnie/694063727_996998996077647_2293924695557307635_n.jpg",
  "/images/compagnie/694409276_836437022414484_3225310568579083601_n.jpg",
  "/images/compagnie/702409520_970126745774730_6602885296246274527_n.jpg",
];

const BrandMarquee = ({ dict }: BrandMarqueeProps) => {
  return (
    <section className="py-24 bg-white overflow-hidden border-t border-zinc-100">
      <div className="text-center mb-16 px-4">
        <p className="text-sm uppercase tracking-[0.35em] text-primary/80 font-semibold mb-2">
          {dict.home.brand_marquee_subtitle}
        </p>

        <h2 className="text-3xl md:text-5xl font-bold text-black font-serif tracking-tight mt-3">
          {dict.home.brand_marquee_title}
        </h2>
      </div>

      <div className="relative">
        <div className="flex animate-marquee gap-8 w-max" style={{ width: 'fit-content' }}>
          {logos.concat(logos, logos).map((logo, index) => (
            <div
              key={index}
              className="relative w-36 h-36 md:w-44 md:h-44 rounded-3xl overflow-hidden shrink-0 border border-zinc-200 bg-zinc-50/50 backdrop-blur-md hover:border-black/20 hover:shadow-[0_0_25px_rgba(0,0,0,0.02)] transition-all duration-500 p-6 flex items-center justify-center group"
            >
              <div className="relative w-full h-full">
                <Image
                  src={logo}
                  alt={`logo-${index}`}
                  width={400}
                  height={400}
                  sizes="(max-width: 768px) 150px, 200px"
                  className="object-contain filter grayscale opacity-60 group-hover:grayscale-0 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500 w-full h-full"
                />
              </div>
            </div>
          ))}
        </div>

        {/* Fade gauche */}
        <div className="absolute top-0 left-0 w-32 h-full bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />

        {/* Fade droite */}
        <div className="absolute top-0 right-0 w-32 h-full bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />
      </div>
    </section>
  );
};

export default BrandMarquee;
