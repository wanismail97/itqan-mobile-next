// ─── API Route — Get product by SKU ────────────────────────────────────────
// Used by CheckoutClient to fetch a product that is not in the cart.
import { NextResponse } from "next/server";
import { getProductBySku } from "@/lib/airtable";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ sku: string }> }
) {
  const { sku } = await params;
  const product = await getProductBySku(sku);

  if (!product) {
    return NextResponse.json(
      { error: "Product not found" },
      { status: 404 }
    );
  }

  return NextResponse.json(product);
}
