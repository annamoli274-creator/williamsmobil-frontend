"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { Menu, X, ShoppingBag, Trash2, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface NavbarProps {
  lang: string;
  dict: {
    navbar: {
      home?: string;
      models: string;
      concept: string;
      contact: string;
      account: string;
      cart?: string;
    };
  };
}

const Navbar = ({ lang, dict }: NavbarProps) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [cartItems, setCartItems] = useState<
    {
      id: string;
      name: string;
      quantity: number;
      price: number;
    }[]
  >([]);
  const [cartMenuOpen, setCartMenuOpen] = useState(false);
  const cartMenuRef = useRef<HTMLDivElement>(null);
  const localePrefix = `/${lang}`;

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Load cart count from server-backed API
  useEffect(() => {
    if (typeof window === "undefined") return;

    const fetchCart = async () => {
      try {
        const res = await fetch("/api/cart", {
          cache: "no-store",
          credentials: "same-origin",
        });
        if (!res.ok) {
          setCartCount(0);
          setCartItems([]);
          return;
        }
        const json = await res.json();
        const items = Array.isArray(json.items) ? json.items : [];
        setCartItems(items);
        const count = items.reduce(
          (sum: number, item: { quantity?: number }) =>
            sum + (item.quantity || 0),
          0,
        );
        setCartCount(count);
      } catch (error) {
        console.warn("Erreur lors de la lecture du panier serveur", error);
      }
    };

    fetchCart();

    window.addEventListener("cartUpdated", fetchCart);

    return () => {
      window.removeEventListener("cartUpdated", fetchCart);
    };
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      if (
        cartMenuRef.current &&
        !cartMenuRef.current.contains(event.target as Node)
      ) {
        setCartMenuOpen(false);
      }
    };

    if (cartMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("touchstart", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, [cartMenuOpen]);

  const handleDeleteItem = async (itemId: string) => {
    try {
      const res = await fetch(`/api/cart/${itemId}`, {
        method: "DELETE",
        credentials: "same-origin",
      });
      if (res.ok) {
        const json = await res.json();
        const items = Array.isArray(json.items) ? json.items : [];
        setCartItems(items);
        const count = items.reduce(
          (sum: number, item: { quantity?: number }) =>
            sum + (item.quantity || 0),
          0,
        );
        setCartCount(count);
        window.dispatchEvent(new Event("cartUpdated"));
      }
    } catch (error) {
      console.warn("Erreur lors de la suppression de l'article", error);
    }
  };

  const navLinks = [
    { href: localePrefix, label: dict.navbar.home ?? "Accueil" },
    { href: `${localePrefix}/catalog`, label: dict.navbar.models },
    { href: `${localePrefix}/about`, label: dict.navbar.concept },
    { href: `${localePrefix}/contact`, label: dict.navbar.contact },
  ];

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b border-black/5",
        isScrolled
          ? "bg-white/95 backdrop-blur-xl shadow-lg shadow-black/5"
          : "bg-white/80 backdrop-blur-md",
      )}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between px-5 h-14">
        {/* Logo */}
        <Link href={localePrefix} className="flex items-center shrink-0">
          <img
            src="/images/logo.png"
            alt="Williams Mobilhome"
            width={1085}
            height={60}
            className="object-contain h-20 w-auto"
          />
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="px-3 py-1.5 text-[11px] uppercase tracking-[0.15em] font-semibold text-black/70 hover:text-black transition-colors duration-200 rounded-md hover:bg-black/5"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Right side actions */}
        <div className="relative flex items-center gap-2">
          <button
            type="button"
            onClick={() => setCartMenuOpen((prev) => !prev)}
            className="relative p-2 text-black/60 hover:text-black hover:bg-black/5 rounded-md transition-colors"
          >
            <ShoppingBag className="w-4 h-4" />
            {cartCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-black text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                {cartCount > 99 ? "99+" : cartCount}
              </span>
            )}
          </button>

          {/* Mobile menu toggle */}
          <button
            type="button"
            className="md:hidden p-2 text-black/60 hover:text-black transition-colors"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? (
              <X className="w-5 h-5" />
            ) : (
              <Menu className="w-5 h-5" />
            )}
          </button>
        </div>

        {/* Cart dropdown */}
        {cartMenuOpen && (
          <div
            ref={cartMenuRef}
            className="absolute right-5 top-full mt-2 w-[300px] bg-white border border-black/10 rounded-xl shadow-2xl shadow-black/10 p-4 z-50"
          >
            <div className="flex items-center justify-between mb-3">
              <div>
                <p className="text-[10px] uppercase tracking-[0.3em] text-black/40 font-bold">
                  {dict.navbar.cart ?? "Panier"}
                </p>
                <p className="text-sm font-bold text-black">
                  {cartCount} articles
                </p>
              </div>
              <button
                type="button"
                onClick={async () => {
                  try {
                    await fetch("/api/cart", {
                      method: "DELETE",
                      credentials: "same-origin",
                    });
                  } catch (error) {
                    console.warn(
                      "Erreur lors de l'écriture du panier serveur",
                      error,
                    );
                  }
                  setCartItems([]);
                  setCartCount(0);
                  setCartMenuOpen(false);
                  window.dispatchEvent(new Event("cartUpdated"));
                }}
                className="text-black/30 hover:text-red-600 transition-colors"
                aria-label="Vider le panier"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
            <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
              {cartItems.length === 0 ? (
                <div className="text-xs text-black/30 py-6 text-center">
                  Votre panier est vide.
                </div>
              ) : (
                cartItems.map(
                  (
                    item: {
                      id: string;
                      name: string;
                      quantity: number;
                      price: number;
                    },
                    index,
                  ) => (
                    <div
                      key={`${item.id}-${index}`}
                      className="flex items-center justify-between gap-2 border-b border-black/5 pb-2"
                    >
                      <div className="flex-1">
                        <p className="font-semibold text-xs text-black">
                          {item.name}
                        </p>
                        <p className="text-[10px] text-black/40">
                          Quantité: {item.quantity}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <p className="font-bold text-xs text-black">
                          €{(item.price * item.quantity).toFixed(2)}
                        </p>
                        <button
                          type="button"
                          onClick={() => handleDeleteItem(item.id)}
                          className="text-black/30 hover:text-red-600 hover:bg-red-50 p-1.5 rounded-lg transition-colors cursor-pointer"
                          aria-label={`Supprimer ${item.name}`}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ),
                )
              )}
            </div>
            <div className="mt-3 border-t border-black/10 pt-3">
              <div className="flex items-center justify-between text-xs text-black/50 mb-3">
                <span>Total</span>
                <span className="font-bold text-black">
                  €
                  {cartItems
                    .reduce(
                      (sum, item: { price: number; quantity: number }) =>
                        sum + item.price * item.quantity,
                      0,
                    )
                    .toFixed(2)}
                </span>
              </div>
              <Link
                href={`${localePrefix}/checkout`}
                className="w-full inline-flex items-center justify-center gap-2 bg-black hover:bg-neutral-850 text-white py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-colors"
                onClick={() => setCartMenuOpen(false)}
              >
                Voir le panier <ArrowRight className="w-3 h-3 text-white" />
              </Link>
            </div>
          </div>
        )}
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden border-t border-black/5 bg-white/98 backdrop-blur-xl">
          <div className="flex flex-col p-4 gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsMenuOpen(false)}
                className="px-3 py-2 text-xs uppercase tracking-[0.15em] font-semibold text-black/70 hover:text-black hover:bg-black/5 rounded-md transition-colors"
              >
                {link.label}
              </Link>
            ))}
            <Link
              href={`${localePrefix}/checkout`}
              onClick={() => setIsMenuOpen(false)}
              className="flex items-center gap-2 px-3 py-2 text-xs uppercase tracking-wider font-bold text-black border-t border-black/5 mt-2 pt-3"
            >
              <ShoppingBag className="w-3 h-3" />
              Panier {cartCount > 0 && `(${cartCount})`}
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
