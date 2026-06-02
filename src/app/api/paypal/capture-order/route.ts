/**
 * Route API: POST /api/paypal/capture-order
 * Capture le paiement PayPal et finalise la commande
 */

import { NextRequest, NextResponse } from "next/server";
import { capturePayPalOrder } from "@/services/paypalService";
import { CaptureOrderRequest, OrderResponse } from "@/types/paypal";

export async function POST(
  request: NextRequest,
): Promise<NextResponse<OrderResponse>> {
  try {
    const body = (await request.json()) as CaptureOrderRequest;

    // Validation
    if (!body.paypalOrderId) {
      return NextResponse.json(
        { success: false, error: "PayPal order ID required" },
        { status: 400 },
      );
    }

    if (!body.customerEmail || !body.customerName) {
      return NextResponse.json(
        { success: false, error: "Customer info required" },
        { status: 400 },
      );
    }

    console.log(`💳 Capturing PayPal order: ${body.paypalOrderId}`);

    const paypalResponse = await capturePayPalOrder(body.paypalOrderId);

    if (paypalResponse.status !== "COMPLETED") {
      console.error(
        `❌ PayPal capture failed. Status: ${paypalResponse.status}`,
      );
      return NextResponse.json(
        {
          success: false,
          error: `Payment not completed. Status: ${paypalResponse.status}`,
        },
        { status: 400 },
      );
    }

    const amountPaid = parseFloat(
      paypalResponse.purchase_units[0].amount.value,
    );

    console.log(`✅ Payment captured: $${amountPaid}`);

    // Optionally save the order to a backend service here
    // or send an email from your dedicated backend instead of from Next.
    // Si tu veux intégrer avec ton backend Express existant, décommente:
    /*
    try {
      const backendResponse = await fetch(
        `${process.env.BACKEND_URL}/api/orders`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            customerName: body.customerName,
            customerEmail: body.customerEmail,
            totalAmount: amountPaid,
            paymentMethod: "paypal",
            paypalOrderId: body.paypalOrderId,
            status: "paid",
            items: body.items,
          }),
        }
      );

      if (!backendResponse.ok) {
        console.warn("⚠️ Backend save warning:", backendResponse.statusText);
      }
    } catch (backendError) {
      console.warn("⚠️ Backend save error (non-blocking):", backendError);
    }
    */

    return NextResponse.json(
      {
        success: true,
        orderId: body.paypalOrderId,
        paypalOrderId: body.paypalOrderId,
        amount: amountPaid,
        status: "paid",
      },
      { status: 200 },
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("❌ Capture order error:", message);

    // Nothing else to do here; surface the error to the client.

    return NextResponse.json(
      {
        success: false,
        error: message,
      },
      { status: 500 },
    );
  }
}
