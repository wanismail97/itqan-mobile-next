// ─── Testimonials — Customer review cards ──────────────────────────────────

const testimonials = [
  {
    initials: "A",
    name: "Amir",
    location: "Kuala Lumpur",
    rating: "★★★★★",
    text: "Pantas delivery! Semalam order, hari ni sampai. Terbaik iTQAN!",
  },
  {
    initials: "S",
    name: "Syafiqah",
    location: "Pulau Pinang",
    rating: "★★★★★",
    text: "Harga memang terbaik. Beli iPhone 15 RM200 lebih murah dari kedai lain. Recommended!",
  },
  {
    initials: "R",
    name: "Raj",
    location: "Johor Bahru",
    rating: "★★★★★",
    text: "Staff mesra, explain semua pasal warranty sabar je. Highly recommended! Beli sini je.",
  },
];

export default function Testimonials() {
  return (
    <section className="section-spacing px-4 bg-white">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-2xl md:text-3xl font-bold text-center text-primary mb-10">
          ❤️ Apa Pelanggan Kami Kata
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((t) => (
            <div
              key={t.name}
              className="card-premium card-hover bg-white border border-gray-100 rounded-2xl p-6 md:p-8 shadow-sm hover:border-accent/20"
            >
              {/* Customer Info */}
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center text-white font-bold text-sm shrink-0">
                  {t.initials}
                </div>
                <div>
                  <p className="font-semibold text-primary">{t.name}</p>
                  <p className="text-gray-400 text-sm">{t.location}</p>
                </div>
              </div>

              {/* Rating */}
              <p className="text-accent mb-3 tracking-wider">{t.rating}</p>

              {/* Review Text */}
              <p className="text-gray-500 italic text-sm leading-relaxed">&ldquo;{t.text}&rdquo;</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
