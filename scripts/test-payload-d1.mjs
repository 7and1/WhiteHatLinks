#!/usr/bin/env node

// Test script to debug Payload CMS + D1 + Cloudflare Workers issues
import { getPayload } from 'payload'
import configPromise from './src/payload.config.js'

async function testPayloadConnection() {
  console.log('🔍 Testing Payload CMS connection...')

  try {
    // Get Payload instance
    console.log('1. Initializing Payload...')
    const payload = await getPayload({ config: configPromise })
    console.log('✅ Payload initialized successfully')

    // Test database connection
    console.log('2. Testing database connection...')
    const result = await payload.find({
      collection: 'posts',
      limit: 5,
      sort: '-published_date',
    })

    console.log('✅ Database query successful')
    console.log(`📊 Found ${result.docs.length} posts`)

    if (result.docs.length > 0) {
      console.log('📝 Latest post:', {
        id: result.docs[0].id,
        title: result.docs[0].title,
        slug: result.docs[0].slug,
        published_date: result.docs[0].published_date,
      })
    }

    // Test raw SQL query
    console.log('3. Testing raw SQL query...')
    const db = payload.db
    const rawResult = await db.execute('SELECT COUNT(*) as count FROM posts')
    console.log('✅ Raw SQL successful:', rawResult)

  } catch (error) {
    console.error('❌ Error details:')
    console.error('Message:', error.message)
    console.error('Stack:', error.stack)
    console.error('Full error:', error)

    // Check if it's a binding error
    if (error.message?.includes('binding') || error.message?.includes('D1')) {
      console.error('\n💡 This looks like a Cloudflare binding issue')
      console.error('Check if D1 binding is correctly configured in wrangler.jsonc')
    }

    // Check if it's a context error
    if (error.message?.includes('context') || error.message?.includes('Cloudflare')) {
      console.error('\n💡 This looks like a Cloudflare context issue')
      console.error('Check Cloudflare context initialization in payload.config.ts')
    }
  }
}

// Run the test
testPayloadConnection()