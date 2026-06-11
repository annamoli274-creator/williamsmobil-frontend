/**
 * Service Email - Envoi des confirmations de commande avec facture
 * Version corrigée pour IONOS + Railway (PRODUCTION READY)
 */

import nodemailer from "nodemailer";

// ✅ Transporteur SMTP IONOS (corrigé)
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST, // smtp.ionos.fr
  port: Number(process.env.SMTP_PORT), // 587
  secure: process.env.SMTP_SECURE === "true", // false

  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },

  tls: {
    rejectUnauthorized: false, // 🔥 évite les erreurs Railway
  },
});

// ✅ Vérification au démarrage
(async () => {
  try {
    await transporter.verify();
    console.log("✅ SMTP connecté !");
  } catch (error) {
    console.error("❌ SMTP erreur :", error);
  }
})();

export interface EmailOptions {
  to: string;
  customerName: string;
  orderNumber: string;
  amount: number;
  currency: string;
  invoicePdfBuffer: Buffer;
}

/**
 * Envoie une confirmation de commande avec facture PDF
 */
export async function sendOrderConfirmationEmail(
  options: EmailOptions,
): Promise<void> {
  const { to, customerName, orderNumber, amount, currency, invoicePdfBuffer } =
    options;

  const htmlTemplate = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: Arial, sans-serif; background-color: #f5f5f5; }
          .container { max-width: 600px; margin: 20px auto; background: white; padding: 30px; border-radius: 8px; }
          .header { text-align: center; border-bottom: 2px solid #007bff; padding-bottom: 20px; margin-bottom: 20px; }
          .header h1 { color: #007bff; margin: 0; }
          .content { line-height: 1.6; color: #333; }
          .info-box { background: #f9f9f9; padding: 15px; border-left: 4px solid #007bff; margin: 20px 0; }
          .total { font-size: 18px; font-weight: bold; color: #007bff; text-align: right; margin-top: 20px; }
          .footer { text-align: center; color: #999; font-size: 12px; margin-top: 30px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>✅ Order Confirmation</h1>
          </div>
          
          <div class="content">
            <p>Hello <strong>${customerName}</strong>,</p>
            <p>Thank you for your payment! Your order has been successfully processed.</p>
            
            <div class="info-box">
              <p><strong>Order Number:</strong> #${orderNumber}</p>
              <p><strong>Amount Paid:</strong> ${amount.toFixed(2)} ${currency}</p>
              <p><strong>Status:</strong> <span style="color: green;">PAID</span></p>
            </div>

            <p>Your invoice is attached to this email.</p>

            <div class="total">
              Total: ${amount.toFixed(2)} ${currency}
            </div>
          </div>

          <div class="footer">
            <p>Williams Mobil</p>
          </div>
        </div>
      </body>
    </html>
  `;

  try {
    await transporter.sendMail({
      from: `Williams Mobil <${process.env.SMTP_USER}>`,
      to,
      subject: `Order Confirmation #${orderNumber}`,
      html: htmlTemplate,
      attachments: [
        {
          filename: `invoice-${orderNumber}.pdf`,
          content: invoicePdfBuffer,
          contentType: "application/pdf",
        },
      ],
    });

    console.log(`✅ Email envoyé à ${to}`);
  } catch (error) {
    console.error("❌ Erreur envoi email :", error);
    throw error;
  }
}

/**
 * Email échec paiement
 */
export async function sendPaymentFailureEmail(
  to: string,
  customerName: string,
  reason?: string,
): Promise<void> {
  try {
    await transporter.sendMail({
      from: `Williams Mobil <${process.env.SMTP_USER}>`,
      to,
      subject: "Paiement échoué",
      html: `<p>Bonjour ${customerName},</p><p>Paiement échoué: ${reason || "Contactez le support."}</p>`,
    });

    console.log(`✅ Email échec envoyé à ${to}`);
  } catch (error) {
    console.error("❌ Erreur email :", error);
    throw error;
  }
}
