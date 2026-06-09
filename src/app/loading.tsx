// ─── Loading Skeleton — Shown while the page is rendering ─────────────────

export default function HomeLoading() {
  return (
    <div className="min-h-screen bg-primary">
      {/* Skeleton Navbar */}
      <div className="h-16 bg-primary/90 flex items-center px-8">
        <div className="skeleton h-6 w-32" />
        <div className="ml-auto hidden md:flex gap-6">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="skeleton h-4 w-16" />
          ))}
        </div>
      </div>

      {/* Skeleton Hero */}
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center max-w-lg w-full">
          <div className="skeleton h-12 w-3/4 mx-auto mb-4" />
          <div className="skeleton h-6 w-full mx-auto mb-8" />
          <div className="flex gap-4 justify-center">
            <div className="skeleton h-12 w-36 rounded-full" />
            <div className="skeleton h-12 w-36 rounded-full" />
          </div>
        </div>
      </div>

      {/* Skeleton Categories */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="skeleton h-8 w-48 mx-auto mb-10" />
          <div className="grid grid-cols-5 gap-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="skeleton h-32 rounded-xl" />
            ))}
          </div>
        </div>
      </section>

      {/* Skeleton Products */}
      <section className="py-16 px-4 bg-[#f8fafc]">
        <div className="max-w-7xl mx-auto">
          <div className="skeleton h-8 w-64 mx-auto mb-10" />
          <div className="grid grid-cols-4 gap-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="space-y-3">
                <div className="skeleton h-48 rounded-xl" />
                <div className="skeleton h-4 w-3/4" />
                <div className="skeleton h-6 w-1/2" />
                <div className="skeleton h-10 w-full rounded-lg" />
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
