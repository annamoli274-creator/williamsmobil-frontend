/**
 * Service Email - Version PRO robuste (IONOS + Railway)
 */

import nodemailer from "nodemailer";

// 🔐 Vérification des variables d'environnement
if (
  !process.env.SMTP_HOST ||
  !process.env.SMTP_PORT ||
  !process.env.SMTP_USER ||
  !process.env.SMTP_PASS
) {
  throw new Error("❌ Variables SMTP manquantes");
}

// ✅ Transporteur SMTP
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: process.env.SMTP_SECURE === "true",

  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },

  tls: {
    rejectUnauthorized: false,
  },

  connectionTimeout: 10000, // 🔥 évite freeze
  greetingTimeout: 10000,
  socketTimeout: 15000,
});

// ✅ Vérification au démarrage (non bloquante)
transporter
  .verify()
  .then(() => {
    console.log("✅ SMTP prêt");
  })
  .catch((err) => {
    console.error("❌ SMTP erreur:", err);
  });

// 📦 Types
export interface EmailOptions {
  to: string;
  customerName: string;
  orderNumber: string;
  amount: number;
  currency: string;
  invoicePdfBuffer: Buffer;
}

// 🧾 Email confirmation commande
export async function sendOrderConfirmationEmail(
  options: EmailOptions,
): Promise<void> {
  const {
    to,
    customerName,
    orderNumber,
    amount = 0,
    currency,
    invoicePdfBuffer,
  } = options;

  const safeAmount = Number(amount) || 0;

  const htmlTemplate = `
  <!DOCTYPE html>
  <html>
    <body style="font-family: Arial; background:#f5f5f5; padding:20px;">
      <div style="max-width:600px;margin:auto;background:#fff;padding:30px;border-radius:8px;">
        <h2 style="color:#007bff;">✅ Order Confirmation</h2>

        <p>Hello <strong>${customerName}</strong>,</p>
        <p>Your payment has been successfully processed.</p>

        <div style="background:#f9f9f9;padding:15px;margin:20px 0;">
          <p><strong>Order:</strong> #${orderNumber}</p>
          <p><strong>Amount:</strong> ${safeAmount.toFixed(2)} ${currency}</p>
        </div>

        <p>Invoice attached.</p>

        <p style="text-align:right;font-weight:bold;color:#007bff;">
          Total: ${safeAmount.toFixed(2)} ${currency}
        </p>

        <p style="font-size:12px;color:#999;margin-top:30px;">
          Williams Mobil
        </p>
      </div>
    </body>
  </html>
  `;

  try {
    await transporter.sendMail({
      from: `"Williams Mobil" <${process.env.SMTP_USER}>`,
      to,
      subject: `Order Confirmation #${orderNumber}`,
      html: htmlTemplate,

      attachments: invoicePdfBuffer
        ? [
            {
              filename: `invoice-${orderNumber}.pdf`,
              content: invoicePdfBuffer,
              contentType: "application/pdf",
            },
          ]
        : [],
    });

    console.log(`📧 Email confirmation envoyé → ${to}`);
  } catch (error) {
    console.error("❌ Erreur email confirmation:", error);
    throw error;
  }
}

// ❌ Email échec paiement
export async function sendPaymentFailureEmail(
  to: string,
  customerName: string,
  reason?: string,
): Promise<void> {
  try {
    await transporter.sendMail({
      from: `"Williams Mobil" <${process.env.SMTP_USER}>`,
      to,
      subject: "Paiement échoué",
      html: `
        <p>Bonjour <strong>${customerName}</strong>,</p>
        <p>Votre paiement a échoué.</p>
        <p><strong>Raison :</strong> ${
          reason || "Veuillez contacter le support."
        }</p>
      `,
    });

    console.log(`📧 Email échec envoyé → ${to}`);
  } catch (error) {
    console.error("❌ Erreur email échec:", error);
    throw error;
  }
}
