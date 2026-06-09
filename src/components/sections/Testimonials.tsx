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
    <section className="py-16 px-4 bg-white">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-2xl font-bold text-center text-primary mb-10">
          ❤️ Apa Pelanggan Kami Kata
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((t) => (
            <div
              key={t.name}
              className="bg-gray-50 rounded-xl p-6 shadow-sm"
            >
              {/* Customer Info */}
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center text-white font-bold">
                  {t.initials}
                </div>
                <div>
                  <p className="font-semibold text-primary">{t.name}</p>
                  <p className="text-gray-500 text-sm">{t.location}</p>
                </div>
              </div>

              {/* Rating */}
              <p className="text-accent mb-2">{t.rating}</p>

              {/* Review Text */}
              <p className="text-gray-600 italic text-sm">{t.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
