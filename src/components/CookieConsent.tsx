"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Cookie, X, ShieldCheck, ChevronRight } from "lucide-react";
import Link from "next/link";
import { Dictionary } from "@/lib/types";

interface CookieConsentProps {
  dict: Dictionary;
}

const CookieConsent = ({ dict }: CookieConsentProps) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem("williams-cookie-consent");
    const hasVisited = localStorage.getItem("williams-has-visited");
    
    if (!consent) {
      if (!hasVisited) {
        localStorage.setItem("williams-has-visited", "true");
        const timer = setTimeout(() => {
          setIsVisible(true);
        }, 2000);
        return () => clearTimeout(timer);
      } else {
        const timer = setTimeout(() => {
          setIsVisible(true);
        }, 0);
        return () => clearTimeout(timer);
      }
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem("williams-cookie-consent", "accepted");
    setIsVisible(false);
  };

  const handleDecline = () => {
    localStorage.setItem("williams-cookie-consent", "declined");
    setIsVisible(false);
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 50, opacity: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="fixed bottom-6 left-4 right-4 md:left-auto md:right-6 z-[100] md:max-w-xl w-auto md:w-full"
        >
          <div className="glass p-6 md:p-8 rounded-[2rem] border border-black/5 shadow-2xl relative overflow-hidden flex flex-col md:flex-row items-start gap-6">
            {/* Subtle background glow */}
            <div className="absolute -top-24 -left-24 w-48 h-48 bg-primary/5 rounded-full blur-3xl pointer-events-none" />
            
            <div className="hidden md:flex w-14 h-14 rounded-2xl glass border border-black/10 items-center justify-center shrink-0 shadow-lg text-primary">
              <Cookie className="w-7 h-7" />
            </div>
            
            <div className="flex-grow relative z-10 text-left">
              <div className="flex items-center justify-start gap-2 mb-2">
                <ShieldCheck className="w-4 h-4 text-primary" />
                <h3 className="font-serif font-bold text-lg text-gradient tracking-tight">
                  {dict.cookies.title}
                </h3>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed font-sans mb-4 md:mb-0">
                {dict.cookies.description}{" "}
                <Link href="/cookies" className="text-primary hover:underline underline-offset-4 font-semibold inline-flex items-center gap-0.5 group">
                  {dict.cookies.more} 
                  <ChevronRight className="w-3 h-3 transition-transform group-hover:translate-x-0.5" />
                </Link>
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto shrink-0 relative z-10 items-stretch sm:items-center">
              <button
                onClick={handleDecline}
                className="w-full sm:w-auto px-5 py-3 text-xs font-bold uppercase tracking-wider rounded-xl border border-black/10 text-muted-foreground hover:bg-black/5 hover:border-black/20 transition-all cursor-pointer"
              >
                {dict.cookies.decline}
              </button>
              <button
                onClick={handleAccept}
                className="w-full sm:w-auto px-6 py-3 text-xs font-bold uppercase tracking-wider rounded-xl premium-gradient text-white shadow-md hover:shadow-lg hover:shadow-primary/20 transition-all active:scale-95 whitespace-nowrap cursor-pointer text-center"
              >
                {dict.cookies.accept}
              </button>
            </div>

            <button 
              onClick={() => setIsVisible(false)}
              className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-colors p-1.5 rounded-full hover:bg-primary/10 cursor-pointer"
              aria-label="Close"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CookieConsent;
