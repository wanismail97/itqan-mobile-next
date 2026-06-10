// ─── Telegram Notification Helper ────────────────────────────────────────
// Sends admin notifications via Telegram Bot API.
// Credentials are read from .env.local (TELEGRAM_BOT_TOKEN, TELEGRAM_CHAT_ID).

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN || "";
const CHAT_ID = process.env.TELEGRAM_CHAT_ID || "";

/**
 * Format a message for Telegram (supports limited HTML).
 * Telegram API: https://core.telegram.org/bots/api#sendmessage
 */
export async function sendTelegramMessage(text: string): Promise<boolean> {
  if (!BOT_TOKEN || !CHAT_ID) {
    console.warn("Telegram: Missing BOT_TOKEN or CHAT_ID. Notification skipped.");
    return false;
  }

  try {
    const url = `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`;
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: CHAT_ID,
        text,
        parse_mode: "HTML",
        disable_web_page_preview: true,
      }),
    });

    if (!res.ok) {
      const errText = await res.text();
      console.error("Telegram API error:", res.status, errText);
      return false;
    }

    return true;
  } catch (err) {
    console.error("Telegram sendMessage exception:", err);
    return false;
  }
}

/**
 * Build a paid order notification for Telegram.
 */
export function buildOrderPaidMessage(params: {
  orderId: string;
  nama: string;
  telepon: string;
  jumlah: number;
  items?: string; // e.g. "• Item A x1\n• Item B x2"
}): string {
  return [
    "🛒 <b>ORDER BARU DIBAYAR</b>",
    "",
    `<b>Order ID:</b> ${params.orderId}`,
    `<b>Nama:</b> ${params.nama}`,
    `<b>Telefon:</b> ${params.telepon}`,
    `<b>Jumlah:</b> RM${params.jumlah.toLocaleString("ms-MY", { minimumFractionDigits: 2 })}`,
    "<b>Status:</b> DIBAYAR ✅",
    ...(params.items
      ? ["", "<b>Produk:</b>", `\n${params.items}`]
      : []),
  ].join("\n");
}

/**
 * Build a low stock alert message for Telegram.
 */
export function buildLowStockMessage(
  level: "low" | "out",
  nama: string,
  sku: string,
  baki: number
): string {
  if (level === "out") {
    return [
      "🚨 <b>STOK HABIS</b>",
      "",
      `<b>Produk:</b> ${nama}`,
      `<b>SKU:</b> ${sku}`,
      `<b>Baki:</b> ${baki} unit`,
      "",
      "Produk tidak lagi boleh dijual sehingga stok ditambah.",
    ].join("\n");
  }
  return [
    "⚠️ <b>AMARAN STOK RENDAH</b>",
    "",
    `<b>Produk:</b> ${nama}`,
    `<b>SKU:</b> ${sku}`,
    `<b>Baki:</b> ${baki} unit`,
    "",
    "Sila tambah stok secepat mungkin.",
  ].join("\n");
}