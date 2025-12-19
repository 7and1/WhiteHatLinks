-- Migration: Create inventory table
-- Date: 2025-12-18
-- Description: Create inventory table for storing backlink inventory data

CREATE TABLE IF NOT EXISTS inventory (
  id TEXT PRIMARY KEY,
  domain TEXT NOT NULL,
  niche TEXT NOT NULL,
  dr INTEGER NOT NULL,
  traffic INTEGER NOT NULL,
  price INTEGER NOT NULL,
  region TEXT,
  status TEXT NOT NULL DEFAULT 'Available',

  -- Additional metrics
  spam_score INTEGER DEFAULT 0,
  google_news INTEGER DEFAULT 0, -- Boolean: 0 or 1
  moz_da INTEGER,
  semrush_as INTEGER,
  referring_domains INTEGER,
  completion_rate INTEGER,
  avg_lifetime INTEGER,
  tat TEXT,
  link_type TEXT DEFAULT 'Unknown',
  language TEXT DEFAULT 'English',
  content_size INTEGER,

  -- Traffic breakdown
  traffic_ahrefs INTEGER,
  traffic_similarweb INTEGER,
  traffic_semrush INTEGER,

  -- Sample URLs (stored as JSON array)
  sample_urls TEXT,

  -- Metadata
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,

  -- Indexes for common queries
  CHECK (status IN ('Available', 'Sold', 'Reserved', 'Unavailable')),
  CHECK (link_type IN ('Dofollow', 'Nofollow', 'Unknown'))
);

-- Index for filtering by niche (most common query)
CREATE INDEX IF NOT EXISTS idx_inventory_niche ON inventory(niche);

-- Index for filtering by DR (second most common)
CREATE INDEX IF NOT EXISTS idx_inventory_dr ON inventory(dr DESC);

-- Index for filtering by price
CREATE INDEX IF NOT EXISTS idx_inventory_price ON inventory(price);

-- Index for filtering by status
CREATE INDEX IF NOT EXISTS idx_inventory_status ON inventory(status);

-- Composite index for niche + status (very common combination)
CREATE INDEX IF NOT EXISTS idx_inventory_niche_status ON inventory(niche, status);

-- Index for filtering by region
CREATE INDEX IF NOT EXISTS idx_inventory_region ON inventory(region) WHERE region IS NOT NULL;

-- Index for Google News filtering
CREATE INDEX IF NOT EXISTS idx_inventory_google_news ON inventory(google_news) WHERE google_news = 1;

-- Index for link type filtering
CREATE INDEX IF NOT EXISTS idx_inventory_link_type ON inventory(link_type) WHERE link_type != 'Unknown';

-- Full-text search index on domain (for search functionality)
CREATE INDEX IF NOT EXISTS idx_inventory_domain ON inventory(domain);
