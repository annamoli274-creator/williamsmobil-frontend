/**
 * Route API: POST /api/paypal/create-order
 * Crée une commande PayPal et retourne l'ID
 */

import { NextRequest, NextResponse } from "next/server";
import { createPayPalOrder } from "@/services/paypalService";
import { CreateOrderRequest, OrderResponse } from "@/types/paypal";

const PAYPAL_HOST = process.env.PAYPAL_BASE_URL?.includes("sandbox")
  ? "https://www.sandbox.paypal.com"
  : "https://www.paypal.com";

export async function POST(
  request: NextRequest,
): Promise<NextResponse<OrderResponse>> {
  try {
    if (!process.env.PAYPAL_CLIENT_ID || !process.env.PAYPAL_CLIENT_SECRET) {
      console.error("❌ PayPal env vars missing");
      return NextResponse.json(
        {
          success: false,
          error: "PayPal configuration missing",
        },
        { status: 500 },
      );
    }

    const body = (await request.json()) as CreateOrderRequest;

    if (!body.totalAmount || body.totalAmount <= 0) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid amount",
        },
        { status: 400 },
      );
    }

    if (!body.customerEmail || !body.customerName) {
      return NextResponse.json(
        {
          success: false,
          error: "Customer info required",
        },
        { status: 400 },
      );
    }

    if (!body.items || body.items.length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: "At least one item required",
        },
        { status: 400 },
      );
    }

    const lang = body.lang || "en";
    const returnUrl = `${process.env.NEXT_PUBLIC_FRONTEND_URL}/api/paypal/callback?lang=${encodeURIComponent(lang)}`;
    const cancelUrl = `${process.env.NEXT_PUBLIC_FRONTEND_URL}/${encodeURIComponent(lang)}/checkout?status=cancel`;

    console.log(`📝 Creating PayPal order for ${body.customerEmail}`);

    const paypalOrderId = await createPayPalOrder(
      body.totalAmount,
      body.currency,
      returnUrl,
      cancelUrl,
    );

    console.log(`✅ PayPal order created: ${paypalOrderId}`);

    return NextResponse.json(
      {
        success: true,
        paypalOrderId,
        approvalUrl: `${PAYPAL_HOST}/checkoutnow?token=${paypalOrderId}`,
        amount: body.totalAmount,
      },
      { status: 201 },
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("❌ Create order error:", message);

    return NextResponse.json(
      {
        success: false,
        error: message,
      },
      { status: 500 },
    );
  }
}
