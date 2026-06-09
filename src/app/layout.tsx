import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/lib/cart-context";

// ─── Font ───────────────────────────────────────────────────────────────────
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

// ─── Metadata ────────────────────────────────────────────────────────────────
export const metadata: Metadata = {
  title: {
    default: "iTQAN Mobile - Telefon & Aksesori Terkini",
    template: "%s | iTQAN Mobile",
  },
  description:
    "iPhone, Samsung, SIM Kad, Modem WiFi & Reload Prepaid — semua ada di iTQAN Mobile. Waranti rasmi, penghantaran seluruh Malaysia.",
  keywords: [
    "iPhone",
    "Samsung",
    "SIM Kad",
    "Modem WiFi",
    "Reload Prepaid",
    "telefon Malaysia",
    "aksesori telefon",
    "iTQAN Mobile",
  ],
  openGraph: {
    title: "iTQAN Mobile - Telefon & Aksesori Terkini",
    description:
      "iPhone, Samsung, SIM Kad, Modem WiFi & Reload Prepaid — semua ada di iTQAN Mobile.",
    url: "https://itqanmobile.my",
    siteName: "iTQAN Mobile",
    locale: "ms_MY",
    type: "website",
  },
  robots: {
    index: true,
    follow: true,
  },
};

// ─── Root Layout ─────────────────────────────────────────────────────────────
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ms" className={`${inter.variable}`}>
      <body className="font-inter antialiased">
        <CartProvider>{children}</CartProvider>
      </body>
    </html>
  );
}
