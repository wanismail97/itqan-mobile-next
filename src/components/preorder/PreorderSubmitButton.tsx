// ─── Preorder Submit Button (ISOLATED) ────────────────────────────────────
// Loading-aware submit button for the preorder-ktb form. Keeps the exact
// same styling as the original "Bayar Sekarang" button.
"use client";

interface Props {
  loading: boolean;
}

export default function PreorderSubmitButton({ loading }: Props) {
  return (
    <button
      type="submit"
      disabled={loading}
      className="btn-premium w-full py-3.5 rounded-xl bg-accent text-primary font-semibold text-sm hover:bg-accent/90 transition min-h-[48px] disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
    >
      {loading ? (
        <>
          <span className="inline-block w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          Memproses...
        </>
      ) : (
        "Bayar Sekarang"
      )}
    </button>
  );
}
