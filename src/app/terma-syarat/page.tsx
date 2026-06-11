// ─── Terma & Syarat — Terma dan Syarat Penggunaan iTQAN Mobile ───────────

import type { Metadata } from "next";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import StickyButtons from "@/components/layout/StickyButtons";

export const metadata: Metadata = {
  title: "Terma & Syarat | iTQAN Mobile",
  description:
    "Terma dan syarat penggunaan laman web dan perkhidmatan iTQAN Mobile oleh Seteguh Gading Enterprise.",
};

export default function TermaSyaratPage() {
  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-[#f8fafc]">
        {/* ─── Hero Section ──────────────────────────────────────────────── */}
        <section className="bg-primary text-white pt-28 pb-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-3xl md:text-5xl font-bold mb-4">
              Terma & Syarat
            </h1>
            <p className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto">
              Sila baca terma dan syarat penggunaan laman web dan perkhidmatan kami dengan teliti.
            </p>
          </div>
        </section>

        {/* ─── Content ───────────────────────────────────────────────────── */}
        <section className="py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-white rounded-2xl p-8 md:p-12 shadow-sm space-y-8 text-gray-600 leading-relaxed">

              <p>
                Terma dan syarat ini (&ldquo;Terma&rdquo;) mengawal penggunaan laman web dan perkhidmatan yang
                disediakan oleh <strong>Seteguh Gading Enterprise</strong> (SSM: TR0341143-D), menjalankan perniagaan
                sebagai <strong>iTQAN Mobile</strong> (&ldquo;kami&rdquo;, &ldquo;pihak kami&rdquo;). Dengan mengakses
                atau menggunakan laman web kami, anda bersetuju untuk terikat dengan terma ini.
              </p>

              {/* ─── Penggunaan Laman Web ────────────────────────────────── */}
              <div>
                <h2 className="text-xl font-bold text-primary mb-3">1. Penggunaan Laman Web</h2>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Anda mestilah berumur sekurang-kurangnya <strong>18 tahun</strong> untuk membuat pembelian.</li>
                  <li>Anda bertanggungjawab untuk memastikan maklumat yang diberikan adalah tepat, lengkap, dan terkini.</li>
                  <li>Anda tidak boleh menggunakan laman web kami untuk sebarang tujuan yang menyalahi undang-undang.</li>
                  <li>Kami berhak untuk menolak perkhidmatan kepada sesiapa sahaja atas sebab-sebab tertentu pada bila-bila masa.</li>
                </ul>
              </div>

              {/* ─── Akaun ────────────────────────────────────────────────── */}
              <div>
                <h2 className="text-xl font-bold text-primary mb-3">2. Pendaftaran & Akaun</h2>
                <p>
                  Laman web kami tidak memerlukan pendaftaran akaun untuk membuat pembelian. Walau bagaimanapun,
                  anda bertanggungjawab untuk menyimpan maklumat pesanan dan bukti pembayaran anda dengan selamat.
                </p>
              </div>

              {/* ─── Pembayaran ───────────────────────────────────────────── */}
              <div>
                <h2 className="text-xl font-bold text-primary mb-3">3. Pembayaran</h2>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Semua harga dipaparkan dalam <strong>Ringgit Malaysia (RM)</strong>.</li>
                  <li>Pembayaran diproses melalui <strong>ToyyibPay</strong>, yang menyokong FPX, DuitNow, kad kredit, dan kad debit.</li>
                  <li>Pesanan hanya akan diproses selepas pembayaran berjaya disahkan.</li>
                  <li>Kami berhak untuk mengubah harga produk pada bila-bila masa tanpa notis awal.</li>
                </ul>
              </div>

              {/* ─── Stok ─────────────────────────────────────────────────── */}
              <div>
                <h2 className="text-xl font-bold text-primary mb-3">4. Ketersediaan Stok</h2>
                <p>
                  Semua produk tertakluk kepada ketersediaan stok. Jika produk yang dipesan tidak tersedia,
                  kami akan memaklumkan anda secepat mungkin dan menawarkan alternatif atau bayaran balik penuh.
                  Kami berhak untuk membatalkan pesanan pada bila-bila masa jika produk tidak dapat disediakan.
                </p>
              </div>

              {/* ─── Penghantaran ──────────────────────────────────────────── */}
              <div>
                <h2 className="text-xl font-bold text-primary mb-3">5. Penghantaran</h2>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Penghantaran hanya tersedia di dalam <strong>Malaysia</strong>.</li>
                  <li>Anggaran masa penghantaran adalah <strong>1-5 hari bekerja</strong> bergantung kepada lokasi.</li>
                  <li>Kami tidak bertanggungjawab terhadap kelewatan yang disebabkan oleh pihak kurier.</li>
                  <li>Risiko kehilangan atau kerosakan semasa penghantaran adalah tanggungjawab pelanggan melainkan diinsuranskan.</li>
                </ul>
              </div>

              {/* ─── Pembatalan ───────────────────────────────────────────── */}
              <div>
                <h2 className="text-xl font-bold text-primary mb-3">6. Pembatalan Pesanan</h2>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Pesanan boleh dibatalkan <strong>sebelum</strong> produk dihantar.</li>
                  <li>Untuk produk digital, pembatalan hanya boleh dibuat sebelum transaksi diproses.</li>
                  <li>Bayaran balik untuk pembatalan adalah mengikut <strong>Polisi Pemulangan Wang</strong> kami.</li>
                  <li>Kami berhak untuk membatalkan pesanan jika pembayaran gagal atau disyaki penipuan.</li>
                </ul>
              </div>

              {/* ─── Had Liabiliti ─────────────────────────────────────────── */}
              <div>
                <h2 className="text-xl font-bold text-primary mb-3">7. Had Liabiliti</h2>
                <p>
                  Seteguh Gading Enterprise / iTQAN Mobile tidak akan bertanggungjawab terhadap sebarang kerosakan
                  langsung, tidak langsung, sampingan, khas, atau berbangkit yang timbul daripada penggunaan atau
                  ketidakupayaan untuk menggunakan laman web atau produk kami, termasuk tetapi tidak terhad kepada
                  kehilangan data, kehilangan keuntungan, atau gangguan perniagaan.
                </p>
              </div>

              {/* ─── Harta Intelek ────────────────────────────────────────── */}
              <div>
                <h2 className="text-xl font-bold text-primary mb-3">8. Harta Intelek</h2>
                <p>
                  Semua kandungan di laman web ini termasuk teks, grafik, logo, ikon, dan perisian adalah hak milik
                  iTQAN Mobile / Seteguh Gading Enterprise dan dilindungi oleh undang-undang harta intelek Malaysia.
                  Anda tidak dibenarkan untuk menyalin, mengubah suai, atau mengedar sebarang kandungan tanpa kebenaran
                  bertulis daripada kami.
                </p>
              </div>

              {/* ─── Perubahan ────────────────────────────────────────────── */}
              <div>
                <h2 className="text-xl font-bold text-primary mb-3">9. Perubahan Terma</h2>
                <p>
                  Kami berhak untuk mengubah terma dan syarat ini pada bila-bila masa. Perubahan akan berkuat kuasa
                  serta-merta selepas dimuat naik ke laman web. Penggunaan berterusan laman web kami selepas
                  perubahan adalah persetujuan anda terhadap terma yang dikemaskini. Anda disarankan untuk menyemak
                  halaman ini secara berkala.
                </p>
              </div>

              {/* ─── Undang-undang ─────────────────────────────────────────── */}
              <div>
                <h2 className="text-xl font-bold text-primary mb-3">10. Undang-Undang Yang Mentadbir</h2>
                <p>
                  Terma dan syarat ini ditadbir oleh undang-undang Malaysia. Sebarang pertikaian yang timbul
                  adalah tertakluk kepada bidang kuasa eksklusif mahkamah Malaysia.
                </p>
              </div>

              {/* ─── Hubungi ───────────────────────────────────────────────── */}
              <div>
                <h2 className="text-xl font-bold text-primary mb-3">11. Hubungi Kami</h2>
                <p>Untuk pertanyaan lanjut, sila hubungi:</p>
                <ul className="list-disc pl-6 space-y-2 mt-2">
                  <li><strong>Syarikat:</strong> Seteguh Gading Enterprise (SSM: TR0341143-D)</li>
                  <li><strong>Jenama:</strong> iTQAN Mobile</li>
                  <li><strong>WhatsApp:</strong> 012-3340972</li>
                  <li><strong>Emel:</strong> hello@itqanmobile.my</li>
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