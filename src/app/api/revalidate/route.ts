import { revalidatePath, revalidateTag } from 'next/cache'
import { NextRequest, NextResponse } from 'next/server'

/**
 * On-Demand Revalidation API
 *
 * This endpoint allows triggering ISR cache invalidation on-demand.
 * Use cases:
 * - Inventory updates trigger revalidation of inventory pages
 * - New blog posts trigger blog list revalidation
 * - Content updates trigger specific page revalidation
 *
 * Security: Protected by a secret token
 *
 * Usage:
 * POST /api/revalidate
 * Headers: { Authorization: Bearer YOUR_SECRET }
 * Body: { path: '/inventory', tag: 'inventory' }
 */

const REVALIDATE_SECRET = process.env.REVALIDATE_SECRET || 'dev-secret-change-in-production'

export async function POST(request: NextRequest) {
  try {
    // Verify authorization
    const authHeader = request.headers.get('authorization')
    const token = authHeader?.replace('Bearer ', '')

    if (token !== REVALIDATE_SECRET) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Parse request body
    const body = await request.json().catch(() => ({})) as { path?: string, tag?: string, type?: string }
    const { path, tag, type = 'path' } = body

    // Revalidate by path or tag
    if (type === 'tag' && tag) {
      revalidateTag(tag)
      return NextResponse.json({
        revalidated: true,
        type: 'tag',
        tag,
        now: Date.now(),
      })
    }

    if (type === 'path' && path) {
      revalidatePath(path)
      return NextResponse.json({
        revalidated: true,
        type: 'path',
        path,
        now: Date.now(),
      })
    }

    // Default revalidation targets
    if (!path && !tag) {
      // Revalidate common pages
      const commonPaths = [
        '/',
        '/inventory',
        '/blog',
      ]

      for (const p of commonPaths) {
        revalidatePath(p)
      }

      return NextResponse.json({
        revalidated: true,
        type: 'multiple',
        paths: commonPaths,
        now: Date.now(),
      })
    }

    return NextResponse.json(
      { message: 'Missing path or tag parameter' },
      { status: 400 }
    )
  } catch (error) {
    console.error('Revalidation error:', error)
    return NextResponse.json(
      { message: 'Internal server error', error: String(error) },
      { status: 500 }
    )
  }
}

// Allow GET for status check
export async function GET() {
  return NextResponse.json({
    status: 'ok',
    message: 'Revalidation API is running',
    usage: {
      method: 'POST',
      headers: { Authorization: 'Bearer YOUR_SECRET' },
      body: {
        type: 'path or tag',
        path: '/inventory (for path type)',
        tag: 'inventory (for tag type)',
      },
    },
  })
}
