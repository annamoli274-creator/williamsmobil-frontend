"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  CreditCard,
  Truck,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  ShoppingBag,
  ShieldCheck,
  HelpCircle,
  Upload,
  Check,
  Trash2,
} from "lucide-react";
import {
  getCartItems,
  clearCart as clearCartApi,
  removeCartItem,
  logClientAction,
} from "@/lib/cart";

type CartItem = {
  id: string;
  name: string;
  price: number;
  quantity: number;
};

type DeliveryForm = {
  fullName: string;
  address: string;
  city: string;
  postalCode: string;
  phone: string;
  email: string;
};

const checkoutTexts = {
  fr: {
    cartReview: "RÉVISEZ VOTRE SÉLECTION",
    deliveryDetails: "DÉTAILS DE LIVRAISON",
    paymentMode: "MODE DE PAIEMENT",
    finalConfirmation: "CONFIRMATION FINALE",
    fullName: "Nom Complet du Propriétaire",
    address: "Adresse du Terrain",
    city: "Ville",
    postalCode: "Code Postal",
    phone: "Téléphone (Appel / WhatsApp)",
    email: "Adresse E-mail",
    paymentSection: "Paiement",
    cardNumber: "Numéro de carte",
    cardName: "Nom sur la carte",
    cardExpiry: "Date d'expiration (MM/AA)",
    cardCvv: "Code CVV (3 chiffres)",
    cardUnavailable: "Le paiement par carte est momentanément indisponible",
    paypalEmail: "Email du compte PayPal",
    bankTransfer: "Virement Bancaire (Recommandé)",
    ibanTitle: "RIB / IBAN WILLIAMS MOBILHOME",
    bankName: "Banque : BBVA Madrid",
    iban: "ES76 0182 2345 6789 0123 4567",
    bic: "BBVAESMMXXX",
    holder: "Titulaire : Williams Mobilhome International S.L.",
    transferInstruction:
      "Veuillez effectuer le virement bancaire puis téléchargez votre preuve de paiement ci-dessous.",
    uploadScreenshot: "Uploader la Capture d'écran",
    emptyCart: "VOTRE PANIER EST VIDE",
    orderConfirmed: "COMMANDE VALIDÉE !",
    orderReceived:
      "Votre demande de réservation pour votre maison mobile a été reçue. Notre équipe vérifiera votre preuve de paiement sous 24h.",
    backHome: "Retour à l'Accueil",
    exploreCatalog: "Explorer le Catalogue",
    errorRequired: "Des champs obligatoires n'ont pas été remplis",
    requiredFields:
      "Veuillez remplir tous les champs obligatoires avant de passer à l'étape suivante.",
    cardDetails: "Informations de la carte",
    securePayment: "Paiement Sécurisé",
    companyFooter: "Williams MobilHome International S.L.",
    card: "Carte Bancaire",
    paypal: "PayPal",
    bank: "Virement Bancaire",
    uploadProof: "Preuve de paiement requise",
    summaryTitle: "Résumé",
    selectedModels: "Modèles sélectionnés",
    shippingDelivery: "Installation & Livraison",
    free: "Gratuit",
    taxes: "Taxes (TVA 20%)",
    included: "Inclus",
    totalTtc: "Total TTC",
    securePaymentFooter: "Paiement Sécurisé\nWilliams MobilHome International",
  },
  es: {
    cartReview: "REVISA TU SELECCIÓN",
    deliveryDetails: "DETALLES DE ENTREGA",
    paymentMode: "MÉTODO DE PAGO",
    finalConfirmation: "CONFIRMACIÓN FINAL",
    fullName: "Nombre completo del propietario",
    address: "Dirección del terreno",
    city: "Ciudad",
    postalCode: "Código postal",
    phone: "Teléfono (Llamada / WhatsApp)",
    email: "Correo electrónico",
    paymentSection: "Pago",
    cardNumber: "Número de tarjeta",
    cardName: "Nombre en la tarjeta",
    cardExpiry: "Fecha de caducidad (MM/AA)",
    cardCvv: "Código CVV (3 dígitos)",
    cardUnavailable: "El pago con tarjeta no está disponible temporalmente",
    paypalEmail: "Correo electrónico de PayPal",
    bankTransfer: "Transferencia Bancaria (Recomendado)",
    ibanTitle: "RIB / IBAN WILLIAMS MOBILHOME",
    bankName: "Banco: BBVA Madrid",
    iban: "ES76 0182 2345 6789 0123 4567",
    bic: "BBVAESMMXXX",
    holder: "Titular: Williams Mobilhome International S.L.",
    transferInstruction:
      "Por favor realice la transferencia bancaria y luego suba su comprobante de pago a continuación.",
    uploadScreenshot: "Subir captura de pantalla",
    emptyCart: "TU CARRITO ESTÁ VACÍO",
    orderConfirmed: "¡ORDEN CONFIRMADA!",
    orderReceived:
      "Su solicitud de reserva de casa móvil ha sido recibida. Nuestro equipo verificará su comprobante de pago dentro de 24 horas.",
    backHome: "Volver al Inicio",
    exploreCatalog: "Explorar catálogo",
    errorRequired: "Des champs obligatoires n'ont pas été remplis",
    requiredFields:
      "Por favor, rellene todos los campos marcados como obligatorios.",
    cardDetails: "Información de la tarjeta",
    securePayment: "Pago Seguro",
    companyFooter: "Williams MobilHome International S.L.",
    card: "Tarjeta Bancaria",
    paypal: "PayPal",
    bank: "Transferencia Bancaria",
    uploadProof: "Comprobante de pago requerido",
    summaryTitle: "Resumen",
    selectedModels: "Modelos seleccionados",
    shippingDelivery: "Envío y entrega",
    free: "Gratis",
    taxes: "Impuestos (IVA 20%)",
    included: "Incluido",
    totalTtc: "Total IVA",
    securePaymentFooter: "Pago Seguro\nWilliams MobilHome International",
  },
  en: {
    cartReview: "REVIEW YOUR SELECTION",
    deliveryDetails: "DELIVERY DETAILS",
    paymentMode: "PAYMENT METHOD",
    finalConfirmation: "FINAL CONFIRMATION",
    fullName: "Owner's Full Name",
    address: "Plot Address",
    city: "City",
    postalCode: "Postal Code",
    phone: "Phone (Call / WhatsApp)",
    email: "Email Address",
    paymentSection: "Payment",
    cardNumber: "Card number",
    cardName: "Name on card",
    cardExpiry: "Expiration date (MM/YY)",
    cardCvv: "CVV code (3 digits)",
    cardUnavailable: "Card payment is temporarily unavailable",
    paypalEmail: "PayPal email address",
    bankTransfer: "Bank Transfer (Recommended)",
    ibanTitle: "RIB / IBAN WILLIAMS MOBILHOME",
    bankName: "Bank: BBVA Madrid",
    iban: "ES76 0182 2345 6789 0123 4567",
    bic: "BBVAESMMXXX",
    holder: "Holder: Williams Mobilhome International S.L.",
    transferInstruction:
      "Please make the bank transfer and then upload your payment proof below.",
    uploadScreenshot: "Upload Screenshot",
    emptyCart: "YOUR CART IS EMPTY",
    orderConfirmed: "ORDER CONFIRMED!",
    orderReceived:
      "Your mobile home reservation request has been received. Our team will verify your proof of payment within 24 hours.",
    backHome: "Back to Home",
    exploreCatalog: "Explore Catalog",
    errorRequired: "Des champs obligatoires n'ont pas été remplis",
    requiredFields: "Please fill in all the fields marked as required.",
    cardDetails: "Card Information",
    securePayment: "Secure Payment",
    companyFooter: "Williams MobilHome International S.L.",
    card: "Credit Card",
    paypal: "PayPal",
    bank: "Bank Transfer",
    uploadProof: "Payment proof required",
    summaryTitle: "Summary",
    selectedModels: "Selected models",
    shippingDelivery: "Shipping & Delivery",
    free: "Free",
    taxes: "Taxes (VAT 20%)",
    included: "Included",
    totalTtc: "Total VAT",
    securePaymentFooter: "Secure Payment\nWilliams MobilHome International",
  },
};

