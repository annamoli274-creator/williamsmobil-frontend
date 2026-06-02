/**
 * Composant PayPalButton - Bouton PayPal avec flux complet
 * Prêt pour production
 */

"use client";

import { FC, useCallback, useEffect, useRef, useState } from "react";
import { OrderItem } from "@/types/paypal";

interface PayPalButtonProps {
  items: OrderItem[];
  totalAmount: number;
  currency?: string;
  customerName: string;
  customerEmail: string;
  onSuccess?: (orderId: string) => void;
  onError?: (error: string) => void;
}

export const PayPalButton: FC<PayPalButtonProps> = ({
  items,
  totalAmount,
  currency = "USD",
  customerName,
  customerEmail,
  onSuccess,
  onError,
}) => {
  const [error, setError] = useState<string | null>(null);
  const [step, setStep] = useState<"ready" | "processing" | "success">("ready");
  const buttonContainerRef = useRef<HTMLDivElement | null>(null);

  const loadAndRender = useCallback(() => {
    if (!process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID) {
      setError("PayPal Client ID not configured");
      return;
    }

    const renderButtons = () => {
      const paypal = (window as any).paypal;
      if (!paypal) {
        setError("PayPal SDK not available");
        return;
      }

      const container = buttonContainerRef.current;
      if (!container) return;

      container.innerHTML = "";

      paypal
        .Buttons({
          style: {
            layout: "vertical",
            color: "blue",
            shape: "rect",
            label: "paypal",
          },
          createOrder: async () => {
            setStep("processing");
            try {
              const res = await fetch("/api/paypal/create-order", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  items,
                  totalAmount,
                  currency,
                  customerName,
                  customerEmail,
                }),
              });

              const data = await res.json();
              if (!res.ok)
                throw new Error(data.error || "Failed to create order");
              return data.paypalOrderId;
            } catch (err) {
              const msg = err instanceof Error ? err.message : String(err);
              setError(msg);
              if (onError) onError(msg);
              throw err;
            }
          },
          onApprove: async (data: any) => {
            const orderId = data.orderID || data.paymentID || data.token;
            try {
              const res = await fetch("/api/paypal/capture-order", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  paypalOrderId: orderId,
                  items,
                  totalAmount,
                  currency,
                  customerName,
                  customerEmail,
                }),
              });

              const capture = await res.json();
              if (!res.ok) throw new Error(capture.error || "Capture failed");

              setStep("success");
              if (onSuccess) onSuccess(orderId);
            } catch (err) {
              const msg = err instanceof Error ? err.message : String(err);
              setError(msg);
              setStep("ready");
              if (onError) onError(msg);
            }
          },
          onError: (err: any) => {
            const msg = err instanceof Error ? err.message : String(err);
            setError(msg);
            setStep("ready");
            if (onError) onError(msg);
          },
        })
        .render(container);
    };

    const id = "paypal-sdk";
    const existing = document.getElementById(id) as HTMLScriptElement | null;
    if (existing) {
      if ((window as any).paypal) renderButtons();
      else existing.addEventListener("load", renderButtons);
      return;
    }

    const script = document.createElement("script");
    script.id = id;
    script.src = `https://www.paypal.com/sdk/js?client-id=${process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID}&currency=${currency}`;
    script.async = true;
    script.onload = renderButtons;
    script.onerror = () => setError("Failed to load PayPal SDK");
    document.body.appendChild(script);
  }, [
    items,
    totalAmount,
    currency,
    customerName,
    customerEmail,
    onError,
    onSuccess,
  ]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    loadAndRender();
  }, [loadAndRender]);

  return (
    <div className="paypal-button-wrapper" style={{ padding: "1rem" }}>
      {error && (
        <div
          className="error-message"
          style={{
            marginBottom: "1rem",
            padding: "0.75rem",
            backgroundColor: "#f8d7da",
            color: "#721c24",
            borderRadius: "0.25rem",
            fontSize: "0.9rem",
          }}
        >
          ❌ {error}
        </div>
      )}

      {step === "processing" && (
        <div
          style={{
            padding: "1rem",
            textAlign: "center",
            color: "#007bff",
            fontSize: "0.9rem",
          }}
        >
          ⏳ Processing payment...
        </div>
      )}

      {step === "success" && (
        <div
          style={{
            padding: "1rem",
            textAlign: "center",
            color: "#28a745",
            fontSize: "0.9rem",
          }}
        >
          ✅ Payment successful!
        </div>
      )}

      {/* Container where PayPal JS SDK will render the buttons */}
      <div id="paypal-button-container" ref={buttonContainerRef} />
    </div>
  );
};

export default PayPalButton;
