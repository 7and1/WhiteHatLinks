import { NextResponse } from 'next/server'

export async function GET() {
  const debugInfo = {
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
  }

  try {
    // Try to access D1 database directly
    // Note: This won't work in the current setup since D1 is only accessible via Payload
    return NextResponse.json({
      success: false,
      error: 'Direct D1 access not available in this setup',
      message: 'D1 database is only accessible through Payload configuration',
      debugInfo,
    })
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      debugInfo,
    })
  }
}