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
    <section className="py-16 px-4 bg-white">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-2xl font-bold text-center text-primary mb-10">
          📦 Kategori Produk
        </h2>

        {/* Desktop Grid — visible md and up */}
        <div className="hidden md:grid lg:grid-cols-5 md:grid-cols-3 gap-4">
          {categories.map((cat) => (
            <a
              key={cat.label}
              href={cat.href}
              className="bg-white border border-gray-200 rounded-xl shadow-md p-6 text-center hover:shadow-xl hover:border-accent transform hover:-translate-y-1 transition duration-300"
            >
              <div className="text-4xl mb-3">{cat.icon}</div>
              <h3 className="font-semibold text-primary">{cat.label}</h3>
            </a>
          ))}
        </div>

        {/* Mobile Horizontal Scroll — visible below md */}
        <div className="flex md:hidden gap-4 overflow-x-auto pb-4 px-2">
          {categories.map((cat) => (
            <a
              key={cat.label}
              href={cat.href}
              className="flex-shrink-0 w-40 bg-white border border-gray-200 rounded-xl shadow-md p-6 text-center hover:shadow-xl hover:border-accent transform hover:-translate-y-1 transition duration-300"
            >
              <div className="text-4xl mb-3">{cat.icon}</div>
              <h3 className="font-semibold text-primary">{cat.label}</h3>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
