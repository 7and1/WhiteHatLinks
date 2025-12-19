import { getPayload } from 'payload'
import configPromise from '@payload-config'
import {
  getInventoryFromD1,
  getInventoryCountFromD1,
  getInventoryNichesFromD1,
  getInventoryRegionsFromD1,
} from './inventory-source-d1'
import { transformRecord, type RawInventoryRecord } from './inventory-source-json-utils'

export interface InventoryItem {
  id: string
  niche: string
  dr: number
  traffic: number
  price: number
  region?: string
  domain?: string
  status: string
  createdAt?: string
  // New fields
  spamScore: number
  googleNews: boolean
  mozDA?: number
  semrushAS?: number
  referringDomains?: number
  completionRate?: number
  avgLifetime?: number
  tat?: string
  linkType: 'Dofollow' | 'Nofollow' | 'Unknown'
  language?: string
  contentSize?: number
  sampleUrls?: string[]
  trafficAhrefs?: number
  trafficSimilarweb?: number
  trafficSemrush?: number
}

const DEFAULT_JSON_PATH =
  process.env.INVENTORY_JSON_PATH ||
  '/Volumes/SSD/dev/links/dobacklinks/scraper/active-sites-incremental.json'

// In-memory cache for inventory data
// Reduces database/file system access significantly
// In-memory cache for inventory data
let inventoryCache: InventoryItem[] | null = null
let cacheTimestamp: number = 0
const CACHE_TTL = 5 * 60 * 1000 // 5 minutes - balances freshness and performance

async function loadFromJson(): Promise<InventoryItem[] | null> {
  const now = Date.now()

  // Check if cache is still valid
  if (inventoryCache && now - cacheTimestamp < CACHE_TTL) {
    return inventoryCache
  }

  try {
    // Use dynamic imports so Cloudflare/edge builds don't bundle fs
    const fs = await import('fs/promises')
    const file = await fs.readFile(DEFAULT_JSON_PATH, 'utf-8')
    const parsed = JSON.parse(file)
    const rawRecords = Array.isArray(parsed) ? parsed : []
    const mapped = rawRecords
      .map((record: unknown, index: number) => transformRecord(record as RawInventoryRecord, index))
      .filter((item): item is InventoryItem => item !== null)
    inventoryCache = mapped.sort((a, b) => b.dr - a.dr)
    cacheTimestamp = now
    return inventoryCache
  } catch (err) {
    console.error('Failed to load inventory JSON. Falling back to database.', err)
    return null
  }
}

async function loadFromPayload(): Promise<InventoryItem[]> {
  const payload = await getPayload({ config: configPromise })
  const { docs } = await payload.find({
    collection: 'inventory',
    limit: 500,
    where: { status: { equals: 'Available' } },
    sort: '-dr',
  })
  return docs.map((doc) => ({
    id: String(doc.id),
    niche: String(doc.niche),
    dr: Number(doc.dr),
    traffic: Number(doc.traffic),
    price: Number(doc.price),
    region: doc.region ? String(doc.region) : undefined,
    domain: doc.domain ? String(doc.domain) : undefined,
    status: String(doc.status),
    createdAt: doc.createdAt ? String(doc.createdAt) : undefined,
    // Default values for new fields when loading from Payload
    spamScore: 0,
    googleNews: false,
    linkType: 'Unknown' as const,
  }))
}

export interface InventoryQuery {
  niche?: string
  minDr?: number
  maxPrice?: number
  limit?: number
  sort?: 'dr' | 'traffic' | 'price' | 'recent'
  // New query params
  maxSpamScore?: number
  minTraffic?: number
  googleNewsOnly?: boolean
  linkType?: 'Dofollow' | 'Nofollow'
  region?: string
  language?: string
  offset?: number
}

/**
 * Get inventory from D1 if available
 */
async function loadFromD1(query: InventoryQuery, env?: { D1?: D1Database }): Promise<InventoryItem[] | null> {
  if (!env?.D1) {
    return null
  }

  try {
    return await getInventoryFromD1(env.D1, query)
  } catch (error) {
    console.error('Failed to load inventory from D1:', error)
    return null
  }
}

