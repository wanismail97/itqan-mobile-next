// ─── Polisi Privasi — Dasar Privasi iTQAN Mobile ─────────────────────────

import type { Metadata } from "next";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import StickyButtons from "@/components/layout/StickyButtons";

export const metadata: Metadata = {
  title: "Polisi Privasi | iTQAN Mobile",
  description:
    "Dasar privasi iTQAN Mobile — bagaimana kami mengumpul, menggunakan, dan melindungi maklumat peribadi pelanggan.",
};

export default function PolisiPrivasiPage() {
  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-[#f8fafc]">
        {/* ─── Hero Section ──────────────────────────────────────────────── */}
        <section className="bg-primary text-white pt-28 pb-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-3xl md:text-5xl font-bold mb-4">
              Polisi Privasi
            </h1>
            <p className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto">
              Kami menghargai privasi anda dan komited untuk melindungi maklumat peribadi yang dikongsi bersama kami.
            </p>
          </div>
        </section>

        {/* ─── Content ───────────────────────────────────────────────────── */}
        <section className="py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-white rounded-2xl p-8 md:p-12 shadow-sm space-y-8 text-gray-600 leading-relaxed">

              <p>
                Polisi Privasi ini menerangkan bagaimana <strong>Seteguh Gading Enterprise</strong> (SSM: TR0341143-D) yang
                menjalankan perniagaan sebagai <strong>iTQAN Mobile</strong> (&ldquo;kami&rdquo;, &ldquo;pihak kami&rdquo;)
                mengumpul, menggunakan, menyimpan, dan melindungi maklumat peribadi anda apabila anda menggunakan laman web
                dan perkhidmatan kami.
              </p>

              <div>
                <h2 className="text-xl font-bold text-primary mb-3">1. Maklumat Yang Kami Kumpulkan</h2>
                <p>Kami mungkin mengumpul maklumat berikut apabila anda menggunakan perkhidmatan kami:</p>
                <ul className="list-disc pl-6 space-y-2 mt-2">
                  <li><strong>Maklumat peribadi:</strong> Nama penuh, nombor telefon, alamat emel, dan alamat penghantaran.</li>
                  <li><strong>Maklumat pesanan:</strong> Butiran produk yang dibeli, kuantiti, dan jumlah pembayaran.</li>
                  <li><strong>Maklumat teknikal:</strong> Alamat IP, jenis pelayar, dan data penggunaan laman web.</li>
                  <li><strong>Maklumat pembayaran:</strong> Semua pembayaran diproses melalui ToyyibPay. Kami <strong>tidak menyimpan</strong> butiran kad kredit atau debit anda.</li>
                </ul>
              </div>

              <div>
                <h2 className="text-xl font-bold text-primary mb-3">2. Tujuan Penggunaan Data</h2>
                <p>Maklumat yang dikumpul digunakan untuk tujuan berikut:</p>
                <ul className="list-disc pl-6 space-y-2 mt-2">
                  <li>Memproses dan menghantar pesanan anda.</li>
                  <li>Menghantar pengesahan pesanan dan kemas kini penghantaran.</li>
                  <li>Memberikan sokongan pelanggan dan menjawab pertanyaan.</li>
                  <li>Mematuhi keperluan perundangan dan kawal selia.</li>
                  <li>Menambah baik pengalaman pengguna di laman web kami.</li>
                </ul>
              </div>

              <div>
                <h2 className="text-xl font-bold text-primary mb-3">3. Perlindungan Data</h2>
                <p>
                  Kami mengambil langkah keselamatan yang munasabah untuk melindungi maklumat peribadi anda daripada akses
                  tanpa kebenaran, pengubahsuaian, pendedahan, atau pemusnahan. Data anda disimpan dengan selamat dan hanya
                  boleh diakses oleh kakitangan yang memerlukannya untuk tujuan operasi perniagaan.
                </p>
              </div>

              <div>
                <h2 className="text-xl font-bold text-primary mb-3">4. Perkongsian Data</h2>
                <p>
                  Kami hanya berkongsi maklumat anda dengan pihak ketiga yang diperlukan untuk menyediakan perkhidmatan
                  kami, termasuk:
                </p>
                <ul className="list-disc pl-6 space-y-2 mt-2">
                  <li><strong>Pembayaran:</strong> ToyyibPay memproses transaksi pembayaran anda.</li>
                  <li><strong>Penghantaran:</strong> Perkhidmatan kurier untuk menghantar produk fizikal ke alamat anda.</li>
                  <li><strong>Perundangan:</strong> Jika dikehendaki oleh undang-undang atau perintah mahkamah.</li>
                </ul>
                <p className="mt-2">
                  Kami <strong>tidak menjual, menyewa, atau memperdagangkan</strong> maklumat peribadi anda kepada mana-mana
                  pihak ketiga untuk tujuan pemasaran.
                </p>
              </div>

              <div>
                <h2 className="text-xl font-bold text-primary mb-3">5. Hak Pelanggan</h2>
                <p>Anda mempunyai hak berikut berkenaan data peribadi anda:</p>
                <ul className="list-disc pl-6 space-y-2 mt-2">
                  <li>Meminta akses kepada maklumat peribadi yang kami simpan.</li>
                  <li>Meminta pembetulan maklumat yang tidak tepat atau tidak lengkap.</li>
                  <li>Meminta pemadaman maklumat peribadi anda, tertakluk kepada keperluan perundangan.</li>
                  <li>Menarik balik persetujuan untuk pemprosesan data pada bila-bila masa.</li>
                </ul>
                <p className="mt-2">
                  Untuk menggunakan hak-hak ini, sila hubungi kami melalui WhatsApp di <strong>012-3340972</strong> atau
                  emel ke <strong>hello@itqanmobile.my</strong>.
                </p>
              </div>

              <div>
                <h2 className="text-xl font-bold text-primary mb-3">6. Pautan Pihak Ketiga</h2>
                <p>
                  Laman web kami mungkin mengandungi pautan ke laman web pihak ketiga. Kami tidak bertanggungjawab terhadap
                  amalan privasi atau kandungan laman web tersebut. Sila baca polisi privasi setiap laman web yang anda
                  lawati.
                </p>
              </div>

              <div>
                <h2 className="text-xl font-bold text-primary mb-3">7. Perubahan Polisi</h2>
                <p>
                  Kami berhak untuk mengubah polisi privasi ini pada bila-bila masa. Sebarang perubahan akan dimuat naik
                  ke halaman ini dengan serta-merta. Penggunaan berterusan laman web kami selepas perubahan tersebut
                  merupakan persetujuan anda terhadap polisi yang dikemaskini.
                </p>
              </div>

              <div>
                <h2 className="text-xl font-bold text-primary mb-3">8. Hubungi Kami</h2>
                <p>
                  Jika anda mempunyai sebarang pertanyaan tentang polisi privasi ini, sila hubungi kami:
                </p>
                <ul className="list-disc pl-6 space-y-2 mt-2">
                  <li><strong>Nama Syarikat:</strong> Seteguh Gading Enterprise (SSM: TR0341143-D)</li>
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