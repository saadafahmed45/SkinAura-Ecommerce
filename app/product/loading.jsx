export default function CatalogLoading() {
  return (
    <div className="min-h-screen bg-[#FCFAF7]">
      <div className="bg-skin-charcoal text-white pt-28 pb-12 px-5 sm:px-8 md:px-12">
        <div className="max-w-7xl mx-auto space-y-3 animate-pulse">
          <div className="h-3 w-32 bg-white/20 rounded" />
          <div className="h-8 w-64 bg-white/30 rounded" />
          <div className="h-4 w-96 bg-white/20 rounded" />
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-5 sm:px-8 md:px-12 py-10">
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 animate-pulse">
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="rounded-2xl border border-skin-sand/40 p-4 bg-white space-y-4"
            >
              <div className="h-52 bg-skin-sand/30 rounded-xl w-full" />
              <div className="h-3 w-16 bg-skin-sand/40 rounded" />
              <div className="h-4 w-3/4 bg-skin-sand/40 rounded" />
              <div className="h-4 w-20 bg-skin-sand/30 rounded" />
              <div className="h-9 w-full bg-skin-sand/20 rounded-xl" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