export async function getInventory(
  query: InventoryQuery = {},
  env?: { D1?: D1Database }
): Promise<InventoryItem[]> {
  // Try D1 first (production), then JSON (local dev), finally Payload (fallback)
  const d1Results = await loadFromD1(query, env)
  if (d1Results) {
    return d1Results
  }

  // Fallback to JSON/Payload with client-side filtering
  const source = (await loadFromJson()) ?? (await loadFromPayload())

  const niche = query.niche?.toLowerCase()
  const minDr = query.minDr ?? 0
  const maxPrice = query.maxPrice
  const maxSpamScore = query.maxSpamScore
  const minTraffic = query.minTraffic ?? 0

  let results = source.filter((item) => {
    const nicheOk = niche
      ? item.niche.toLowerCase() === niche || item.niche.toLowerCase().includes(niche)
      : true
    const drOk = item.dr >= minDr
    const priceOk = maxPrice ? item.price <= maxPrice : true
    const spamOk = maxSpamScore !== undefined ? item.spamScore <= maxSpamScore : true
    const newsOk = query.googleNewsOnly ? item.googleNews : true
    const trafficOk = item.traffic >= minTraffic
    const linkTypeOk = query.linkType ? item.linkType === query.linkType : true
    const regionOk = query.region ? item.region === query.region : true
    const languageOk = query.language ? item.language === query.language : true
    const statusOk = item.status === 'Available'

    return nicheOk && drOk && priceOk && spamOk && newsOk && trafficOk && linkTypeOk && regionOk && languageOk && statusOk
  })

  switch (query.sort) {
    case 'traffic':
      results = results.sort((a, b) => (b.traffic || 0) - (a.traffic || 0))
      break
    case 'price':
      results = results.sort((a, b) => a.price - b.price)
      break
    case 'recent':
      results = results.sort((a, b) => Date.parse(b.createdAt || '0') - Date.parse(a.createdAt || '0'))
      break
    default:
      results = results.sort((a, b) => b.dr - a.dr)
  }

  // Pagination
  const offset = query.offset ?? 0
  if (query.limit) {
    return results.slice(offset, offset + query.limit)
  }
  return results.slice(offset)
}

export async function getInventoryCount(
  query: Omit<InventoryQuery, 'limit' | 'offset'> = {},
  env?: { D1?: D1Database }
): Promise<number> {
  // Try D1 first for efficient counting
  if (env?.D1) {
    try {
      return await getInventoryCountFromD1(env.D1, query)
    } catch (error) {
      console.error('Failed to get count from D1:', error)
    }
  }

  // Fallback to loading all and counting
  const results = await getInventory({ ...query, limit: undefined, offset: undefined }, env)
  return results.length
}

export async function getInventoryNiches(
  limit = 20,
  env?: { D1?: D1Database }
): Promise<string[]> {
  // Try D1 first for efficient grouping
  if (env?.D1) {
    try {
      return await getInventoryNichesFromD1(env.D1, limit)
    } catch (error) {
      console.error('Failed to get niches from D1:', error)
    }
  }

  // Fallback to loading all and grouping
  const data = await getInventory({ limit: undefined }, env)
  const nicheCounts = new Map<string, number>()
  data.forEach((item) => {
    nicheCounts.set(item.niche, (nicheCounts.get(item.niche) || 0) + 1)
  })
  // Sort by count descending
  const sorted = Array.from(nicheCounts.entries())
    .sort((a, b) => b[1] - a[1])
    .map(([niche]) => niche)
  return sorted.slice(0, limit)
}

export async function getInventoryRegions(env?: { D1?: D1Database }): Promise<string[]> {
  // Try D1 first for efficient distinct query
  if (env?.D1) {
    try {
      return await getInventoryRegionsFromD1(env.D1)
    } catch (error) {
      console.error('Failed to get regions from D1:', error)
    }
  }

  // Fallback to loading all and filtering
  const data = await getInventory({ limit: undefined }, env)
  const regions = Array.from(new Set(data.map((i) => i.region).filter(Boolean))) as string[]
  return regions.sort()
}

export function clearInventoryCache() {
  inventoryCache = null
  cacheTimestamp = 0
}
