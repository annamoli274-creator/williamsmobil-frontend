export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { cookies } from "next/headers";

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

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ itemId: string }> }
) {
  try {
    const { itemId } = await params;
    const cookieStore = await cookies();
    const raw = cookieStore.get("cart_items")?.value;
    const items = parseCartItems(raw);
    const remainingItems = items.filter(
      (item: any) => item.productId !== itemId && item.id !== itemId,
    );

    const res = NextResponse.json({ items: remainingItems });
    res.cookies.set("cart_items", serializeCartItems(remainingItems), {
      path: "/",
      httpOnly: false,
    });
    return res;
  } catch (error) {
    console.error("Error removing cart item:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
