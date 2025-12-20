import { sqliteD1Adapter } from '@payloadcms/db-d1-sqlite'
import { buildConfig } from 'payload'

// Simplified test to verify D1 connection in Cloudflare Workers environment

async function testD1Binding() {
  console.log('🔍 Testing D1 binding in Cloudflare Workers...')

  try {
    // Get Cloudflare context
    const { getCloudflareContext } = await import('@opennextjs/cloudflare')
    const cloudflare = await getCloudflareContext({ async: true })

    console.log('1. Cloudflare Context:', {
      hasD1: !!cloudflare.env.D1,
      d1Type: typeof cloudflare.env.D1,
      envKeys: Object.keys(cloudflare.env || {})
    })

    // Test basic D1 operation
    if (cloudflare.env.D1) {
      console.log('2. Testing D1 prepare...')
      const stmt = cloudflare.env.D1.prepare('SELECT 1 as test')
      console.log('Statement created:', !!stmt)

      const result = await stmt.first()
      console.log('✅ D1 Query result:', result)
    } else {
      console.error('❌ D1 binding not found!')
    }

    // Test Payload config with D1
    console.log('3. Testing Payload config...')
    const testConfig = buildConfig({
      secret: 'test-secret',
      db: sqliteD1Adapter({ binding: cloudflare.env.D1 }),
      collections: [],
    })

    console.log('✅ Payload config created successfully')
    console.log('DB Adapter:', testConfig.db)

  } catch (error) {
    console.error('❌ Error:', {
      message: error.message,
      stack: error.stack,
      name: error.name
    })
  }
}

// Export for use in worker
export { testD1Binding }