/**
 * Service Email - Envoi des confirmations de commande avec facture
 * Prêt pour production
 */

import nodemailer from "nodemailer";

// Configuration du transporteur
const transporter = nodemailer.createTransport({
  service: "gmail", // Ou tout autre service SMTP
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

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
  options: EmailOptions
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
          .container { max-width: 600px; margin: 20px auto; background: white; padding: 30px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
          .header { text-align: center; border-bottom: 2px solid #007bff; padding-bottom: 20px; margin-bottom: 20px; }
          .header h1 { color: #007bff; margin: 0; }
          .content { line-height: 1.6; color: #333; }
          .info-box { background: #f9f9f9; padding: 15px; border-left: 4px solid #007bff; margin: 20px 0; }
          .info-box p { margin: 5px 0; }
          .total { font-size: 18px; font-weight: bold; color: #007bff; text-align: right; margin-top: 20px; }
          .footer { text-align: center; color: #999; font-size: 12px; margin-top: 30px; border-top: 1px solid #eee; padding-top: 20px; }
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
              <p><strong>Status:</strong> <span style="color: green; font-weight: bold;">PAID</span></p>
            </div>
            
            <p>Your invoice is attached to this email. You can also download it from your account dashboard.</p>
            
            <p><strong>What's next?</strong></p>
            <ul>
              <li>We're preparing your order for shipment</li>
              <li>You'll receive a tracking number via email within 24-48 hours</li>
              <li>If you have any questions, contact us at support@williamsmobil.com</li>
            </ul>
            
            <div class="total">
              Total: ${amount.toFixed(2)} ${currency}
            </div>
          </div>
          
          <div class="footer">
            <p>Williams Mobil | Professional Rental Services</p>
            <p>© ${new Date().getFullYear()} All rights reserved.</p>
          </div>
        </div>
      </body>
    </html>
  `;

  try {
    await transporter.sendMail({
      from: `Williams Mobil <${process.env.SMTP_USER}>`,
      to,
      subject: `Order Confirmation #${orderNumber} - Williams Mobil`,
      html: htmlTemplate,
      attachments: [
        {
          filename: `invoice-${orderNumber}.pdf`,
          content: invoicePdfBuffer,
          contentType: "application/pdf",
        },
      ],
    });

    console.log(`✅ Confirmation email sent to ${to}`);
  } catch (error) {
    console.error("❌ Email service error:", error);
    throw error;
  }
}

/**
 * Envoie un email de failure de paiement
 */
export async function sendPaymentFailureEmail(
  to: string,
  customerName: string,
  reason?: string
): Promise<void> {
  const htmlTemplate = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: Arial, sans-serif; background-color: #f5f5f5; }
          .container { max-width: 600px; margin: 20px auto; background: white; padding: 30px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
          .header { text-align: center; border-bottom: 2px solid #dc3545; padding-bottom: 20px; margin-bottom: 20px; }
          .header h1 { color: #dc3545; margin: 0; }
          .content { line-height: 1.6; color: #333; }
          .warning-box { background: #fff3cd; padding: 15px; border-left: 4px solid #dc3545; margin: 20px 0; }
          .footer { text-align: center; color: #999; font-size: 12px; margin-top: 30px; border-top: 1px solid #eee; padding-top: 20px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>⚠️ Payment Failed</h1>
          </div>
          
          <div class="content">
            <p>Hello <strong>${customerName}</strong>,</p>
            
            <p>Unfortunately, your payment could not be processed.</p>
            
            <div class="warning-box">
              <p><strong>Reason:</strong> ${reason || "Please contact support for details"}</p>
            </div>
            
            <p><strong>What to do?</strong></p>
            <ul>
              <li>Check your payment information</li>
              <li>Try again at your earliest convenience</li>
              <li>Contact our support team if you continue to experience issues: support@williamsmobil.com</li>
            </ul>
          </div>
          
          <div class="footer">
            <p>Williams Mobil | Professional Rental Services</p>
          </div>
        </div>
      </body>
    </html>
  `;

  try {
    await transporter.sendMail({
      from: `Williams Mobil <${process.env.SMTP_USER}>`,
      to,
      subject: "Payment Failed - Please Try Again",
      html: htmlTemplate,
    });

    console.log(`✅ Failure email sent to ${to}`);
  } catch (error) {
    console.error("❌ Email service error:", error);
    throw error;
  }
}
