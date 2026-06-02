/**
 * Service PayPal - Tous les appels à l'API PayPal
 * Prêt pour production
 */

const PAYPAL_BASE_URL =
  process.env.PAYPAL_BASE_URL || "https://api-m.paypal.com";

/**
 * Récupère un token d'accès PayPal
 */
export async function getPayPalAccessToken(): Promise<string> {
  const auth = Buffer.from(
    `${process.env.PAYPAL_CLIENT_ID}:${process.env.PAYPAL_CLIENT_SECRET}`,
  ).toString("base64");

  try {
    const response = await fetch(`${PAYPAL_BASE_URL}/v1/oauth2/token`, {
      method: "POST",
      headers: {
        Authorization: `Basic ${auth}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: "grant_type=client_credentials",
    });

    if (!response.ok) {
      throw new Error(`PayPal auth failed: ${response.statusText}`);
    }

    const data = (await response.json()) as { access_token: string };
    return data.access_token;
  } catch (error) {
    console.error("❌ PayPal getAccessToken error:", error);
    throw error;
  }
}

/**
 * Crée une commande PayPal
 */
export async function createPayPalOrder(
  amount: number,
  currency: string = "USD",
  returnUrl: string,
  cancelUrl: string,
): Promise<string> {
  const accessToken = await getPayPalAccessToken();

  const payload = {
    intent: "CAPTURE",
    purchase_units: [
      {
        amount: {
          currency_code: currency,
          value: amount.toFixed(2),
        },
      },
    ],
    application_context: {
      brand_name: "Williams Mobil",
      locale: "en-US",
      user_action: "PAY_NOW",
      return_url: returnUrl,
      cancel_url: cancelUrl,
    },
  };

  try {
    const response = await fetch(`${PAYPAL_BASE_URL}/v2/checkout/orders`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(`PayPal create order failed: ${JSON.stringify(error)}`);
    }

    const data = (await response.json()) as { id: string };
    console.log("✅ PayPal order created:", data.id);
    return data.id;
  } catch (error) {
    console.error("❌ PayPal createOrder error:", error);
    throw error;
  }
}

/**
 * Capture une commande PayPal
 */
export async function capturePayPalOrder(orderId: string): Promise<{
  id: string;
  status: string;
  payer: {
    email_address: string;
    name: { given_name: string; surname: string };
  };
  purchase_units: Array<{ amount: { value: string; currency_code: string } }>;
}> {
  const accessToken = await getPayPalAccessToken();

  try {
    const response = await fetch(
      `${PAYPAL_BASE_URL}/v2/checkout/orders/${orderId}/capture`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      },
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(`PayPal capture failed: ${JSON.stringify(error)}`);
    }

    const data = await response.json();
    console.log("✅ PayPal order captured:", data.id, "Status:", data.status);
    return data;
  } catch (error) {
    console.error("❌ PayPal captureOrder error:", error);
    throw error;
  }
}
