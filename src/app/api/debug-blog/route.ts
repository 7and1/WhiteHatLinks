import { NextResponse } from 'next/server'
import { getPayload } from 'payload'
import configPromise from '@payload-config'

export async function GET() {
  const debugInfo = {
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
    cfEnv: !!(globalThis as any).__env__,
    hasD1Binding: !!process.env.D1,
    payloadSecret: !!process.env.PAYLOAD_SECRET,
  }

  try {
    console.log('Attempting to initialize Payload...')
    console.log('Debug info:', debugInfo)

    const payload = await getPayload({ config: configPromise })
    console.log('Payload initialized successfully')

    // Try a simple database query
    console.log('Testing database connection...')
    const result = await payload.find({
      collection: 'posts',
      limit: 1,
    })

    console.log('Database query result:', result)

    return NextResponse.json({
      success: true,
      debugInfo,
      postsCount: result.totalDocs,
      samplePost: result.docs[0] ? {
        id: result.docs[0].id,
        title: result.docs[0].title,
        slug: result.docs[0].slug,
      } : null,
    })
  } catch (error) {
    console.error('Debug endpoint error:', error)
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
      debugInfo,
    })
  }
}