// ─── Servis Page Loading Skeleton ──────────────────────────────────────────

export default function ServisLoading() {
  return (
    <div className="min-h-screen bg-[#f8fafc] pt-20 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="skeleton h-9 w-36 mb-2" />
        <div className="skeleton h-5 w-56 mb-8" />
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="skeleton h-28 rounded-xl" />
          ))}
        </div>
      </div>
    </div>
  );
}
