// ─── Kategori Grid — 5 premium category cards with unified SVG icons ──────

const categories = [
  {
    label: "Telefon",
    href: "/produk?kategori=Telefon",
    featured: true,
    icon: (
      <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="5" y="2" width="14" height="20" rx="2" ry="2" />
        <line x1="12" y1="18" x2="12.01" y2="18" />
      </svg>
    ),
  },
  {
    label: "SIM Kad",
    href: "/produk?kategori=SIM%20Kad",
    featured: true,
    icon: (
      <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="6" y="4" width="12" height="16" rx="2" />
        <path d="M9 8h6M9 12h4" />
        <rect x="7" y="14" width="4" height="1.5" rx="0.5" />
      </svg>
    ),
  },
  {
    label: "Modem WiFi",
    href: "/produk?kategori=Modem%20WiFi",
    featured: false,
    icon: (
      <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 20h.01" />
        <path d="M8.5 16.5a5 5 0 017 0" />
        <path d="M5 12.5a10 10 0 0114 0" />
        <circle cx="12" cy="5" r="2" />
      </svg>
    ),
  },
  {
    label: "Reload Prepaid",
    href: "/reload",
    featured: false,
    icon: (
      <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
      </svg>
    ),
  },
  {
    label: "Aksesori",
    href: "/produk?kategori=Aksesori",
    featured: false,
    icon: (
      <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21.44 11.05l-9.19 9.19a6 6 0 01-8.49-8.49l9.19-9.19a4 4 0 015.66 0l2.83 2.83a4 4 0 010 5.66z" />
        <circle cx="15" cy="9" r="1.5" fill="currentColor" stroke="none" />
      </svg>
    ),
  },
];

function CategoryCard({ cat }: { cat: (typeof categories)[number] }) {
  return (
    <a
      href={cat.href}
      className={`group flex flex-col items-center text-center bg-white rounded-2xl border transition-all duration-300 ease-out p-6
        hover:-translate-y-1.5 hover:shadow-xl hover:shadow-gray-200/50 hover:border-primary/15
        ${cat.featured
          ? "border-primary/10 shadow-md shadow-gray-200/40"
          : "border-gray-100 shadow-sm"
        }`}
    >
      {/* Icon */}
      <div
        className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-4 transition-all duration-300 ease-out
          group-hover:scale-110 group-hover:shadow-md
          ${cat.featured
            ? "bg-primary text-accent shadow-sm"
            : "bg-gray-50 text-primary/60 group-hover:text-primary group-hover:bg-primary/5"
          }`}
      >
        {cat.icon}
      </div>

      {/* Title */}
      <h3 className={`font-semibold text-sm mb-1.5 transition-colors duration-300
        ${cat.featured ? "text-primary" : "text-gray-700 group-hover:text-primary"}`}>
        {cat.label}
      </h3>

      {/* CTA */}
      <span className={`text-xs font-medium transition-all duration-300
        ${cat.featured
          ? "text-accent"
          : "text-gray-400 group-hover:text-accent"
        }`}>
        Lihat Produk &rarr;
      </span>
    </a>
  );
}

export default function CategoryGrid() {
  return (
    <section className="section-spacing px-4 bg-white">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-10">
          <h2 className="text-2xl md:text-3xl font-bold text-primary mb-2">
            Kategori Produk
          </h2>
          <p className="text-gray-400 text-sm max-w-md mx-auto">
            Pilih kategori kegemaran anda dan mula membeli-belah
          </p>
        </div>

        {/* ─── Desktop Grid ───────────────────────────────────────────── */}
        <div className="hidden sm:grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-5">
          {categories.map((cat) => (
            <CategoryCard key={cat.label} cat={cat} />
          ))}
        </div>

        {/* ─── Mobile Horizontal Scroll ────────────────────────────────── */}
        <div className="flex sm:hidden gap-3 overflow-x-auto pb-2 px-1 -mx-1 snap-x snap-mandatory scrollbar-hide">
          {categories.map((cat) => (
            <div key={cat.label} className="min-w-[150px] flex-shrink-0 snap-start">
              <CategoryCard cat={cat} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}