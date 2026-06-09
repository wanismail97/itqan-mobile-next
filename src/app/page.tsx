// ─── Home Page — iTQAN Mobile Landing ─────────────────────────────────────
// Data is fetched from Airtable at request time (SSR / Dynamic).
// If you want ISR (static with revalidation), remove this line:
export const dynamic = "force-dynamic";

import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import StickyButtons from "@/components/layout/StickyButtons";
import HeroSection from "@/components/sections/HeroSection";
import CategoryGrid from "@/components/sections/CategoryGrid";
import FeaturedProducts from "@/components/sections/FeaturedProducts";
import AccessoriesGrid from "@/components/sections/AccessoriesGrid";
import WhyChooseUs from "@/components/sections/WhyChooseUs";
import HowToOrder from "@/components/sections/HowToOrder";
import Testimonials from "@/components/sections/Testimonials";
import { getFeaturedProducts, getAccessories } from "@/lib/airtable";

export default async function HomePage() {
  // ─── Fetch data in parallel ────────────────────────────────────────────
  const [featuredProducts, accessories] = await Promise.all([
    getFeaturedProducts(),
    getAccessories(),
  ]);

  return (
    <>
      {/* ─── Navbar ─────────────────────────────────────────────────── */} 
      <Navbar />

      {/* ─── Hero ──────────────────────────────────────────────────── */} 
      <HeroSection />

      {/* ─── Category Grid (static — not from Airtable) ────────────── */}
      <CategoryGrid />

      {/* ⚠️ NOTE: Produk Terlaris & Aksesori share the same bg color.
          They are rendered as two separate sections but visually appear
          as a single continuous block. */}

      {/* ─── Featured Products ─────────────────────────────────────── */} 
      <FeaturedProducts products={featuredProducts} />

      {/* ─── Accessories ───────────────────────────────────────────── */} 
      <AccessoriesGrid accessories={accessories} />

      {/* ─── Why Choose Us ─────────────────────────────────────────── */} 
      <WhyChooseUs />

      {/* ─── How to Order ──────────────────────────────────────────── */} 
      <HowToOrder />

      {/* ─── Testimonials ──────────────────────────────────────────── */} 
      <Testimonials />

      {/* ─── Footer ────────────────────────────────────────────────── */} 
      <Footer />

      {/* ─── Sticky Buttons ────────────────────────────────────────── */} 
      <StickyButtons />
    </>
  );
}
