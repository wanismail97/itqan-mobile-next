// ─── Why Choose Us — 3-column feature cards with custom images ────────────

import Image from "next/image";

const features = [
  {
    imgSrc: "/images/servis/jaminan.png",
    imgAlt: "Waranti Rasmi",
    title: "Waranti Rasmi 1 Tahun",
    description:
      "Semua telefon dilindungi waranti pengeluar. Jaminan 100% original, bukan refurbished.",
  },
  {
    imgSrc: "/images/servis/mampu-milik.png",
    imgAlt: "Harga Mampu Milik",
    title: "Harga Mampu Milik",
    description:
      "Kami potong orang tengah. Harga direct dari pembekal, jimat untuk anda.",
  },
  {
    imgSrc: "/images/servis/penghantaran.png",
    imgAlt: "Penghantaran Pantas",
    title: "Penghantaran Pantas Ke Lokasi Anda",
    description:
      "Pos Laju, J&T, Ninja Van dan rakan logistik dipercayai. Penghantaran cepat terus ke lokasi anda di seluruh Malaysia.",
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
              className="card-premium card-hover bg-white border border-gray-100 rounded-2xl p-8 md:p-10 text-center shadow-sm hover:border-accent/20 group"
            >
              <div className="mb-5 flex justify-center">
                <Image
                  src={feature.imgSrc}
                  alt={feature.imgAlt}
                  width={120}
                  height={120}
                  className="h-24 md:h-28 w-auto object-contain transition-transform duration-300 ease-out group-hover:scale-105"
                />
              </div>
              <h3 className="text-lg font-semibold text-primary mb-3">
                {feature.title}
              </h3>
              <p className="text-gray-500 text-sm leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}