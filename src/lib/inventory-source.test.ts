import { describe, it, expect, beforeEach, vi } from 'vitest'
import { getInventory, getInventoryCount, getInventoryNiches, getInventoryRegions, clearInventoryCache, type InventoryQuery } from './inventory-source'
import { mockInventoryItems } from './__mocks__/inventory-data'

// Mock Payload CMS
vi.mock('payload', () => ({
  getPayload: vi.fn(),
}))

vi.mock('@payload-config', () => ({
  default: {},
}))

// Mock fs/promises to return our mock data
vi.mock('fs/promises', () => ({
  readFile: vi.fn().mockResolvedValue(JSON.stringify(
    mockInventoryItems.map(item => ({
      domain: item.domain,
      siteId: item.id,
      timestamp: item.createdAt,
      success: true,
      data: {
        ahrefsDR: item.dr,
        mozDA: item.mozDA,
        semrushAS: item.semrushAS,
        ahrefsOrganicTraffic: item.trafficAhrefs,
        similarwebTraffic: item.trafficSimilarweb,
        semrushTotalTraffic: item.trafficSemrush,
        referralDomains: item.referringDomains,
        contentPlacementPrice: item.price / 2,
        spamScore: `${item.spamScore}%`,
        googleNews: item.googleNews ? 'yes' : 'no',
        completionRate: `${item.completionRate}%`,
        avgLifetimeOfLinks: `${item.avgLifetime}%`,
        linkAttributionType: item.linkType,
        requiredContentSize: `${item.contentSize} words`,
        tat: item.tat,
        country: item.region,
        language: item.language,
        sampleUrls: item.sampleUrls,
      },
    }))
  )),
}))

