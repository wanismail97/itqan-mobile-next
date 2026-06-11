// ─── Hero Section — Full-screen hero with gradient background ──────────────

export default function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-primary via-[#0d1f33] to-[#05101a] px-4 overflow-hidden">
      {/* Decorative blur circles */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-accent/10 rounded-full blur-3xl -translate-x-48 -translate-y-48 animate-pulse" style={{ animationDuration: '4s' }} />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-accent/10 rounded-full blur-3xl translate-x-48 translate-y-48 animate-pulse" style={{ animationDuration: '5s' }} />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-accent/5 rounded-full blur-3xl" />

      {/* Decorative dots pattern overlay */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: 'radial-gradient(circle, #ffffff 1px, transparent 1px)',
          backgroundSize: '30px 30px',
        }}
      />

      <div className="relative z-10 text-center max-w-4xl mx-auto py-20">
        <div className="fade-in">
          <h1 className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-extrabold text-white mb-4 leading-tight font-nunito tracking-normal">
          Telefon & Aksesori Terkini, Harga Mampu Milik!
        </h1>
          <p className="text-white/80 max-w-2xl mx-auto mb-8 text-lg md:text-xl leading-relaxed">
          iPhone, Samsung, SIM Kad, Modem WiFi & Reload Prepaid — semua ada
          di iTQAN Mobile. Waranti rasmi, penghantaran seluruh Malaysia.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <a
            href="/produk"
              className="btn-premium bg-accent text-primary px-8 py-4 rounded-full font-semibold hover:bg-accent/90 shadow-lg hover:shadow-accent/25 min-h-[44px]"
          >
            🛒 Beli Sekarang
          </a>
          <a
            href="https://wa.me/60123340972"
            target="_blank"
            rel="noopener noreferrer"
              className="btn-premium border-2 border-white/30 text-white px-8 py-4 rounded-full font-semibold hover:bg-white hover:text-primary hover:border-white min-h-[44px]"
          >
            💬 WhatsApp Kami
          </a>
        </div>
      </div>
      </div>
    </section>
  );
}

