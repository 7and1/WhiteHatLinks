/**
 * JSON Inventory Utilities
 *
 * Shared utilities for transforming raw JSON inventory data
 * Used by both inventory-source.ts and import scripts
 */

import type { InventoryItem } from './inventory-source'

// Raw data structure from JSON file
export interface RawInventoryData {
  ahrefsDR?: string | number | null
  mozDA?: string | number | null
  semrushAS?: string | number | null
  ahrefsOrganicTraffic?: string | number | null
  similarwebTraffic?: string | number | null
  semrushTotalTraffic?: string | number | null
  referralDomains?: string | number | null
  contentPlacementPrice?: string | number | null
  writingPlacementPrice?: string | number | null
  specialTopicPrice?: string | number | null
  spamScore?: string | null
  googleNews?: string | null
  completionRate?: string | null
  avgLifetimeOfLinks?: string | null
  linkAttributionType?: string | null
  requiredContentSize?: string | null
  tat?: string | null
  country?: string | null
  language?: string | null
  sampleUrls?: string[]
}

export interface RawInventoryRecord {
  domain?: string
  site?: string
  url?: string
  siteId?: string | number
  timestamp?: string
  success?: boolean
  data?: RawInventoryData
}

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

export function transformRecord(raw: RawInventoryRecord, index?: number): InventoryItem | null {
  if (!raw || typeof raw !== 'object' || raw.success === false) return null
  const data: RawInventoryData = raw.data || {}

  const domain = raw.domain || raw.site || raw.url
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

  // Generate unique ID: prefer siteId with domain suffix to handle duplicates
  // If no siteId, use domain with optional index suffix
  const baseId = raw.siteId ? `${raw.siteId}-${domain}` : domain
  const uniqueId = index !== undefined ? `${baseId}-${index}` : baseId

  return {
    id: uniqueId,
    niche: inferNiche(domain, data.sampleUrls),
    dr,
    traffic,
    price,
    region: normalizeCountry(data.country) || undefined,
    domain,
    status: 'Available',
    createdAt: raw.timestamp || undefined,
    // New fields
    spamScore,
    googleNews,
    mozDA: mozDA ?? undefined,
    semrushAS: semrushAS ?? undefined,
    referringDomains: referringDomains ?? undefined,
    completionRate: completionRate ?? undefined,
    avgLifetime: avgLifetime ?? undefined,
    tat: tat || undefined,
    linkType,
    language: data.language || 'English',
    contentSize,
    sampleUrls: data.sampleUrls?.slice?.(0, 5),
    trafficAhrefs: trafficAhrefs ?? undefined,
    trafficSimilarweb: trafficSimilarweb ?? undefined,
    trafficSemrush: trafficSemrush ?? undefined,
  }
}
