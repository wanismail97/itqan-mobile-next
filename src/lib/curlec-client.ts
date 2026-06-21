// ─── Curlec Client — Preorder KTB ONLY (ISOLATED) ─────────────────────────
// Self-contained client for the Curlec (Razorpay-compatible) Payment Links API.
// Used EXCLUSIVELY by the /preorder-ktb feature. Does NOT touch the existing
// ToyyibPay integration (src/lib/toyyibpay.ts) in any way.
//
// API reference: Curlec mirrors the Razorpay v1 API.
//   POST {BASE_URL}/payment_links   → create a hosted payment link
//
// Env (isolated):
//   CURLEC_KEY_ID
//   CURLEC_KEY_SECRET
//   CURLEC_BASE_URL          (default https://api.curlec.com/v1)
//   CURLEC_WEBHOOK_SECRET    (optional — only for POST webhook verification)

import crypto from "crypto";

function getConfig() {
  const keyId = process.env.CURLEC_KEY_ID || "";
  const keySecret = process.env.CURLEC_KEY_SECRET || "";
  const baseUrl = process.env.CURLEC_BASE_URL || "https://api.curlec.com/v1";
  return { keyId, keySecret, baseUrl };
}

export interface CreatePaymentLinkInput {
  /** Amount in RM (major unit). Converted to sen internally. */
  amount: number;
  referenceNo: string;
  name: string;
  phone: string;
  email?: string;
  description: string;
  callbackUrl: string;
}

export interface CreatePaymentLinkResult {
  id?: string;
  shortUrl?: string;
  error?: string;
}

/** Create a Curlec payment link. Returns the hosted short_url to redirect to. */
export async function createPaymentLink(
  input: CreatePaymentLinkInput
): Promise<CreatePaymentLinkResult> {
  const { keyId, keySecret, baseUrl } = getConfig();
  if (!keyId || !keySecret) {
    return { error: "Curlec credentials not configured" };
  }

  const auth = Buffer.from(`${keyId}:${keySecret}`).toString("base64");
  const amountInSen = Math.round(input.amount * 100);

  const body: Record<string, unknown> = {
    amount: amountInSen,
    currency: "MYR",
    accept_partial: false,
    reference_id: input.referenceNo,
    description: input.description,
    customer: {
      name: input.name,
      contact: input.phone,
      ...(input.email ? { email: input.email } : {}),
    },
    notify: { sms: false, email: false },
    reminder_enable: false,
    callback_url: input.callbackUrl,
    callback_method: "get",
    notes: { reference_no: input.referenceNo },
  };

  try {
    const res = await fetch(`${baseUrl}/payment_links`, {
      method: "POST",
      headers: {
        Authorization: `Basic ${auth}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      const msg =
        (data?.error?.description as string) ||
        (data?.error?.reason as string) ||
        `Curlec API error (${res.status})`;
      console.error("[curlec] create link failed:", res.status, JSON.stringify(data));
      return { error: msg };
    }

    return { id: data.id as string, shortUrl: data.short_url as string };
  } catch (err) {
    console.error("[curlec] create link exception:", err);
    return { error: err instanceof Error ? err.message : "Curlec network error" };
  }
}

/**
 * Verify the signature appended to the browser redirect (callback_url) after a
 * payment link is paid. Razorpay/Curlec signs:
 *   payment_link_id + "|" + payment_link_reference_id + "|" +
 *   payment_link_status + "|" + payment_id
 * using HMAC-SHA256 with the key secret.
 */
export function verifyPaymentLinkSignature(params: {
  paymentLinkId: string;
  referenceId: string;
  status: string;
  paymentId: string;
  signature: string;
}): boolean {
  const { keySecret } = getConfig();
  if (!keySecret || !params.signature) return false;

  const payload = `${params.paymentLinkId}|${params.referenceId}|${params.status}|${params.paymentId}`;
  const expected = crypto
    .createHmac("sha256", keySecret)
    .update(payload)
    .digest("hex");

  try {
    return crypto.timingSafeEqual(
      Buffer.from(expected),
      Buffer.from(params.signature)
    );
  } catch {
    return false;
  }
}

/**
 * Verify a server-to-server webhook POST using the webhook secret
 * (X-Razorpay-Signature header = HMAC-SHA256(rawBody, webhookSecret)).
 * If no webhook secret is configured, returns false (caller decides fallback).
 */
export function verifyWebhookSignature(rawBody: string, signature: string): boolean {
  const secret = process.env.CURLEC_WEBHOOK_SECRET || "";
  if (!secret || !signature) return false;

  const expected = crypto
    .createHmac("sha256", secret)
    .update(rawBody)
    .digest("hex");

  try {
    return crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(signature));
  } catch {
    return false;
  }
}
