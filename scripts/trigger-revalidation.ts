#!/usr/bin/env tsx
/**
 * Trigger ISR Revalidation Script
 *
 * Use this script to manually trigger cache revalidation after:
 * - Inventory updates
 * - Blog post publication
 * - Content changes
 *
 * Usage:
 *   npx tsx scripts/trigger-revalidation.ts --path /inventory
 *   npx tsx scripts/trigger-revalidation.ts --path /blog
 *   npx tsx scripts/trigger-revalidation.ts --all
 */

import 'dotenv/config'

const REVALIDATE_SECRET = process.env.REVALIDATE_SECRET || 'dev-secret-change-in-production'
const BASE_URL = process.env.PAYLOAD_PUBLIC_SERVER_URL || 'http://localhost:3000'

interface RevalidateOptions {
  type?: 'path' | 'tag'
  path?: string
  tag?: string
}

async function revalidate(options: RevalidateOptions): Promise<void> {
  const url = `${BASE_URL}/api/revalidate`

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${REVALIDATE_SECRET}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(options),
    })

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Unknown error' }))
      throw new Error(`Revalidation failed: ${error.message}`)
    }

    const result = await response.json()
    console.log('✅ Revalidation successful:', result)
  } catch (error) {
    console.error('❌ Revalidation failed:', error)
    process.exit(1)
  }
}

async function main() {
  const args = process.argv.slice(2)

  // Parse arguments
  const pathIndex = args.indexOf('--path')
  const tagIndex = args.indexOf('--tag')
  const allFlag = args.includes('--all')

  if (allFlag) {
    console.log('🔄 Triggering revalidation for all common pages...')
    await revalidate({})
    return
  }

  if (pathIndex !== -1 && args[pathIndex + 1]) {
    const path = args[pathIndex + 1]
    console.log(`🔄 Triggering revalidation for path: ${path}`)
    await revalidate({ type: 'path', path })
    return
  }

  if (tagIndex !== -1 && args[tagIndex + 1]) {
    const tag = args[tagIndex + 1]
    console.log(`🔄 Triggering revalidation for tag: ${tag}`)
    await revalidate({ type: 'tag', tag })
    return
  }

  // Show usage
  console.log(`
Usage:
  npx tsx scripts/trigger-revalidation.ts --path <path>
  npx tsx scripts/trigger-revalidation.ts --tag <tag>
  npx tsx scripts/trigger-revalidation.ts --all

Examples:
  npx tsx scripts/trigger-revalidation.ts --path /inventory
  npx tsx scripts/trigger-revalidation.ts --path /blog
  npx tsx scripts/trigger-revalidation.ts --path /
  npx tsx scripts/trigger-revalidation.ts --all

Environment Variables:
  REVALIDATE_SECRET - Secret for authentication
  PAYLOAD_PUBLIC_SERVER_URL - Base URL for the API
  `)
  process.exit(1)
}

main()
