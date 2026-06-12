// ─── Utility Helpers ────────────────────────────────────────────────────────

/**
 * Format a number as Malaysian Ringgit string.
 * Example: 1599.50 -> "RM1,599.50"
 */
export function formatRM(amount: number): string {
  return `RM${amount.toLocaleString("ms-MY", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

/**
 * Generate a WhatsApp product inquiry message.
 */
export function waProductMessage(
  productName: string,
  sku: string,
  phone: string
): string {
  const text = encodeURIComponent(
    `Assalamualaikum.\nSaya ingin bertanya mengenai produk:\n${productName}\nSKU: ${sku}\nBoleh saya dapatkan maklumat lanjut?`
  );
  return `https://wa.me/${phone}?text=${text}`;
}

/**
 * Generate a WhatsApp checkout message.
 */
export function waCheckoutMessage(
  orderSummary: string,
  customerName: string,
  customerPhone: string,
  phone: string
): string {
  const text = encodeURIComponent(
    `Assalamualaikum.\nSaya ingin membuat pesanan:\n\n${orderSummary}\n\nNama: ${customerName}\nTelefon: ${customerPhone}\n\nTerima kasih.`
  );
  return `https://wa.me/${phone}?text=${text}`;
}
