/**
 * Service Invoice PDF - Génération de factures
 * Prêt pour production
 */

import PDFDocument from "pdfkit";

export interface InvoiceData {
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  amount: number;
  currency: string;
  items: Array<{ name: string; quantity: number; price: number }>;
  createdAt: Date;
}

/**
 * Génère une facture PDF et retourne un buffer
 */
export async function generateInvoicePdf(
  invoiceData: InvoiceData
): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({
        margin: 50,
      });

      const chunks: Buffer[] = [];

      doc.on("data", (chunk: Buffer) => chunks.push(chunk));
      doc.on("end", () => {
        const buffer = Buffer.concat(chunks);
        resolve(buffer);
      });
      doc.on("error", reject);

      // En-tête
      doc.fontSize(20).font("Helvetica-Bold").text("INVOICE", { align: "center" });
      doc.moveDown(0.5);

      // Infos entreprise
      doc
        .fontSize(10)
        .font("Helvetica")
        .text("Williams Mobil", { align: "center" })
        .text("Professional Rental Services", { align: "center" })
        .moveDown(1);

      // Numéro et date
      doc
        .fontSize(11)
        .text(`Invoice #: ${invoiceData.orderNumber}`, 50)
        .text(
          `Date: ${invoiceData.createdAt.toLocaleDateString()}`,
          50
        )
        .text(
          `Due Date: ${new Date(invoiceData.createdAt.getTime() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString()}`,
          50
        )
        .moveDown(1);

      // Client
      doc.fontSize(11).font("Helvetica-Bold").text("BILL TO:", 50);
      doc
        .font("Helvetica")
        .text(invoiceData.customerName, 50)
        .text(invoiceData.customerEmail, 50)
        .moveDown(1);

      // Tableau des items
      const tableTop = doc.y;
      const col1 = 50;
      const col2 = 300;
      const col3 = 380;
      const col4 = 480;
      const rowHeight = 25;

      // En-têtes du tableau
      doc
        .fontSize(11)
        .font("Helvetica-Bold")
        .text("Item", col1, tableTop)
        .text("Qty", col2, tableTop)
        .text("Unit Price", col3, tableTop)
        .text("Total", col4, tableTop);

      doc
        .moveTo(50, tableTop + 20)
        .lineTo(550, tableTop + 20)
        .stroke();

      // Lignes
      let currentY = tableTop + 30;
      let subtotal = 0;

      invoiceData.items.forEach((item) => {
        const total = item.quantity * item.price;
        subtotal += total;

        doc
          .fontSize(10)
          .font("Helvetica")
          .text(item.name.substring(0, 30), col1, currentY)
          .text(item.quantity.toString(), col2, currentY)
          .text(`$${item.price.toFixed(2)}`, col3, currentY)
          .text(`$${total.toFixed(2)}`, col4, currentY);

        currentY += rowHeight;
      });

      doc
        .moveTo(50, currentY)
        .lineTo(550, currentY)
        .stroke();

      currentY += 10;

      // Totaux
      doc
        .fontSize(11)
        .font("Helvetica")
        .text(`Subtotal: $${subtotal.toFixed(2)}`, 350, currentY);

      currentY += rowHeight;

      doc.text(`Tax (0%): $0.00`, 350, currentY);

      currentY += rowHeight;

      doc
        .font("Helvetica-Bold")
        .text(
          `TOTAL: $${invoiceData.amount.toFixed(2)} ${invoiceData.currency}`,
          350,
          currentY
        );

      currentY += rowHeight * 1.5;

      // Footer
      doc
        .fontSize(9)
        .font("Helvetica")
        .moveTo(50, currentY)
        .lineTo(550, currentY)
        .stroke()
        .text("Thank you for your business!", 50, currentY + 10, {
          align: "center",
        })
        .text(
          "For support, contact: support@williamsmobil.com",
          50,
          currentY + 25,
          { align: "center" }
        );

      doc.end();
    } catch (error) {
      console.error("❌ PDF generation error:", error);
      reject(error);
    }
  });
}
