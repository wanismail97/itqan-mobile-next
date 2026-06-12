// ─── Order Create API Route ─────────────────────────────────────────────────
// POST /api/order/create
//
// Unified endpoint that handles the entire order creation flow on the server:
//   1. Generate Order ID
//   2. Create Pesanan record in Airtable (Status: Menunggu Bayaran)
//   3. Create Item Pesanan records in Airtable
//   4. Create ToyyibPay bill
//   5. Return { orderId, paymentUrl } to the client
//
// This ensures Airtable API keys and Order ID generation NEVER execute in the browser.

import { NextRequest, NextResponse } from "next/server";
import { generateOrderId, createOrder, updateOrderStatus, validateStockForItems } from "@/lib/airtable";
import { createBill } from "@/lib/toyyibpay";
import type { PesananFields, ItemPesananFields } from "@/types/airtable";

interface OrderItemInput {
  label: string;
  detail: string;
  quantity: number;
  amount: number;
  variasi?: string;
}

interface CustomerInput {
  nama: string;
  telepon: string;
  email: string;
  alamat?: string;
  bandar?: string;
  poskod?: string;
  negeri?: string;
}

interface CreateOrderRequest {
  customer: CustomerInput;
  items: OrderItemInput[];
  total: number;
  orderType: string;
  description: string;
}

export async function POST(request: NextRequest) {
  try {
    const body: CreateOrderRequest = await request.json();
    const { customer, items, total, orderType, description } = body;

    // ─── Validate ───────────────────────────────────────────────────────
    if (!customer?.nama || !customer?.telepon) {
      return NextResponse.json(
        { error: "Nama dan Telefon diperlukan" },
        { status: 400 }
      );
    }

    if (!items || items.length === 0) {
      return NextResponse.json(
        { error: "Pesanan mesti mengandungi sekurang-kurangnya satu item" },
        { status: 400 }
      );
    }

    if (typeof total !== "number" || total <= 0) {
      return NextResponse.json(
        { error: "Jumlah pesanan tidak sah" },
        { status: 400 }
      );
    }

    // ─── Stock Validation ────────────────────────────────────────────
    // For product-type items, check if sufficient stock is available.
    // Only validate items whose detail field starts with "SKU:" (product items).
    const productItems = items
      .filter((i) => i.detail.startsWith("SKU:"))
      .map((i) => ({ SKU: i.detail, Kuantiti: i.quantity }));

    if (productItems.length > 0) {
      const stockErrors = await validateStockForItems(productItems);
      if (stockErrors.length > 0) {
        return NextResponse.json(
          { error: stockErrors.join(". ") },
          { status: 409 }
        );
      }
      console.log(`Stock validation passed for ${productItems.length} product item(s)`);
    }

    // ─── 1. Generate Order ID (server-only) ─────────────────────────────
    let oid: string;
    try {
      oid = await generateOrderId();
    } catch {
      // Fallback: generate locally if Airtable is unreachable
      const today = new Date();
      const yyyy = today.getFullYear();
      const mm = String(today.getMonth() + 1).padStart(2, "0");
      const dd = String(today.getDate()).padStart(2, "0");
      oid = `ITQ-${yyyy}${mm}${dd}-${String(Math.floor(Math.random() * 999)).padStart(3, "0")}`;
    }

    // ─── Malaysia timezone date ─────────────────────────────────────────
    const tarikhMalaysia = new Date()
      .toLocaleString("sv-SE", {
        timeZone: "Asia/Kuala_Lumpur",
      })
      .split(" ")[0];

    // ─── 2. Create Pesanan record ───────────────────────────────────────
    const orderFields: PesananFields = {
      "Order ID": oid,
      Nama: customer.nama.trim(),
      Telefon: customer.telepon.trim(),
      Email: customer.email.trim() || undefined,
      Jumlah: total,
      Status: "Menunggu Bayaran",
      "Jenis Pesanan": orderType || "",
      Tarikh: tarikhMalaysia,
      // ─── Address fields (optional — for physical products) ───────────
      Alamat: customer.alamat?.trim() || undefined,
      Poskod: customer.poskod?.trim() || undefined,
      Bandar: customer.bandar?.trim() || undefined,
      Negeri: customer.negeri?.trim() || undefined,
    };

    // 🐛 DEBUG: Log exact payload before sending to Airtable
    console.log("ORDER PAYLOAD");
    console.log(JSON.stringify(orderFields, null, 2));
    console.log("ORDER PAYLOAD FIELD TYPES:");
    for (const [key, value] of Object.entries(orderFields)) {
      console.log(`  ${key}: type=${typeof value}, value=${JSON.stringify(value)}`);
    }
    console.log(`  total (raw from request): type=${typeof total}, value=${JSON.stringify(total)}`);

    const orderResult = await createOrder(orderFields);
    if (!orderResult) {
      // 🐛 DEBUG: Include payload in error for diagnosis
      return NextResponse.json(
        {
          error: "Gagal menyimpan pesanan. Sila cuba lagi.",
          debug: {
            orderFields,
            totalType: typeof total,
            totalValue: total,
            totalJson: JSON.stringify(total),
            allFields: Object.fromEntries(
              Object.entries(orderFields).map(([k, v]) => [
                k,
                { type: typeof v, value: v, json: JSON.stringify(v) },
              ])
            ),
          },
        },
        { status: 500 }
      );
    }

    // ─── 3. Store Order Items JSON in Pesanan (deferred creation) ─────
    // Item Pesanan will be created after successful payment callback.
    const orderItemsPayload = JSON.stringify(
      items.map((item) => ({
        sku: item.detail,
        name: item.label,
        qty: item.quantity,
        price: item.amount,
        ...(item.variasi ? { variasi: item.variasi } : {}),
      }))
    );
    // Update the Pesanan record with Order Items JSON
    await updateOrderStatus(oid, { "Order Items": orderItemsPayload });

    // ─── 4. Create ToyyibPay bill ───────────────────────────────────────
    const billResult = await createBill({
      orderId: oid,
      nama: customer.nama.trim(),
      telepon: customer.telepon.trim(),
      email: customer.email.trim() || "noreply@itqanmobile.my",
      jumlah: total,
      description: description || `Pesanan ${oid}`,
      successUrl: `${process.env.NEXT_PUBLIC_SITE_URL || "https://itqanmobile.my"}/payment/success?orderId=${encodeURIComponent(oid)}`,
      failedUrl: `${process.env.NEXT_PUBLIC_SITE_URL || "https://itqanmobile.my"}/payment/failed?orderId=${encodeURIComponent(oid)}`,
    });

    if (billResult.error) {
      console.error("/api/order/create: ToyyibPay error:", billResult.error);
      return NextResponse.json(
        { error: "Gagal mencipta bil pembayaran: " + billResult.error },
        { status: 500 }
      );
    }

    // ─── 5. Return success ──────────────────────────────────────────────
    return NextResponse.json({
      success: true,
      orderId: oid,
      billCode: billResult.BillCode,
      paymentUrl: billResult.PaymentURL,
    });
  } catch (err) {
    console.error("/api/order/create exception:", err);
    return NextResponse.json(
      {
        error:
          err instanceof Error
            ? err.message
            : "Ralat dalaman pelayan",
      },
      { status: 500 }
    );
  }
}
