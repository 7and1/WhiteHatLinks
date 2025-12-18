export default function BlogLoading() {
  return (
    <div className="container py-16">
      {/* Header skeleton */}
      <div className="max-w-2xl mb-10">
        <div className="h-10 w-48 bg-muted rounded animate-pulse mb-4" />
        <div className="h-6 w-full max-w-md bg-muted rounded animate-pulse" />
      </div>

      {/* Blog cards skeleton */}
      <div className="grid gap-6 md:grid-cols-2">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="rounded-lg border p-6 shadow-sm">
            <div className="h-4 w-24 bg-muted rounded animate-pulse mb-3" />
            <div className="h-6 w-full bg-muted rounded animate-pulse mb-2" />
            <div className="h-4 w-3/4 bg-muted rounded animate-pulse mb-4" />
            <div className="space-y-2">
              <div className="h-4 w-full bg-muted rounded animate-pulse" />
              <div className="h-4 w-2/3 bg-muted rounded animate-pulse" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
