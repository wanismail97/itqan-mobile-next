// ─── Polisi Pemulangan Wang — Polisi Bayaran Balik iTQAN Mobile ──────────

import type { Metadata } from "next";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import StickyButtons from "@/components/layout/StickyButtons";

export const metadata: Metadata = {
  title: "Polisi Pemulangan Wang | iTQAN Mobile",
  description:
    "Polisi pemulangan wang iTQAN Mobile — syarat dan proses bayaran balik untuk produk fizikal dan digital.",
};

export default function PolisiPemulanganWangPage() {
  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-[#f8fafc]">
        {/* ─── Hero Section ──────────────────────────────────────────────── */}
        <section className="bg-primary text-white pt-28 pb-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-3xl md:text-5xl font-bold mb-4">
              Polisi Pemulangan Wang
            </h1>
            <p className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto">
              Maklumat tentang proses bayaran balik dan pemulangan produk di iTQAN Mobile.
            </p>
          </div>
        </section>

        {/* ─── Content ───────────────────────────────────────────────────── */}
        <section className="py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-white rounded-2xl p-8 md:p-12 shadow-sm space-y-8 text-gray-600 leading-relaxed">

              <p>
                Polisi ini menerangkan syarat dan proses pemulangan wang (&ldquo;refund&rdquo;) oleh
                <strong> Seteguh Gading Enterprise</strong> (SSM: TR0341143-D), menjalankan perniagaan sebagai
                <strong> iTQAN Mobile</strong>. Dengan membuat pembelian di laman web kami, anda bersetuju dengan
                polisi ini.
              </p>

              {/* ─── Produk Fizikal ──────────────────────────────────────── */}
              <div>
                <h2 className="text-xl font-bold text-primary mb-3">1. Pemulangan Produk Fizikal</h2>

                <h3 className="text-lg font-semibold text-primary mt-4 mb-2">1.1 Tempoh Pemulangan</h3>
                <p>
                  Anda boleh memulangkan produk fizikal dalam tempoh <strong>7 hari</strong> dari tarikh penerimaan
                  produk. Selepas tempoh ini, kami tidak dapat menerima pemulangan.
                </p>

                <h3 className="text-lg font-semibold text-primary mt-4 mb-2">1.2 Syarat Pemulangan</h3>
                <p>Produk yang dipulangkan mestilah memenuhi syarat berikut:</p>
                <ul className="list-disc pl-6 space-y-2 mt-2">
                  <li>Produk dalam keadaan asal, tidak digunakan, dan tidak rosak.</li>
                  <li>Kotak, pembungkusan, dan semua aksesori asal masih lengkap.</li>
                  <li>Resit atau bukti pembelian disertakan.</li>
                  <li>Pembalut keselamatan (security seal) tidak ditanggalkan.</li>
                </ul>

                <h3 className="text-lg font-semibold text-primary mt-4 mb-2">1.3 Proses Pemulangan</h3>
                <p>Untuk memulangkan produk, sila ikut langkah berikut:</p>
                <ol className="list-decimal pl-6 space-y-2 mt-2">
                  <li>Hubungi kami melalui WhatsApp di <strong>012-3340972</strong> dalam tempoh 7 hari penerimaan.</li>
                  <li>Sertakan gambar produk dan pembungkusan asal.</li>
                  <li>Kami akan memberikan alamat penghantaran pemulangan.</li>
                  <li>Kos penghantaran pemulangan ditanggung oleh pelanggan.</li>
                  <li>Setelah produk diterima dan diperiksa, bayaran balik akan diproses dalam <strong>7-14 hari bekerja</strong>.</li>
                </ol>

                <h3 className="text-lg font-semibold text-primary mt-4 mb-2">1.4 Bayaran Balik</h3>
                <p>
                  Bayaran balik akan dibuat melalui kaedah pembayaran asal. Sila ambil makluman bahawa caj transaksi
                  pembayaran mungkin tidak dikembalikan oleh pihak bank atau ToyyibPay.
                </p>
              </div>

              {/* ─── Produk Digital ──────────────────────────────────────── */}
              <div>
                <h2 className="text-xl font-bold text-primary mb-3">2. Produk Digital & Perkhidmatan</h2>

                <h3 className="text-lg font-semibold text-primary mt-4 mb-2">2.1 Produk Digital</h3>
                <p>
                  Produk digital termasuk tetapi tidak terhad kepada: topup prabayar, pelan data, e-wallet reload,
                  dan baucar digital adalah <strong>tidak boleh dipulangkan</strong> setelah transaksi selesai
                  diproses.
                </p>

                <h3 className="text-lg font-semibold text-primary mt-4 mb-2">2.2 Kesilapan Teknikal</h3>
                <p>
                  Jika transaksi gagal diproses tetapi pembayaran telah dibuat, bayaran balik penuh akan diberikan.
                  Sila hubungi kami dengan bukti pembayaran dan kami akan menyelesaikan isu tersebut secepat mungkin.
                </p>
              </div>

              {/* ─── Tidak Layak ─────────────────────────────────────────── */}
              <div>
                <h2 className="text-xl font-bold text-primary mb-3">3. Kes Yang Tidak Layak Dipulangkan</h2>
                <p>Permohonan pemulangan wang akan ditolak dalam keadaan berikut:</p>
                <ul className="list-disc pl-6 space-y-2 mt-2">
                  <li>Melebihi tempoh 7 hari dari tarikh penerimaan produk.</li>
                  <li>Produk telah digunakan, rosak akibat kecuaian pelanggan, atau tidak lengkap.</li>
                  <li>Produk digital yang telah berjaya diproses dan dihantar.</li>
                  <li>Produk yang dibeli semasa promosi khas atau jualan akhir (kecuali dinyatakan sebaliknya).</li>
                  <li>Pembelian yang dibuat melalui perundingan khas tanpa invois standard.</li>
                </ul>
              </div>

              {/* ─── Proses ───────────────────────────────────────────────── */}
              <div>
                <h2 className="text-xl font-bold text-primary mb-3">4. Proses Tuntutan</h2>
                <p>Untuk membuat tuntutan pemulangan wang:</p>
                <ol className="list-decimal pl-6 space-y-2 mt-2">
                  <li>Hubungi kami melalui WhatsApp: <strong>012-3340972</strong></li>
                  <li>Berikan: Nama penuh, nombor pesanan, tarikh pembelian, dan sebab pemulangan.</li>
                  <li>Lampirkan bukti pembayaran dan gambar produk (jika berkaitan).</li>
                  <li>Kami akan menyemak tuntutan anda dalam tempoh <strong>3 hari bekerja</strong>.</li>
                  <li>Keputusan akan dimaklumkan melalui WhatsApp atau emel.</li>
                </ol>
              </div>

              {/* ─── Pengecualian ─────────────────────────────────────────── */}
              <div>
                <h2 className="text-xl font-bold text-primary mb-3">5. Pengecualian & Had Liabiliti</h2>
                <p>
                  iTQAN Mobile / Seteguh Gading Enterprise tidak bertanggungjawab terhadap sebarang kelewatan dalam
                  pemprosesan bayaran balik yang disebabkan oleh pihak bank, ToyyibPay, atau sistem pembayaran
                  pihak ketiga. Semua keputusan pemulangan wang adalah muktamad dan tertakluk kepada budi bicara
                  pihak kami.
                </p>
              </div>

              <div>
                <h2 className="text-xl font-bold text-primary mb-3">6. Hubungi Kami</h2>
                <p>Untuk pertanyaan lanjut, sila hubungi:</p>
                <ul className="list-disc pl-6 space-y-2 mt-2">
                  <li><strong>WhatsApp:</strong> 012-3340972</li>
                  <li><strong>Emel:</strong> hello@itqanmobile.my</li>
                  <li><strong>Syarikat:</strong> Seteguh Gading Enterprise (SSM: TR0341143-D)</li>
                </ul>
              </div>

              <p className="text-sm text-gray-400 pt-4 border-t border-gray-100">
                Dikemaskini pada: 10 Jun 2026
              </p>
            </div>
          </div>
        </section>
      </main>

      <Footer />
      <StickyButtons />
    </>
  );
}