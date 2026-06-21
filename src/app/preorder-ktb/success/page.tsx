// ─── Preorder KTB — Success Page (ISOLATED) ───────────────────────────────
// /preorder-ktb/success?ref=PRE-...
// Server component: reads the reference no and shows the order summary by
// reading directly from the isolated airtable-client.
import type { Metadata } from "next";
import Link from "next/link";
import { getPreorderByRef } from "@/lib/airtable-client";

export const metadata: Metadata = {
  title: "Pembayaran Berjaya — Pre-Order Kitab",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

interface Props {
  searchParams: Promise<{ ref?: string }>;
}

export default async function PreorderSuccessPage({ searchParams }: Props) {
  const { ref } = await searchParams;
  const record = ref ? await getPreorderByRef(ref).catch(() => null) : null;

  return (
    <main className="min-h-screen bg-[#f8fafc] py-8 px-4 sm:px-6 lg:px-8 font-inter antialiased">
      <div className="max-w-md mx-auto">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="bg-primary px-6 py-6 text-center">
            <div className="text-4xl mb-2">✅</div>
            <h1 className="text-white text-xl sm:text-2xl font-bold font-nunito">
              Pembayaran Berjaya
            </h1>
          </div>

          <div className="p-6">
            <p className="text-sm text-gray-600 text-center mb-5">
              Terima kasih! Pra-tempahan anda untuk{" "}
              <span className="font-semibold text-primary">
                Kitab Sunan Abi Daud
              </span>{" "}
              telah diterima.
            </p>

            <dl className="bg-gray-50 rounded-lg p-3 mb-5 text-xs divide-y divide-gray-100">
              <div className="flex justify-between py-1.5">
                <dt className="text-gray-500">No. Rujukan</dt>
                <dd className="font-mono font-bold text-primary text-right">
                  {ref || "—"}
                </dd>
              </div>
              {record && (
                <>
                  <div className="flex justify-between py-1.5">
                    <dt className="text-gray-500">Nama</dt>
                    <dd className="font-medium text-primary text-right">
                      {record.name || "—"}
                    </dd>
                  </div>
                  <div className="flex justify-between py-1.5">
                    <dt className="text-gray-500">Kuantiti</dt>
                    <dd className="font-medium text-primary text-right">
                      {record.quantity} set
                    </dd>
                  </div>
                  <div className="flex justify-between py-1.5">
                    <dt className="text-gray-500">Jumlah Bayaran</dt>
                    <dd className="font-bold text-accent text-right">
                      RM{record.amount.toLocaleString("ms-MY")}
                    </dd>
                  </div>
                  <div className="flex justify-between py-1.5">
                    <dt className="text-gray-500">Status</dt>
                    <dd className="font-semibold text-green-600 text-right">
                      {record.status}
                    </dd>
                  </div>
                </>
              )}
            </dl>

            <p className="text-[11px] text-gray-400 text-center mb-5">
              Sila simpan No. Rujukan ini untuk semakan. Resit pembayaran
              dihantar oleh Curlec ke email anda (jika diberikan).
            </p>

            {/* ✨ BUTTON 1: Kembali ke Pondok Gajah Mati ✨ */}
            <Link
              href="https://pondokgajahmati.com.my"
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full text-center py-3.5 rounded-xl bg-accent text-primary font-semibold text-sm hover:bg-accent/90 transition min-h-[48px] mb-3"
            >
              🏠 Kembali ke Laman Utama Pondok Gajah Mati
            </Link>

           
          </div>
        </div>
      </div>
    </main>
  );
}