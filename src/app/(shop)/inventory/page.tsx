import { getPayloadHMR } from '@payloadcms/next/utilities'
import configPromise from '@payload-config'
import { InventoryTable } from '@/components/inventory/Table'
import { ProductSchema } from '@/components/seo/Schema'
import { BreadcrumbSchema } from '@/components/seo'
import type { Metadata } from 'next'

export const dynamic = 'force-dynamic' // keep live inventory fresh

export const metadata: Metadata = {
  title: 'Premium Backlink Inventory',
  description:
    'Browse our vetted list of high DR guest post sites. Filter by niche, DR, and price. Transparent metrics, real traffic.',
  alternates: {
    canonical: 'https://whitehatlinks.io/inventory',
  },
  openGraph: {
    title: 'Premium Backlink Inventory | WhiteHatLinks',
    description: 'Browse our vetted list of high DR guest post sites.',
    url: 'https://whitehatlinks.io/inventory',
  },
}

interface InventoryItem {
  id: string
  niche: string
  dr: number
  traffic: number
  price: number
  region?: string
  status: string
}

export default async function InventoryPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}) {
  const params = await searchParams
  const payload = await getPayloadHMR({ config: configPromise })

  const nicheFilter = typeof params.niche === 'string' ? params.niche : undefined
  const minDr = typeof params.min_dr === 'string' ? parseInt(params.min_dr) : 0
  const maxPrice =
    typeof params.max_price === 'string' ? parseInt(params.max_price) : undefined

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const where: any = {
    status: { equals: 'Available' },
    dr: { greater_than_equal: minDr },
  }
  if (nicheFilter) where.niche = { equals: nicheFilter }
  if (maxPrice) where.price = { less_than_equal: maxPrice }

  const { docs } = await payload.find({
    collection: 'inventory',
    where,
    sort: '-traffic',
    limit: 100,
  })

  // Transform to typed inventory items
  const items: InventoryItem[] = docs.map((doc) => ({
    id: String(doc.id),
    niche: (doc.niche as string) || '',
    dr: (doc.dr as number) || 0,
    traffic: (doc.traffic as number) || 0,
    price: (doc.price as number) || 0,
    region: (doc.region as string) || undefined,
    status: (doc.status as string) || 'Available',
  }))

  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: 'Home', url: 'https://whitehatlinks.io' },
          { name: 'Inventory', url: 'https://whitehatlinks.io/inventory' },
        ]}
      />
      <ProductSchema items={items} />

      <div className="container py-20 mx-auto px-4">
        <div className="mb-10 text-center">
          <p className="text-sm font-semibold text-primary uppercase tracking-wide">Inventory</p>
          <h1 className="text-4xl font-bold tracking-tight text-foreground mt-2 mb-4">
            Live Backlink Inventory
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Browse {items.length} vetted sites with transparent metrics. Filter by niche, DR, and
            price.
            {nicheFilter && (
              <span className="font-semibold text-primary"> Filtered by: {nicheFilter}</span>
            )}
          </p>
        </div>
        <InventoryTable initialData={items} />
      </div>
    </>
  )
}
