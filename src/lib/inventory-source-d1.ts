/**
 * D1 Database Inventory Source
 *
 * This module provides inventory data access using Cloudflare D1 database.
 * Replaces JSON file loading with scalable database queries.
 */

import type { InventoryItem, InventoryQuery } from './inventory-source'

// D1 Database row structure
interface D1InventoryRow {
  id: string
  domain: string
  niche: string
  dr: number
  traffic: number
  price: number
  region: string | null
  status: string
  spam_score: number
  google_news: number
  moz_da: number | null
  semrush_as: number | null
  referring_domains: number | null
  completion_rate: number | null
  avg_lifetime: number | null
  tat: string | null
  link_type: string
  language: string
  content_size: number | null
  traffic_ahrefs: number | null
  traffic_similarweb: number | null
  traffic_semrush: number | null
  sample_urls: string | null
  created_at: string
  updated_at: string
}

/**
 * Transform D1 row to InventoryItem
 */
function transformD1Row(row: D1InventoryRow): InventoryItem {
  return {
    id: row.id,
    domain: row.domain,
    niche: row.niche,
    dr: row.dr,
    traffic: row.traffic,
    price: row.price,
    region: row.region || undefined,
    status: row.status,
    spamScore: row.spam_score,
    googleNews: row.google_news === 1,
    mozDA: row.moz_da || undefined,
    semrushAS: row.semrush_as || undefined,
    referringDomains: row.referring_domains || undefined,
    completionRate: row.completion_rate || undefined,
    avgLifetime: row.avg_lifetime || undefined,
    tat: row.tat || undefined,
    linkType: (row.link_type as 'Dofollow' | 'Nofollow' | 'Unknown') || 'Unknown',
    language: row.language || 'English',
    contentSize: row.content_size || undefined,
    trafficAhrefs: row.traffic_ahrefs || undefined,
    trafficSimilarweb: row.traffic_similarweb || undefined,
    trafficSemrush: row.traffic_semrush || undefined,
    sampleUrls: row.sample_urls ? JSON.parse(row.sample_urls) : undefined,
    createdAt: row.created_at,
  }
}

/**
 * Build WHERE clause from query parameters
 */
function buildWhereClause(query: InventoryQuery): { sql: string; params: unknown[] } {
  const conditions: string[] = []
  const params: unknown[] = []

  // Always filter by status = 'Available'
  conditions.push('status = ?')
  params.push('Available')

  // Niche filter
  if (query.niche) {
    conditions.push('(LOWER(niche) = LOWER(?) OR LOWER(niche) LIKE ?)')
    params.push(query.niche, `%${query.niche.toLowerCase()}%`)
  }

  // DR filter
  if (query.minDr !== undefined) {
    conditions.push('dr >= ?')
    params.push(query.minDr)
  }

  // Price filter
  if (query.maxPrice !== undefined) {
    conditions.push('price <= ?')
    params.push(query.maxPrice)
  }

  // Spam score filter
  if (query.maxSpamScore !== undefined) {
    conditions.push('spam_score <= ?')
    params.push(query.maxSpamScore)
  }

  // Traffic filter
  if (query.minTraffic !== undefined) {
    conditions.push('traffic >= ?')
    params.push(query.minTraffic)
  }

  // Google News filter
  if (query.googleNewsOnly) {
    conditions.push('google_news = 1')
  }

  // Link type filter
  if (query.linkType) {
    conditions.push('link_type = ?')
    params.push(query.linkType)
  }

  // Region filter
  if (query.region) {
    conditions.push('region = ?')
    params.push(query.region)
  }

  // Language filter
  if (query.language) {
    conditions.push('language = ?')
    params.push(query.language)
  }

  const sql = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : ''
  return { sql, params }
}

/**
 * Build ORDER BY clause from sort parameter
 */
function buildOrderByClause(sort?: string): string {
  switch (sort) {
    case 'traffic':
      return 'ORDER BY traffic DESC'
    case 'price':
      return 'ORDER BY price ASC'
    case 'recent':
      return 'ORDER BY created_at DESC'
    default:
      return 'ORDER BY dr DESC'
  }
}

/**
 * Get inventory items from D1 database
 */
export async function getInventoryFromD1(
  db: D1Database,
  query: InventoryQuery = {}
): Promise<InventoryItem[]> {
  try {
    const { sql: whereClause, params } = buildWhereClause(query)
    const orderByClause = buildOrderByClause(query.sort)
    const offset = query.offset ?? 0
    const limit = query.limit ?? 100

    // Build SQL query
    const sql = `
      SELECT *
      FROM inventory
      ${whereClause}
      ${orderByClause}
      LIMIT ? OFFSET ?
    `

    // Execute query
    const result = await db.prepare(sql).bind(...params, limit, offset).all<D1InventoryRow>()

    if (!result.success) {
      throw new Error('D1 query failed')
    }

    // Transform rows to InventoryItem
    return (result.results || []).map(transformD1Row)
  } catch (error) {
    console.error('Failed to load inventory from D1:', error)
    throw error
  }
}

/**
 * Get total count of inventory items matching query
 */
export async function getInventoryCountFromD1(
  db: D1Database,
  query: Omit<InventoryQuery, 'limit' | 'offset'> = {}
): Promise<number> {
  try {
    const { sql: whereClause, params } = buildWhereClause(query)

    const sql = `
      SELECT COUNT(*) as count
      FROM inventory
      ${whereClause}
    `

    const result = await db.prepare(sql).bind(...params).first<{ count: number }>()

    return result?.count ?? 0
  } catch (error) {
    console.error('Failed to get inventory count from D1:', error)
    throw error
  }
}

