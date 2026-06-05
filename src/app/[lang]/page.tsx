import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Container, Truck, Home as HomeIcon } from "lucide-react";
import Hero from "@/components/Hero";
import AnimatedProductGrid from "@/components/AnimatedProductGrid";
import BrandMarquee from "@/components/BrandMarquee";
import ReviewSection from "@/components/ReviewSection";
import { getDictionary } from "@/get-dictionary";
import { Locale, i18n } from "@/i18n-config";
import { getLocalizedProducts } from "@/lib/localize-products";
import { cn } from "@/lib/utils";

export function generateStaticParams() {
  return i18n.locales.map((locale) => ({ lang: locale }));
}

export default async function Home(props: {
  params: Promise<{ lang: Locale }>;
}) {
  const { lang } = await props.params;
  const dict = await getDictionary(lang);

  const featuredProducts = (await getLocalizedProducts(lang)).slice(0, 3);

  return (
    <div>
      <Hero
        subtitle={dict.hero.subtitle}
        title={dict.hero.title}
        description={dict.hero.description}
        ctaPrimary={dict.hero.cta_primary}
        ctaSecondary={dict.hero.cta_secondary}
      />

      {/* Category Browse Section */}
      <section className="py-24 bg-white border-b border-zinc-100">
        <div className="w-full px-4 md:px-8 xl:px-14 2xl:px-20">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-4 font-serif text-gradient tracking-tight">
              {dict.featured.browse_title}
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto font-sans">
              {dict.featured.browse_description}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                id: "conteneur",
                label: dict.categories.conteneur,
                icon: Container,
                img: "/images/conteneur/imgl/WhatsApp Image 2026-05-15 at 11.29.40 (1).jpeg",
              },
              {
                id: "caravane",
                label: dict.categories.caravane,
                icon: Truck,
                img: "/images/caravane/imge/WhatsApp Image 2026-05-16 at 01.44.20.jpeg",
              },
              {
                id: "mobile-home",
                label: dict.categories["mobile-home"],
                icon: HomeIcon,
                img: "/images/mobilehome/imga/WhatsApp Image 2026-05-18 at 16.27.24.jpeg",
              },
            ].map((cat) => (
              <Link
                key={cat.id}
                href={`/${lang}/catalog?category=${cat.id}`}
                className="group relative h-96 rounded-[2rem] overflow-hidden border border-primary/10 shadow-xl hover:border-primary/30 hover:shadow-primary/15 transition-all duration-500 hover:-translate-y-2"
              >
                <Image
                  src={cat.img}
                  alt={cat.label}
                  width={600}
                  height={500}
                  sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-[1200ms] ease-out w-full h-full"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-transparent transition-opacity duration-500" />
                <div className="absolute inset-0 p-8 flex flex-col justify-end">
                  <div className="w-14 h-14 rounded-2xl glass flex items-center justify-center mb-6 text-primary border border-primary/20 group-hover:bg-primary group-hover:text-black group-hover:shadow-[0_0_20px_rgba(255,255,255,0.2)] transition-all duration-500">
                    <cat.icon className="w-7 h-7" />
                  </div>
                  <h3 className="text-2xl md:text-3xl font-bold text-white mb-2 tracking-tight font-serif">
                    {cat.label}
                  </h3>
                  <div className="flex items-center gap-2 text-primary/80 font-semibold group-hover:text-primary transition-colors text-sm tracking-wider uppercase">
                    {dict.home.view_catalog}
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-2 transition-transform duration-300" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 bg-zinc-50/50">
        <div className="w-full px-4 md:px-8 xl:px-14 2xl:px-20">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-5">
            <div>
              <h2 className="text-primary font-bold uppercase tracking-[0.2em] mb-3 text-sm">
                {dict.featured.subtitle}
              </h2>
              <h3 className="text-3xl md:text-5xl font-bold font-serif tracking-tight">
                {dict.featured.title}
              </h3>
            </div>
            <p className="text-muted-foreground max-w-md font-sans text-base">
              {dict.featured.description}
            </p>
          </div>

          <AnimatedProductGrid products={featuredProducts} dict={dict} />
        </div>
      </section>

      <ReviewSection dict={dict} lang={lang} />

      {/* Why Choose Us Section */}
      <section className="py-24 bg-white border-t border-b border-zinc-100">
        <div className="w-full px-4 md:px-8 xl:px-14 2xl:px-20 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="relative aspect-video rounded-3xl overflow-hidden shadow-2xl border border-primary/10">
            <video
              autoPlay
              loop
              muted
              playsInline
              controls
              className="w-full h-full object-cover"
            >
              <source src="/video/williams-promo.mp4" type="video/mp4" />
              Votre navigateur ne supporte pas la lecture vidéo.
            </video>
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent pointer-events-none" />
          </div>
          <div>
            <h3 className="text-3xl md:text-5xl font-bold mb-8 font-serif leading-tight">
              {dict.home.why_choose_prefix}{" "}
              <span className="text-gradient">WILLIAMS MOBILHOME</span>
              {dict.home.why_choose_suffix}
            </h3>
            <div className="space-y-8">
              <div className="flex gap-6">
                <div className="w-12 h-12 shrink-0 rounded-full glass border border-primary/30 flex items-center justify-center text-primary font-serif font-bold shadow-[0_0_15px_rgba(255,255,255,0.05)]">
                  1
                </div>
                <div>
                  <h4 className="text-xl font-bold mb-2 font-serif text-primary-light">
                    {dict.home.quality_title}
                  </h4>
                  <p className="text-muted-foreground font-sans">
                    {dict.home.quality_description}
                  </p>
                </div>
              </div>
              <div className="flex gap-6">
                <div className="w-12 h-12 shrink-0 rounded-full glass border border-primary/30 flex items-center justify-center text-primary font-serif font-bold shadow-[0_0_15px_rgba(255,255,255,0.05)]">
                  2
                </div>
                <div>
                  <h4 className="text-xl font-bold mb-2 font-serif text-primary-light">
                    {dict.home.energy_title}
                  </h4>
                  <p className="text-muted-foreground font-sans">
                    {dict.home.energy_description}
                  </p>
                </div>
              </div>
              <div className="flex gap-6">
                <div className="w-12 h-12 shrink-0 rounded-full glass border border-primary/30 flex items-center justify-center text-primary font-serif font-bold shadow-[0_0_15px_rgba(255,255,255,0.05)]">
                  3
                </div>
                <div>
                  <h4 className="text-xl font-bold mb-2 font-serif text-primary-light">
                    {dict.home.turnkey_title}
                  </h4>
                  <p className="text-muted-foreground font-sans">
                    {dict.home.turnkey_description}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <BrandMarquee dict={dict} />
    </div>
  );
}
