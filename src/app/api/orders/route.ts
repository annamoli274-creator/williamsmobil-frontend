export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";

const BACKEND_URL =
  process.env.BACKEND_URL ??
  process.env.NEXT_PUBLIC_BACKEND_URL ??
  (process.env.NODE_ENV === "production" ? undefined : "http://localhost:5001");

function createForwardHeaders(request: Request) {
  const headers = new Headers();
  const allowed = [
    "content-type",
    "accept",
    "cookie",
    "authorization",
    "referer",
    "user-agent",
  ];

  for (const [key, value] of request.headers.entries()) {
    if (allowed.includes(key.toLowerCase()) && value) {
      headers.set(key, value);
    }
  }

  return headers;
}

async function forwardRequest(request: Request) {
  if (!BACKEND_URL) {
    throw new Error(
      "BACKEND_URL or NEXT_PUBLIC_BACKEND_URL is not defined in frontend environment for /api/orders",
    );
  }

  const url = new URL(request.url);
  const query = url.searchParams.toString();
  const backendUrl = `${BACKEND_URL}/api/orders${query ? `?${query}` : ""}`;
  const headers = createForwardHeaders(request);
  const body = request.method === "GET" ? undefined : await request.blob();

  const backendRes = await fetch(backendUrl, {
    method: request.method,
    headers,
    body,
  });

  const text = await backendRes.text();
  let json = null;

  try {
    json = JSON.parse(text);
  } catch {
    json = null;
  }

  return { backendRes, text, json };
}

function buildResponse(backendRes: Response, text: string, json: unknown) {
  if (json !== null) {
    return NextResponse.json(json, { status: backendRes.status });
  }

  const contentType = backendRes.headers.get("content-type") ?? "text/plain";
  return new Response(text, {
    status: backendRes.status,
    headers: { "Content-Type": contentType },
  });
}

export async function POST(request: Request) {
  try {
    const { backendRes, text, json } = await forwardRequest(request);
    return buildResponse(backendRes, text, json);
  } catch (error) {
    console.error("Error proxying order request to backend:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Server error" },
      { status: 500 },
    );
  }
}

export async function GET(request: Request) {
  try {
    const { backendRes, text, json } = await forwardRequest(request);
    return buildResponse(backendRes, text, json);
  } catch (error) {
    console.error("Error proxying order request to backend:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Server error" },
      { status: 500 },
    );
  }
}

