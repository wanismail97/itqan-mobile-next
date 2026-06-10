// ─── POST /api/review/create — Submit a new product review ────────────────
// Saves to Airtable Reviews table with Status = "Pending".
import { NextRequest, NextResponse } from "next/server";
import { createReview } from "@/lib/airtable";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { sku, nama, telefon = "", rating, review } = body;

    // ─── Validation ───────────────────────────────────────────────────
    if (!sku || typeof sku !== "string") {
      return NextResponse.json(
        { success: false, error: "SKU produk diperlukan" },
        { status: 400 }
      );
    }

    if (!nama || typeof nama !== "string" || nama.trim().length === 0) {
      return NextResponse.json(
        { success: false, error: "Nama diperlukan" },
        { status: 400 }
      );
    }

    const ratingNum = Number(rating);
    if (!Number.isInteger(ratingNum) || ratingNum < 1 || ratingNum > 5) {
      return NextResponse.json(
        { success: false, error: "Rating mesti antara 1 hingga 5" },
        { status: 400 }
      );
    }

    if (!review || typeof review !== "string" || review.trim().length === 0) {
      return NextResponse.json(
        { success: false, error: "Review diperlukan" },
        { status: 400 }
      );
    }

    // ─── Save to Airtable ─────────────────────────────────────────────
    const success = await createReview(
      sku.trim(),
      nama.trim(),
      telefon.trim(),
      ratingNum,
      review.trim()
    );

    if (!success) {
      return NextResponse.json(
        { success: false, error: "Gagal menyimpan review. Sila cuba lagi." },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("POST /api/review/create error:", err);
    return NextResponse.json(
      { success: false, error: "Ralat dalaman pelayan" },
      { status: 500 }
    );
  }
}