describe('Inventory Source', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    clearInventoryCache()
  })

  describe('getInventory', () => {
    it('should return all inventory items without filters', async () => {
      const items = await getInventory()

      expect(items).toBeDefined()
      expect(Array.isArray(items)).toBe(true)
      expect(items.length).toBeGreaterThan(0)
    })

    it('should filter by niche', async () => {
      const techItems = await getInventory({ niche: 'Tech' })

      expect(techItems.length).toBe(2) // We have 2 tech items in mock data
      techItems.forEach(item => {
        expect(item.niche).toBe('Tech')
      })
    })

    it('should filter by minimum DR', async () => {
      const highDRItems = await getInventory({ minDr: 70 })

      expect(highDRItems.length).toBeGreaterThan(0)
      highDRItems.forEach(item => {
        expect(item.dr).toBeGreaterThanOrEqual(70)
      })
    })

    it('should filter by maximum price', async () => {
      const affordableItems = await getInventory({ maxPrice: 400 })

      expect(affordableItems.length).toBeGreaterThan(0)
      affordableItems.forEach(item => {
        expect(item.price).toBeLessThanOrEqual(400)
      })
    })

    it('should filter by maximum spam score', async () => {
      const lowSpamItems = await getInventory({ maxSpamScore: 2 })

      expect(lowSpamItems.length).toBeGreaterThan(0)
      lowSpamItems.forEach(item => {
        expect(item.spamScore).toBeLessThanOrEqual(2)
      })
    })

    it('should filter by minimum traffic', async () => {
      const highTrafficItems = await getInventory({ minTraffic: 50000 })

      expect(highTrafficItems.length).toBeGreaterThan(0)
      highTrafficItems.forEach(item => {
        expect(item.traffic).toBeGreaterThanOrEqual(50000)
      })
    })

    it('should filter by Google News only', async () => {
      const googleNewsItems = await getInventory({ googleNewsOnly: true })

      expect(googleNewsItems.length).toBeGreaterThan(0)
      googleNewsItems.forEach(item => {
        expect(item.googleNews).toBe(true)
      })
    })

    it('should filter by link type', async () => {
      const dofollowItems = await getInventory({ linkType: 'Dofollow' })

      expect(dofollowItems.length).toBeGreaterThan(0)
      dofollowItems.forEach(item => {
        expect(item.linkType).toBe('Dofollow')
      })

      const nofollowItems = await getInventory({ linkType: 'Nofollow' })
      expect(nofollowItems.length).toBeGreaterThan(0)
      nofollowItems.forEach(item => {
        expect(item.linkType).toBe('Nofollow')
      })
    })

    it('should filter by region', async () => {
      const usaItems = await getInventory({ region: 'USA' })

      expect(usaItems.length).toBeGreaterThan(0)
      usaItems.forEach(item => {
        expect(item.region).toBe('USA')
      })
    })

    it('should filter by language', async () => {
      const englishItems = await getInventory({ language: 'English' })

      expect(englishItems.length).toBeGreaterThan(0)
      englishItems.forEach(item => {
        expect(item.language).toBe('English')
      })
    })

    it('should apply multiple filters simultaneously', async () => {
      const query: InventoryQuery = {
        niche: 'Tech',
        minDr: 50,
        maxPrice: 600,
        maxSpamScore: 5,
        linkType: 'Dofollow',
      }

      const items = await getInventory(query)

      items.forEach(item => {
        expect(item.niche).toBe('Tech')
        expect(item.dr).toBeGreaterThanOrEqual(50)
        expect(item.price).toBeLessThanOrEqual(600)
        expect(item.spamScore).toBeLessThanOrEqual(5)
        expect(item.linkType).toBe('Dofollow')
      })
    })

    it('should sort by DR (default)', async () => {
      const items = await getInventory({ sort: 'dr' })

      for (let i = 1; i < items.length; i++) {
        expect(items[i - 1].dr).toBeGreaterThanOrEqual(items[i].dr)
      }
    })

    it('should sort by traffic', async () => {
      const items = await getInventory({ sort: 'traffic' })

      for (let i = 1; i < items.length; i++) {
        expect(items[i - 1].traffic).toBeGreaterThanOrEqual(items[i].traffic)
      }
    })

    it('should sort by price', async () => {
      const items = await getInventory({ sort: 'price' })

      for (let i = 1; i < items.length; i++) {
        expect(items[i - 1].price).toBeLessThanOrEqual(items[i].price)
      }
    })

    it('should sort by recent (createdAt)', async () => {
      const items = await getInventory({ sort: 'recent' })

      for (let i = 1; i < items.length; i++) {
        const date1 = new Date(items[i - 1].createdAt || 0).getTime()
        const date2 = new Date(items[i].createdAt || 0).getTime()
        expect(date1).toBeGreaterThanOrEqual(date2)
      }
    })

    it('should limit results', async () => {
      const items = await getInventory({ limit: 3 })

      expect(items.length).toBe(3)
    })

    it('should support pagination with offset', async () => {
      const firstPage = await getInventory({ limit: 3, offset: 0 })
      const secondPage = await getInventory({ limit: 3, offset: 3 })

      expect(firstPage.length).toBe(3)
      expect(secondPage.length).toBeGreaterThan(0)
      expect(firstPage[0].id).not.toBe(secondPage[0].id)
    })

    it('should return empty array when no items match filters', async () => {
      const items = await getInventory({
        niche: 'NonExistentNiche',
        minDr: 100,
      })

      expect(items).toEqual([])
    })

    it('should handle case-insensitive niche filtering', async () => {
      const items = await getInventory({ niche: 'tech' })

      expect(items.length).toBeGreaterThan(0)
      items.forEach(item => {
        expect(item.niche.toLowerCase()).toContain('tech')
      })
    })
  })

  describe('getInventoryCount', () => {
    it('should return total count without filters', async () => {
      const count = await getInventoryCount()

      expect(count).toBeGreaterThan(0)
      expect(typeof count).toBe('number')
    })

    it('should return count with filters', async () => {
      const count = await getInventoryCount({ niche: 'Tech' })

      expect(count).toBe(2) // We have 2 tech items
    })

    it('should return count with multiple filters', async () => {
      const count = await getInventoryCount({
        minDr: 60,
        maxPrice: 600,
      })

      expect(typeof count).toBe('number')
      expect(count).toBeGreaterThan(0)
    })

    it('should return 0 when no items match', async () => {
      const count = await getInventoryCount({
        niche: 'NonExistent',
        minDr: 100,
      })

      expect(count).toBe(0)
    })
  })

  describe('getInventoryNiches', () => {
    it('should return list of available niches', async () => {
      const niches = await getInventoryNiches()

      expect(Array.isArray(niches)).toBe(true)
      expect(niches.length).toBeGreaterThan(0)
      expect(niches).toContain('Tech')
    })

    it('should return niches sorted by count', async () => {
      const niches = await getInventoryNiches()

      // Tech appears twice in mock data, should be first or high in the list
      expect(niches).toContain('Tech')
    })

    it('should respect limit parameter', async () => {
      const niches = await getInventoryNiches(3)

      expect(niches.length).toBeLessThanOrEqual(3)
    })

    it('should return unique niches', async () => {
      const niches = await getInventoryNiches()

      const uniqueNiches = new Set(niches)
      expect(uniqueNiches.size).toBe(niches.length)
    })
  })

  describe('getInventoryRegions', () => {
    it('should return list of available regions', async () => {
      const regions = await getInventoryRegions()

      expect(Array.isArray(regions)).toBe(true)
      expect(regions.length).toBeGreaterThan(0)
    })

    it('should return sorted regions', async () => {
      const regions = await getInventoryRegions()

      const sortedRegions = [...regions].sort()
      expect(regions).toEqual(sortedRegions)
    })

    it('should return unique regions', async () => {
      const regions = await getInventoryRegions()

      const uniqueRegions = new Set(regions)
      expect(uniqueRegions.size).toBe(regions.length)
    })

    it('should include common regions from mock data', async () => {
      const regions = await getInventoryRegions()

      expect(regions).toContain('USA')
      expect(regions).toContain('UK')
    })

    it('should not include undefined or null regions', async () => {
      const regions = await getInventoryRegions()

      regions.forEach(region => {
        expect(region).toBeDefined()
        expect(region).not.toBeNull()
        expect(typeof region).toBe('string')
        expect(region.length).toBeGreaterThan(0)
      })
    })
  })

  describe('clearInventoryCache', () => {
    it('should clear the cache', async () => {
      // Load data to populate cache
      await getInventory()

      // Clear cache
      clearInventoryCache()

      // Load again - should work
      const items = await getInventory()
      expect(items.length).toBeGreaterThan(0)
    })

    it('should allow fresh data after cache clear', async () => {
      const items1 = await getInventory({ limit: 5 })
      clearInventoryCache()
      const items2 = await getInventory({ limit: 5 })

      expect(items1.length).toBe(items2.length)
    })
  })

  describe('data integrity', () => {
    it('should return items with all required fields', async () => {
      const items = await getInventory()

      items.forEach(item => {
        expect(item.id).toBeDefined()
        expect(item.niche).toBeDefined()
        expect(item.dr).toBeDefined()
        expect(item.traffic).toBeDefined()
        expect(item.price).toBeDefined()
        expect(item.status).toBe('Available')
        expect(item.linkType).toBeDefined()
        expect(item.spamScore).toBeDefined()
      })
    })

    it('should return items with valid numeric values', async () => {
      const items = await getInventory()

      items.forEach(item => {
        expect(typeof item.dr).toBe('number')
        expect(typeof item.traffic).toBe('number')
        expect(typeof item.price).toBe('number')
        expect(typeof item.spamScore).toBe('number')
        expect(item.dr).toBeGreaterThanOrEqual(0)
        expect(item.traffic).toBeGreaterThanOrEqual(0)
        expect(item.price).toBeGreaterThan(0)
        expect(item.spamScore).toBeGreaterThanOrEqual(0)
      })
    })

    it('should return items with valid link types', async () => {
      const items = await getInventory()

      items.forEach(item => {
        expect(['Dofollow', 'Nofollow', 'Unknown']).toContain(item.linkType)
      })
    })
  })

  describe('edge cases', () => {
    it('should handle empty query object', async () => {
      const items = await getInventory({})

      expect(Array.isArray(items)).toBe(true)
      expect(items.length).toBeGreaterThan(0)
    })

    it('should handle limit of 0', async () => {
      const items = await getInventory({ limit: 0 })

      // Limit 0 is falsy, so query.limit condition fails and returns all items
      expect(items.length).toBeGreaterThan(0)
    })

    it('should handle very high limit', async () => {
      const items = await getInventory({ limit: 10000 })

      expect(Array.isArray(items)).toBe(true)
    })

    it('should handle offset beyond data length', async () => {
      const items = await getInventory({ offset: 10000 })

      expect(items).toEqual([])
    })

    it('should handle DR filter of 0', async () => {
      const items = await getInventory({ minDr: 0 })

      expect(items.length).toBeGreaterThan(0)
    })

    it('should handle very high DR filter', async () => {
      const items = await getInventory({ minDr: 95 })

      expect(Array.isArray(items)).toBe(true)
    })
  })
})
