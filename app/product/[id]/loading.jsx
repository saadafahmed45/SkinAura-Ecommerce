export default function ProductLoading() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 py-12">
      <div className="animate-pulse space-y-8">
        <div className="h-4 w-48 bg-skin-sand/60 rounded" />
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          <div className="lg:col-span-7 aspect-square bg-skin-sand/40 rounded-3xl" />
          <div className="lg:col-span-5 space-y-6 pt-4">
            <div className="h-4 w-24 bg-skin-sand/60 rounded" />
            <div className="h-10 w-3/4 bg-skin-sand/60 rounded" />
            <div className="h-6 w-36 bg-skin-sand/60 rounded" />
            <div className="h-24 w-full bg-skin-sand/40 rounded-2xl" />
            <div className="h-12 w-full bg-skin-sand/60 rounded-xl" />
          </div>
        </div>
      </div>
    </div>
  );
}
