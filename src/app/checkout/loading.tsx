// ─── Checkout Page Loading Skeleton ────────────────────────────────────────

export default function CheckoutLoading() {
  return (
    <div className="min-h-screen bg-[#f8fafc] pt-20 pb-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="skeleton h-9 w-36 mb-8" />

        <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
          {/* Form skeleton */}
          <div className="md:col-span-3">
            <div className="bg-white rounded-xl shadow-sm p-6 space-y-4">
              <div className="skeleton h-6 w-44" />
              <div className="skeleton h-12 w-full rounded-lg" />
              <div className="skeleton h-12 w-full rounded-lg" />
              <div className="skeleton h-12 w-full rounded-lg" />
              <div className="skeleton h-12 w-full rounded-lg" />
            </div>
          </div>

          {/* Summary skeleton */}
          <div className="md:col-span-2">
            <div className="bg-white rounded-xl shadow-sm p-6 space-y-3">
              <div className="skeleton h-6 w-40" />
              {Array.from({ length: 2 }).map((_, i) => (
                <div key={i} className="flex gap-3">
                  <div className="skeleton h-14 w-14 rounded-lg" />
                  <div className="flex-1 space-y-1">
                    <div className="skeleton h-4 w-3/4" />
                    <div className="skeleton h-3 w-16" />
                    <div className="skeleton h-4 w-20" />
                  </div>
                </div>
              ))}
              <div className="border-t pt-3">
                <div className="skeleton h-6 w-32" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
