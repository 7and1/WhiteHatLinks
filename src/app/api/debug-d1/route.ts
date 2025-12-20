import { NextResponse } from 'next/server'
import { getPayload } from 'payload'
import configPromise from '@/payload.config'

export async function GET() {
  const debug = {
    timestamp: new Date().toISOString(),
    environment: {
      NODE_ENV: process.env.NODE_ENV,
      CLOUDFLARE_ENV: process.env.CLOUDFLARE_ENV,
    },
    steps: [] as any[],
    error: null,
  }

  try {
    // Step 1: Initialize Payload
    debug.steps.push('Initializing Payload...')
    const payload = await getPayload({ config: configPromise })
    debug.steps.push('✅ Payload initialized')

    // Step 2: Test database connection
    debug.steps.push('Testing database connection...')
    const result = await payload.find({
      collection: 'posts',
      limit: 1,
    })
    debug.steps.push(`✅ Database query successful - found ${result.totalDocs} posts`)

    // Step 3: Test raw SQL
    debug.steps.push('Testing raw SQL query...')
    const db = payload.db
    const rawResult = await db.execute('SELECT COUNT(*) as count FROM posts')
    debug.steps.push(`✅ Raw SQL successful - count: ${JSON.stringify(rawResult)}`)

    return NextResponse.json(debug)
  } catch (error) {
    debug.error = {
      message: error.message,
      stack: error.stack,
      name: error.name,
    }
    debug.steps.push(`❌ Error: ${error.message}`)

    return NextResponse.json(debug, { status: 500 })
  }
}