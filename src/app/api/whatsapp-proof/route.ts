import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";
import os from "os";

/**
 * POST /api/whatsapp-proof
 * Receives a FormData payload containing:
 *   - file: image proof (png/jpg/jpeg)
 *   - fullName, email, total, paymentMethod
 *
 * Validates the file type, stores it temporarily, uploads to WhatsApp Cloud API,
 * then sends an image message with a caption containing the provided details.
 * Returns `{ success: true }` on success or a JSON error with appropriate status.
 */
export async function POST(request: Request) {
  try {
    const form = await request.formData();
    const file = form.get("file") as File | null;
    const fullName = form.get("fullName") as string | null;
    const email = form.get("email") as string | null;
    const total = form.get("total") as string | null;
    const paymentMethod = form.get("paymentMethod") as string | null;

    // Basic validation
    if (!file || !fullName || !email || !total || !paymentMethod) {
      return NextResponse.json({ success: false, error: "Missing required fields" }, { status: 400 });
    }
    if (!file.type.startsWith("image/")) {
      return NextResponse.json({ success: false, error: "Provided file is not an image" }, { status: 400 });
    }

    // Read file into buffer
    const buffer = Buffer.from(await file.arrayBuffer());
    const tmpFilePath = path.join(os.tmpdir(), `${Date.now()}_${file.name}`);
    await fs.writeFile(tmpFilePath, buffer);

    // Upload media to WhatsApp Cloud API
    const mediaForm = new FormData();
    mediaForm.append("file", new Blob([buffer], { type: file.type }), file.name);
    mediaForm.append("type", file.type);

    const mediaRes = await fetch(
      `https://graph.facebook.com/v19.0/${process.env.WHATSAPP_PHONE_NUMBER_ID}/media`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.WHATSAPP_TOKEN}`,
        },
        body: mediaForm as any, // Node's fetch accepts FormData
      }
    );
    if (!mediaRes.ok) {
      const err = await mediaRes.text();
      throw new Error(`WhatsApp media upload failed: ${err}`);
    }
    const mediaData = await mediaRes.json();
    const mediaId = mediaData.id;

    // Build caption
    const caption = `Preuve de paiement\nNom: ${fullName}\nEmail: ${email}\nTotal: ${total}\nMéthode: ${paymentMethod}`;

    // Send image message
    const msgRes = await fetch(
      `https://graph.facebook.com/v19.0/${process.env.WHATSAPP_PHONE_NUMBER_ID}/messages`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.WHATSAPP_TOKEN}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messaging_product: "whatsapp",
          to: process.env.WHATSAPP_RECIPIENT_NUMBER,
          type: "image",
          image: { id: mediaId, caption },
        }),
      }
    );
    if (!msgRes.ok) {
      const err = await msgRes.text();
      throw new Error(`WhatsApp message send failed: ${err}`);
    }

    // Cleanup temporary file
    await fs.unlink(tmpFilePath).catch(() => {});

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("WhatsApp proof error", error);
    return NextResponse.json({ success: false, error: error.message || "Internal error" }, { status: 500 });
  }
}

export const runtime = "nodejs"; // Ensure Node runtime for file system access
