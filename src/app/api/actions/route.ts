export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { cartToken, actionType } = await request.json();

    if (!cartToken || !actionType) {
      return NextResponse.json(
        { error: "Missing cartToken or actionType" },
        { status: 400 },
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error logging action:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({ actions: [] });
}
