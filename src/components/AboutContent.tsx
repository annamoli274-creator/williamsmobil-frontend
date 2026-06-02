"use client";

import { useRef, useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, useScroll, useTransform, useInView } from "framer-motion";
import {
  ArrowRight,
  Shield,
  Zap,
  Users,
  Award,
  MapPin,
  Star,
  CheckCircle2,
  Heart,
} from "lucide-react";
import type { Dictionary } from "@/lib/types";

// ─── Types ────────────────────────────────────────────────────────────────────
interface AboutContentProps {
  lang: string;
  dict: Dictionary;
}

// ─── Animated counter ─────────────────────────────────────────────────────────
function useCounter(end: number, duration = 2200, decimals = 0) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true });

  useEffect(() => {
    if (!inView) return;
    let startTime: number;
    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(parseFloat((eased * end).toFixed(decimals)));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [inView, end, duration, decimals]);

  return { count, ref };
}

// ─── Sub-components ───────────────────────────────────────────────────────────
function SectionHeading({ subtitle, title }: { subtitle: string; title: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, ease: "easeOut" }}
      className="text-center mb-16"
    >
      <p className="text-xs uppercase tracking-[0.4em] text-primary font-extrabold mb-4">
        {subtitle}
      </p>
      <h2 className="text-3xl md:text-5xl font-bold font-serif tracking-tight">{title}</h2>
      <div className="mt-5 mx-auto w-16 h-0.5 bg-primary/60 rounded-full" />
    </motion.div>
  );
}

function ValueCard({
  icon: Icon,
  title,
  body,
  delay,
}: {
  icon: React.ElementType;
  title: string;
  body: string;
  delay: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay, ease: "easeOut" }}
      className="group relative rounded-[2rem] glass border border-primary/10 p-8 shadow-xl hover:border-primary/30 hover:shadow-primary/10 hover:-translate-y-1 transition-all duration-500"
    >
      <div className="absolute -top-px left-8 right-8 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      <div className="w-14 h-14 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center mb-6 group-hover:bg-primary group-hover:shadow-[0_0_20px_rgba(255, 255, 255,0.15)] transition-all duration-500">
        <Icon className="w-6 h-6 text-primary group-hover:text-black transition-colors duration-500" />
      </div>
      <h3 className="text-xl font-bold text-primary mb-3 font-serif">{title}</h3>
      <p className="text-muted-foreground leading-7 text-sm">{body}</p>
    </motion.div>
  );
}

function StatCard({
  end,
  suffix,
  label,
  decimals,
  delay,
}: {
  end: number;
  suffix: string;
  label: string;
  decimals?: number;
  delay: number;
}) {
  const { count, ref } = useCounter(end, 2200, decimals ?? 0);
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay }}
      className="flex flex-col items-center justify-center p-8 rounded-[2rem] glass border border-primary/10 shadow-xl text-center"
    >
      <div ref={ref} className="text-4xl md:text-5xl font-black text-gradient font-serif mb-2">
        {decimals ? count.toFixed(decimals) : Math.round(count)}
        {suffix}
      </div>
      <p className="text-xs uppercase tracking-widest text-muted-foreground font-bold">{label}</p>
    </motion.div>
  );
}

function TimelineItem({
  year,
  title,
  body,
  side,
  delay,
}: {
  year: string;
  title: string;
  body: string;
  side: "left" | "right";
  delay: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: side === "left" ? -50 : 50 }}
      animate={inView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.6, delay, ease: "easeOut" }}
      className={`relative flex ${side === "right" ? "md:flex-row-reverse" : "md:flex-row"} flex-row items-start gap-6 md:gap-10`}
    >
      <div className={`flex-1 rounded-[1.5rem] glass border border-primary/10 p-6 shadow-lg ${side === "right" ? "md:text-right" : ""}`}>
        <span className="text-xs font-extrabold uppercase tracking-widest text-primary block mb-2">
          {year}
        </span>
        <h4 className="text-lg font-bold font-serif mb-2">{title}</h4>
        <p className="text-sm text-muted-foreground leading-6">{body}</p>
      </div>
      <div className="flex flex-col items-center shrink-0">
        <div className="w-4 h-4 rounded-full bg-primary shadow-[0_0_12px_rgba(255, 255, 255,0.2)] border-2 border-primary-light mt-1.5" />
      </div>
      <div className="flex-1 hidden md:block" />
    </motion.div>
  );
}

