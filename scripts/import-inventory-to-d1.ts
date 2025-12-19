/**
 * Import Inventory Data to D1 Database
 *
 * This script reads inventory data from JSON file and imports it into Cloudflare D1 database.
 * Can be run locally or in CI/CD pipeline.
 *
 * Usage:
 *   pnpm tsx scripts/import-inventory-to-d1.ts [--file path/to/inventory.json]
 */

import fs from 'fs/promises'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

// Import inventory utilities
import { transformRecord, type RawInventoryRecord } from '../src/lib/inventory-source-json-utils'
import type { InventoryItem } from '../src/lib/inventory-source'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const DEFAULT_JSON_PATH = join(
  __dirname,
  '../../dobacklinks/scraper/active-sites-incremental.json'
)

interface ImportStats {
  total: number
  transformed: number
  skipped: number
  errors: number
}

/**
 * Parse command line arguments
 */
function parseArgs(): { filePath: string; dryRun: boolean } {
  const args = process.argv.slice(2)
  let filePath = DEFAULT_JSON_PATH
  let dryRun = false

  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--file' && i + 1 < args.length) {
      filePath = args[i + 1]
      i++
    } else if (args[i] === '--dry-run') {
      dryRun = true
    }
  }

  return { filePath, dryRun }
}

/**
 * Load and transform JSON data
 */
async function loadInventoryData(filePath: string): Promise<{
  items: InventoryItem[]
  stats: ImportStats
}> {
  console.log(`📖 Reading inventory file: ${filePath}`)

  const fileContent = await fs.readFile(filePath, 'utf-8')
  const rawData = JSON.parse(fileContent)
  const rawRecords = Array.isArray(rawData) ? rawData : []

  console.log(`📊 Found ${rawRecords.length} raw records`)

  const stats: ImportStats = {
    total: rawRecords.length,
    transformed: 0,
    skipped: 0,
    errors: 0,
  }

  const items: InventoryItem[] = []

  for (let i = 0; i < rawRecords.length; i++) {
    const raw = rawRecords[i]
    try {
      const item = transformRecord(raw as RawInventoryRecord, i)
      if (item) {
        items.push(item)
        stats.transformed++
      } else {
        stats.skipped++
      }
    } catch (error) {
      stats.errors++
      console.error(`❌ Error transforming record:`, error)
    }
  }

  return { items, stats }
}

/**
 * Generate SQL INSERT statements for D1 import
 */
function generateSQLInserts(items: InventoryItem[]): string {
  const now = new Date().toISOString()

  const statements = items.map((item) => {
    const values = [
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
      now,
    ]

    // Escape SQL values
    const escapedValues = values.map((v) => {
      if (v === null) return 'NULL'
      if (typeof v === 'number') return String(v)
      if (typeof v === 'string') return `'${v.replace(/'/g, "''")}'`
      return 'NULL'
    })

    return `INSERT OR REPLACE INTO inventory (
      id, domain, niche, dr, traffic, price, region, status,
      spam_score, google_news, moz_da, semrush_as, referring_domains,
      completion_rate, avg_lifetime, tat, link_type, language, content_size,
      traffic_ahrefs, traffic_similarweb, traffic_semrush, sample_urls,
      created_at, updated_at
    ) VALUES (${escapedValues.join(', ')});`
  })

  return statements.join('\n')
}

/**
 * Write SQL file for import
 */
async function writeSQLFile(sql: string, outputPath: string): Promise<void> {
  await fs.writeFile(outputPath, sql, 'utf-8')
  console.log(`💾 SQL file written: ${outputPath}`)
}

/**
 * Main import function
 */
async function main() {
  const { filePath, dryRun } = parseArgs()

  console.log('🚀 Starting inventory import to D1')
  console.log(`📝 Mode: ${dryRun ? 'DRY RUN' : 'PRODUCTION'}`)
  console.log('')

  try {
    // Load and transform data
    const { items, stats } = await loadInventoryData(filePath)

    console.log('')
    console.log('📊 Import Statistics:')
    console.log(`   Total records:      ${stats.total}`)
    console.log(`   Transformed:        ${stats.transformed}`)
    console.log(`   Skipped:            ${stats.skipped}`)
    console.log(`   Errors:             ${stats.errors}`)
    console.log('')

    if (stats.transformed === 0) {
      console.log('⚠️  No items to import. Exiting.')
      return
    }

    // Generate SQL
    const sql = generateSQLInserts(items)
    const outputPath = join(__dirname, '../migrations/import_inventory_data.sql')

    if (dryRun) {
      console.log('🔍 DRY RUN - SQL preview (first 5 records):')
      console.log('')
      const preview = sql.split('\n').slice(0, 5).join('\n')
      console.log(preview)
      console.log(`... and ${items.length - 5} more records`)
    } else {
      // Write SQL file
      await writeSQLFile(sql, outputPath)

      console.log('')
      console.log('✅ Import preparation complete!')
      console.log('')
      console.log('📋 Next steps:')
      console.log('   1. Review the SQL file:')
      console.log(`      cat ${outputPath}`)
      console.log('')
      console.log('   2. Apply migration to D1:')
      console.log('      wrangler d1 execute D1 --file=migrations/import_inventory_data.sql --remote')
      console.log('')
      console.log('   3. Verify import:')
      console.log('      wrangler d1 execute D1 --command="SELECT COUNT(*) FROM inventory" --remote')
      console.log('')
    }
  } catch (error) {
    console.error('❌ Import failed:', error)
    process.exit(1)
  }
}

// Run if executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main()
}

// Export for testing
export { loadInventoryData, generateSQLInserts }
