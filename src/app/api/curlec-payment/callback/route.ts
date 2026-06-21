// ─── Curlec Payment — CALLBACK (ISOLATED) ─────────────────────────────────
// Path: /api/curlec-payment/callback
//
// Two entry points:
//   GET  → browser redirect from the Curlec payment link (callback_method=get).
//          Verifies the signature, updates Airtable, then 302-redirects the
//          user to /preorder-ktb/success or /preorder-ktb/failed.
//   POST → optional server-to-server webhook. Verifies X-Razorpay-Signature
//          (if CURLEC_WEBHOOK_SECRET is set), updates Airtable, returns 200.
//
// Fully isolated — does not touch the existing ToyyibPay callback.

import { NextRequest, NextResponse } from "next/server";
import {
  verifyPaymentLinkSignature,
  verifyWebhookSignature,
} from "@/lib/curlec-client";
import {
  updatePreorderStatusByRef,
  createPreorderRecord,
  malaysiaDate,
} from "@/lib/airtable-client";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function appBaseUrl(request: NextRequest): string {
  const host = request.headers.get("host");
  const proto = request.headers.get("x-forwarded-proto") || "http";
  if (host) return `${proto}://${host}`;
  return process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") || "http://localhost:3000";
}

// ─── GET: browser redirect after payment ────────────────────────────────────
export async function GET(request: NextRequest) {
  const sp = request.nextUrl.searchParams;
  const paymentId = sp.get("razorpay_payment_id") || "";
  const paymentLinkId = sp.get("razorpay_payment_link_id") || "";
  const referenceId = sp.get("razorpay_payment_link_reference_id") || "";
  const status = sp.get("razorpay_payment_link_status") || "";
  const signature = sp.get("razorpay_signature") || "";

  const base = appBaseUrl(request);
  const successUrl = `${base}/preorder-ktb/success?ref=${encodeURIComponent(referenceId)}`;
  const failedUrl = `${base}/preorder-ktb/failed?ref=${encodeURIComponent(referenceId)}`;

  const signatureValid = verifyPaymentLinkSignature({
    paymentLinkId,
    referenceId,
    status,
    paymentId,
    signature,
  });

  const isPaid = signatureValid && status === "paid";

  if (referenceId) {
    try {
      if (isPaid) {
        const updated = await updatePreorderStatusByRef(
          referenceId,
          "Paid",
          malaysiaDate()
        );
        if (updated) {
          console.log(`✅ Updated ${referenceId} to Paid`);
        } else {
          // Record missing (e.g. create step had failed) — user already paid,
          // so create a fallback record so the payment is not lost.
          console.warn(
            `⚠️ Record not found for ${referenceId}, creating fallback (Paid)...`
          );
          const fb = await createPreorderRecord({
            name: "Unknown (Callback)",
            phone: "0000000000",
            quantity: 1,
            donation: 0,
            amount: 100,
            referenceNo: referenceId,
            status: "Paid",
          });
          if (fb) {
            await updatePreorderStatusByRef(referenceId, "Paid", malaysiaDate());
            console.log(`✅ Fallback record created for ${referenceId}`);
          } else {
            console.error(`❌ Failed to create fallback for ${referenceId}`);
          }
        }
      } else {
        const updated = await updatePreorderStatusByRef(referenceId, "Cancelled");
        console.log(
          updated
            ? `✅ Updated ${referenceId} to Cancelled`
            : `⚠️ Record not found for ${referenceId} (Cancelled)`
        );
      }
    } catch (e) {
      // Never block the user redirect on an Airtable error.
      console.error("[curlec-callback GET] Airtable update error:", e);
    }
  }

  return NextResponse.redirect(isPaid ? successUrl : failedUrl, { status: 302 });
}

// ─── POST: optional server webhook ──────────────────────────────────────────
export async function POST(request: NextRequest) {
  try {
    const rawBody = await request.text();
    const signature = request.headers.get("x-razorpay-signature") || "";

    // Only enforce verification when a webhook secret is configured.
    if (process.env.CURLEC_WEBHOOK_SECRET) {
      const ok = verifyWebhookSignature(rawBody, signature);
      if (!ok) {
        return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
      }
    }

    const event = JSON.parse(rawBody || "{}");
    const entity =
      event?.payload?.payment_link?.entity || event?.payload?.payment?.entity || {};
    const referenceId: string =
      entity.reference_id || entity?.notes?.reference_no || "";
    const eventType: string = event?.event || "";

    if (referenceId) {
      if (eventType.includes("paid") || entity.status === "paid") {
        const updated = await updatePreorderStatusByRef(
          referenceId,
          "Paid",
          malaysiaDate()
        );
        if (!updated) {
          console.warn(
            `⚠️ [webhook] Record not found for ${referenceId}, creating fallback (Paid)...`
          );
          const fb = await createPreorderRecord({
            name: "Unknown (Webhook)",
            phone: "0000000000",
            quantity: 1,
            donation: 0,
            amount: 100,
            referenceNo: referenceId,
            status: "Paid",
          });
          if (fb) await updatePreorderStatusByRef(referenceId, "Paid", malaysiaDate());
        }
      } else if (
        eventType.includes("cancelled") ||
        entity.status === "cancelled" ||
        entity.status === "expired"
      ) {
        await updatePreorderStatusByRef(referenceId, "Cancelled");
      }
    }

    // Always acknowledge to stop Curlec retries.
    return NextResponse.json({ received: true }, { status: 200 });
  } catch (err) {
    console.error("[curlec-callback POST] exception:", err);
    // Still return 200 so the gateway doesn't hammer retries on our parse error.
    return NextResponse.json({ received: true }, { status: 200 });
  }
}
