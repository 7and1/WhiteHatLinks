'use client'

import { useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

interface FiltersProps {
  onUpdate: (params: Record<string, string | undefined>) => void
  availableNiches: string[]
  availableRegions: string[]
}

export function InventoryFilters({ onUpdate, availableNiches, availableRegions }: FiltersProps) {
  const searchParams = useSearchParams()
  const [isAdvancedOpen, setIsAdvancedOpen] = useState(false)

  const [filters, setFilters] = useState({
    niche: searchParams?.get('niche') || '',
    min_dr: searchParams?.get('min_dr') || '',
    max_price: searchParams?.get('max_price') || '',
    max_spam: searchParams?.get('max_spam') || '',
    min_traffic: searchParams?.get('min_traffic') || '',
    google_news: searchParams?.get('google_news') === 'true',
    link_type: searchParams?.get('link_type') || '',
    region: searchParams?.get('region') || '',
    sort: searchParams?.get('sort') || 'dr',
  })

  const handleApply = () => {
    onUpdate({
      niche: filters.niche || undefined,
      min_dr: filters.min_dr || undefined,
      max_price: filters.max_price || undefined,
      max_spam: filters.max_spam || undefined,
      min_traffic: filters.min_traffic || undefined,
      google_news: filters.google_news ? 'true' : undefined,
      link_type: filters.link_type || undefined,
      region: filters.region || undefined,
      sort: filters.sort !== 'dr' ? filters.sort : undefined,
    })
  }

  const handleReset = () => {
    setFilters({
      niche: '',
      min_dr: '',
      max_price: '',
      max_spam: '',
      min_traffic: '',
      google_news: false,
      link_type: '',
      region: '',
      sort: 'dr',
    })
    onUpdate({})
  }

  const activeFilterCount = [
    filters.niche,
    filters.min_dr,
    filters.max_price,
    filters.max_spam,
    filters.min_traffic,
    filters.google_news,
    filters.link_type,
    filters.region,
  ].filter(Boolean).length

  return (
    <div className="space-y-4 p-4 rounded-lg border bg-card">
      {/* Main filters row */}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <label htmlFor="filter-niche" className="text-xs font-medium text-muted-foreground mb-1.5 block">Niche</label>
          <select
            id="filter-niche"
            className="w-full h-9 px-3 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            value={filters.niche}
            onChange={(e) => setFilters({ ...filters, niche: e.target.value })}
            aria-label="Filter by niche category"
          >
            <option value="">All Niches</option>
            {availableNiches.map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="filter-min-dr" className="text-xs font-medium text-muted-foreground mb-1.5 block">Min DR</label>
          <Input
            id="filter-min-dr"
            type="number"
            placeholder="e.g. 50"
            min={0}
            max={100}
            value={filters.min_dr}
            onChange={(e) => setFilters({ ...filters, min_dr: e.target.value })}
            aria-label="Minimum Domain Rating"
          />
        </div>

        <div>
          <label htmlFor="filter-max-price" className="text-xs font-medium text-muted-foreground mb-1.5 block">Max Price ($)</label>
          <Input
            id="filter-max-price"
            type="number"
            placeholder="e.g. 300"
            min={0}
            value={filters.max_price}
            onChange={(e) => setFilters({ ...filters, max_price: e.target.value })}
            aria-label="Maximum price in dollars"
          />
        </div>

        <div>
          <label htmlFor="filter-sort" className="text-xs font-medium text-muted-foreground mb-1.5 block">Sort By</label>
          <select
            id="filter-sort"
            className="w-full h-9 px-3 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            value={filters.sort}
            onChange={(e) => setFilters({ ...filters, sort: e.target.value })}
            aria-label="Sort results by"
          >
            <option value="dr">Domain Rating (High to Low)</option>
            <option value="traffic">Traffic (High to Low)</option>
            <option value="price">Price (Low to High)</option>
            <option value="recent">Recently Added</option>
          </select>
        </div>
      </div>

      {/* Advanced filters toggle */}
      <div>
        <button
          type="button"
          onClick={() => setIsAdvancedOpen(!isAdvancedOpen)}
          className="text-sm font-medium text-muted-foreground hover:text-foreground flex items-center gap-2 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded-sm px-1"
          aria-expanded={isAdvancedOpen}
          aria-controls="advanced-filters"
          aria-label={isAdvancedOpen ? 'Hide advanced filters' : 'Show advanced filters'}
        >
          <span>Advanced Filters</span>
          {activeFilterCount > 0 && (
            <Badge variant="secondary" className="text-xs">
              {activeFilterCount} active
            </Badge>
          )}
          <svg
            className={cn('w-4 h-4 transition-transform', isAdvancedOpen && 'rotate-180')}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      </div>

      {/* Advanced filters panel */}
      {isAdvancedOpen && (
        <div id="advanced-filters" className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4 pt-2 border-t">
          <div>
            <label htmlFor="filter-max-spam" className="text-xs font-medium text-muted-foreground mb-1.5 block">
              Max Spam Score (%)
            </label>
            <Input
              id="filter-max-spam"
              type="number"
              placeholder="e.g. 5"
              min={0}
              max={100}
              value={filters.max_spam}
              onChange={(e) => setFilters({ ...filters, max_spam: e.target.value })}
              aria-label="Maximum spam score percentage"
            />
          </div>

          <div>
            <label htmlFor="filter-min-traffic" className="text-xs font-medium text-muted-foreground mb-1.5 block">
              Min Traffic
            </label>
            <Input
              id="filter-min-traffic"
              type="number"
              placeholder="e.g. 10000"
              min={0}
              value={filters.min_traffic}
              onChange={(e) => setFilters({ ...filters, min_traffic: e.target.value })}
              aria-label="Minimum monthly traffic"
            />
          </div>

          <div>
            <label htmlFor="filter-link-type" className="text-xs font-medium text-muted-foreground mb-1.5 block">Link Type</label>
            <select
              id="filter-link-type"
              className="w-full h-9 px-3 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              value={filters.link_type}
              onChange={(e) => setFilters({ ...filters, link_type: e.target.value })}
              aria-label="Filter by link type"
            >
              <option value="">All Types</option>
              <option value="Dofollow">Dofollow</option>
              <option value="Nofollow">Nofollow</option>
            </select>
          </div>

          <div>
            <label htmlFor="filter-region" className="text-xs font-medium text-muted-foreground mb-1.5 block">Region</label>
            <select
              id="filter-region"
              className="w-full h-9 px-3 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              value={filters.region}
              onChange={(e) => setFilters({ ...filters, region: e.target.value })}
              aria-label="Filter by geographic region"
            >
              <option value="">All Regions</option>
              {availableRegions.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-end">
            <label htmlFor="filter-google-news" className="flex items-center gap-2 cursor-pointer h-9">
              <input
                id="filter-google-news"
                type="checkbox"
                className="w-4 h-4 rounded border-input accent-primary focus:ring-2 focus:ring-primary focus:ring-offset-2"
                checked={filters.google_news}
                onChange={(e) => setFilters({ ...filters, google_news: e.target.checked })}
                aria-label="Show only Google News approved sites"
              />
              <span className="text-sm">Google News Only</span>
            </label>
          </div>
        </div>
      )}

      {/* Action buttons */}
      <div className="flex gap-2 pt-2">
        <Button onClick={handleApply}>Apply Filters</Button>
        <Button variant="outline" onClick={handleReset}>
          Reset All
        </Button>
      </div>
    </div>
  )
}
