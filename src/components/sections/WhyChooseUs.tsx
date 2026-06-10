// ─── Why Choose Us — 3-column feature cards ───────────────────────────────

const features = [
  {
    icon: "✅",
    title: "Waranti Rasmi 1 Tahun",
    description:
      "Semua telefon dilindungi waranti pengeluar. Jaminan 100% original, bukan refurbished.",
  },
  {
    icon: "💰",
    title: "Harga Mampu Milik",
    description:
      "Kami potong orang tengah. Harga direct dari pembekal, jimat untuk anda.",
  },
  {
    icon: "🚚",
    title: "Penghantaran Seluruh Malaysia",
    description:
      "Pos Laju, J&T, Ninja Van. Sampai depan pintu dalam 1-3 hari bekerja.",
  },
];

export default function WhyChooseUs() {
  return (
    <section className="section-spacing px-4 bg-white">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-2xl md:text-3xl font-bold text-center text-primary mb-10">
          ✨ Kenapa Pilih iTQAN Mobile?
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="card-premium card-hover bg-white border border-gray-100 rounded-2xl p-8 md:p-10 text-center shadow-sm hover:border-accent/20"
            >
              <div className="text-5xl mb-5 transition-transform duration-300 ease-out hover:scale-110">
                {feature.icon}
              </div>
              <h3 className="text-lg font-semibold text-primary mb-3">{feature.title}</h3>
              <p className="text-gray-500 text-sm leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
