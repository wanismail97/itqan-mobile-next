// ─── POST /api/shipping/calculate — Calculate shipping fee ─────────────────
import { NextRequest, NextResponse } from "next/server";
import { getShippingRates } from "@/lib/airtable";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { hasProducts } = body;

    // Digital-only orders — no shipping
    if (!hasProducts) {
      return NextResponse.json({ success: true, shippingFee: 0 });
    }

    const rates = await getShippingRates();

    if (rates.length === 0) {
      return NextResponse.json({ success: true, shippingFee: 0 });
    }

    // Use highest rate as default (customer may have mixed items)
    // The actual tier determination happens on the server
    const highestRate = rates.reduce(
      (max, r) => (r.Rate > max ? r.Rate : max),
      0
    );

    return NextResponse.json({ success: true, shippingFee: highestRate });
  } catch (err) {
    console.error("Shipping calculation error:", err);
    return NextResponse.json(
      { success: false, error: "Ralat mengira caj penghantaran" },
      { status: 500 }
    );
  }
}