// ─── Main export ──────────────────────────────────────────────────────────────
export default function AboutContent({ lang, dict }: AboutContentProps) {
  const isFr = lang === "fr";
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const heroY = useTransform(scrollYProgress, [0, 1], [0, 180]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  const values = [
    { icon: Shield, title: dict.about.mission_title, body: dict.about.mission_body },
    { icon: Zap, title: dict.about.quality_title, body: dict.about.quality_body },
    { icon: Users, title: dict.about.team_title, body: dict.about.team_body },
    {
      icon: Heart,
      title: isFr ? "Service personnalisé" : "Personalised service",
      body: isFr
        ? "Chaque projet est unique. Nous écoutons, conseillons et accompagnons chaque client avec une attention toute particulière."
        : "Every project is unique. We listen, advise and support each client with the utmost care.",
    },
    {
      icon: Award,
      title: isFr ? "Certification & Conformité" : "Certification & Compliance",
      body: isFr
        ? "Tous nos modèles sont homologués et conformes aux normes européennes pour vous offrir sécurité et tranquillité d'esprit."
        : "All our models are approved and comply with European standards for your safety and peace of mind.",
    },
    {
      icon: MapPin,
      title: isFr ? "Livraison partout" : "Worldwide delivery",
      body: isFr
        ? "Nous livrons et installons nos unités sur l'ensemble du territoire national et dans de nombreux pays européens."
        : "We deliver and install our units across the country and in many European countries.",
    },
  ];

  const timeline = [
    {
      year: "2013",
      title: isFr ? "Fondation" : "Foundation",
      body: isFr
        ? "Williams Mobilhome est fondé avec une vision simple : rendre l'habitat mobile accessible et luxueux."
        : "Williams Mobilhome is founded with a simple vision: making mobile living accessible and luxurious.",
      side: "left" as const,
    },
    {
      year: "2016",
      title: isFr ? "100 premiers clients" : "First 100 clients",
      body: isFr
        ? "Nous atteignons notre premier cap de 100 clients satisfaits et ouvrons notre showroom principal."
        : "We reach our first milestone of 100 satisfied customers and open our main showroom.",
      side: "right" as const,
    },
    {
      year: "2019",
      title: isFr ? "Expansion internationale" : "International expansion",
      body: isFr
        ? "Nos modèles traversent les frontières. Premières livraisons en France, Belgique, Suisse et Pays-Bas."
        : "Our models cross borders. First deliveries to France, Belgium, Switzerland and the Netherlands.",
      side: "left" as const,
    },
    {
      year: "2022",
      title: isFr ? "Innovation solaire" : "Solar innovation",
      body: isFr
        ? "Lancement de notre gamme éco-responsable équipée de panneaux solaires et systèmes de récupération d'eau."
        : "Launch of our eco-friendly range with solar panels and water recovery systems.",
      side: "right" as const,
    },
    {
      year: "2024",
      title: isFr ? "250+ familles équipées" : "250+ families equipped",
      body: isFr
        ? "Plus de 250 familles vivent désormais dans un espace signé Williams Mobilhome à travers l'Europe."
        : "Over 250 families now live in a Williams Mobilhome space across Europe.",
      side: "left" as const,
    },
  ];

  const whyPoints = [
    {
      t: isFr ? "Matériaux certifiés premium" : "Premium certified materials",
      b: isFr
        ? "Aluminium, bois massif, isolation haute performance — rien n'est laissé au hasard."
        : "Aluminium, solid wood, high-performance insulation — nothing is left to chance.",
    },
    {
      t: isFr ? "Personnalisation totale" : "Full customisation",
      b: isFr
        ? "Chaque détail de votre espace de vie est configurable selon vos goûts et besoins."
        : "Every detail of your living space is configurable to your tastes and needs.",
    },
    {
      t: isFr ? "Garantie & SAV" : "Warranty & after-sales",
      b: isFr
        ? "Nos unités sont couvertes par une garantie complète avec un suivi après-vente réactif."
        : "Our units come with a comprehensive warranty and responsive after-sales service.",
    },
  ];

  return (
    <div className="overflow-x-hidden">
      {/* ── Hero ──────────────────────────────────────────────────────────────── */}
      <section
        ref={heroRef}
        className="relative min-h-[70vh] flex items-center justify-center overflow-hidden bg-white"
      >
        <motion.div style={{ y: heroY }} className="absolute inset-0 z-0">
          <Image
            src="/images/hero.png"
            alt="Williams Mobilhome"
            fill
            className="object-cover scale-110"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-white" />
        </motion.div>

        {/* Decorative rings */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full border border-primary/5 z-0 pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full border border-primary/8 z-0 pointer-events-none" />

        <motion.div
          style={{ opacity: heroOpacity }}
          className="relative z-10 max-w-5xl mx-auto px-6 text-center text-white pt-32 pb-20"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="inline-flex items-center gap-2 bg-primary/10 backdrop-blur-md border border-primary/25 px-5 py-2 rounded-full mb-8 text-xs uppercase tracking-widest font-extrabold text-primary"
          >
            <span className="w-1.5 h-1.5 bg-primary rounded-full animate-pulse" />
            {dict.about.page_title}
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35, duration: 0.8 }}
            className="text-4xl md:text-6xl lg:text-7xl font-bold font-serif tracking-tight mb-6 leading-[1.1]"
          >
            {dict.about.page_heading.includes(",") ? (
              <>
                <span className="text-white">{dict.about.page_heading.split(",")[0]},</span>
                <br />
                <span className="text-gradient">{dict.about.page_heading.split(",")[1]?.trim()}</span>
              </>
            ) : (
              <span className="text-gradient">{dict.about.page_heading}</span>
            )}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.7 }}
            className="text-slate-300 text-lg max-w-2xl mx-auto leading-relaxed mb-10"
          >
            {dict.about.page_intro}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.6 }}
            className="flex flex-wrap items-center justify-center gap-8 pt-10 border-t border-white/10"
          >
            {[
              { num: "250+", label: isFr ? "Clients" : "Clients" },
              { num: "10+", label: isFr ? "Ans" : "Years" },
              { num: "12", label: isFr ? "Pays" : "Countries" },
              { num: "4.9★", label: isFr ? "Note moyenne" : "Avg. rating" },
            ].map((s) => (
              <div key={s.label} className="text-center">
                <p className="text-3xl font-black text-gradient font-serif">{s.num}</p>
                <p className="text-[10px] uppercase tracking-widest text-slate-400 font-bold mt-1">
                  {s.label}
                </p>
              </div>
            ))}
          </motion.div>
        </motion.div>

        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center"
        >
          <div className="w-5 h-8 border border-white/20 rounded-full flex justify-center pt-1.5">
            <motion.div
              animate={{ height: [3, 9, 3] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="w-0.5 bg-primary rounded-full"
            />
          </div>
        </motion.div>
      </section>

      {/* ── Stats counters ─────────────────────────────────────────────────────── */}
      <section className="py-20 px-6 bg-background border-b border-primary/5">
        <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6">
          <StatCard end={250} suffix="+" label={isFr ? "Clients satisfaits" : "Satisfied clients"} delay={0} />
          <StatCard end={10} suffix="+" label={isFr ? "Années d'expérience" : "Years of experience"} delay={0.1} />
          <StatCard end={12} suffix="" label={isFr ? "Pays livrés" : "Countries delivered"} delay={0.2} />
          <StatCard end={4.9} suffix="/5" label={isFr ? "Note moyenne" : "Average rating"} decimals={1} delay={0.3} />
        </div>
      </section>

      {/* ── Values grid ────────────────────────────────────────────────────────── */}
      <section className="py-24 px-6 bg-zinc-50 border-b border-zinc-150">
        <div className="max-w-6xl mx-auto">
          <SectionHeading
            subtitle={isFr ? "Ce qui nous distingue" : "What sets us apart"}
            title={isFr ? "Nos Valeurs" : "Our Values"}
          />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {values.map((v, i) => (
              <ValueCard key={v.title} icon={v.icon} title={v.title} body={v.body} delay={i * 0.08} />
            ))}
          </div>
        </div>
      </section>

      {/* ── Video + why choose ─────────────────────────────────────────────────── */}
      <section className="py-24 px-6 bg-background border-b border-primary/5">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Video */}
          <motion.div
            initial={{ opacity: 0, x: -60 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative aspect-video rounded-3xl overflow-hidden shadow-2xl border border-primary/10"
          >
            <video
              autoPlay
              loop
              muted
              playsInline
              className="w-full h-full object-cover"
            >
              <source src="/video/williams-promo.mp4" type="video/mp4" />
            </video>
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent pointer-events-none" />
            <div className="absolute bottom-4 left-4 flex items-center gap-2 bg-black/60 backdrop-blur-md border border-primary/20 rounded-2xl px-4 py-2">
              <Star className="w-4 h-4 fill-primary text-primary" />
              <span className="text-white text-xs font-bold uppercase tracking-wider">
                Williams Mobilhome
              </span>
            </div>
          </motion.div>

          {/* Copy */}
          <motion.div
            initial={{ opacity: 0, x: 60 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <p className="text-xs uppercase tracking-[0.4em] text-primary font-extrabold mb-4">
              {isFr ? "Notre ADN" : "Our DNA"}
            </p>
            <h2 className="text-3xl md:text-4xl font-bold font-serif mb-8 leading-tight">
              {isFr ? "Pourquoi choisir " : "Why choose "}
              <span className="text-gradient">Williams Mobilhome</span>
              {isFr ? " ?" : "?"}
            </h2>
            <div className="space-y-6">
              {whyPoints.map((item) => (
                <div key={item.t} className="flex gap-4">
                  <div className="w-10 h-10 shrink-0 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center">
                    <CheckCircle2 className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-bold font-serif mb-1 text-primary-light">{item.t}</h4>
                    <p className="text-muted-foreground text-sm leading-6">{item.b}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── Timeline ───────────────────────────────────────────────────────────── */}
      <section className="py-24 px-6 bg-zinc-50 border-b border-zinc-150">
        <div className="max-w-4xl mx-auto">
          <SectionHeading
            subtitle={isFr ? "10 ans d'excellence" : "10 years of excellence"}
            title={isFr ? "Notre parcours" : "Our journey"}
          />
          <div className="relative">
            <div className="absolute left-[calc(50%-1px)] top-0 bottom-0 hidden md:block w-0.5 bg-gradient-to-b from-primary/40 via-primary/20 to-transparent" />
            <div className="space-y-10">
              {timeline.map((item, i) => (
                <TimelineItem key={item.year} {...item} delay={i * 0.1} />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA banner ─────────────────────────────────────────────────────────── */}
      <section className="py-24 px-6 bg-background">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative overflow-hidden rounded-[3rem] bg-zinc-50 text-black shadow-2xl border border-zinc-200 p-12 md:p-16"
          >
            <div className="absolute -top-20 -right-20 w-80 h-80 bg-black/5 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-black/5 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-10">
              <div className="max-w-xl text-center lg:text-left">
                <p className="text-xs uppercase tracking-[0.4em] text-primary font-extrabold mb-4">
                  Williams Mobilhome
                </p>
                <h3 className="text-3xl md:text-4xl font-black font-serif mb-4 leading-tight">
                  {isFr ? "Votre partenaire de mobilité haut de gamme" : "Your premium mobility partner"}
                </h3>
                <p className="text-zinc-650 leading-8 text-base">
                  {isFr
                    ? "Chez Williams Mobilhome, nous concevons bien plus que des véhicules : nous créons des espaces de vie mobiles, raffinés et pensés pour s'adapter à votre style de vie."
                    : "At Williams Mobilhome, we design far more than vehicles: we create refined mobile living spaces tailored to your lifestyle."}
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4 shrink-0">
                <Link
                  href={`/${lang}/contact`}
                  className="inline-flex items-center justify-center gap-2 rounded-3xl bg-black px-7 py-4 text-xs font-black uppercase tracking-widest text-white shadow-xl shadow-black/10 hover:bg-zinc-800 transition-colors"
                >
                  {isFr ? "Contacter notre équipe" : "Contact our team"} <ArrowRight className="w-4 h-4 text-white" />
                </Link>
                <Link
                  href={`/${lang}/catalog`}
                  className="inline-flex items-center justify-center gap-2 rounded-3xl bg-white border border-zinc-200 px-7 py-4 text-xs font-black uppercase tracking-widest text-black hover:bg-zinc-50 transition-colors"
                >
                  {isFr ? "Voir nos modèles" : "See our models"}
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
