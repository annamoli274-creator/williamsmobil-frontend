/**
 * Route API: GET /api/paypal/callback
 * Gère les callbacks de PayPal (approbation + capture automatique)
 */

import { NextRequest, NextResponse } from "next/server";
import { capturePayPalOrder } from "@/services/paypalService";
import { OrderResponse } from "@/types/paypal";

interface CaptureParams {
  paypalOrderId?: string;
  items?: Array<{ name: string; quantity: number; price: number }>;
  totalAmount?: number;
  currency?: string;
  customerName?: string;
  customerEmail?: string;
}

export async function GET(request: NextRequest): Promise<NextResponse<any>> {
  try {
    const searchParams = request.nextUrl.searchParams;
    const paypalOrderId = searchParams.get("token");
    const status = searchParams.get("status");
    const lang = searchParams.get("lang") || "";
    const checkoutPath = lang ? `/${lang}/checkout` : "/checkout";

    if (!paypalOrderId) {
      return NextResponse.json(
        { success: false, error: "Missing PayPal order ID" },
        { status: 400 },
      );
    }

    if (status === "cancel") {
      return NextResponse.redirect(
        new URL(
          `${checkoutPath}?error=Payment cancelled by user`,
          request.nextUrl.origin,
        ),
      );
    }

    console.log(`💳 PayPal callback received for order: ${paypalOrderId}`);

    // ⚠️ À ce stade, nous devrions avoir les infos de la commande en session
    // Pour cet exemple, nous capturons sans les infos complètes
    // En production, stocke les infos dans Redis ou une session

    try {
      const paypalResponse = await capturePayPalOrder(paypalOrderId);

      if (paypalResponse.status === "COMPLETED") {
        console.log("✅ Payment captured successfully");

        const amount = parseFloat(
          paypalResponse.purchase_units[0].amount.value,
        );
        const currency = paypalResponse.purchase_units[0].amount.currency_code;

        // In this simplified flow, payment was captured successfully.
        // Back-end order persistence and email delivery should be handled by a dedicated server.
        return NextResponse.redirect(
          new URL(
            `/checkout?success=true&orderId=${paypalOrderId}`,
            request.nextUrl.origin,
          ),
        );
      } else {
        return NextResponse.redirect(
          new URL(
            `/checkout?error=Payment not completed. Status: ${paypalResponse.status}`,
            request.nextUrl.origin,
          ),
        );
      }
    } catch (captureError) {
      const message =
        captureError instanceof Error ? captureError.message : "Capture failed";
      return NextResponse.redirect(
        new URL(
          `/checkout?error=${encodeURIComponent(message)}`,
          request.nextUrl.origin,
        ),
      );
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("❌ PayPal callback error:", message);

    return NextResponse.redirect(
      new URL(
        `/checkout?error=${encodeURIComponent(message)}`,
        request.nextUrl.origin,
      ),
    );
  }
}
