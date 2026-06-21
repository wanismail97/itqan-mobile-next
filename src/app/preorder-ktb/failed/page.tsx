// ─── Preorder KTB — Failed Page (ISOLATED) ────────────────────────────────
// /preorder-ktb/failed?ref=PRE-...
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Pembayaran Gagal — Pre-Order Kitab",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

interface Props {
  searchParams: Promise<{ ref?: string }>;
}

export default async function PreorderFailedPage({ searchParams }: Props) {
  const { ref } = await searchParams;

  return (
    <main className="min-h-screen bg-[#f8fafc] py-8 px-4 sm:px-6 lg:px-8 font-inter antialiased">
      <div className="max-w-md mx-auto">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="bg-red-500 px-6 py-6 text-center">
            <div className="text-4xl mb-2">❌</div>
            <h1 className="text-white text-xl sm:text-2xl font-bold font-nunito">
              Pembayaran Gagal
            </h1>
          </div>

          <div className="p-6">
            <p className="text-sm text-gray-600 text-center mb-5">
              Maaf, pembayaran anda tidak berjaya. Sila cuba lagi atau hubungi
              pihak penganjur untuk bantuan.
            </p>

            {ref && (
              <dl className="bg-gray-50 rounded-lg p-3 mb-5 text-xs divide-y divide-gray-100">
                <div className="flex justify-between py-1.5">
                  <dt className="text-gray-500">No. Rujukan</dt>
                  <dd className="font-mono font-bold text-primary text-right">
                    {ref}
                  </dd>
                </div>
              </dl>
            )}

            {/* ✨ BUTTON 1: Cuba Bayar Semula ✨ */}
            <Link
              href="https://itqanmobile.my/preorder-ktb"
              className="block w-full text-center py-3.5 rounded-xl bg-yellow-500 text-white font-semibold text-sm hover:bg-yellow-600 transition min-h-[48px] mb-3"
            >
              🔄 Cuba Bayar Semula
            </Link>

            {/* ✨ BUTTON 2: Kembali ke Pondok Gajah Mati ✨ */}
            <Link
              href="https://pondokgajahmati.com.my"
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full text-center py-3.5 rounded-xl bg-primary text-white font-semibold text-sm hover:bg-primary/90 transition min-h-[48px] mb-3"
            >
              🏠 Kembali ke Laman Utama Pondok Gajah Mati
            </Link>

            
          </div>
        </div>
      </div>
    </main>
  );
}