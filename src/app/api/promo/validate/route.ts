// ─── POST /api/promo/validate — Validate a promo code ──────────────────────
import { NextRequest, NextResponse } from "next/server";
import { getPromoCode } from "@/lib/airtable";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { code, subtotal } = body;

    if (!code || typeof code !== "string") {
      return NextResponse.json(
        { success: false, error: "Kod promo diperlukan" },
        { status: 400 }
      );
    }

    const promo = await getPromoCode(code.trim().toUpperCase());

    console.log("DEBUG PROMO RECORD:", JSON.stringify(promo, null, 2));
    console.log("DEBUG DISCOUNT TYPE:", promo?.["Discount Type"], typeof promo?.["Discount Type"]);
    console.log("DEBUG DISCOUNT VALUE:", promo?.["Discount Value"], typeof promo?.["Discount Value"]);

    if (!promo) {
      return NextResponse.json(
        { success: false, error: "Kod promo tidak sah atau telah tamat tempoh" },
        { status: 404 }
      );
    }

    // Check min order
    if (promo["Min Order"] && subtotal < promo["Min Order"]) {
      return NextResponse.json(
        {
          success: false,
          error: `Pembelian minimum RM${promo["Min Order"]} diperlukan untuk kod promo ini`,
        },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      discountType: promo["Discount Type"],
      discountValue: promo["Discount Value"],
    });
  } catch (err) {
    console.error("Promo validation error:", err);
    return NextResponse.json(
      { success: false, error: "Ralat dalaman pelayan" },
      { status: 500 }
    );
  }
}