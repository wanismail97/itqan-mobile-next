// ─── ToyyibPay Callback / Webhook ──────────────────────────────────────────
// POST /api/payment/callback
// ToyyibPay will call this endpoint after a payment is completed.
// We verify the payment status with ToyyibPay before updating Airtable.

import { NextRequest, NextResponse } from "next/server";
import { getBillStatus } from "@/lib/toyyibpay";
import {
  getOrderByOrderId,
  updateOrderStatus,
  getOrderItemsByOrderId,
  deductStockForOrderItems,
} from "@/lib/airtable";

export async function POST(request: NextRequest) {
  try {
    // ToyyibPay sends form-urlencoded data
    const formData = await request.formData();
    const billCode = formData.get("billcode") as string;
    const orderId = formData.get("order_id") as string;
    const status = formData.get("status") as string;
    const reason = formData.get("reason") as string;

    console.log("ToyyibPay callback received:", {
      billCode,
      orderId,
      status,
      reason,
    });

    if (!billCode && !orderId) {
      // Also try to get from query params (some ToyyibPay versions use GET)
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

    // Check if payment was successful
    // ToyyibPay status "1" means paid
    const isPaid = billStatus.status === "1" || status === "1";

    if (isPaid && targetOrderId && targetOrderId.startsWith("ITQ-")) {
      // ─── Check current order status BEFORE updating ────────────────
      // This prevents double-deduction if callback fires twice.
      const currentOrder = await getOrderByOrderId(targetOrderId);
      const wasAlreadyPaid = currentOrder?.Status === "Dibayar";

      // Update Airtable: Status → Dibayar, store BillCode as payment reference
      const success = await updateOrderStatus(targetOrderId, {
        Status: "Dibayar",
        "Rujukan Bayaran": billCode || "",
      });

      if (success) {
        console.log(`Order ${targetOrderId} marked as Dibayar in Airtable`);

        // ─── Stock Deduction (only if order was NOT already Dibayar) ─
        if (!wasAlreadyPaid) {
          console.log(`Deducting stock for order ${targetOrderId}...`);
          const items = await getOrderItemsByOrderId(targetOrderId);
          if (items.length > 0) {
            const deductionResult = await deductStockForOrderItems(items);
            if (deductionResult) {
              console.log(`Stock deducted successfully for order ${targetOrderId}`);
            } else {
              console.error(`Some stock deductions failed for order ${targetOrderId}`);
            }
          } else {
            console.log(`No order items found for ${targetOrderId} — nothing to deduct`);
          }
        } else {
          console.log(`Order ${targetOrderId} was already Dibayar — skipping stock deduction`);
        }
      } else {
        console.error(`Failed to update order ${targetOrderId} in Airtable`);
      }
    } else {
      console.log(
        `Payment not successful for ${targetOrderId}. Status: ${billStatus.status}`
      );
    }

    // ToyyibPay expects "OK" response to acknowledge callback
    return new NextResponse("OK", { status: 200 });
  } catch (err) {
    console.error("ToyyibPay callback exception:", err);
    // Still return OK to acknowledge receipt
    return new NextResponse("OK", { status: 200 });
  }
}

// ToyyibPay may also send GET callbacks
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const billCode = searchParams.get("billcode");
  const orderId = searchParams.get("order_id");
  const status = searchParams.get("status");

  console.log("ToyyibPay GET callback:", { billCode, orderId, status });

  if (status === "1" && orderId && orderId.startsWith("ITQ-")) {
    // ─── Check current order status BEFORE updating ──────────────────
    const currentOrder = await getOrderByOrderId(orderId);
    const wasAlreadyPaid = currentOrder?.Status === "Dibayar";

    const success = await updateOrderStatus(orderId, {
      Status: "Dibayar",
      "Rujukan Bayaran": billCode || "",
    });

    if (success) {
      console.log(`Order ${orderId} marked as Dibayar via GET callback`);

      // ─── Stock Deduction (only if order was NOT already Dibayar) ───
      if (!wasAlreadyPaid) {
        console.log(`Deducting stock for order ${orderId}...`);
        const items = await getOrderItemsByOrderId(orderId);
        if (items.length > 0) {
          const deductionResult = await deductStockForOrderItems(items);
          if (deductionResult) {
            console.log(`Stock deducted successfully for order ${orderId}`);
          } else {
            console.error(`Some stock deductions failed for order ${orderId}`);
          }
        } else {
          console.log(`No order items found for ${orderId} — nothing to deduct`);
        }
      } else {
        console.log(`Order ${orderId} was already Dibayar — skipping stock deduction`);
      }
    }
  }

  return new NextResponse("OK", { status: 200 });
}
