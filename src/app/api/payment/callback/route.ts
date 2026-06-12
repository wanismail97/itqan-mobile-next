// ─── ToyyibPay Callback / Webhook ──────────────────────────────────────────
// POST /api/payment/callback
// ToyyibPay calls this endpoint after a payment is completed.
// We verify hash, check payment status, update Airtable, deduct stock,
// send Telegram notifications, and alert on low stock.

import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { getBillStatus } from "@/lib/toyyibpay";
import {
  getOrderByOrderId,
  updateOrderStatus,
  getOrderItemsByOrderId,
  createOrderItems,
  deductStockForOrderItems,
  getProductBySku,
} from "@/lib/airtable";
import type { ItemPesananFields } from "@/types/airtable";
import {
  sendTelegramMessage,
  buildOrderPaidMessage,
  buildLowStockMessage,
} from "@/lib/telegram";
import { toyyibpayConfig } from "@/lib/config";

// ─── Constants ─────────────────────────────────────────────────────────────

const SECRET_KEY = toyyibpayConfig.secretKey;

// ─── Helpers ───────────────────────────────────────────────────────────────

/**
 * Verify ToyyibPay callback hash.
 * Formula: MD5(userSecretKey + status + order_id + refno + "ok")
 */
function verifyCallbackHash(
  receivedHash: string,
  status: string,
  order_id: string,
  refno: string
): boolean {
  const raw = SECRET_KEY + status + order_id + refno + "ok";
  const computed = crypto.createHash("md5").update(raw).digest("hex");
  const match = computed === receivedHash;

  if (!match) {
    console.warn(`Hash mismatch. Expected: ${computed}, Got: ${receivedHash}`);
  }

  return match;
}

/** Extract product SKU from item detail like "SKU: HUA-4GMW x2" */
function extractSku(raw: string): string {
  const trimmed = raw.trim();

  if (trimmed.startsWith("SKU: ")) {
    return trimmed.replace(/^SKU: /, "").split(" x")[0].trim();
  }

  return trimmed;
}

/**
 * Check stock levels after deduction and send Telegram alerts.
 * Only sends when stock reaches 0 or drops to ≤ 5.
 * Skips non-physical items (SERVIS- / RELOAD- prefixed).
 */
async function checkLowStock(
  items: { SKU: string; Kuantiti: number; "Nama Item"?: string }[]
): Promise<void> {
  for (const item of items) {
    const sku = extractSku(item.SKU);

    // Skip non-physical items
    if (!sku || sku.startsWith("SERVIS-") || sku.startsWith("RELOAD-")) {
      continue;
    }

    try {
      const product = await getProductBySku(sku);
      if (!product) continue;

      const baki = typeof product.Stok === "number" ? product.Stok : 0;

      if (baki === 0) {
        const msg = buildLowStockMessage("out", product.Nama, sku, baki);
        await sendTelegramMessage(msg);
        console.log(`Telegram: Stock out alert sent for ${sku}`);
      } else if (baki <= 5) {
        const msg = buildLowStockMessage("low", product.Nama, sku, baki);
        await sendTelegramMessage(msg);
        console.log(`Telegram: Low stock alert sent for ${sku} (${baki} left)`);
      }
    } catch (err) {
      console.error(
        `Telegram low stock check failed for SKU ${sku} (non-fatal):`,
        err
      );
    }
  }
}

/**
 * Send order paid notification and low stock alerts after a successful payment.
 * Only called when the order was NOT already marked as Dibayar (first callback).
 */
async function handleSuccessfulPayment(
  targetOrderId: string,
  currentOrder: {
    Nama: string;
    Telefon: string;
    Jumlah: number;
    "Order Items"?: string;
  } | null
): Promise<void> {
  // ─── Step 1: Check if Item Pesanan already exist (duplicate protection)
  let items = await getOrderItemsByOrderId(targetOrderId);

  if (items.length === 0 && currentOrder?.["Order Items"]) {
    // Create Item Pesanan from stored JSON (first callback only)
    try {
      const parsed = JSON.parse(currentOrder["Order Items"]) as {
        sku: string;
        name: string;
        qty: number;
        price: number;
        variasi?: string;
      }[];

      const receiptNo = `RCP-${targetOrderId}`;

      const itemRecords: ItemPesananFields[] = parsed.map((item) => ({
        "Order ID": targetOrderId,
        "Nama Item": item.name,
        SKU: item.sku,
        Kuantiti: item.qty,
        Harga: item.price,
        ...(item.variasi ? { Variasi: item.variasi } : {}),
        ReceiptNo: receiptNo,
        Kurier: "",
        "Tracking No": "",
        Dihantar: false,
      }));

      const created = await createOrderItems(itemRecords);
      if (created) {
        console.log(`Item Pesanan created for ${targetOrderId} (${parsed.length} items)`);
        // Re-fetch the items for deduction
        items = await getOrderItemsByOrderId(targetOrderId);
      } else {
        console.error(`Failed to create Item Pesanan for ${targetOrderId}`);
      }
    } catch (err) {
      console.error(`Failed to parse Order Items JSON for ${targetOrderId}:`, err);
    }
  }

  // ─── Step 2: Deduct stock ──────────────────────────────────────────
  if (items.length > 0) {
    console.log(`Deducting stock for order ${targetOrderId}...`);
    const deductionResult = await deductStockForOrderItems(items);

    if (deductionResult) {
      console.log(`Stock deducted successfully for order ${targetOrderId}`);

      // ─── Step 3: Low stock alerts ─────────────────────────────────
      await checkLowStock(items);
    } else {
      console.error(`Some stock deductions failed for order ${targetOrderId}`);
    }
  } else {
    console.log(
      `No order items found for ${targetOrderId} — nothing to deduct`
    );
  }

  // ─── Step 4: Telegram order notification ───────────────────────────
  if (currentOrder) {
    const itemsList = items
      .map((i) => {
        const name = i["Nama Item"] || i.SKU;
        return `• ${name} x${i.Kuantiti}`;
      })
      .join("\n");

    const msg = buildOrderPaidMessage({
      orderId: targetOrderId,
      nama: currentOrder.Nama,
      telepon: currentOrder.Telefon,
      jumlah: currentOrder.Jumlah,
      items: itemsList || undefined,
    });

    try {
      await sendTelegramMessage(msg);
      console.log(`Telegram order notification sent for ${targetOrderId}`);
    } catch (err) {
      console.error(
        "Telegram order notification failed (non-fatal):",
        err
      );
    }
  }
}

