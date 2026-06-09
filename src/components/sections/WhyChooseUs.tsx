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
    <section className="py-16 px-4 bg-white">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-2xl font-bold text-center text-primary mb-10">
          ✨ Kenapa Pilih iTQAN Mobile?
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="bg-gray-50 rounded-xl p-8 text-center shadow-sm hover:shadow-md transition duration-300"
            >
              <div className="text-4xl mb-4">{feature.icon}</div>
              <h3 className="font-semibold text-primary mb-2">{feature.title}</h3>
              <p className="text-gray-600 text-sm">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