/**
 * Get all unique niches from inventory
 */
export async function getInventoryNichesFromD1(db: D1Database, limit = 20): Promise<string[]> {
  try {
    const sql = `
      SELECT niche, COUNT(*) as count
      FROM inventory
      WHERE status = 'Available'
      GROUP BY niche
      ORDER BY count DESC
      LIMIT ?
    `

    const result = await db.prepare(sql).bind(limit).all<{ niche: string }>()

    if (!result.success) {
      throw new Error('D1 query failed')
    }

    return (result.results || []).map((row) => row.niche)
  } catch (error) {
    console.error('Failed to get niches from D1:', error)
    throw error
  }
}

/**
 * Get all unique regions from inventory
 */
export async function getInventoryRegionsFromD1(db: D1Database): Promise<string[]> {
  try {
    const sql = `
      SELECT DISTINCT region
      FROM inventory
      WHERE status = 'Available' AND region IS NOT NULL
      ORDER BY region ASC
    `

    const result = await db.prepare(sql).all<{ region: string }>()

    if (!result.success) {
      throw new Error('D1 query failed')
    }

    return (result.results || []).map((row) => row.region)
  } catch (error) {
    console.error('Failed to get regions from D1:', error)
    throw error
  }
}

/**
 * Insert or update inventory item in D1
 */
export async function upsertInventoryItem(db: D1Database, item: InventoryItem): Promise<void> {
  try {
    const now = new Date().toISOString()

    const sql = `
      INSERT INTO inventory (
        id, domain, niche, dr, traffic, price, region, status,
        spam_score, google_news, moz_da, semrush_as, referring_domains,
        completion_rate, avg_lifetime, tat, link_type, language, content_size,
        traffic_ahrefs, traffic_similarweb, traffic_semrush, sample_urls,
        created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      ON CONFLICT(id) DO UPDATE SET
        domain = excluded.domain,
        niche = excluded.niche,
        dr = excluded.dr,
        traffic = excluded.traffic,
        price = excluded.price,
        region = excluded.region,
        status = excluded.status,
        spam_score = excluded.spam_score,
        google_news = excluded.google_news,
        moz_da = excluded.moz_da,
        semrush_as = excluded.semrush_as,
        referring_domains = excluded.referring_domains,
        completion_rate = excluded.completion_rate,
        avg_lifetime = excluded.avg_lifetime,
        tat = excluded.tat,
        link_type = excluded.link_type,
        language = excluded.language,
        content_size = excluded.content_size,
        traffic_ahrefs = excluded.traffic_ahrefs,
        traffic_similarweb = excluded.traffic_similarweb,
        traffic_semrush = excluded.traffic_semrush,
        sample_urls = excluded.sample_urls,
        updated_at = excluded.updated_at
    `

    await db
      .prepare(sql)
      .bind(
        item.id,
        item.domain || '',
        item.niche,
        item.dr,
        item.traffic,
        item.price,
        item.region || null,
        item.status,
        item.spamScore,
        item.googleNews ? 1 : 0,
        item.mozDA || null,
        item.semrushAS || null,
        item.referringDomains || null,
        item.completionRate || null,
        item.avgLifetime || null,
        item.tat || null,
        item.linkType,
        item.language || 'English',
        item.contentSize || null,
        item.trafficAhrefs || null,
        item.trafficSimilarweb || null,
        item.trafficSemrush || null,
        item.sampleUrls ? JSON.stringify(item.sampleUrls) : null,
        item.createdAt || now,
        now
      )
      .run()
  } catch (error) {
    console.error('Failed to upsert inventory item:', error)
    throw error
  }
}

/**
 * Batch insert inventory items
 */
export async function batchInsertInventory(
  db: D1Database,
  items: InventoryItem[]
): Promise<void> {
  try {
    // D1 batch API - max 500 statements per batch
    const BATCH_SIZE = 500
    for (let i = 0; i < items.length; i += BATCH_SIZE) {
      const batch = items.slice(i, i + BATCH_SIZE)
      const statements = batch.map((item) => {
        const now = new Date().toISOString()
        return db
          .prepare(
            `
          INSERT OR REPLACE INTO inventory (
            id, domain, niche, dr, traffic, price, region, status,
            spam_score, google_news, moz_da, semrush_as, referring_domains,
            completion_rate, avg_lifetime, tat, link_type, language, content_size,
            traffic_ahrefs, traffic_similarweb, traffic_semrush, sample_urls,
            created_at, updated_at
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `
          )
          .bind(
            item.id,
            item.domain || '',
            item.niche,
            item.dr,
            item.traffic,
            item.price,
            item.region || null,
            item.status,
            item.spamScore,
            item.googleNews ? 1 : 0,
            item.mozDA || null,
            item.semrushAS || null,
            item.referringDomains || null,
            item.completionRate || null,
            item.avgLifetime || null,
            item.tat || null,
            item.linkType,
            item.language || 'English',
            item.contentSize || null,
            item.trafficAhrefs || null,
            item.trafficSimilarweb || null,
            item.trafficSemrush || null,
            item.sampleUrls ? JSON.stringify(item.sampleUrls) : null,
            item.createdAt || now,
            now
          )
      })

      await db.batch(statements)
    }
  } catch (error) {
    console.error('Failed to batch insert inventory:', error)
    throw error
  }
}
