// ─── Airtable API Configuration ────────────────────────────────────────────

export const airtableConfig = {
  apiKey: process.env.AIRTABLE_API_KEY || "",
  baseId: process.env.AIRTABLE_BASE_ID || "",
  tables: {
    produk: process.env.AIRTABLE_PRODUK_TABLE || "Produk",
    servis: process.env.AIRTABLE_SERVIS_TABLE || "Servis",
    pesanan: process.env.AIRTABLE_PESANAN_TABLE || "Pesanan",
    itemPesanan: process.env.AIRTABLE_ITEM_PESANAN_TABLE || "Item Pesanan",
  },
} as const;

// ─── ToyyibPay Configuration ────────────────────────────────────────────────

export const toyyibpayConfig = {
  secretKey: process.env.TOYYIBPAY_SECRET_KEY || "",
  categoryCode: process.env.TOYYIBPAY_CATEGORY_CODE || "",
  sandbox: process.env.TOYYIBPAY_SANDBOX === "true",
  baseUrl: process.env.TOYYIBPAY_SANDBOX === "true"
    ? "https://dev.toyyibpay.com"
    : "https://toyyibpay.com",
} as const;

// ─── Site Configuration ──────────────────────────────────────────────────────

export const siteConfig = {
  name: process.env.NEXT_PUBLIC_SITE_NAME || "iTQAN Mobile",
  url: process.env.NEXT_PUBLIC_SITE_URL || "https://itqanmobile.my",
  contact: {
    phone: "012-3340972",
    phoneRaw: "+60123340972",
    email: "hello@itqanmobile.my",
    address:
      "Operasi Secara Dalam Talian Seluruh Malaysia",
  },
  social: {
    facebook: "#",
    instagram: "#",
    tiktok: "#",
  },
} as const;

// ─── Navigation Links ────────────────────────────────────────────────────────

export const navLinks = [
  { label: "Home", href: "/" },
  { label: "Produk", href: "/produk" },
  { label: "Reload", href: "/reload" },
  { label: "Servis", href: "/servis" },
  { label: "Tentang Kami", href: "/tentang-kami" },
  { label: "Hubungi", href: "/hubungi" },
] as const;
