const BACKEND_URL =
  process.env.BACKEND_URL ??
  (process.env.NODE_ENV === "production" ? undefined : "http://localhost:5001");

export async function POST(req: Request) {
  if (!BACKEND_URL) {
    console.error(
      "BACKEND_URL is not defined in frontend environment for /api/contacts",
    );
    return new Response(
      JSON.stringify({ error: "BACKEND_URL is not defined" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      },
    );
  }

  try {
    const body = await req.text();
    const backendRes = await fetch(`${BACKEND_URL}/api/contact`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body,
    });

    const responseText = await backendRes.text();
    return new Response(responseText, {
      status: backendRes.status,
      headers: {
        "Content-Type":
          backendRes.headers.get("content-type") ?? "application/json",
      },
    });
  } catch (error) {
    console.error("Erreur proxy email:", error);
    return new Response(JSON.stringify({ error: "Erreur serveur" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
