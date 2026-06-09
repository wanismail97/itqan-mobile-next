import { NextRequest, NextResponse } from "next/server";
import { createBill } from "@/lib/toyyibpay";
import { siteConfig } from "@/lib/config";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { orderId, nama, telepon, email, jumlah, description } = body;

    // Validate required fields
    if (!orderId || !nama || !telepon || jumlah == null) {
      return NextResponse.json(
        { error: "Missing required fields: orderId, nama, telepon, jumlah" },
        { status: 400 }
      );
    }

    if (typeof jumlah !== "number" || jumlah <= 0) {
      return NextResponse.json(
        { error: "Jumlah must be a positive number" },
        { status: 400 }
      );
    }

    // Build redirect URLs for ToyyibPay
    const siteUrl = siteConfig.url;
    const successUrl = `${siteUrl}/payment/success?orderId=${encodeURIComponent(orderId)}`;
    const failedUrl = `${siteUrl}/payment/failed?orderId=${encodeURIComponent(orderId)}`;

    const result = await createBill({
      orderId,
      nama,
      telepon,
      email: email || "noreply@itqanmobile.my",
      jumlah,
      description: description || `Pesanan ${orderId}`,
      successUrl,
      failedUrl,
    });

    if (result.error) {
      console.error("create-bill API: ToyyibPay error:", result.error);
      return NextResponse.json(
        { error: result.error },
        { status: 500 }
      );
    }

    return NextResponse.json({
      billCode: result.BillCode,
      paymentUrl: result.PaymentURL,
    });
  } catch (err) {
    console.error("create-bill API exception:", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Internal server error" },
      { status: 500 }
    );
  }
}
