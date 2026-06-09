// ─── Product Detail Page — /produk/[sku] ──────────────────────────────────
// Dynamic route using SKU field from Airtable.
// Generates SEO metadata dynamically based on product data.
// Returns 404 via notFound() if SKU does not exist in Airtable.
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getProductBySku } from "@/lib/airtable";
import { siteConfig } from "@/lib/config";
import ProdukDetailClient from "./ProdukDetailClient";

interface Props {
  params: Promise<{ sku: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { sku } = await params;
  const product = await getProductBySku(sku);

  if (!product) {
    return { title: "Produk Tidak Dijumpai" };
  }

  return {
    title: product.Nama,
    description: product.Deskripsi || `${product.Nama} — ${product.Jenama}`,
    openGraph: {
      title: `${product.Nama} | iTQAN Mobile`,
      description:
        product.Deskripsi?.slice(0, 160) ||
        `${product.Nama} — SKU: ${product.SKU}. Harga daripada RM${product["Harga RM"].toLocaleString("ms-MY")}.`,
      images: product["Gambar URL"] ? [{ url: product["Gambar URL"] }] : [],
    },
  };
}

export const dynamic = "force-dynamic";

export default async function ProdukDetailPage({ params }: Props) {
  const { sku } = await params;
  const product = await getProductBySku(sku);

  if (!product) {
    notFound();
  }

  return (
    <ProdukDetailClient
      product={product}
      waPhone={siteConfig.contact.phoneRaw}
    />
  );
}
