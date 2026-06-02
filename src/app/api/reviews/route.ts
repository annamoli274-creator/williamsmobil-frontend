export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const FALLBACK_FILE = path.join(process.cwd(), "public", "reviews_fallback.json");

function getFallbackReviews(): any[] {
  try {
    if (!fs.existsSync(FALLBACK_FILE)) {
      const initialReviews = [
        {
          id: 1,
          product_id: 0,
          user_name: "Jean Dupont",
          rating: 5,
          comment: "Très satisfait de mon achat. La qualité de fabrication est exceptionnelle.",
          created_at: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
        },
        {
          id: 2,
          product_id: 0,
          user_name: "Marie Martin",
          rating: 4,
          comment: "Superbe espace de vie, très moderne. Livraison rapide.",
          created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        },
        {
          id: 3,
          product_id: 0,
          user_name: "Pierre Dubois",
          rating: 5,
          comment: "Service après-vente au top, ils m'ont accompagné dans toute l'installation.",
          created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        },
      ];
      fs.writeFileSync(FALLBACK_FILE, JSON.stringify(initialReviews, null, 2), "utf8");
      return initialReviews;
    }
    const data = fs.readFileSync(FALLBACK_FILE, "utf8");
    return JSON.parse(data);
  } catch (err) {
    console.error("Error reading fallback reviews:", err);
    return [];
  }
}

function saveFallbackReview(reviewData: { product_id: number; user_name: string; rating: number; comment?: string }) {
  try {
    const reviews = getFallbackReviews();
    const newId = reviews.length > 0 ? Math.max(...reviews.map((r) => r.id || 0)) + 1 : 1;
    const newReview = {
      id: newId,
      product_id: reviewData.product_id,
      user_name: reviewData.user_name,
      rating: reviewData.rating,
      comment: reviewData.comment || "",
      created_at: new Date().toISOString(),
    };
    reviews.push(newReview);
    fs.writeFileSync(FALLBACK_FILE, JSON.stringify(reviews, null, 2), "utf8");
    return newReview;
  } catch (err) {
    console.error("Error saving fallback review:", err);
    throw err;
  }
}

export async function POST(req: Request) {
  try {
    const { product_id, user_name, rating, comment } = await req.json();

    if ((!product_id && product_id !== 0) || !user_name || !rating) {
      return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
    }

    const fallbackReview = saveFallbackReview({ product_id, user_name, rating, comment });
    return NextResponse.json(fallbackReview, { status: 201 });
  } catch (error) {
    console.error("Error creating review:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const product_id = searchParams.get("product_id");
    const reviews = getFallbackReviews();

    if (product_id) {
      const filtered = reviews.filter((r) => r.product_id === parseInt(product_id));
      return NextResponse.json(filtered);
    }

    const sorted = [...reviews].sort(
      (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
    );
    return NextResponse.json(sorted);
  } catch (error) {
    console.error("Error fetching reviews:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
