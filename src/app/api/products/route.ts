export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { products as staticProducts } from "@/lib/products";

const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:5001";

export async function GET() {
  try {
    const backendRes = await fetch(`${BACKEND_URL}/api/products`, {
      cache: "no-store",
    });
    if (!backendRes.ok) {
      throw new Error(`Backend product fetch failed with ${backendRes.status}`);
    }
    const json = await backendRes.json();
    return NextResponse.json(json);
  } catch (error) {
    console.error("Error fetching products from backend:", error);
    return NextResponse.json({ products: staticProducts });
  }
}

// POST /api/products - Proxy sync request to backend
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const backendRes = await fetch(`${BACKEND_URL}/api/products`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const json = await backendRes.json();
    return NextResponse.json(json, { status: backendRes.status });
  } catch (error) {
    console.error("Error proxying product sync to backend:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
