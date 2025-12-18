export default function Loading() {
  return (
    <div className="container py-16">
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <div className="relative">
          {/* Spinner */}
          <div className="h-12 w-12 rounded-full border-4 border-muted border-t-primary animate-spin" />
        </div>
        <p className="mt-4 text-sm text-muted-foreground">Loading...</p>
      </div>
    </div>
  )
}
