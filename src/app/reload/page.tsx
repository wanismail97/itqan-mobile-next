// ─── Reload Page — Server Component ────────────────────────────────────────

import type { Metadata } from "next";
import { getReloadProviders } from "@/lib/airtable";
import ReloadClient from "./ReloadClient";

export const metadata: Metadata = {
  title: "Reload & eWallet",
  description:
    "Top up prabayar Hotlink, CelcomDigi, U Mobile, Tune Talk, Touch n Go, ShopeePay dan banyak lagi.",
};

export const dynamic = "force-dynamic";

export default async function ReloadPage() {
  const providers = await getReloadProviders();
  return <ReloadClient providers={providers} />;
}
