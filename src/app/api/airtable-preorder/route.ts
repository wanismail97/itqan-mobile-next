// ─── Airtable Preorder — CRUD (ISOLATED) ──────────────────────────────────
// Path: /api/airtable-preorder
//
//   POST → create a new Preorder record (Status: Pending)
//   PUT  → update Status (and Tarikh Bayaran) by Reference No
//   GET  → fetch a record by Reference No (?ref=PRE-...)
//
// Thin wrapper around the isolated airtable-client. Shares NO code with the
// existing src/lib/airtable.ts (cart/checkout/ToyyibPay).

import { NextRequest, NextResponse } from "next/server";
import {
  createPreorderRecord,
  getPreorderByRef,
  updatePreorderStatusByRef,
  malaysiaDate,
} from "@/lib/airtable-client";
import type { PreorderStatus } from "@/types/preorder";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const VALID_STATUS: PreorderStatus[] = ["Pending", "Paid", "Cancelled"];

// ─── GET /api/airtable-preorder?ref=PRE-... ─────────────────────────────────
export async function GET(request: NextRequest) {
  const ref = request.nextUrl.searchParams.get("ref")?.trim();
  if (!ref) {
    return NextResponse.json({ error: "Parameter 'ref' diperlukan" }, { status: 400 });
  }
  const record = await getPreorderByRef(ref);
  if (!record) {
    return NextResponse.json({ error: "Rekod tidak dijumpai" }, { status: 404 });
  }
  return NextResponse.json({ success: true, record });
}

// ─── POST /api/airtable-preorder ────────────────────────────────────────────
export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));
    const name = String(body.name || "").trim();
    const phone = String(body.phone || "").trim();
    const email = String(body.email || "").trim();
    const quantity = parseInt(String(body.quantity ?? "1"), 10);
    const amount = Number(body.amount);
    const referenceNo = String(body.referenceNo || "").trim();

    if (!name || !phone || !referenceNo || !Number.isFinite(amount)) {
      return NextResponse.json(
        { error: "Medan name, phone, referenceNo, amount diperlukan" },
        { status: 400 }
      );
    }

    const record = await createPreorderRecord({
      name,
      phone,
      email: email || undefined,
      quantity: Number.isFinite(quantity) && quantity > 0 ? quantity : 1,
      amount,
      referenceNo,
    });

    if (!record) {
      return NextResponse.json({ error: "Gagal mencipta rekod" }, { status: 500 });
    }
    return NextResponse.json({ success: true, record }, { status: 201 });
  } catch (err) {
    console.error("[airtable-preorder POST] exception:", err);
    return NextResponse.json({ error: "Ralat dalaman pelayan" }, { status: 500 });
  }
}

// ─── PUT /api/airtable-preorder ─────────────────────────────────────────────
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));
    const referenceNo = String(body.referenceNo || "").trim();
    const status = String(body.status || "").trim() as PreorderStatus;

    if (!referenceNo || !VALID_STATUS.includes(status)) {
      return NextResponse.json(
        { error: "referenceNo dan status (Pending|Paid|Cancelled) diperlukan" },
        { status: 400 }
      );
    }

    const tarikh = status === "Paid" ? malaysiaDate() : undefined;
    const ok = await updatePreorderStatusByRef(referenceNo, status, tarikh);
    if (!ok) {
      return NextResponse.json({ error: "Gagal mengemaskini rekod" }, { status: 500 });
    }
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[airtable-preorder PUT] exception:", err);
    return NextResponse.json({ error: "Ralat dalaman pelayan" }, { status: 500 });
  }
}
