// ─── Produk Page — Product listing with search & filters ───────────────────
// Server Component: fetches all products and unique brand names from Airtable,
// then passes them to the client-side ProdukClient for interactive filtering.
import type { Metadata } from "next";
import { getAllProducts, getJenamaList } from "@/lib/airtable";
import ProdukClient from "./ProdukClient";

export const metadata: Metadata = {
  title: "Produk",
  description:
    "Koleksi telefon, aksesori, modem WiFi, SIM Kad dan reload prepaid terkini. Harga mampu milik, waranti rasmi.",
  openGraph: {
    title: "Produk | iTQAN Mobile",
    description:
      "Koleksi telefon, aksesori, modem WiFi, SIM Kad dan reload prepaid terkini.",
  },
};

export const dynamic = "force-dynamic";

export default async function ProdukPage() {
  const [products, jenamaList] = await Promise.all([
    getAllProducts(),
    getJenamaList(),
  ]);

  return <ProdukClient products={products} jenamaList={jenamaList} />;
}
