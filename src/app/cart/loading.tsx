// ─── Cart Page Loading Skeleton ────────────────────────────────────────────

export default function CartLoading() {
  return (
    <div className="min-h-screen bg-white pt-20 pb-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="skeleton h-9 w-48 mb-8" />

        <div className="space-y-4 mb-8">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="flex gap-4 p-4 bg-gray-50 rounded-xl">
              <div className="skeleton h-24 w-24 rounded-lg flex-shrink-0" />
              <div className="flex-1 space-y-2">
                <div className="skeleton h-5 w-3/4" />
                <div className="skeleton h-3 w-24" />
                <div className="skeleton h-5 w-20" />
                <div className="skeleton h-8 w-32 rounded" />
              </div>
            </div>
          ))}
        </div>

        <div className="skeleton h-32 rounded-xl" />
      </div>
    </div>
  );
}
