'use client'

import { useState, useMemo, Fragment } from 'react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { InquiryDialog } from '@/app/(frontend)/(shop)/inventory/InquiryDialog'
import { InventoryFilters } from './Filters'
import { InventoryPagination } from './Pagination'
import type { InventoryItem } from '@/lib/inventory-source'
import { cn } from '@/lib/utils'

const ITEMS_PER_PAGE = 20

interface InventoryTableProps {
  initialData: InventoryItem[]
  totalCount: number
  availableNiches: string[]
  availableRegions: string[]
}

export function InventoryTable({
  initialData,
  totalCount,
  availableNiches,
  availableRegions,
}: InventoryTableProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const pathname = usePathname()

  const [currentPage, setCurrentPage] = useState(1)
  const [expandedRow, setExpandedRow] = useState<string | null>(null)

  const updateParams = (updates: Record<string, string | undefined>) => {
    const params = new URLSearchParams(searchParams?.toString())
    Object.entries(updates).forEach(([key, value]) => {
      if (value) params.set(key, value)
      else params.delete(key)
    })
    router.replace(`${pathname}?${params.toString()}`)
    setCurrentPage(1)
  }

  // Paginate data
  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE
    const end = start + ITEMS_PER_PAGE
    return initialData.slice(start, end)
  }, [initialData, currentPage])

  const totalPages = Math.ceil(initialData.length / ITEMS_PER_PAGE)

  const toggleRow = (id: string) => {
    setExpandedRow(expandedRow === id ? null : id)
  }

  return (
    <div className="space-y-6">
      {/* Filters */}
      <InventoryFilters
        onUpdate={updateParams}
        availableNiches={availableNiches}
        availableRegions={availableRegions}
      />

      {/* Results count */}
      <div className="text-sm text-muted-foreground">
        Showing {((currentPage - 1) * ITEMS_PER_PAGE) + 1}-
        {Math.min(currentPage * ITEMS_PER_PAGE, initialData.length)} of{' '}
        {initialData.length.toLocaleString()} results
        {initialData.length < totalCount && (
          <span className="ml-1">
            (filtered from {totalCount.toLocaleString()} total)
          </span>
        )}
      </div>

      {/* Table */}
      <div className="rounded-lg border shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="border-t-0">
                <TableHead className="min-w-[180px]">Site & Niche</TableHead>
                <TableHead className="min-w-[120px]">DR / DA</TableHead>
                <TableHead className="min-w-[100px]">Traffic</TableHead>
                <TableHead className="min-w-[140px]">Quality</TableHead>
                <TableHead className="min-w-[80px]">Region</TableHead>
                <TableHead className="min-w-[80px]">Price</TableHead>
                <TableHead className="text-right min-w-[100px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedData.map((item) => (
                <Fragment key={item.id}>
                  <TableRow
                    className={cn(
                      'cursor-pointer hover:bg-muted/50 transition-colors',
                      expandedRow === item.id && 'bg-muted/30'
                    )}
                    onClick={() => toggleRow(item.id)}
                  >
                    {/* Site & Niche */}
                    <TableCell>
                      <div className="flex flex-col gap-1">
                        <span className="font-medium text-sm truncate max-w-[160px]" title={item.domain}>
                          {item.domain}
                        </span>
                        <Badge variant="outline" className="capitalize w-fit text-xs">
                          {item.niche}
                        </Badge>
                      </div>
                    </TableCell>

                    {/* Metrics: DR + DA + RDs */}
                    <TableCell>
                      <div className="flex flex-col gap-0.5">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold">DR {item.dr}</span>
                          {item.mozDA && item.mozDA !== item.dr && (
                            <span className="text-xs text-muted-foreground">DA {item.mozDA}</span>
                          )}
                        </div>
                        {item.referringDomains && (
                          <span className="text-xs text-muted-foreground">
                            {item.referringDomains.toLocaleString()} RDs
                          </span>
                        )}
                      </div>
                    </TableCell>

                    {/* Traffic */}
                    <TableCell>
                      <div className="flex flex-col gap-0.5">
                        <span className="font-semibold text-sm">
                          {item.traffic.toLocaleString()}
                        </span>
                        <span className="text-xs text-muted-foreground">organic/mo</span>
                      </div>
                    </TableCell>

                    {/* Quality: Spam + Google News + Link Type */}
                    <TableCell>
                      <div className="flex flex-col gap-1">
                        <Badge
                          variant={item.spamScore <= 3 ? 'default' : item.spamScore <= 10 ? 'secondary' : 'outline'}
                          className="text-xs w-fit"
                        >
                          Spam {item.spamScore}%
                        </Badge>
                        <div className="flex flex-wrap gap-1">
                          {item.googleNews && (
                            <Badge variant="outline" className="text-xs">
                              G News
                            </Badge>
                          )}
                          {item.linkType !== 'Unknown' && (
                            <Badge
                              variant={item.linkType === 'Dofollow' ? 'default' : 'outline'}
                              className="text-xs"
                            >
                              {item.linkType}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </TableCell>

                    {/* Region */}
                    <TableCell>
                      <span className="text-sm">{item.region || 'Global'}</span>
                    </TableCell>

                    {/* Price */}
                    <TableCell>
                      <span className="font-semibold">
                        ${item.price >= 100
                          ? `${Math.floor(item.price / 100)}**`
                          : `${String(item.price)[0]}*`}
                      </span>
                    </TableCell>

                    {/* Action */}
                    <TableCell className="text-right" onClick={(e) => e.stopPropagation()}>
                      <InquiryDialog item={item} />
                    </TableCell>
                  </TableRow>

                  {/* Expanded row details */}
                  {expandedRow === item.id && (
                    <TableRow>
                      <TableCell colSpan={7} className="bg-muted/20 p-0">
                        <div className="p-4 space-y-4">
                          {/* Stats grid */}
                          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
                            {item.completionRate !== undefined && (
                              <div>
                                <span className="text-muted-foreground block text-xs">Completion Rate</span>
                                <span className="font-medium">{item.completionRate}%</span>
                              </div>
                            )}
                            {item.avgLifetime !== undefined && (
                              <div>
                                <span className="text-muted-foreground block text-xs">Avg Link Lifetime</span>
                                <span className="font-medium">{item.avgLifetime}%</span>
                              </div>
                            )}
                            {item.tat && (
                              <div>
                                <span className="text-muted-foreground block text-xs">Turnaround Time</span>
                                <span className="font-medium">{item.tat}</span>
                              </div>
                            )}
                            {item.contentSize && (
                              <div>
                                <span className="text-muted-foreground block text-xs">Min Content Size</span>
                                <span className="font-medium">{item.contentSize} words</span>
                              </div>
                            )}
                            {item.language && (
                              <div>
                                <span className="text-muted-foreground block text-xs">Language</span>
                                <span className="font-medium">{item.language}</span>
                              </div>
                            )}
                            {item.semrushAS && (
                              <div>
                                <span className="text-muted-foreground block text-xs">Semrush AS</span>
                                <span className="font-medium">{item.semrushAS}</span>
                              </div>
                            )}
                          </div>

                          {/* Traffic sources */}
                          {(item.trafficAhrefs || item.trafficSimilarweb || item.trafficSemrush) && (
                            <div className="text-xs text-muted-foreground border-t pt-3">
                              <span className="font-medium text-foreground">Traffic Sources: </span>
                              {item.trafficAhrefs && (
                                <span className="mr-3">Ahrefs: {item.trafficAhrefs.toLocaleString()}</span>
                              )}
                              {item.trafficSimilarweb && (
                                <span className="mr-3">Similarweb: {item.trafficSimilarweb.toLocaleString()}</span>
                              )}
                              {item.trafficSemrush && (
                                <span>Semrush: {item.trafficSemrush.toLocaleString()}</span>
                              )}
                            </div>
                          )}

                          {/* Sample URLs */}
                          {item.sampleUrls && item.sampleUrls.length > 0 && (
                            <div className="border-t pt-3">
                              <p className="text-xs font-medium mb-2">Sample Posts:</p>
                              <ul className="text-xs text-muted-foreground space-y-1">
                                {item.sampleUrls.slice(0, 3).map((url, i) => (
                                  <li key={i} className="truncate">
                                    <a
                                      href={url}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="hover:text-primary hover:underline"
                                      onClick={(e) => e.stopPropagation()}
                                    >
                                      {url}
                                    </a>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </Fragment>
              ))}

              {paginatedData.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} className="px-4 py-8 text-center text-muted-foreground">
                    No sites match your filters. Try adjusting your criteria.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Pagination */}
      <InventoryPagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />

      {/* URL hint */}
      <div className="text-xs text-muted-foreground text-center">
        Filters are shareable via URL. Click any row for more details.
      </div>
    </div>
  )
}
