// ─── How to Order — 5-step checkout flow guide ────────────────────────────

const steps = [
  {
    number: "01",
    title: "Pilih Produk",
    description:
      "Pilih telefon, SIM kad, modem WiFi, aksesori atau produk digital yang anda inginkan.",
  },
  {
    number: "02",
    title: "Tambah Ke Bakul",
    description:
      "Masukkan produk ke dalam bakul dan semak semula pesanan anda.",
  },
  {
    number: "03",
    title: "Checkout & Bayar",
    description:
      "Isi maklumat penghantaran dan buat pembayaran secara selamat.",
  },
  {
    number: "04",
    title: "Pesanan Diproses",
    description:
      "Pesanan disahkan dan akan diproses untuk penghantaran atau pengaktifan.",
  },
  {
    number: "05",
    title: "Terima Produk",
    description:
      "Produk dihantar ke alamat anda atau diterima secara digital mengikut jenis pesanan.",
  },
];

export default function HowToOrder() {
  return (
    <section className="section-spacing px-4 bg-[#f8fafc]">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-2xl md:text-3xl font-bold text-center text-primary mb-10">
          📋 Cara Order, Senang Je!
        </h2>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6">
          {steps.map((step) => (
            <div key={step.number} className="text-center group">
              <div className="w-14 h-14 bg-accent/10 rounded-2xl flex items-center justify-center text-lg font-bold text-accent mx-auto mb-4 transition-all duration-300 ease-out group-hover:bg-accent group-hover:text-primary group-hover:scale-110 group-hover:shadow-lg">
                {step.number}
              </div>
              <h3 className="font-semibold text-primary mb-2 text-sm">
                {step.title}
              </h3>
              <p className="text-xs text-gray-500 leading-relaxed">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}