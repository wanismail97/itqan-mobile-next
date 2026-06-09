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
    <section className="py-16 px-4 bg-[#f8fafc]">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-2xl font-bold text-center text-primary mb-10">
          📋 Cara Order, Senang Je!
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {steps.map((step) => (
            <div key={step.number} className="text-center">
              <div className="w-12 h-12 bg-accent text-white rounded-full flex items-center justify-center font-bold mx-auto mb-3">
                {step.number}
              </div>
              <p className="text-sm text-center text-gray-700">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
