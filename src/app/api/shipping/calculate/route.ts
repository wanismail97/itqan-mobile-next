// ─── POST /api/shipping/calculate — Calculate shipping fee ─────────────────
import { NextRequest, NextResponse } from "next/server";
import { getShippingRates } from "@/lib/airtable";

type ShippingTier = "Ringan" | "Pertengahan" | "Berat";

const TIER_PRIORITY: Record<ShippingTier, number> = {
  Ringan: 1,
  Pertengahan: 2,
  Berat: 3,
};

interface ShippingItem {
  shippingClass?: string | null;
  quantity: number;
}

/** Resolve shipping class; defaults to Pertengahan if missing (never under-charges). */
function resolveClass(item: ShippingItem): ShippingTier {
  const cls = item.shippingClass?.trim();
  if (cls === "Ringan" || cls === "Pertengahan" || cls === "Berat") return cls;
  return "Pertengahan";
}

/** Apply quantity-based tier escalation. */
function escalate(base: ShippingTier, qty: number): ShippingTier {
  if (base === "Ringan") {
    if (qty >= 16) return "Berat";
    if (qty >= 8) return "Pertengahan";
    return "Ringan";
  }
  if (base === "Pertengahan") {
    return qty >= 4 ? "Berat" : "Pertengahan";
  }
  return "Berat";
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const items: ShippingItem[] = body.items ?? [];

    // Client sends only ProductCartItems — reload/service excluded upstream.
    // Empty array = no physical products = no shipping.
    if (items.length === 0) {
      return NextResponse.json({ success: true, shippingFee: 0 });
    }

    // Highest effective tier across all items wins
    let highestTier: ShippingTier = "Ringan";
    for (const item of items) {
      const effective = escalate(resolveClass(item), item.quantity);
      if (TIER_PRIORITY[effective] > TIER_PRIORITY[highestTier]) {
        highestTier = effective;
      }
    }

    const rates = await getShippingRates();
    if (rates.length === 0) {
      return NextResponse.json({ success: true, shippingFee: 0 });
    }

    // Match by Jenis Berat; fall back to max rate if record missing
    const match = rates.find((r) => r["Jenis Berat"] === highestTier);
    const fee = match
      ? match.Rate
      : rates.reduce((max, r) => (r.Rate > max ? r.Rate : max), 0);

    return NextResponse.json({ success: true, shippingFee: fee });
  } catch (err) {
    console.error("Shipping calculation error:", err);
    return NextResponse.json(
      { success: false, error: "Ralat mengira caj penghantaran" },
      { status: 500 }
    );
  }
}
