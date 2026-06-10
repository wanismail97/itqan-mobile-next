// ─── GET /api/review/list?sku=XXXXX — Fetch approved reviews for a product ──
import { NextRequest, NextResponse } from "next/server";
import { getApprovedReviewsBySku } from "@/lib/airtable";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const sku = searchParams.get("sku");

    if (!sku) {
      return NextResponse.json(
        { success: false, error: "Parameter SKU diperlukan" },
        { status: 400 }
      );
    }

    const reviews = await getApprovedReviewsBySku(sku);

    // Calculate average rating
    let averageRating = 0;
    if (reviews.length > 0) {
      const total = reviews.reduce((sum, r) => sum + r.Rating, 0);
      averageRating = Math.round((total / reviews.length) * 10) / 10;
    }

    return NextResponse.json({
      success: true,
      reviews,
      averageRating,
      total: reviews.length,
    });
  } catch (err) {
    console.error("GET /api/review/list error:", err);
    return NextResponse.json(
      { success: false, error: "Ralat dalaman pelayan" },
      { status: 500 }
    );
  }
}
