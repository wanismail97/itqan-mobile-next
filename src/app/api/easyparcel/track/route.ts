// ─── EasyParcel Shipment Tracking API ────────────────────────────────────────
// POST /api/easyparcel/track
//
// Accepts { orderId: "ITQ-20260613-015" }
// Returns shipment info from Penghantaran table + live tracking from EasyParcel.
//
// Flow:
// 1. Find shipment in Penghantaran table by Order ID
// 2. If not found → 404
// 3. If AWB is empty → return shipment info without tracking
// 4. Get access_token from EasyParcel Config
// 5. Call EasyParcel tracking_status API
// 6. Return combined result

import { NextRequest, NextResponse } from "next/server";
import {
  getShipmentByOrderId,
  getEasyParcelAccessToken,
} from "@/lib/airtable";

const EASYPARCEL_TRACKING_URL =
  "https://api.easyparcel.com/open_api/2025-12/shipment/tracking_status";

export async function POST(request: NextRequest) {
  try {
    // ─── 1. Parse request body ────────────────────────────────────────
    let orderId: string;
    try {
      const body = await request.json();
      orderId = body.orderId;
    } catch {
      return NextResponse.json(
        { success: false, message: "Invalid request body" },
        { status: 400 }
      );
    }

    if (!orderId || typeof orderId !== "string" || !orderId.trim()) {
      return NextResponse.json(
        { success: false, message: "Order ID diperlukan" },
        { status: 400 }
      );
    }

    orderId = orderId.trim();

    // ─── 2. Find shipment in Penghantaran table ────────────────────────
    const shipment = await getShipmentByOrderId(orderId);

    if (!shipment) {
      return NextResponse.json(
        { success: false, message: "Order tidak dijumpai" },
        { status: 404 }
      );
    }

    const { AWB, Kurier, Status, "Tarikh Dihantar": tarikhDihantar } = shipment;

    // ─── 3. If AWB is empty, return what we have ──────────────────────
    if (!AWB || !AWB.trim()) {
      return NextResponse.json({
        success: true,
        orderId,
        awb: AWB || "",
        kurier: Kurier || "",
        status: Status || "",
        tarikhDihantar: tarikhDihantar || "",
      });
    }

    // ─── 4. Get EasyParcel access token ───────────────────────────────
    const accessToken = await getEasyParcelAccessToken();

    if (!accessToken) {
      // Token unavailable — still return shipment info
      return NextResponse.json({
        success: true,
        orderId,
        awb: AWB,
        kurier: Kurier || "",
        status: Status || "",
        tarikhDihantar: tarikhDihantar || "",
      });
    }

    // ─── 5. Call EasyParcel tracking API ──────────────────────────────
    let tracking: unknown = undefined;

    try {
      const trackingRes = await fetch(EASYPARCEL_TRACKING_URL, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          awb_numbers: [AWB],
        }),
      });

      if (trackingRes.ok) {
        tracking = await trackingRes.json();
      } else {
        console.error(
          `EasyParcel tracking API error for AWB ${AWB}: ${trackingRes.status}`
        );
      }
    } catch (err) {
      console.error(
        `EasyParcel tracking API exception for AWB ${AWB}:`,
        err
      );
    }

    // ─── 6. Return combined result ────────────────────────────────────
    return NextResponse.json({
      success: true,
      orderId,
      awb: AWB,
      kurier: Kurier || "",
      status: Status || "",
      tarikhDihantar: tarikhDihantar || "",
      ...(tracking ? { tracking } : {}),
    });
  } catch (err) {
    console.error("EasyParcel track API exception:", err);
    return NextResponse.json(
      { success: false, message: "Ralat pelayan. Sila cuba lagi." },
      { status: 500 }
    );
  }
}