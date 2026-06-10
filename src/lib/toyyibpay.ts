// ─── ToyyibPay API Client ───────────────────────────────────────────────────
// Docs: https://toyyibpay.com/

import { toyyibpayConfig, siteConfig } from "./config";

const { secretKey: TOYYIBPAY_SECRET_KEY, categoryCode: TOYYIBPAY_CATEGORY_CODE, baseUrl: BASE_URL } = toyyibpayConfig;

export interface ToyyibpayBillResult {
  /** BillCode returned by ToyyibPay */
  BillCode: string;
  /** The payment URL to redirect the customer to */
  PaymentURL: string;
  /** Any error message from ToyyibPay */
  error?: string;
}

/**
 * Create a ToyyibPay bill.
 *
 * @param params - Bill parameters
 * @returns The bill code and payment URL
 */
export async function createBill(params: {
  orderId: string;
  nama: string;
  telepon: string;
  email: string;
  jumlah: number; // in RM
  description: string;
  /** URL to redirect after successful payment */
  successUrl: string;
  /** URL to redirect if payment fails/cancelled */
  failedUrl: string;
}): Promise<ToyyibpayBillResult> {
  // ToyyibPay expects amount in cents (sen)
  const billAmount = Math.round(params.jumlah * 100);

  // Build callback URL using site config
  const callbackUrl = `${siteConfig.url}/api/payment/callback`;

  const body = new URLSearchParams({
    userSecretKey: TOYYIBPAY_SECRET_KEY,
    categoryCode: TOYYIBPAY_CATEGORY_CODE,
    billName: `Pesanan ${params.orderId}`,
    billDescription: params.description.slice(0, 100),
    billPriceSetting: "1", // 1 = fixed price
    billPayorInfo: "1", // 1 = show payor info
    billAmount: String(billAmount),
    billReturnUrl: params.successUrl,
    billCallbackUrl: callbackUrl,
    billExternalReferenceNo: params.orderId,
    billTo: params.nama,
    billEmail: params.email || "noreply@itqanmobile.my",
    billPhone: params.telepon,
    billExpiryDate: "",
    billExpiryDays: "7",
    enableDuitNowQR: "1",
    chargeDuitNowQR: "0",
  });

  try {
    const res = await fetch(`${BASE_URL}/index.php/api/createBill`, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: body.toString(),
    });

    if (!res.ok) {
      const text = await res.text();
      console.error("ToyyibPay createBill HTTP error:", res.status, text);
      return { BillCode: "", PaymentURL: "", error: `HTTP ${res.status}: ${text}` };
    }

    const data = await res.json();
    console.log("ToyyibPay createBill response:", JSON.stringify(data));

    if (!Array.isArray(data) || data.length === 0) {
      return { BillCode: "", PaymentURL: "", error: "Empty response from ToyyibPay" };
    }

    const bill = data[0];
    const billCode = bill.BillCode;

    if (!billCode) {
      return { BillCode: "", PaymentURL: "", error: bill.msg || "No BillCode returned" };
    }

    return {
      BillCode: billCode,
      PaymentURL: `${BASE_URL}/${billCode}`,
    };
  } catch (err) {
    console.error("ToyyibPay createBill exception:", err);
    return {
      BillCode: "",
      PaymentURL: "",
      error: err instanceof Error ? err.message : "Unknown error",
    };
  }
}

/**
 * Get bill payment status from ToyyibPay.
 */
export async function getBillStatus(billCode: string): Promise<{
  status: string;
  paymentAmount?: number;
  paymentDate?: string;
  referenceNo?: string;
}> {
  try {
    const body = new URLSearchParams({
      userSecretKey: TOYYIBPAY_SECRET_KEY,
      billCode,
    });

    const res = await fetch(`${BASE_URL}/index.php/api/getBillTransactions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: body.toString(),
    });

    if (!res.ok) {
      console.error("ToyyibPay getBillStatus HTTP error:", res.status);
      return { status: "error" };
    }

    const data = await res.json();
    if (!Array.isArray(data) || data.length === 0) {
      return { status: "unknown" };
    }

    const tx = data[0];
    return {
      status: tx.billPaymentStatus || "unknown",
      paymentAmount: tx.billPaymentAmount
        ? parseInt(tx.billPaymentAmount, 10) / 100
        : undefined,
      paymentDate: tx.billPaymentDate || undefined,
      referenceNo: tx.billExternalReferenceNo || undefined,
    };
  } catch (err) {
    console.error("ToyyibPay getBillStatus exception:", err);
    return { status: "error" };
  }
}
