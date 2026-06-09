// ─── Reload Page Loading Skeleton ──────────────────────────────────────────

export default function ReloadLoading() {
  return (
    <div className="min-h-screen bg-[#f8fafc] pt-20 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="skeleton h-9 w-48 mb-2" />
        <div className="skeleton h-5 w-72 mb-8" />
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="skeleton h-28 rounded-xl" />
          ))}
        </div>
      </div>
    </div>
  );
}
