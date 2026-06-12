// ─── Receipt Page — /receipt/[orderId] ─────────────────────────────────────
// Read-only receipt view for a given Order ID.
// Fetches order data and items from Airtable. No writes.

import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getOrderByOrderId, getOrderItemsByOrderId } from "@/lib/airtable";
import ReceiptClient from "./ReceiptClient";

interface Props {
  params: Promise<{ orderId: string }>;
}

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { orderId } = await params;
  return {
    title: `Resit ${orderId} | iTQAN Mobile`,
    robots: { index: false, follow: false },
  };
}

export default async function ReceiptPage({ params }: Props) {
  const { orderId } = await params;

  const [order, items] = await Promise.all([
    getOrderByOrderId(orderId),
    getOrderItemsByOrderId(orderId),
  ]);

  if (!order) {
    notFound();
  }

  // ReceiptNo comes from Item Pesanan, not Pesanan
  const receiptNo =
    items.find((i) => i.ReceiptNo)?.ReceiptNo || `RCP-${orderId}`;

  return (
    <ReceiptClient order={order} items={items} receiptNo={receiptNo} />
  );
}