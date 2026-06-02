import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Home, Mail, Phone, Camera, Globe, Share2 } from "lucide-react";

interface FooterProps {
  lang: string;
  dict: {
    footer: {
      navigation: string;
      allModels: string;
      concept: string;
      tech: string;
      faq: string;
      legal: string;
      privacy: string;
      terms: string;
      cookies: string;
      mentions: string;
      contact: string;
      copyright: string;
    };
  };
}

const Footer = ({ lang, dict }: FooterProps) => {
  const localePrefix = `/${lang}`;

  return (
    <footer className="bg-zinc-50 border-t border-zinc-200 pt-16 pb-8 px-6 text-zinc-800">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
        <div className="col-span-1 md:col-span-1">
          <Link
            href={`${localePrefix}`}
            className="flex items-center gap-2 mb-6"
          >
            <img
              src="/images/logo.png"
              alt="Williams Mobilhome"
              width={200}
              height={80}
              className="object-contain h-12 md:h-16 w-auto"
            />
          </Link>
          <p className="text-zinc-700 mb-6 leading-relaxed">
            {lang === "fr"
              ? "Redéfinir l'habitat moderne avec élégance et liberté. Des maisons mobiles de luxe conçues pour durer."
              : lang === "es"
                ? "Redefinir la vivienda moderna con elegancia y libertad. Casas móviles de lujo diseñadas para durar."
                : "Redefine modern living with elegance and freedom. Luxury mobile homes designed to last."}
          </p>
          <div className="flex gap-4">
            <a
              href="#"
              className="w-10 h-10 rounded-full bg-white border border-zinc-200 flex items-center justify-center hover:bg-black hover:text-white hover:border-black transition-all duration-300 text-zinc-500"
            >
              <Camera className="w-5 h-5" />
            </a>
            <a
              href="#"
              className="w-10 h-10 rounded-full bg-white border border-zinc-200 flex items-center justify-center hover:bg-black hover:text-white hover:border-black transition-all duration-300 text-zinc-500"
            >
              <Globe className="w-5 h-5" />
            </a>
            <a
              href="#"
              className="w-10 h-10 rounded-full bg-white border border-zinc-200 flex items-center justify-center hover:bg-black hover:text-white hover:border-black transition-all duration-300 text-zinc-500"
            >
              <Share2 className="w-5 h-5" />
            </a>
          </div>
        </div>

        <div>
          <h4 className="font-bold text-lg mb-6">{dict.footer.navigation}</h4>
          <ul className="flex flex-col gap-4 text-muted-foreground">
            <li>
              <Link
                href={`${localePrefix}/catalog`}
                className="hover:text-black transition-colors"
              >
                {dict.footer.allModels}
              </Link>
            </li>
            <li>
              <Link
                href={`${localePrefix}/concept`}
                className="hover:text-black transition-colors"
              >
                {dict.footer.concept}
              </Link>
            </li>
            <li>
              <Link
                href={`${localePrefix}/tech`}
                className="hover:text-black transition-colors"
              >
                {dict.footer.tech}
              </Link>
            </li>
            <li>
              <Link
                href={`${localePrefix}/faq`}
                className="hover:text-black transition-colors"
              >
                {dict.footer.faq}
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="font-bold text-lg mb-6">{dict.footer.legal}</h4>
          <ul className="flex flex-col gap-4 text-muted-foreground">
            <li>
              <Link
                href={`${localePrefix}/privacy`}
                className="hover:text-black transition-colors"
              >
                {dict.footer.privacy}
              </Link>
            </li>
            <li>
              <Link
                href={`${localePrefix}/terms`}
                className="hover:text-black transition-colors"
              >
                {dict.footer.terms}
              </Link>
            </li>
            <li>
              <Link
                href={`${localePrefix}/cookies`}
                className="hover:text-black transition-colors"
              >
                {dict.footer.cookies}
              </Link>
            </li>
            <li>
              <Link
                href={`${localePrefix}/mentions`}
                className="hover:text-black transition-colors"
              >
                {dict.footer.mentions}
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="font-bold text-lg mb-6">{dict.footer.contact}</h4>
          <ul className="flex flex-col gap-4 text-zinc-700">
            <li className="flex items-center gap-3">
              <Mail className="w-5 h-5 text-black" />{" "}
              <a href="mailto:contact@williamsmobilhome.com" className="hover:text-black transition-colors">
                contact@williamsmobilhome.com
              </a>
            </li>
            <li className="flex items-center gap-3">
              <Phone className="w-5 h-5 text-black" />{" "}
              <a href="tel:+34610706919" className="hover:text-black transition-colors">
                +34 610 70 69 19
              </a>
            </li>
            <li className="flex items-center gap-3 leading-relaxed">
              Avenida de América,
              <br />
              28002 Madrid, España
            </li>
          </ul>
        </div>
      </div>

      <div className="max-w-7xl mx-auto border-t border-zinc-200 pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-zinc-650 text-sm">
        <p>{dict.footer.copyright}</p>
        <div className="flex gap-6">
          <span>FR</span>
          <span>EN</span>
          <span>ES</span>
          <span>DE</span>
          <span>IT</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
