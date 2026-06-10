// ─── ToyyibPay Callback / Webhook ──────────────────────────────────────────
// POST /api/payment/callback
// ToyyibPay will call this endpoint after a payment is completed.
// We verify the payment status with ToyyibPay before updating Airtable.

import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { getBillStatus } from "@/lib/toyyibpay";
import {
  getOrderByOrderId,
  updateOrderStatus,
  getOrderItemsByOrderId,
  deductStockForOrderItems,
  getProductBySku,
} from "@/lib/airtable";
import {
  sendTelegramMessage,
  buildOrderPaidMessage,
  buildLowStockMessage,
} from "@/lib/telegram";
import { toyyibpayConfig } from "@/lib/config";

const SECRET_KEY = toyyibpayConfig.secretKey;

/** Verify callback hash: MD5(secretKey + status + order_id + refno + "ok") */
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
 * Only sends when stock reaches 0 or drops to ≤5.
 */
async function checkLowStock(
  items: { SKU: string; Kuantiti: number; "Nama Item"?: string }[]
): Promise<void> {
  for (const item of items) {
    const sku = extractSku(item.SKU);
    if (!sku || sku.startsWith("SERVIS-") || sku.startsWith("RELOAD-")) continue;

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
      console.error(`Telegram low stock check failed for SKU ${sku} (non-fatal):`, err);
    }
  }
}

export async function POST(request: NextRequest) {
  try {
    // ToyyibPay sends form-urlencoded data
    const formData = await request.formData();
    const billCode = formData.get("billcode") as string;
    const orderId = formData.get("order_id") as string;
    const status = formData.get("status") as string;
    const reason = formData.get("reason") as string;
    const refno = formData.get("refno") as string;
    const hash = formData.get("hash") as string;

    // ─── Hash Verification ──────────────────────────────────────────
    if (hash) {
      const isValid = verifyCallbackHash(hash, status || "", orderId || "", refno || "");
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

    if (!billCode && !orderId) {
      return NextResponse.json(
        { error: "Missing billcode or order_id" },
        { status: 400 }
      );
    }

    // Determine which Order ID to use
    const targetOrderId = orderId || billCode;

    // Verify the payment status with ToyyibPay API
    const billStatus = await getBillStatus(billCode || "");
    console.log("ToyyibPay bill status check:", billStatus);

    const isPaid = billStatus.status === "1" || status === "1";

    if (isPaid && targetOrderId && targetOrderId.startsWith("ITQ-")) {
      const currentOrder = await getOrderByOrderId(targetOrderId);
      const wasAlreadyPaid = currentOrder?.Status === "Dibayar";

      const success = await updateOrderStatus(targetOrderId, {
        Status: "Dibayar",
        "Rujukan Bayaran": billCode || "",
      });

      if (success) {
        console.log(`Order ${targetOrderId} marked as Dibayar in Airtable`);

        if (!wasAlreadyPaid) {
          console.log(`Deducting stock for order ${targetOrderId}...`);
          const items = await getOrderItemsByOrderId(targetOrderId);
          if (items.length > 0) {
            const deductionResult = await deductStockForOrderItems(items);
            if (deductionResult) {
              console.log(`Stock deducted successfully for order ${targetOrderId}`);

              // ─── Low stock alert ──────────────────────────────────────
              await checkLowStock(items);
            } else {
              console.error(`Some stock deductions failed for order ${targetOrderId}`);
            }
          }

          // ─── Telegram: Order Paid Notification ───────────────────────
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
              console.error("Telegram order notification failed (non-fatal):", err);
            }
          }
        } else {
          console.log(`Order ${targetOrderId} was already Dibayar — skipping`);
        }
      } else {
        console.error(`Failed to update order ${targetOrderId} in Airtable`);
      }
    } else {
      console.log(
        `Payment not successful for ${targetOrderId}. Status: ${billStatus.status}`
      );
    }

    return new NextResponse("OK", { status: 200 });
  } catch (err) {
    console.error("ToyyibPay callback exception:", err);
    return new NextResponse("OK", { status: 200 });
  }
}

// ToyyibPay may also send GET callbacks
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const billCode = searchParams.get("billcode");
  const orderId = searchParams.get("order_id");
  const status = searchParams.get("status");
  const refno = searchParams.get("refno");
  const hash = searchParams.get("hash");

  // ─── Hash Verification ──────────────────────────────────────────
  if (hash) {
    const isValid = verifyCallbackHash(hash, status || "", orderId || "", refno || "");
    if (!isValid) {
      console.error("GET callback hash verification FAILED");
      return NextResponse.json({ error: "Invalid hash" }, { status: 400 });
    }
    console.log("GET callback hash verification passed");
  }

  console.log("ToyyibPay GET callback:", { billCode, orderId, status });

  if (status === "1" && orderId && orderId.startsWith("ITQ-")) {
    const currentOrder = await getOrderByOrderId(orderId);
    const wasAlreadyPaid = currentOrder?.Status === "Dibayar";

    const success = await updateOrderStatus(orderId, {
      Status: "Dibayar",
      "Rujukan Bayaran": billCode || "",
    });

    if (success) {
      console.log(`Order ${orderId} marked as Dibayar via GET callback`);

      if (!wasAlreadyPaid) {
        console.log(`Deducting stock for order ${orderId}...`);
        const items = await getOrderItemsByOrderId(orderId);
        if (items.length > 0) {
          const deductionResult = await deductStockForOrderItems(items);
          if (deductionResult) {
            console.log(`Stock deducted successfully for order ${orderId}`);

            // ─── Low stock alert ──────────────────────────────────────
            await checkLowStock(items);
          } else {
            console.error(`Some stock deductions failed for order ${orderId}`);
          }
        }

        // ─── Telegram: Order Paid Notification ───────────────────────
        if (currentOrder) {
          const itemsList = items
            .map((i) => {
              const name = i["Nama Item"] || i.SKU;
              return `• ${name} x${i.Kuantiti}`;
            })
            .join("\n");
          const msg = buildOrderPaidMessage({
            orderId,
            nama: currentOrder.Nama,
            telepon: currentOrder.Telefon,
            jumlah: currentOrder.Jumlah,
            items: itemsList || undefined,
          });
          try {
            await sendTelegramMessage(msg);
            console.log(`Telegram order notification sent for ${orderId}`);
          } catch (err) {
            console.error("Telegram order notification failed (non-fatal):", err);
          }
        }
      } else {
        console.log(`Order ${orderId} was already Dibayar — skipping`);
      }
    }
  }

  return new NextResponse("OK", { status: 200 });
}