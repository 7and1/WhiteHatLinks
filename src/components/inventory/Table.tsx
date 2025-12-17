'use client'
import { useMemo } from 'react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { InquiryDialog } from '@/app/(shop)/inventory/InquiryDialog'

export function InventoryTable({ initialData }: { initialData: any[] }) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const pathname = usePathname()

  const current = useMemo(() => new URLSearchParams(searchParams?.toString()), [searchParams])

  const setParam = (key: string, value: string) => {
    const next = new URLSearchParams(current)
    if (value) next.set(key, value)
    else next.delete(key)
    router.replace(`${pathname}?${next.toString()}`)
  }

  const niche = searchParams?.get('niche') ?? ''
  const minDr = searchParams?.get('min_dr') ?? ''
  const maxPrice = searchParams?.get('max_price') ?? ''

  const filtered = initialData.filter((item) => {
    const nicheOk = niche ? item.niche?.toLowerCase().includes(niche.toLowerCase()) : true
    const drOk = minDr ? Number(item.dr) >= Number(minDr) : true
    const priceOk = maxPrice ? Number(item.price) <= Number(maxPrice) : true
    return nicheOk && drOk && priceOk
  })

  return (
    <div className="space-y-4">
      <div className="grid gap-3 md:grid-cols-[1.2fr_1fr_1fr]">
        <Input placeholder="Filter by niche (e.g. saas)" value={niche} onChange={(e) => setParam('niche', e.target.value)} />
        <Input placeholder="Min DR" type="number" value={minDr} onChange={(e) => setParam('min_dr', e.target.value)} />
        <Input placeholder="Max price" type="number" value={maxPrice} onChange={(e) => setParam('max_price', e.target.value)} />
      </div>
      <div className="rounded-lg border shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Niche</TableHead>
              <TableHead>Metrics</TableHead>
              <TableHead>Region</TableHead>
              <TableHead>Price</TableHead>
              <TableHead className="text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((item) => (
              <TableRow key={item.id}>
                <TableCell><Badge variant="outline" className="capitalize">{item.niche}</Badge></TableCell>
                <TableCell>
                  <div className="flex flex-col">
                    <span className="font-semibold">DR {item.dr}</span>
                    <span className="text-xs text-muted-foreground">{item.traffic?.toLocaleString?.() ?? 'N/A'} traffic</span>
                  </div>
                </TableCell>
                <TableCell>{item.region ?? 'Global'}</TableCell>
                <TableCell className="font-semibold">${item.price}</TableCell>
                <TableCell className="text-right"><InquiryDialog item={item} /></TableCell>
              </TableRow>
            ))}
            {filtered.length === 0 && (
              <TableRow>
                <TableCell className="px-4 py-6 text-center text-muted-foreground" colSpan={5}>No items match these filters yet.</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="text-xs text-muted-foreground">Filters are shareable via URL params (?niche=tech&min_dr=50&max_price=300).</div>
      <Button variant="ghost" onClick={() => router.replace(pathname)}>Reset filters</Button>
    </div>
  )
}