// ─── POST Handler ──────────────────────────────────────────────────────────

export async function POST(request: NextRequest) {
  try {
    // Parse ToyyibPay form-urlencoded callback data
    const formData = await request.formData();

    const billCode = formData.get("billcode") as string;
    const orderId = formData.get("order_id") as string;
    const status = formData.get("status") as string;
    const reason = formData.get("reason") as string;
    const refno = formData.get("refno") as string;
    const hash = formData.get("hash") as string;

    // ─── Hash Verification ────────────────────────────────────────────
    if (hash) {
      const isValid = verifyCallbackHash(
        hash,
        status || "",
        orderId || "",
        refno || ""
      );

      if (!isValid) {
        console.error("Callback hash verification FAILED");
        return NextResponse.json({ error: "Invalid hash" }, { status: 400 });
      }

      console.log("Callback hash verification passed");
    }

    console.log("ToyyibPay callback received:", {
      billCode,
      orderId,
      status,
      reason,
    });

    // Validate required fields
    if (!billCode && !orderId) {
      return NextResponse.json(
        { error: "Missing billcode or order_id" },
        { status: 400 }
      );
    }

    const targetOrderId = orderId || billCode;

    // Verify payment status with ToyyibPay API
    const billStatus = await getBillStatus(billCode || "");
    console.log("ToyyibPay bill status check:", billStatus);

    const isPaid = billStatus.status === "1" || status === "1";

    // Only process ITQ- prefixed orders that are paid
    if (!isPaid || !targetOrderId || !targetOrderId.startsWith("ITQ-")) {
      console.log(
        `Payment not successful for ${targetOrderId}. Status: ${billStatus.status}`
      );
      return new NextResponse("OK", { status: 200 });
    }

    // ─── Check for duplicate callbacks ─────────────────────────────────
    const currentOrder = await getOrderByOrderId(targetOrderId);
    const wasAlreadyPaid = currentOrder?.Status === "Dibayar";

    // ─── Update Airtable: Status → Dibayar ────────────────────────────
    const success = await updateOrderStatus(targetOrderId, {
      Status: "Dibayar",
      "Rujukan Bayaran": billCode || "",
    });

    if (!success) {
      console.error(`Failed to update order ${targetOrderId} in Airtable`);
      return new NextResponse("OK", { status: 200 });
    }

    console.log(`Order ${targetOrderId} marked as Dibayar in Airtable`);

    // ─── Process payment (only on first callback) ──────────────────────
    if (!wasAlreadyPaid) {
      await handleSuccessfulPayment(targetOrderId, currentOrder || null);
    } else {
      console.log(
        `Order ${targetOrderId} was already Dibayar — skipping deduction & notifications`
      );
    }

    return new NextResponse("OK", { status: 200 });
  } catch (err) {
    console.error("ToyyibPay callback exception:", err);
    // Always return OK to acknowledge receipt
    return new NextResponse("OK", { status: 200 });
  }
}

// ─── GET Handler ───────────────────────────────────────────────────────────

/** ToyyibPay may also send GET callbacks */
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);

  const billCode = searchParams.get("billcode");
  const orderId = searchParams.get("order_id");
  const status = searchParams.get("status");
  const refno = searchParams.get("refno");
  const hash = searchParams.get("hash");

  // ─── Hash Verification ──────────────────────────────────────────────
  if (hash) {
    const isValid = verifyCallbackHash(
      hash,
      status || "",
      orderId || "",
      refno || ""
    );

    if (!isValid) {
      console.error("GET callback hash verification FAILED");
      return NextResponse.json({ error: "Invalid hash" }, { status: 400 });
    }

    console.log("GET callback hash verification passed");
  }

  console.log("ToyyibPay GET callback:", { billCode, orderId, status });

  // Only process paid ITQ- orders
  if (status !== "1" || !orderId || !orderId.startsWith("ITQ-")) {
    return new NextResponse("OK", { status: 200 });
  }

  // ─── Check for duplicate callbacks ───────────────────────────────────
  const currentOrder = await getOrderByOrderId(orderId);
  const wasAlreadyPaid = currentOrder?.Status === "Dibayar";

  // ─── Update Airtable ────────────────────────────────────────────────
  const success = await updateOrderStatus(orderId, {
    Status: "Dibayar",
    "Rujukan Bayaran": billCode || "",
  });

  if (!success) {
    return new NextResponse("OK", { status: 200 });
  }

  console.log(`Order ${orderId} marked as Dibayar via GET callback`);

  // ─── Process payment (only on first callback) ────────────────────────
  if (!wasAlreadyPaid) {
    await handleSuccessfulPayment(orderId, currentOrder || null);
  } else {
    console.log(
      `Order ${orderId} was already Dibayar — skipping deduction & notifications`
    );
  }

  return new NextResponse("OK", { status: 200 });
}