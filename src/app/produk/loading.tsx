// ─── Produk Page Loading Skeleton ──────────────────────────────────────────

export default function ProdukLoading() {
  return (
    <div className="min-h-screen bg-[#f8fafc] pt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Title skeleton */}
        <div className="skeleton h-9 w-48 mb-6" />

        {/* Search bar skeleton */}
        <div className="skeleton h-12 max-w-md rounded-xl mb-6" />

        {/* Filter chips skeleton */}
        <div className="flex gap-2 mb-6">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="skeleton h-9 w-20 rounded-full" />
          ))}
          <div className="skeleton h-9 w-28 rounded-full" />
        </div>

        {/* Product grid skeleton */}
        <div className="skeleton h-5 w-32 mb-4" />

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="space-y-3">
              <div className="skeleton h-48 rounded-xl" />
              <div className="skeleton h-4 w-3/4" />
              <div className="skeleton h-3 w-1/2" />
              <div className="skeleton h-6 w-1/3" />
              <div className="skeleton h-10 w-full rounded-lg" />
              <div className="skeleton h-10 w-full rounded-lg" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
