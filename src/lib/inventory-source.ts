import { getPayload } from 'payload'
import configPromise from '@payload-config'

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

let inventoryCache: InventoryItem[] | null = null
let cacheTimestamp: number = 0
const CACHE_TTL = 5 * 60 * 1000 // 5 minutes

function parseNumber(input: unknown): number | null {
  if (input === null || input === undefined) return null
  if (typeof input === 'number' && !Number.isNaN(input)) return input
  if (typeof input !== 'string') return null
  const cleaned = input.replace(/[^0-9.\-]/g, '')
  const value = Number(cleaned)
  return Number.isFinite(value) ? value : null
}

function inferNiche(domain: string, sampleUrls?: string[]): string {
  const d = domain.toLowerCase()

  // High priority niches (from domain)
  if (/(crypto|blockchain|bitcoin|defi|web3|nft|coin)/.test(d)) return 'Crypto'
  if (/(financ|bank|loan|credit|invest|fund|stock|forex|money)/.test(d)) return 'Finance'
  if (/(health|medic|clinic|wellness|fitness|care|pharma|hospital|doctor)/.test(d)) return 'Health'
  if (/(saas|software.*service)/.test(d)) return 'SaaS'
  if (/(tech|ai\b|data|cloud|dev|code|app|software|digital|cyber)/.test(d)) return 'Tech'
  if (/(marketing|seo|advertis|brand|media|agency)/.test(d)) return 'Marketing'
  if (/(travel|tour|hotel|flight|vacation|trip)/.test(d)) return 'Travel'
  if (/(fashion|style|beauty|cosmetic|makeup)/.test(d)) return 'Fashion'
  if (/(food|recipe|restaurant|cook|cuisine|dining)/.test(d)) return 'Food'
  if (/(sport|athlet|fitness|gym|yoga|soccer|football|basketball)/.test(d)) return 'Sports'
  if (/(edu|learn|course|academ|tutor|school|university)/.test(d)) return 'Education'
  if (/(game|gaming|esport|play|gamer)/.test(d)) return 'Gaming'
  if (/(legal|law|lawyer|attorney|court|justice)/.test(d)) return 'Legal'
  if (/(real.*estate|property|realty|housing|home)/.test(d)) return 'Real Estate'
  if (/(business|entrepreneur|startup|company|enterprise)/.test(d)) return 'Business'

  // Secondary analysis from sample URLs
  if (sampleUrls && sampleUrls.length > 0) {
    const urlText = sampleUrls.join(' ').toLowerCase()
    if (/(crypto|blockchain|bitcoin)/.test(urlText)) return 'Crypto'
    if (/(saas|software.*as.*service)/.test(urlText)) return 'SaaS'
    if (/(health|medical|wellness)/.test(urlText)) return 'Health'
    if (/(marketing|seo|digital.*marketing)/.test(urlText)) return 'Marketing'
    if (/(finance|invest|trading)/.test(urlText)) return 'Finance'
  }

  // Generic domains (news/blog/media)
  if (/(news|blog|media|magazine|journal|post|bulletin|press)/.test(d)) return 'News & Media'

  return 'General'
}

function normalizeCountry(country?: string | null): string {
  if (!country) return 'Global'
  if (country.includes('🇺🇸') || /US|United States/i.test(country)) return 'USA'
  if (country.includes('🇬🇧') || /UK|United Kingdom/i.test(country)) return 'UK'
  if (country.includes('🇨🇦') || /Canada/i.test(country)) return 'Canada'
  if (country.includes('🇦🇺') || /Australia/i.test(country)) return 'Australia'
  if (country.includes('🇩🇪') || /Germany|DE/i.test(country)) return 'Germany'
  if (country.includes('🇫🇷') || /France|FR/i.test(country)) return 'France'
  if (country.includes('🇮🇳') || /India|IN/i.test(country)) return 'India'
  return country.replace(/[^A-Za-z\s]/g, '').trim() || 'Global'
}