interface CheckoutPageProps {
  lang?: string;
}

const CheckoutPage = ({ lang }: CheckoutPageProps) => {
  const currentLang = (
    lang === "es" || lang === "en" || lang === "fr" ? lang : "fr"
  ) as "fr" | "es" | "en";
  const text = checkoutTexts[currentLang];
  const steps = [
    currentLang === "es" ? "Carrito" : currentLang === "en" ? "Cart" : "Panier",
    currentLang === "es"
      ? "Entrega"
      : currentLang === "en"
        ? "Delivery"
        : "Livraison",
    currentLang === "es"
      ? "Pago"
      : currentLang === "en"
        ? "Payment"
        : "Paiement",
    currentLang === "es"
      ? "Confirmación"
      : currentLang === "en"
        ? "Confirmation"
        : "Confirmation",
  ];

  const [items, setItems] = useState<CartItem[]>([]);
  const [step, setStep] = useState(1);
  const [isOrdered, setIsOrdered] = useState(false);
  const [isLocating, setIsLocating] = useState(false);

  // Delivery Form State (with email)
  const [deliveryForm, setDeliveryForm] = useState<DeliveryForm>({
    fullName: "Juan García",
    address: "",
    city: "",
    postalCode: "",
    phone: "",
    email: "",
  });

  // Credit Card States
  const [cardName, setCardName] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvv, setCardCvv] = useState("");

  // Virement Proof States
  const [paymentProofFile, setPaymentProofFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [paypalProcessing, setPaypalProcessing] = useState(false);

  // Error & Card Block Modal States
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [showCardUnavailableModal, setShowCardUnavailableModal] =
    useState(false);
  const [cardForceDisabled, setCardForceDisabled] = useState(false);

  // Selected Payment Method
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("");

  const localePrefix = lang ? `/${lang}` : "";

  const totalPrice = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );

  useEffect(() => {
    if (totalPrice > 0) {
      if (totalPrice <= 1500 && !cardForceDisabled) {
        setSelectedPaymentMethod("card");
      } else {
        setSelectedPaymentMethod("paypal");
      }
    }
  }, [totalPrice, cardForceDisabled]);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const fetched = await getCartItems();
        if (mounted) setItems(fetched as CartItem[]);
      } catch (error) {
        console.warn(
          "Impossible de charger le panier depuis le serveur",
          error,
        );
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  const clearCart = async () => {
    await clearCartApi();
    setItems([]);
  };

  const handleDeleteItem = async (itemId: string) => {
    try {
      const updatedItems = await removeCartItem(itemId);
      if (updatedItems) {
        setItems(updatedItems as CartItem[]);
      } else {
        const updated = items.filter((item) => item.id !== itemId);
        setItems(updated);
        document.cookie = `cart_items=${encodeURIComponent(JSON.stringify(updated))}; path=/; SameSite=Lax`;
      }
      logClientAction("remove_from_cart", { itemId });
    } catch (err) {
      console.warn("Failed to delete cart item", err);
    }
  };

  const handlePlaceOrder = async () => {
    if (selectedPaymentMethod === "paypal") {
      await handlePayPalCheckout();
      return;
    }

    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.append("fullName", deliveryForm.fullName);
      formData.append("address", deliveryForm.address);
      formData.append("city", deliveryForm.city);
      formData.append("postalCode", deliveryForm.postalCode);
      formData.append("phone", deliveryForm.phone);
      formData.append("email", deliveryForm.email);
      formData.append("paymentMethod", selectedPaymentMethod);
      formData.append("total", totalPrice.toString());
      formData.append("items", JSON.stringify(items));

      if (selectedPaymentMethod === "virement" && paymentProofFile) {
        formData.append("proofFile", paymentProofFile);
      }

      const res = await fetch("/api/orders", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to place order");
      }

      // After successful order, send proof to WhatsApp if applicable
      if (selectedPaymentMethod === "virement" && paymentProofFile) {
        try {
          const whatsappForm = new FormData();
          whatsappForm.append("file", paymentProofFile);
          whatsappForm.append("fullName", deliveryForm.fullName);
          whatsappForm.append("email", deliveryForm.email);
          whatsappForm.append("total", totalPrice.toString());
          whatsappForm.append("paymentMethod", selectedPaymentMethod);
          await fetch("/api/whatsapp-proof", {
            method: "POST",
            body: whatsappForm,
          });
        } catch (whErr) {
          console.error("WhatsApp proof error", whErr);
        }
      }
      setIsOrdered(true);
      setItems([]);
    } catch (error: any) {
      console.error("Error placing order:", error);
      setErrorMessage(
        currentLang === "es"
          ? "Error al procesar el pedido. Por favor, inténtelo de nouveau."
          : currentLang === "en"
            ? "Failed to process order. Please try again."
            : "Échec du traitement de la commande. Veuillez réessayer.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePayPalCheckout = async () => {
    setPaypalProcessing(true);
    try {
      const res = await fetch("/api/paypal/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items,
          totalAmount: totalPrice,
          currency: "EUR",
          customerName: deliveryForm.fullName,
          customerEmail: deliveryForm.email,
          lang: currentLang,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Unable to create PayPal order");
      }

      if (!data.approvalUrl) {
        throw new Error("PayPal approval URL not provided");
      }

      window.location.href = data.approvalUrl;
    } catch (error: any) {
      setErrorMessage(
        error?.message ||
          (currentLang === "es"
            ? "Error al iniciar PayPal. Por favor inténtelo de nuevo."
            : currentLang === "en"
              ? "Failed to start PayPal checkout. Please try again."
              : "Échec du démarrage de PayPal. Veuillez réessayer."),
      );
    } finally {
      setPaypalProcessing(false);
    }
  };

  const handleLocate = (
    e:
      | React.MouseEvent<HTMLButtonElement>
      | React.TouchEvent<HTMLButtonElement>,
  ) => {
    e.preventDefault();

    if (!navigator.geolocation) {
      alert("La géolocalisation n'est pas supportée par votre navigateur");
      return;
    }

    setIsLocating(true);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`,
          );
          const data = await res.json();

          if (data && data.address) {
            const addr = data.address;
            const street =
              `${addr.road || ""} ${addr.house_number || ""}`.trim();
            setDeliveryForm((prev) => ({
              ...prev,
              address: street || data.display_name || "",
              city:
                addr.city ||
                addr.town ||
                addr.village ||
                addr.municipality ||
                "",
              postalCode: addr.postcode || "",
            }));
          }
        } catch (error) {
          console.error("Erreur de géolocalisation", error);
          alert("Impossible de récupérer l'adresse");
        } finally {
          setIsLocating(false);
        }
      },
      (error) => {
        console.error(error);
        alert("Erreur lors de la géolocalisation : " + error.message);
        setIsLocating(false);
      },
    );
  };

  if (isOrdered) {
    return (
      <div className="min-h-[100dvh] flex items-center justify-center pt-20 px-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full glass p-12 rounded-[3rem] text-center text-zinc-900"
        >
          <div className="w-24 h-24 bg-green-500/20 text-green-500 rounded-full flex items-center justify-center mx-auto mb-8">
            <CheckCircle2 size={48} />
          </div>
          <h1 className="text-3xl font-black mb-4 font-serif text-black">
            {text.orderConfirmed}
          </h1>
          <p className="text-zinc-650 mb-10 leading-relaxed text-sm">
            {text.orderReceived}
          </p>
          <Link
            href={`${localePrefix || "/"}`}
            className="block w-full bg-primary text-white py-4 rounded-2xl font-bold shadow-xl transition-all hover:scale-[1.02] cursor-pointer"
          >
            {text.backHome}
          </Link>
        </motion.div>
      </div>
    );
  }

  if (items.length === 0 && step === 1) {
    return (
      <div className="min-h-[100dvh] flex items-center justify-center pt-20 px-6 text-center text-zinc-900">
        <div>
          <ShoppingBag
            size={64}
            className="mx-auto mb-6 opacity-25 text-primary"
          />
          <h2 className="text-3xl font-black mb-4 font-serif">
            {text.emptyCart}
          </h2>
          <Link
            href={`${localePrefix}/catalog`}
            className="text-primary font-bold hover:underline cursor-pointer"
          >
            {text.exploreCatalog}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-32 pb-24 min-h-[100dvh] max-w-7xl mx-auto px-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 space-y-8">
          <div className="flex justify-between items-center mb-12 relative px-4">
            <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-zinc-200 dark:bg-zinc-800 -z-10" />
            {steps.map((s, i) => (
              <div key={s} className="flex flex-col items-center gap-2">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                    step > i + 1
                      ? "bg-green-500 text-white"
                      : step === i + 1
                        ? "bg-primary text-white scale-125 shadow-lg shadow-primary/30"
                        : "bg-zinc-200 dark:bg-zinc-800"
                  }`}
                >
                  {step > i + 1 ? <CheckCircle2 size={16} /> : i + 1}
                </div>
                <span className="text-[10px] uppercase tracking-widest font-black opacity-50">
                  {s}
                </span>
              </div>
            ))}
          </div>

          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="glass p-8 rounded-[2rem]"
              >
                <h3 className="text-2xl font-black mb-6">
                  RÉVISEZ VOTRE PANIER
                </h3>
                <div className="space-y-4">
                  {items.map((item) => (
                    <div
                      key={item.id}
                      className="flex justify-between items-center border-b border-glass-border pb-4 gap-4"
                    >
                      <div className="flex-1">
                        <div className="font-bold text-zinc-900">
                          {item.name}
                        </div>
                        <div className="text-sm opacity-60">
                          Quantité : {item.quantity}
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="font-black text-zinc-900">
                          €{(item.price * item.quantity).toFixed(2)}
                        </div>
                        <button
                          onClick={() => handleDeleteItem(item.id)}
                          className="text-red-500 hover:text-red-700 p-2 hover:bg-red-500/10 rounded-lg transition-all cursor-pointer"
                          title="Supprimer"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
                <button
                  onClick={() => setStep(2)}
                  className="mt-8 w-full bg-foreground text-background py-4 rounded-xl font-bold flex items-center justify-center gap-2"
                >
                  Continuer vers la Livraison <ArrowRight size={18} />
                </button>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="glass p-8 rounded-[2rem] space-y-6"
              >
                <div className="flex items-center gap-2 mb-2">
                  <Truck className="text-primary" />
                  <h3 className="text-2xl font-black">
                    {text.deliveryDetails}
                  </h3>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2">
                    <label className="text-[10px] uppercase font-bold opacity-50 ml-2">
                      {text.fullName}
                    </label>
                    <input
                      type="text"
                      className="w-full glass p-4 rounded-xl focus:ring-1 focus:ring-primary outline-none mt-1"
                      value={deliveryForm.fullName}
                      onChange={(e) =>
                        setDeliveryForm((prev) => ({
                          ...prev,
                          fullName: e.target.value,
                        }))
                      }
                      placeholder={
                        currentLang === "es"
                          ? "Ej: Juan García"
                          : currentLang === "en"
                            ? "Ex: John Smith"
                            : "Ex: Jean Dupont"
                      }
                    />
                  </div>
                  <div className="col-span-2">
                    <div className="flex justify-between items-center ml-2">
                      <label className="text-[10px] uppercase font-bold opacity-50">
                        {text.address}
                      </label>
                      <button
                        onClick={handleLocate}
                        disabled={isLocating}
                        className="text-[10px] uppercase font-bold text-primary hover:underline flex items-center gap-1 disabled:opacity-50"
                      >
                        {isLocating
                          ? "Localisation..."
                          : "📍 " +
                            (currentLang === "es"
                              ? "Localizarme"
                              : currentLang === "en"
                                ? "Locate me"
                                : "Me localiser")}
                      </button>
                    </div>
                    <input
                      type="text"
                      className="w-full glass p-4 rounded-xl focus:ring-1 focus:ring-primary outline-none mt-1"
                      value={deliveryForm.address}
                      onChange={(e) =>
                        setDeliveryForm((prev) => ({
                          ...prev,
                          address: e.target.value,
                        }))
                      }
                      placeholder={
                        currentLang === "es"
                          ? "Ej: Avenida de América, 12"
                          : currentLang === "en"
                            ? "Ex: Avenida de América, 12"
                            : "Ex: Avenida de América, 12"
                      }
                    />
                  </div>
                  <div>
                    <label className="text-[10px] uppercase font-bold opacity-50 ml-2">
                      {text.city}
                    </label>
                    <input
                      type="text"
                      className="w-full glass p-4 rounded-xl focus:ring-1 focus:ring-primary outline-none mt-1"
                      value={deliveryForm.city}
                      onChange={(e) =>
                        setDeliveryForm((prev) => ({
                          ...prev,
                          city: e.target.value,
                        }))
                      }
                      placeholder={
                        currentLang === "es"
                          ? "Ej: Madrid"
                          : currentLang === "en"
                            ? "Ex: Madrid"
                            : "Ex: Madrid"
                      }
                    />
                  </div>
                  <div>
                    <label className="text-[10px] uppercase font-bold opacity-50 ml-2">
                      {text.postalCode}
                    </label>
                    <input
                      type="text"
                      className="w-full glass p-4 rounded-xl focus:ring-1 focus:ring-primary outline-none mt-1"
                      value={deliveryForm.postalCode}
                      onChange={(e) =>
                        setDeliveryForm((prev) => ({
                          ...prev,
                          postalCode: e.target.value,
                        }))
                      }
                      placeholder={
                        currentLang === "es"
                          ? "Ej: 28002"
                          : currentLang === "en"
                            ? "Ex: 28002"
                            : "Ex: 28002"
                      }
                    />
                  </div>
                  <div className="col-span-2">
                    <label className="text-[10px] uppercase font-bold opacity-50 ml-2">
                      {text.phone}
                    </label>
                    <input
                      type="text"
                      className="w-full glass p-4 rounded-xl focus:ring-1 focus:ring-primary outline-none mt-1"
                      value={deliveryForm.phone}
                      onChange={(e) =>
                        setDeliveryForm((prev) => ({
                          ...prev,
                          phone: e.target.value,
                        }))
                      }
                      placeholder={
                        currentLang === "es"
                          ? "Ej: +34 610 70 69 19"
                          : currentLang === "en"
                            ? "Ex: +34 610 70 69 19"
                            : "Ex: +34 610 70 69 19"
                      }
                    />
                  </div>
                  <div className="col-span-2">
                    <label className="text-[10px] uppercase font-bold opacity-50 ml-2">
                      {text.email}
                    </label>
                    <input
                      type="email"
                      className="w-full glass p-4 rounded-xl focus:ring-1 focus:ring-primary outline-none mt-1"
                      value={deliveryForm.email}
                      onChange={(e) =>
                        setDeliveryForm((prev) => ({
                          ...prev,
                          email: e.target.value,
                        }))
                      }
                      placeholder={
                        currentLang === "es"
                          ? "Ej: juan.garcia@ejemplo.com"
                          : currentLang === "en"
                            ? "Ex: john.smith@example.com"
                            : "Ex: jean.dupont@example.com"
                      }
                    />
                  </div>
                </div>
                <div className="flex gap-4 pt-4">
                  <button
                    onClick={() => setStep(1)}
                    className="flex-1 glass p-4 rounded-xl font-bold flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <ArrowLeft size={18} />{" "}
                    {currentLang === "es"
                      ? "Retroceder"
                      : currentLang === "en"
                        ? "Back"
                        : "Retour"}
                  </button>
                  <button
                    onClick={() => {
                      if (
                        !deliveryForm.fullName.trim() ||
                        !deliveryForm.address.trim() ||
                        !deliveryForm.city.trim() ||
                        !deliveryForm.postalCode.trim() ||
                        !deliveryForm.phone.trim() ||
                        !deliveryForm.email.trim()
                      ) {
                        setErrorMessage(text.errorRequired);
                        return;
                      }
                      setStep(3);
                    }}
                    className="flex-[2] bg-foreground text-background p-4 rounded-xl font-bold flex items-center justify-center gap-2 cursor-pointer"
                  >
                    {currentLang === "es"
                      ? "Continuar hacia pago"
                      : currentLang === "en"
                        ? "Continue to Payment"
                        : "Continuer vers le Paiement"}{" "}
                    <ArrowRight size={18} />
                  </button>
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="glass p-8 rounded-[2rem] space-y-6"
              >
                <div className="flex items-center gap-2 mb-2">
                  <CreditCard className="text-primary" />
                  <h3 className="text-2xl font-black">{text.paymentMode}</h3>
                </div>
                <div className="space-y-4">
                  {/* Option 1: Carte (only if total <= 1500 & not force-disabled) */}
                  {totalPrice <= 1500 && !cardForceDisabled && (
                    <button
                      type="button"
                      onClick={() => setSelectedPaymentMethod("card")}
                      className={`glass p-6 rounded-2xl flex justify-between items-center cursor-pointer transition-all duration-300 w-full text-left ${
                        selectedPaymentMethod === "card"
                          ? "border-primary bg-primary/5 ring-1 ring-primary"
                          : "opacity-70 hover:opacity-100"
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-8 bg-zinc-800 rounded-md flex items-center justify-center font-bold text-[8px] text-white">
                          CARD
                        </div>
                        <div>
                          <div className="font-bold">{text.card}</div>
                        </div>
                      </div>
                      <div
                        className={`w-5 h-5 rounded-full border ${
                          selectedPaymentMethod === "card"
                            ? "border-4 border-primary"
                            : "border-glass-border"
                        }`}
                      />
                    </button>
                  )}

                  {/* Option 2: PayPal */}
                  <button
                    type="button"
                    onClick={() => setSelectedPaymentMethod("paypal")}
                    className={`glass p-6 rounded-2xl flex justify-between items-center cursor-pointer transition-all duration-300 w-full text-left ${
                      selectedPaymentMethod === "paypal"
                        ? "border-primary bg-primary/5 ring-1 ring-primary"
                        : "opacity-70 hover:opacity-100"
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-8 bg-zinc-800 rounded-md flex items-center justify-center font-bold text-[8px] text-white">
                        PAYPAL
                      </div>
                      <div>
                        <div className="font-bold">{text.paypal}</div>
                      </div>
                    </div>
                    <div
                      className={`w-5 h-5 rounded-full border ${
                        selectedPaymentMethod === "paypal"
                          ? "border-4 border-primary"
                          : "border-glass-border"
                      }`}
                    />
                  </button>

                  {/* Option 3: Virement Bancaire */}
                  <button
                    type="button"
                    onClick={() => setSelectedPaymentMethod("virement")}
                    className={`glass p-6 rounded-2xl flex justify-between items-center cursor-pointer transition-all duration-300 w-full text-left ${
                      selectedPaymentMethod === "virement"
                        ? "border-primary bg-primary/5 ring-1 ring-primary"
                        : "opacity-70 hover:opacity-100"
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-8 bg-zinc-800 rounded-md flex items-center justify-center font-bold text-[8px] text-white">
                        BANK
                      </div>
                      <div>
                        <div className="font-bold">{text.bank}</div>
                      </div>
                    </div>
                    <div
                      className={`w-5 h-5 rounded-full border ${
                        selectedPaymentMethod === "virement"
                          ? "border-4 border-primary"
                          : "border-glass-border"
                      }`}
                    />
                  </button>
                </div>

                {/* Sub-Forms based on selected option */}
                <AnimatePresence mode="wait">
                  {selectedPaymentMethod === "card" && (
                    <motion.div
                      key="cardForm"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="bg-white/5 rounded-2xl p-6 space-y-4"
                    >
                      <h4 className="text-sm font-bold text-primary font-serif mb-2">
                        {text.cardDetails}
                      </h4>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="col-span-2">
                          <label className="text-[10px] uppercase font-bold opacity-50 ml-2">
                            {text.cardName}
                          </label>
                          <input
                            type="text"
                            required
                            placeholder="Ex: Juan García"
                            className="w-full glass p-3.5 rounded-xl focus:ring-1 focus:ring-primary outline-none mt-1 text-sm text-zinc-900"
                            value={cardName}
                            onChange={(e) => setCardName(e.target.value)}
                          />
                        </div>
                        <div className="col-span-2">
                          <label className="text-[10px] uppercase font-bold opacity-50 ml-2">
                            {text.cardNumber}
                          </label>
                          <input
                            type="text"
                            required
                            maxLength={19}
                            placeholder="4000 1234 5678 9010"
                            className="w-full glass p-3.5 rounded-xl focus:ring-1 focus:ring-primary outline-none mt-1 text-sm font-mono text-zinc-900"
                            value={cardNumber}
                            onChange={(e) => {
                              const val = e.target.value
                                .replace(/\D/g, "")
                                .replace(/(\d{4})/g, "$1 ")
                                .trim();
                              setCardNumber(val);
                            }}
                          />
                        </div>
                        <div>
                          <label className="text-[10px] uppercase font-bold opacity-50 ml-2">
                            {text.cardExpiry}
                          </label>
                          <input
                            type="text"
                            required
                            maxLength={5}
                            placeholder="MM/AA"
                            className="w-full glass p-3.5 rounded-xl focus:ring-1 focus:ring-primary outline-none mt-1 text-sm font-mono text-zinc-900"
                            value={cardExpiry}
                            onChange={(e) => {
                              let val = e.target.value.replace(/\D/g, "");
                              if (val.length >= 2) {
                                val = val.slice(0, 2) + "/" + val.slice(2, 4);
                              }
                              setCardExpiry(val);
                            }}
                          />
                        </div>
                        <div>
                          <label className="text-[10px] uppercase font-bold opacity-50 ml-2">
                            {text.cardCvv}
                          </label>
                          <input
                            type="password"
                            required
                            maxLength={3}
                            placeholder="123"
                            className="w-full glass p-3.5 rounded-xl focus:ring-1 focus:ring-primary outline-none mt-1 text-sm font-mono text-zinc-900"
                            value={cardCvv}
                            onChange={(e) =>
                              setCardCvv(e.target.value.replace(/\D/g, ""))
                            }
                          />
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {selectedPaymentMethod === "paypal" && (
                    <motion.div
                      key="paypalForm"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="bg-white/5 rounded-2xl p-6 space-y-4"
                    >
                      <h4 className="text-sm font-bold text-primary font-serif mb-2">
                        PayPal
                      </h4>
                      <div className="space-y-4">
                        <p className="text-[11px] leading-relaxed opacity-70">
                          {currentLang === "es"
                            ? "Al hacer clic en Pagar con PayPal, se le redirigirá a PayPal para iniciar sesión y completar el pago."
                            : currentLang === "en"
                              ? "By clicking Pay with PayPal, you will be redirected to PayPal to login and complete your payment."
                              : "En cliquant sur Payer avec PayPal, vous serez redirigé vers PayPal pour vous connecter et finaliser votre paiement."}
                        </p>
                        <button
                          type="button"
                          onClick={handlePayPalCheckout}
                          disabled={paypalProcessing}
                          className="w-full bg-[#003087] hover:bg-[#002266] text-white font-bold py-4 rounded-2xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {paypalProcessing
                            ? currentLang === "es"
                              ? "Redirigiendo a PayPal..."
                              : currentLang === "en"
                                ? "Redirecting to PayPal..."
                                : "Redirection vers PayPal..."
                            : currentLang === "es"
                              ? "Pagar con PayPal"
                              : currentLang === "en"
                                ? "Pay with PayPal"
                                : "Payer avec PayPal"}
                        </button>
                      </div>
                    </motion.div>
                  )}

                  {selectedPaymentMethod === "virement" && (
                    <motion.div
                      key="bankForm"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="bg-white/5 rounded-2xl p-6 space-y-4"
                    >
                      <h4 className="text-sm font-bold text-primary font-serif mb-2">
                        {text.bank}
                      </h4>
                      <div className="rounded-2xl border border-red-200 bg-red-50 p-5 text-sm text-red-900">
                        {currentLang === "es"
                          ? "El pago por transferencia bancaria aún no está disponible. Por favor, elija otro método de pago."
                          : currentLang === "en"
                            ? "Bank transfer payment is not available yet. Please choose another payment method."
                            : "Le paiement par virement bancaire n'est pas encore disponible. Veuillez choisir un autre mode de paiement."}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                <div className="flex gap-4 pt-4">
                  <button
                    onClick={() => setStep(2)}
                    className="flex-1 glass p-4 rounded-xl font-bold flex items-center justify-center gap-2 cursor-pointer text-zinc-800"
                  >
                    <ArrowLeft size={18} />{" "}
                    {currentLang === "es"
                      ? "Retroceder"
                      : currentLang === "en"
                        ? "Back"
                        : "Retour"}
                  </button>
                  <button
                    onClick={() => {
                      if (!selectedPaymentMethod) {
                        setErrorMessage(text.errorRequired);
                        return;
                      }

                      // Card validation
                      if (selectedPaymentMethod === "card") {
                        if (
                          !cardName.trim() ||
                          !cardNumber.trim() ||
                          !cardExpiry.trim() ||
                          !cardCvv.trim()
                        ) {
                          setErrorMessage(text.errorRequired);
                          return;
                        }
                        // If everything is correct, trigger elegant "momentarily unavailable" modal and force Paypal/Bank transfer selection
                        setShowCardUnavailableModal(true);
                        return;
                      }

                      // PayPal validation
                      if (selectedPaymentMethod === "virement") {
                        setErrorMessage(
                          currentLang === "es"
                            ? "El pago por transferencia bancaria aún no está disponible."
                            : currentLang === "en"
                              ? "Bank transfer payment is not available yet."
                              : "Le paiement par virement bancaire n'est pas encore disponible.",
                        );
                        return;
                      }

                      setStep(4);
                    }}
                    className="flex-[2] bg-foreground text-background p-4 rounded-xl font-bold flex items-center justify-center gap-2 cursor-pointer"
                  >
                    {currentLang === "es"
                      ? "Confirmar"
                      : currentLang === "en"
                        ? "Confirm"
                        : "Confirmer"}{" "}
                    <ArrowRight size={18} />
                  </button>
                </div>
              </motion.div>
            )}

            {step === 4 && (
              <motion.div
                key="step4"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="glass p-8 rounded-[2rem] space-y-6"
              >
                <h3 className="text-2xl font-black text-center mb-4">
                  {text.finalConfirmation}
                </h3>
                <div className="bg-zinc-50 border border-zinc-200 rounded-2xl p-6 space-y-4 text-zinc-900">
                  <div className="flex justify-between text-sm">
                    <span className="opacity-60">
                      {currentLang === "es"
                        ? "Entregar a"
                        : currentLang === "en"
                          ? "Deliver to"
                          : "Livraison à"}
                    </span>
                    <span className="font-bold">{deliveryForm.fullName}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="opacity-60">
                      {currentLang === "es"
                        ? "Dirección"
                        : currentLang === "en"
                          ? "Address"
                          : "Adresse"}
                    </span>
                    <span className="font-bold">
                      {deliveryForm.address}, {deliveryForm.city}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="opacity-60">{text.email}</span>
                    <span className="font-bold">{deliveryForm.email}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="opacity-60">
                      {currentLang === "es"
                        ? "Método de pago"
                        : currentLang === "en"
                          ? "Payment via"
                          : "Paiement via"}
                    </span>
                    <span className="font-bold text-emerald-700">
                      {selectedPaymentMethod === "card" && "Carte Bancaire"}
                      {selectedPaymentMethod === "paypal" && "PayPal"}
                      {selectedPaymentMethod === "virement" &&
                        `Virement Bancaire (Preuve: ${paymentProofFile?.name || ""})`}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm border-t border-zinc-200 pt-4 mt-2">
                    <span className="opacity-60">{text.totalTtc}</span>
                    <span className="font-black text-primary text-lg">
                      €{totalPrice.toFixed(2)}
                    </span>
                  </div>
                </div>
                <div className="flex gap-4 pt-4">
                  <button
                    onClick={() => setStep(3)}
                    className="flex-1 glass p-4 rounded-xl font-bold flex items-center justify-center gap-2 cursor-pointer text-zinc-800"
                  >
                    <ArrowLeft size={18} />{" "}
                    {currentLang === "es"
                      ? "Retroceder"
                      : currentLang === "en"
                        ? "Back"
                        : "Retour"}
                  </button>
                  <button
                    disabled={isSubmitting}
                    onClick={handlePlaceOrder}
                    className="flex-[2] bg-primary text-white p-4 rounded-xl font-bold flex items-center justify-center gap-2 shadow-xl cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? (
                      <>
                        <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        {currentLang === "es"
                          ? "Procesando..."
                          : currentLang === "en"
                            ? "Processing..."
                            : "Traitement..."}
                      </>
                    ) : (
                      <>
                        {selectedPaymentMethod === "paypal"
                          ? currentLang === "es"
                            ? "Pagar con PayPal"
                            : currentLang === "en"
                              ? "Pay with PayPal"
                              : "Payer avec PayPal"
                          : currentLang === "es"
                            ? "Realizar pedido"
                            : currentLang === "en"
                              ? "Place Order"
                              : "Passer la Commande"}
                      </>
                    )}
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="lg:col-span-1">
          <div className="glass p-8 rounded-[2rem] sticky top-32">
            <h3 className="text-xl font-black mb-6 uppercase tracking-tighter text-zinc-900">
              {text.summaryTitle}
            </h3>
            <div className="space-y-4 mb-8 text-zinc-800">
              <div className="flex justify-between opacity-60 text-sm">
                <span>
                  {currentLang === "es"
                    ? "Modelos"
                    : currentLang === "en"
                      ? "Models"
                      : "Articles"}
                </span>
                <span>€{totalPrice.toFixed(2)}</span>
              </div>
              <div className="flex justify-between opacity-60 text-sm">
                <span>{text.shippingDelivery}</span>
                <span className="text-emerald-700 font-bold uppercase">
                  {text.free}
                </span>
              </div>
              <div className="flex justify-between opacity-60 text-sm">
                <span>{text.taxes}</span>
                <span className="text-zinc-650 font-medium">
                  {text.included}
                </span>
              </div>
              <div className="flex justify-between pt-4 border-t border-zinc-200">
                <span className="font-bold text-zinc-900">Total</span>
                <span className="text-2xl font-black text-primary">
                  €{totalPrice.toFixed(2)}
                </span>
              </div>
            </div>

            <div className="text-[10px] text-center opacity-60 uppercase tracking-[0.2em] font-black whitespace-pre-line text-emerald-400 leading-relaxed">
              🛡️ {text.securePaymentFooter}
            </div>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {errorMessage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/85 backdrop-blur-sm z-[999] flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-[#0a0a0a]/98 border border-primary/20 p-8 rounded-[2.5rem] max-w-sm w-full text-center shadow-2xl relative text-slate-100"
            >
              <div className="w-16 h-16 bg-red-500/20 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg
                  className="w-8 h-8"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2.5}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
              </div>
              <h4 className="text-xl font-bold font-serif mb-3 text-red-400">
                Attention
              </h4>
              <p className="text-sm text-slate-300 leading-relaxed mb-6">
                {errorMessage}
              </p>
              <button
                onClick={() => setErrorMessage(null)}
                className="w-full bg-primary text-white py-3.5 rounded-xl font-bold hover:bg-primary-light transition-all shadow-lg cursor-pointer"
              >
                Compris
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Custom Elegant Card Unavailability Modal */}
      <AnimatePresence>
        {showCardUnavailableModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/85 backdrop-blur-sm z-[999] flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-[#0a0a0a]/98 border border-primary/20 p-8 rounded-[2.5rem] max-w-md w-full text-center shadow-2xl relative text-slate-100"
            >
              <div className="w-16 h-16 bg-amber-500/20 text-amber-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg
                  className="w-8 h-8"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2.5}
                    d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h4 className="text-xl font-bold font-serif mb-3 text-amber-400">
                {text.cardUnavailable}
              </h4>
              <p className="text-sm text-slate-300 leading-relaxed mb-6 px-2">
                {currentLang === "es"
                  ? "El pago mediante tarjeta bancaria no está disponible en este momento debido a un mantenimiento técnico de nuestra pasarela de pago local. Por favor, seleccione PayPal o Transferencia Bancaria para finalizar su pedido de forma segura."
                  : currentLang === "en"
                    ? "Credit card payment is currently unavailable due to technical maintenance of our local payment gateway. Please select PayPal or Bank Transfer to complete your order securely."
                    : "Le paiement par carte bancaire est temporairement indisponible en raison d'une maintenance technique de notre passerelle de paiement locale. Veuillez sélectionner PayPal ou le Virement Bancaire pour finaliser votre commande en toute sécurité."}
              </p>
              <button
                onClick={() => {
                  setShowCardUnavailableModal(false);
                  setCardForceDisabled(true);
                  setSelectedPaymentMethod("paypal");
                }}
                className="w-full bg-primary text-white py-3.5 rounded-xl font-bold hover:bg-primary-light transition-all shadow-lg cursor-pointer"
              >
                {currentLang === "es"
                  ? "Usar otros métodos"
                  : currentLang === "en"
                    ? "Use other methods"
                    : "Utiliser les autres modes"}
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CheckoutPage;
