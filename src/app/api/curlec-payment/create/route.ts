// ─── Curlec Payment — CREATE (ISOLATED) ───────────────────────────────────
// POST /api/curlec-payment/create
//
// Flow (preorder-ktb ONLY):
//   1. Validate input (name, phone, email?, quantity, donation?)
//   2. Recompute amount server-side (never trust client total)
//   3. Generate Reference No: PRE-YYYYMMDD-XXXXX
//   4. Save to Airtable (Status: Pending) — isolated client
//   5. Create Curlec payment link — isolated client
//   6. Return { paymentUrl, referenceNo, orderId }
//
// This route is fully self-contained and shares NO state with the existing
// cart / checkout / ToyyibPay order flow.

import { NextRequest, NextResponse } from "next/server";
import { createPreorderRecord } from "@/lib/airtable-client";
import { createPaymentLink } from "@/lib/curlec-client";
import { PREORDER_BASE_PRICE } from "@/types/preorder";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// ─── Helpers (isolated to this feature) ──────────────────────────────────────
function isValidMalaysianPhone(phone: string): boolean {
  // Accept 01X-XXXXXXX with optional +60/60 prefix, spaces/dashes stripped.
  const cleaned = phone.replace(/[\s-]/g, "");
  return /^(\+?60|0)1\d{8,9}$/.test(cleaned);
}

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function generateReferenceNo(): string {
  const d = new Date().toLocaleString("sv-SE", { timeZone: "Asia/Kuala_Lumpur" });
  const ymd = d.split(" ")[0].replace(/-/g, "");
  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let rand = "";
  for (let i = 0; i < 5; i++) {
    rand += alphabet[Math.floor(Math.random() * alphabet.length)];
  }
  return `PRE-${ymd}-${rand}`;
}

function getBaseUrl(request: NextRequest): string {
  // Prefer the actual request origin (handles localhost:3000/3001 in dev),
  // fall back to configured env values.
  const origin = request.headers.get("origin");
  if (origin) return origin.replace(/\/$/, "");
  const host = request.headers.get("host");
  const proto = request.headers.get("x-forwarded-proto") || "http";
  if (host) return `${proto}://${host}`;
  return (
    process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ||
    "http://localhost:3000"
  );
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));
    const name = String(body.name || "").trim();
    const phone = String(body.phone || "").trim();
    const email = String(body.email || "").trim();
    const quantity = parseInt(String(body.quantity ?? "1"), 10);
    const donation = Number(body.donation ?? 0);

    // ─── Validation ───────────────────────────────────────────────────────
    if (name.length < 3) {
      return NextResponse.json(
        { success: false, error: "Nama mesti sekurang-kurangnya 3 aksara." },
        { status: 400 }
      );
    }
    if (!isValidMalaysianPhone(phone)) {
      return NextResponse.json(
        { success: false, error: "No telefon tidak sah." },
        { status: 400 }
      );
    }
    if (email && !isValidEmail(email)) {
      return NextResponse.json(
        { success: false, error: "Format email tidak sah." },
        { status: 400 }
      );
    }
    if (!Number.isFinite(quantity) || quantity < 1) {
      return NextResponse.json(
        { success: false, error: "Kuantiti minimum 1." },
        { status: 400 }
      );
    }
    const safeDonation =
      Number.isFinite(donation) && donation > 0 ? Math.round(donation * 100) / 100 : 0;

    // ─── Server-authoritative amount ───────────────────────────────────────
    const amount = PREORDER_BASE_PRICE * quantity + safeDonation;
    if (amount <= 0) {
      return NextResponse.json(
        { success: false, error: "Jumlah bayaran tidak sah." },
        { status: 400 }
      );
    }

    const referenceNo = generateReferenceNo();

    // ─── Explicit Number conversion BEFORE sending to Airtable ─────────────
    const qty = Number(quantity) || 1; // FORCE NUMBER
    const donasi = Number(safeDonation) || 0; // FORCE NUMBER
    const total = Number(amount) || 0; // FORCE NUMBER

    console.log("📤 Creating preorder:", {
      referenceNo,
      name,
      phone,
      email,
      quantity: qty,
      donation: donasi,
      total,
    });

    // ─── 1. Save to Airtable (Pending) ─────────────────────────────────────
    // If Airtable creation fails we MUST stop — otherwise the callback later
    // has no record to update (root cause of "record not found").
    const record = await createPreorderRecord({
      name: String(name || "").trim(),
      phone: String(phone || "").trim(),
      email: email ? String(email).trim() : undefined,
      quantity: qty,
      donation: donasi,
      amount: total,
      referenceNo: String(referenceNo),
      status: "Pending",
    });

    if (!record || !record.id) {
      console.error("❌ Airtable record creation failed — aborting before Curlec");
      return NextResponse.json(
        {
          success: false,
          error: "Gagal menyimpan maklumat. Sila cuba lagi.",
          referenceNo,
        },
        { status: 500 }
      );
    }

    const orderId = record.id;
    console.log(`✅ Airtable record created: ${orderId} — proceeding to Curlec`);

    // ─── 2. Create Curlec payment link ─────────────────────────────────────
    const baseUrl = getBaseUrl(request);
    const callbackUrl = `${baseUrl}/api/curlec-payment/callback`;
    const description = `Pre-Order Kitab Sunan Abi Daud (${quantity} set) — ${referenceNo}`;

    const link = await createPaymentLink({
      amount,
      referenceNo,
      name,
      phone,
      email: email || undefined,
      description,
      callbackUrl,
    });

    if (link.error || !link.shortUrl) {
      return NextResponse.json(
        {
          success: false,
          error: "Gagal mencipta pautan pembayaran. Sila cuba lagi.",
          referenceNo,
        },
        { status: 502 }
      );
    }

    return NextResponse.json({
      success: true,
      paymentUrl: link.shortUrl,
      referenceNo,
      orderId,
    });
  } catch (err) {
    console.error("[curlec-create] exception:", err);
    return NextResponse.json(
      { success: false, error: "Ralat dalaman pelayan." },
      { status: 500 }
    );
  }
}