function transformRecord(raw: any): InventoryItem | null {
  if (!raw || typeof raw !== 'object' || raw.success === false) return null
  const data = raw.data || {}

  const domain: string = raw.domain || raw.site || raw.url
  if (!domain) return null

  // Parse DR (priority: Ahrefs DR > Moz DA)
  const ahrefsDR = parseNumber(data.ahrefsDR)
  const mozDA = parseNumber(data.mozDA)
  const dr = ahrefsDR ?? mozDA
  const semrushAS = parseNumber(data.semrushAS)

  // Traffic (keep all sources, main traffic uses max value)
  const trafficAhrefs = parseNumber(data.ahrefsOrganicTraffic)
  const trafficSimilarweb = parseNumber(data.similarwebTraffic)
  const trafficSemrush = parseNumber(data.semrushTotalTraffic)
  const traffic = Math.max(trafficAhrefs ?? 0, trafficSimilarweb ?? 0, trafficSemrush ?? 0)

  // Referring domains
  const referringDomains = parseNumber(data.referralDomains)

  // Price (keep all prices, main price uses contentPlacement)
  const priceContentPlacement = parseNumber(data.contentPlacementPrice)
  const priceWritingPlacement = parseNumber(data.writingPlacementPrice)
  const priceSpecialTopic = parseNumber(data.specialTopicPrice)
  const basePrice = priceContentPlacement ?? priceWritingPlacement ?? priceSpecialTopic

  if (!dr || !basePrice) return null
  const price = Math.round(basePrice * 2)

  // Spam Score (1% → 1)
  const spamScoreStr = data.spamScore?.replace(/[^0-9]/g, '') || '0'
  const spamScore = parseInt(spamScoreStr) || 0

  // Google News
  const googleNews = /yes/i.test(data.googleNews || '')

  // Completion Rate & Avg Lifetime
  const completionRate = parseNumber(data.completionRate?.replace?.('%', ''))
  const avgLifetime = parseNumber(data.avgLifetimeOfLinks?.replace?.('%', ''))

  // Link Type
  let linkType: 'Dofollow' | 'Nofollow' | 'Unknown' = 'Unknown'
  if (/dofollow/i.test(data.linkAttributionType || '')) linkType = 'Dofollow'
  else if (/nofollow/i.test(data.linkAttributionType || '')) linkType = 'Nofollow'

  // Content Size ("500 words" → 500)
  const contentSizeMatch = data.requiredContentSize?.match?.(/\d+/)
  const contentSize = contentSizeMatch ? parseInt(contentSizeMatch[0]) : undefined

  // TAT (turnaround time)
  const tat = data.tat?.split?.('\n')?.[0] || data.tat

  return {
    id: String(raw.siteId || domain),
    niche: inferNiche(domain, data.sampleUrls),
    dr,
    traffic,
    price,
    region: normalizeCountry(data.country),
    domain,
    status: 'Available',
    createdAt: raw.timestamp,
    // New fields
    spamScore,
    googleNews,
    mozDA: mozDA ?? undefined,
    semrushAS: semrushAS ?? undefined,
    referringDomains: referringDomains ?? undefined,
    completionRate: completionRate ?? undefined,
    avgLifetime: avgLifetime ?? undefined,
    tat,
    linkType,
    language: data.language || 'English',
    contentSize,
    sampleUrls: data.sampleUrls?.slice?.(0, 5),
    trafficAhrefs: trafficAhrefs ?? undefined,
    trafficSimilarweb: trafficSimilarweb ?? undefined,
    trafficSemrush: trafficSemrush ?? undefined,
  }
}

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
    const mapped = (parsed as any[])?.map(transformRecord).filter(Boolean) as InventoryItem[]
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
  return docs.map((doc: any) => ({
    id: String(doc.id),
    niche: doc.niche,
    dr: doc.dr,
    traffic: doc.traffic,
    price: doc.price,
    region: doc.region,
    domain: doc.domain,
    status: doc.status,
    createdAt: doc.createdAt,
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

export async function getInventory(query: InventoryQuery = {}): Promise<InventoryItem[]> {
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
  query: Omit<InventoryQuery, 'limit' | 'offset'> = {}
): Promise<number> {
  const results = await getInventory({ ...query, limit: undefined, offset: undefined })
  return results.length
}

export async function getInventoryNiches(limit = 20): Promise<string[]> {
  const data = await getInventory({ limit: undefined })
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

export async function getInventoryRegions(): Promise<string[]> {
  const data = await getInventory({ limit: undefined })
  const regions = Array.from(new Set(data.map((i) => i.region).filter(Boolean))) as string[]
  return regions.sort()
}

export function clearInventoryCache() {
  inventoryCache = null
  cacheTimestamp = 0
}
