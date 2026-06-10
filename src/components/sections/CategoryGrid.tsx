// ─── Kategori Grid — 5 static category icon cards (desktop grid + mobile scroll) ──
// Currently static. Will be migrated to Airtable Servis table later.

const categories = [
  { label: "Telefon", icon: "📱", href: "/produk?kategori=Telefon" },
  { label: "SIM Kad", icon: "📶", href: "/produk?kategori=SIM%20Kad" },
  { label: "Modem WiFi", icon: "📡", href: "/produk?kategori=Modem%20WiFi" },
  { label: "Reload Prepaid", icon: "💳", href: "/reload" },
  { label: "Aksesori", icon: "🎧", href: "/produk?kategori=Aksesori" },
];

export default function CategoryGrid() {
  return (
    <section className="section-spacing px-4 bg-white">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-2xl md:text-3xl font-bold text-center text-primary mb-10">
          📦 Kategori Produk
        </h2>

        {/* Desktop Grid — visible md and up */}
        <div className="hidden md:grid lg:grid-cols-5 md:grid-cols-3 gap-6">
          {categories.map((cat) => (
            <a
              key={cat.label}
              href={cat.href}
              className="card-premium card-hover border border-gray-100 rounded-2xl shadow-sm hover:border-accent/30 p-8 text-center group"
            >
              <div className="text-5xl mb-4 transition-transform duration-300 ease-out group-hover:scale-110">
                {cat.icon}
              </div>
              <h3 className="font-semibold text-primary text-lg">{cat.label}</h3>
              <p className="text-xs text-gray-400 mt-1 group-hover:text-accent transition-colors">
                Lihat Produk &rarr;
              </p>
            </a>
          ))}
        </div>

        {/* Mobile Horizontal Scroll — visible below md */}
        <div className="flex md:hidden gap-4 overflow-x-auto pb-4 px-2 -mx-2 snap-x snap-mandatory scrollbar-hide">
          {categories.map((cat) => (
            <a
              key={cat.label}
              href={cat.href}
              className="card-premium card-hover flex-shrink-0 w-44 border border-gray-100 rounded-2xl shadow-sm hover:border-accent/30 p-6 text-center snap-start group"
            >
              <div className="text-4xl mb-3 transition-transform duration-300 ease-out group-hover:scale-110">
                {cat.icon}
              </div>
              <h3 className="font-semibold text-primary">{cat.label}</h3>
              <p className="text-xs text-gray-400 mt-1 group-hover:text-accent transition-colors">
                Lihat &rarr;
              </p>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
