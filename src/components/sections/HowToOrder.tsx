// ─── How to Order — 4-step ordering guide ──────────────────────────────────

const steps = [
  {
    number: "1️⃣",
    title: "Pilih Produk",
    description:
      "Browse katalog kami dan pilih produk kegemaran",
  },
  {
    number: "2️⃣",
    title: "WhatsApp Order",
    description:
      "Screenshot produk & hantar ke 012-3340972",
  },
  {
    number: "3️⃣",
    title: "Buat Bayaran",
    description:
      "Online transfer, DuitNow atau bank transfer. Senang!",
  },
  {
    number: "4️⃣",
    title: "Terima Produk",
    description:
      "Kami hantar terus ke alamat anda. Tracking number diberikan.",
  },
];

export default function HowToOrder() {
  return (
    <section className="section-spacing px-4 bg-[#f8fafc]">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-2xl md:text-3xl font-bold text-center text-primary mb-10">
          📋 Cara Order, Senang Je!
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {steps.map((step) => (
            <div key={step.number} className="text-center group">
              <div className="w-16 h-16 bg-accent/10 rounded-2xl flex items-center justify-center text-2xl mx-auto mb-4 transition-all duration-300 ease-out group-hover:bg-accent group-hover:scale-110 group-hover:shadow-lg">
                {step.number}
              </div>
              <h3 className="font-semibold text-primary mb-2">{step.title}</h3>
              <p className="text-sm text-gray-500 leading-relaxed">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
