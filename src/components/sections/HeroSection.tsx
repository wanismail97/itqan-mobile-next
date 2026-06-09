// ─── Hero Section — Full-screen hero with gradient background ──────────────

export default function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-primary to-[#05101a] px-4 overflow-hidden">
      {/* Decorative blur circles */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-accent/10 rounded-full blur-3xl -translate-x-48 -translate-y-48" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-accent/10 rounded-full blur-3xl translate-x-48 translate-y-48" />

      <div className="relative z-10 text-center max-w-4xl mx-auto py-20">
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 leading-tight">
          Telefon &amp; Aksesori Terkini, Harga Mampu Milik!
        </h1>
        <p className="text-white opacity-80 max-w-2xl mx-auto mb-8 text-lg md:text-xl">
          iPhone, Samsung, SIM Kad, Modem WiFi &amp; Reload Prepaid — semua ada
          di iTQAN Mobile. Waranti rasmi, penghantaran seluruh Malaysia.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <a
            href="/produk"
            className="bg-accent text-primary px-6 py-3 rounded-full font-semibold hover:bg-accent/90 transition duration-300 transform hover:scale-105"
          >
            🛒 Beli Sekarang
          </a>
          <a
            href="https://wa.me/60123340972"
            target="_blank"
            rel="noopener noreferrer"
            className="border-2 border-white text-white px-6 py-3 rounded-full font-semibold hover:bg-white hover:text-primary transition duration-300 transform hover:scale-105"
          >
            💬 WhatsApp Kami
          </a>
        </div>
      </div>
    </section>
  );
}
