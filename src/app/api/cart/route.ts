import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export const dynamic = "force-dynamic";

function parseCartItems(raw?: string) {
  if (!raw) return [];
  try {
    return JSON.parse(decodeURIComponent(raw));
  } catch {
    return [];
  }
}

function serializeCartItems(items: any[]) {
  return encodeURIComponent(JSON.stringify(items));
}

export async function GET() {
  const cookieStore = await cookies();
  const items = parseCartItems(cookieStore.get("cart_items")?.value);
  return NextResponse.json({ items });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const incoming = body.item;
    if (!incoming) {
      return NextResponse.json({ error: "Missing item" }, { status: 400 });
    }

    const cookieStore = await cookies();
    const raw = cookieStore.get("cart_items")?.value;
    const items = parseCartItems(raw);

    const existingIndex = items.findIndex(
      (it: any) => it.productId === incoming.id || it.id === incoming.id,
    );
    if (existingIndex > -1) {
      items[existingIndex].quantity =
        (items[existingIndex].quantity || 0) + (incoming.quantity || 1);
    } else {
      items.push({
        id: incoming.id,
        productId: incoming.id,
        name: incoming.name,
        price: incoming.price,
        quantity: incoming.quantity || 1,
      });
    }

    const res = NextResponse.json({ items });
    res.cookies.set("cart_items", serializeCartItems(items), {
      path: "/",
      httpOnly: false,
    });
    return res;
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function DELETE() {
  const res = NextResponse.json({ ok: true });
  res.cookies.delete("cart_items");
  res.cookies.delete("cart_token");
  return res;
}
