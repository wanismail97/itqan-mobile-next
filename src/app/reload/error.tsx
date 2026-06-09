// ─── Reload Page Error Boundary ────────────────────────────────────────────
"use client";

export default function ReloadError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="min-h-screen bg-[#f8fafc] flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="text-6xl mb-6">😵</div>
        <h1 className="text-2xl font-bold text-primary mb-4">
          Reload Gagal Dimuat
        </h1>
        <p className="text-gray-500 mb-6">
          Maaf, senarai provider reload tidak dapat dimuatkan. Sila cuba sebentar lagi.
        </p>
        <button
          onClick={() => reset()}
          className="bg-accent text-primary px-6 py-3 rounded-full font-semibold hover:bg-accent/90 transition"
        >
          Cuba Semula
        </button>
      </div>
    </div>
  );
}
