// ─── Servis Page — Server Component ────────────────────────────────────────
import type { Metadata } from "next";
import { getServisList } from "@/lib/airtable";
import ServisClient from "./ServisClient";

export const metadata: Metadata = {
  title: "Servis",
  description:
    "Pembayaran bil elektrik, bil air, pendaftaran SIM, dan penggantian SIM.",
};

export const dynamic = "force-dynamic";

export default async function ServisPage() {
  const services = await getServisList();
  return <ServisClient services={services} />;
}
