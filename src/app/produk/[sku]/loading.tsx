// ─── Product Detail Loading Skeleton ───────────────────────────────────────

export default function ProdukDetailLoading() {
  return (
    <div className="min-h-screen bg-white pt-20 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb skeleton */}
        <div className="skeleton h-4 w-48 mb-6" />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
          {/* Image skeleton */}
          <div className="skeleton aspect-square rounded-xl" />

          {/* Info skeleton */}
          <div className="space-y-4">
            <div className="skeleton h-9 w-3/4" />
            <div className="flex gap-4">
              <div className="skeleton h-4 w-24" />
              <div className="skeleton h-4 w-28" />
              <div className="skeleton h-4 w-20" />
            </div>
            <div className="skeleton h-10 w-40" />
            <div className="flex gap-2">
              <div className="skeleton h-6 w-24 rounded-full" />
              <div className="skeleton h-6 w-20 rounded-full" />
            </div>
            <div className="space-y-2">
              <div className="skeleton h-4 w-full" />
              <div className="skeleton h-4 w-full" />
              <div className="skeleton h-4 w-2/3" />
            </div>
            <div className="skeleton h-12 w-36 rounded-lg" />
            <div className="flex gap-3">
              <div className="skeleton h-12 flex-1 rounded-lg" />
              <div className="skeleton h-12 flex-1 rounded-lg" />
              <div className="skeleton h-12 flex-1 rounded-lg" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
