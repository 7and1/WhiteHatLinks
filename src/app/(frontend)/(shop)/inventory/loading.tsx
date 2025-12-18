export default function InventoryLoading() {
  return (
    <div className="container py-20 mx-auto px-4">
      {/* Header skeleton */}
      <div className="mb-12 text-center max-w-4xl mx-auto">
        <div className="h-4 w-24 bg-muted rounded animate-pulse mx-auto mb-2" />
        <div className="h-12 w-80 bg-muted rounded animate-pulse mx-auto mb-6" />
        <div className="h-6 w-full max-w-xl bg-muted rounded animate-pulse mx-auto mb-4" />
        <div className="h-4 w-40 bg-muted rounded animate-pulse mx-auto" />
      </div>

      {/* Filters skeleton */}
      <div className="space-y-4 p-4 rounded-lg border bg-card mb-6">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i}>
              <div className="h-3 w-16 bg-muted rounded animate-pulse mb-1.5" />
              <div className="h-9 bg-muted rounded animate-pulse" />
            </div>
          ))}
        </div>
        <div className="flex gap-2 pt-2">
          <div className="h-9 w-28 bg-muted rounded animate-pulse" />
          <div className="h-9 w-24 bg-muted rounded animate-pulse" />
        </div>
      </div>

      {/* Results count skeleton */}
      <div className="h-5 w-48 bg-muted rounded animate-pulse mb-6" />

      {/* Table skeleton */}
      <div className="rounded-lg border shadow-sm overflow-hidden">
        {/* Header */}
        <div className="bg-muted/60 px-4 py-3">
          <div className="grid grid-cols-7 gap-4">
            {[1, 2, 3, 4, 5, 6, 7].map((i) => (
              <div key={i} className="h-4 bg-muted rounded animate-pulse" />
            ))}
          </div>
        </div>
        {/* Rows */}
        {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
          <div key={i} className="border-t px-4 py-4">
            <div className="grid grid-cols-7 gap-4 items-center">
              {/* Site */}
              <div className="space-y-2">
                <div className="h-4 w-32 bg-muted rounded animate-pulse" />
                <div className="h-5 w-16 bg-muted rounded animate-pulse" />
              </div>
              {/* Metrics */}
              <div className="space-y-1">
                <div className="h-4 w-16 bg-muted rounded animate-pulse" />
                <div className="h-3 w-20 bg-muted rounded animate-pulse" />
              </div>
              {/* Traffic */}
              <div className="space-y-1">
                <div className="h-4 w-20 bg-muted rounded animate-pulse" />
                <div className="h-3 w-16 bg-muted rounded animate-pulse" />
              </div>
              {/* Quality */}
              <div className="space-y-1">
                <div className="h-5 w-16 bg-muted rounded animate-pulse" />
                <div className="h-5 w-20 bg-muted rounded animate-pulse" />
              </div>
              {/* Region */}
              <div className="h-4 w-12 bg-muted rounded animate-pulse" />
              {/* Price */}
              <div className="h-5 w-14 bg-muted rounded animate-pulse" />
              {/* Action */}
              <div className="h-9 w-20 bg-muted rounded animate-pulse ml-auto" />
            </div>
          </div>
        ))}
      </div>

      {/* Pagination skeleton */}
      <div className="flex justify-center gap-2 mt-6">
        <div className="h-9 w-20 bg-muted rounded animate-pulse" />
        <div className="h-9 w-10 bg-muted rounded animate-pulse" />
        <div className="h-9 w-10 bg-muted rounded animate-pulse" />
        <div className="h-9 w-10 bg-muted rounded animate-pulse" />
        <div className="h-9 w-20 bg-muted rounded animate-pulse" />
      </div>
    </div>
  )
}
