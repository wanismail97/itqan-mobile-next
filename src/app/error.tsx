"use client";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="font-inter bg-primary min-h-screen flex items-center justify-center px-4">
      <div className="text-center text-white max-w-md">
        <div className="text-6xl mb-6">😵</div>

        <h1 className="text-2xl font-bold mb-4">
          Maaf, Ada Masalah Teknikal
        </h1>

        <p className="text-gray-300 mb-6">
          Kami sedang cuba perbaiki. Sila cuba sebentar lagi.
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