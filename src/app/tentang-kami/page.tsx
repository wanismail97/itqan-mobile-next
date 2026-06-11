// ─── Tentang Kami — About iTQAN Mobile ────────────────────────────────────

import type { Metadata } from "next";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import StickyButtons from "@/components/layout/StickyButtons";

export const metadata: Metadata = {
  title: "Tentang Kami | iTQAN Mobile",
  description:
    "iTQAN Mobile dikendalikan oleh Seteguh Gading Enterprise (SSM: TR0341143-D). Menyediakan telefon bimbit, SIM kad, topup, aksesori & produk digital di Malaysia.",
};

export default function TentangKamiPage() {
  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-[#f8fafc]">
        {/* ─── Hero Section ──────────────────────────────────────────────── */}
        <section className="bg-primary text-white pt-28 pb-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-3xl md:text-5xl font-bold mb-4">
              Tentang Kami
            </h1>
            <p className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto">
              Kenali iTQAN Mobile — rakan digital anda untuk keperluan telekomunikasi
              dan pembayaran di Malaysia.
            </p>
          </div>
        </section>

        {/* ─── Company Info ──────────────────────────────────────────────── */}
        <section className="py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-white rounded-2xl p-8 md:p-12 shadow-sm">
              <h2 className="text-2xl md:text-3xl font-bold text-primary mb-6 text-center">
                Maklumat Syarikat
              </h2>

              <div className="space-y-4 max-w-xl mx-auto">
                <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 border-b border-gray-100 pb-4">
                  <span className="text-sm font-medium text-gray-500 sm:w-48">Nama Syarikat</span>
                  <span className="text-primary font-semibold">Seteguh Gading Enterprise</span>
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 border-b border-gray-100 pb-4">
                  <span className="text-sm font-medium text-gray-500 sm:w-48">No. Pendaftaran SSM</span>
                  <span className="text-primary font-semibold">TR0341143-D</span>
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 border-b border-gray-100 pb-4">
                  <span className="text-sm font-medium text-gray-500 sm:w-48">Jenama</span>
                  <span className="text-primary font-semibold">iTQAN Mobile</span>
                </div>
                <div className="flex flex-col sm:flex-row sm:items-start gap-1 sm:gap-4">
                  <span className="text-sm font-medium text-gray-500 sm:w-48">Jenis Perniagaan</span>
                  <span className="text-primary font-semibold">
                    Peruncitan Produk Telekomunikasi & Digital
                  </span>
                </div>
              </div>

              <p className="text-gray-600 text-lg leading-relaxed text-center max-w-3xl mx-auto mt-10">
                iTQAN Mobile dikendalikan oleh <strong>Seteguh Gading Enterprise</strong>, sebuah
                perniagaan berdaftar di Malaysia yang menawarkan pelbagai produk dan
                perkhidmatan telekomunikasi termasuk telefon bimbit, SIM kad, topup,
                pelan data, aksesori telefon, serta produk digital dan telekomunikasi
                yang lain. Kami komited untuk memberikan pengalaman terbaik kepada
                pelanggan dengan perkhidmatan yang pantas, mudah dan dipercayai.
              </p>
            </div>
          </div>
        </section>

        {/* ─── Services ──────────────────────────────────────────────────── */}
        <section className="py-16 bg-white">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl md:text-3xl font-bold text-primary mb-10 text-center">
              Perkhidmatan Kami
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                {
                  title: "Reload & Topup",
                  desc: "Isi semula kredit prabayar untuk semua rangkaian utama di Malaysia dengan kadar terbaik.",
                  icon: (
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.078.879 4.249 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  ),
                },
                {
                  title: "SIM Kad Prabayar",
                  desc: "Dapatkan SIM kad prabayar dengan pelan data dan pakej menarik untuk kegunaan harian.",
                  icon: (
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 1.5H8.25A2.25 2.25 0 006 3.75v16.5a2.25 2.25 0 002.25 2.25h7.5A2.25 2.25 0 0018 20.25V3.75a2.25 2.25 0 00-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 18.75h3" />
                    </svg>
                  ),
                },
                {
                  title: "Port In (MNP)",
                  desc: "Kekalkan nombor sedia ada anda sambil beralih ke rangkaian baru dengan proses MNP yang mudah.",
                  icon: (
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 21L3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5" />
                    </svg>
                  ),
                },
                {
                  title: "Pembayaran Bil",
                  desc: "Bayar bil utiliti, insurans, pinjaman dan pelbagai bil lain dengan mudah dalam satu platform.",
                  icon: (
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z" />
                    </svg>
                  ),
                },
                {
                  title: "Telefon Pintar",
                  desc: "Pelbagai pilihan telefon pintar dari jenama terkemuka dengan harga berpatutan dan jaminan rasmi.",
                  icon: (
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 1.5H8.25A2.25 2.25 0 006 3.75v16.5a2.25 2.25 0 002.25 2.25h7.5A2.25 2.25 0 0018 20.25V3.75a2.25 2.25 0 00-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 18.75h3" />
                    </svg>
                  ),
                },
                {
                  title: "Aksesori",
                  desc: "Lengkapkan peranti anda dengan pelbagai aksesori berkualiti seperti casing, charger dan pelindung skrin.",
                  icon: (
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  ),
                },
              ].map((service) => (
                <div
                  key={service.title}
                  className="bg-[#f8fafc] rounded-xl p-6 hover:shadow-lg transition duration-300"
                >
                  <div className="text-accent mb-3">{service.icon}</div>
                  <h3 className="font-semibold text-primary mb-2">
                    {service.title}
                  </h3>
                  <p className="text-sm text-gray-500 leading-relaxed">
                    {service.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ─── Why Choose Us ─────────────────────────────────────────────── */}
        <section className="py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl md:text-3xl font-bold text-primary mb-10 text-center">
              Kenapa Pilih Kami
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {[
                {
                  title: "Transaksi Selamat",
                  desc: "Semua transaksi dilindungi dengan teknologi keselamatan terkini. Data peribadi anda dijamin selamat.",
                  icon: (
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
                    </svg>
                  ),
                },
                {
                  title: "Pembayaran Dalam Talian",
                  desc: "Pelbagai pilihan pembayaran termasuk FPX, DuitNow, kad kredit dan kad debit melalui ToyyibPay.",
                  icon: (
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z" />
                    </svg>
                  ),
                },
                {
                  title: "Sokongan Pelanggan",
                  desc: "Pasukan sokongan mesra kami sedia membantu anda melalui WhatsApp dari 9:00 pagi hingga 10:00 malam.",
                  icon: (
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193-.34.027-.68.052-1.02.072v3.091l-3-3c-1.354 0-2.694-.055-4.02-.163a2.115 2.115 0 01-.825-.242m9.345-8.334a2.126 2.126 0 00-.476-.095 48.64 48.64 0 00-8.048 0c-1.131.094-1.976 1.057-1.976 2.192v4.286c0 .837.46 1.58 1.155 1.951m9.345-8.334V6.637c0-1.621-1.152-3.026-2.76-3.235A48.455 48.455 0 0011.25 3c-2.115 0-4.198.137-6.24.402-1.608.209-2.76 1.614-2.76 3.235v6.226c0 1.621 1.152 3.026 2.76 3.235.577.075 1.157.14 1.74.194V21l4.155-4.155" />
                    </svg>
                  ),
                },
                {
                  title: "Produk Berkualiti",
                  desc: "Kami hanya menawarkan produk-produk terpilih daripada jenama ternama dengan waranti rasmi.",
                  icon: (
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
                    </svg>
                  ),
                },
              ].map((item) => (
                <div
                  key={item.title}
                  className="flex gap-4 bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition duration-300"
                >
                  <div className="flex-shrink-0 w-12 h-12 bg-accent/20 text-accent rounded-xl flex items-center justify-center">
                    {item.icon}
                  </div>
                  <div>
                    <h3 className="font-semibold text-primary mb-1">
                      {item.title}
                    </h3>
                    <p className="text-sm text-gray-500 leading-relaxed">
                      {item.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
      <StickyButtons />
    </>
  );
}