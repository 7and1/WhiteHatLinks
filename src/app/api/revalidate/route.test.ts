import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { NextRequest } from 'next/server'

// Mock Next.js cache functions - must be before route imports
vi.mock('next/cache', () => ({
  revalidatePath: vi.fn(),
  revalidateTag: vi.fn(),
}))

import { POST, GET } from './route'
import { revalidatePath, revalidateTag } from 'next/cache'

/**
 * Helper function to create a test request
 */
function createRequest(options: {
  method?: string
  body?: Record<string, unknown>
  headers?: Record<string, string>
  url?: string
}): NextRequest {
  const url = options.url || 'http://localhost:3000/api/revalidate'
  const method = options.method || 'POST'

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...options.headers,
  }

  return new NextRequest(url, {
    method,
    headers,
    body: options.body ? JSON.stringify(options.body) : undefined,
  })
}

describe('POST /api/revalidate', () => {
  const validSecret = 'test-secret-token'

  beforeEach(() => {
    // Reset mock implementations to default behavior
    vi.mocked(revalidatePath).mockClear().mockResolvedValue(undefined)
    vi.mocked(revalidateTag).mockClear().mockResolvedValue(undefined)
  })

  afterEach(() => {
    // Clear mocks after each test
    vi.clearAllMocks()
  })

  describe('Success scenarios', () => {
    it('should successfully revalidate by path', async () => {
      const request = createRequest({
        headers: {
          Authorization: `Bearer ${validSecret}`,
        },
        body: {
          type: 'path',
          path: '/blog',
        },
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.revalidated).toBe(true)
      expect(data.type).toBe('path')
      expect(data.path).toBe('/blog')
      expect(data.now).toBeDefined()
      expect(revalidatePath).toHaveBeenCalledWith('/blog')
      expect(revalidateTag).not.toHaveBeenCalled()
    })

    it('should successfully revalidate by tag', async () => {
      const request = createRequest({
        headers: {
          Authorization: `Bearer ${validSecret}`,
        },
        body: {
          type: 'tag',
          tag: 'inventory',
        },
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.revalidated).toBe(true)
      expect(data.type).toBe('tag')
      expect(data.tag).toBe('inventory')
      expect(data.now).toBeDefined()
      expect(revalidateTag).toHaveBeenCalledWith('inventory')
      expect(revalidatePath).not.toHaveBeenCalled()
    })

    it('should revalidate multiple common paths when no specific path/tag provided', async () => {
      const request = createRequest({
        headers: {
          Authorization: `Bearer ${validSecret}`,
        },
        body: {},
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.revalidated).toBe(true)
      expect(data.type).toBe('multiple')
      expect(data.paths).toEqual(['/', '/inventory', '/blog'])
      expect(revalidatePath).toHaveBeenCalledTimes(3)
      expect(revalidatePath).toHaveBeenCalledWith('/')
      expect(revalidatePath).toHaveBeenCalledWith('/inventory')
      expect(revalidatePath).toHaveBeenCalledWith('/blog')
    })

    it('should handle path revalidation with default type', async () => {
      const request = createRequest({
        headers: {
          Authorization: `Bearer ${validSecret}`,
        },
        body: {
          path: '/inventory/item-123',
          // type defaults to 'path'
        },
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.revalidated).toBe(true)
      expect(revalidatePath).toHaveBeenCalledWith('/inventory/item-123')
    })

    it('should revalidate nested paths', async () => {
      const request = createRequest({
        headers: {
          Authorization: `Bearer ${validSecret}`,
        },
        body: {
          type: 'path',
          path: '/blog/posts/2024/january/article-slug',
        },
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(revalidatePath).toHaveBeenCalledWith('/blog/posts/2024/january/article-slug')
    })
  })

  describe('Authentication failures', () => {
    it('should reject requests without authorization header', async () => {
      const request = createRequest({
        body: {
          path: '/blog',
        },
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(401)
      expect(data.message).toBe('Unauthorized')
      expect(revalidatePath).not.toHaveBeenCalled()
    })

    it('should reject requests with invalid token', async () => {
      const request = createRequest({
        headers: {
          Authorization: 'Bearer wrong-token',
        },
        body: {
          path: '/blog',
        },
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(401)
      expect(data.message).toBe('Unauthorized')
      expect(revalidatePath).not.toHaveBeenCalled()
    })

    it('should reject requests with malformed authorization header', async () => {
      const request = createRequest({
        headers: {
          Authorization: 'wrongtoken123', // Completely wrong token (no Bearer prefix)
        },
        body: {
          path: '/blog',
        },
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(401)
      expect(data.message).toBe('Unauthorized')
    })

    it('should handle empty authorization header', async () => {
      const request = createRequest({
        headers: {
          Authorization: '',
        },
        body: {
          path: '/blog',
        },
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(401)
      expect(data.message).toBe('Unauthorized')
    })
  })

  describe('Validation failures', () => {
    it('should use default paths when path and tag are missing', async () => {
      const request = createRequest({
        headers: {
          Authorization: `Bearer ${validSecret}`,
        },
        body: {
          type: 'path',
          // Missing both path and tag - will fall back to default paths
        },
      })

      const response = await POST(request)
      const data = await response.json()

      // Should fall back to multiple default paths when neither is provided
      expect(response.status).toBe(200)
      expect(data.type).toBe('multiple')
      expect(revalidatePath).toHaveBeenCalled()
    })

    it('should use default paths when path and tag are explicitly null', async () => {
      const request = createRequest({
        headers: {
          Authorization: `Bearer ${validSecret}`,
        },
        body: {
          path: null,
          tag: null,
        },
      })

      const response = await POST(request)
      const data = await response.json()

      // Should fall back to multiple default paths
      expect(response.status).toBe(200)
      expect(data.type).toBe('multiple')
    })
  })

  describe('Error handling', () => {
    it('should handle revalidatePath throwing an error', async () => {
      revalidatePath.mockImplementationOnce(() => {
        throw new Error('Cache error')
      })

      const request = createRequest({
        headers: {
          Authorization: `Bearer ${validSecret}`,
        },
        body: {
          path: '/blog',
        },
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(500)
      expect(data.message).toBe('Internal server error')
      expect(data.error).toBeDefined()
    })

    it('should handle revalidateTag throwing an error', async () => {
      revalidateTag.mockImplementationOnce(() => {
        throw new Error('Tag cache error')
      })

      const request = createRequest({
        headers: {
          Authorization: `Bearer ${validSecret}`,
        },
        body: {
          type: 'tag',
          tag: 'inventory',
        },
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(500)
      expect(data.message).toBe('Internal server error')
    })

    it('should handle malformed JSON request body', async () => {
      const request = new NextRequest('http://localhost:3000/api/revalidate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${validSecret}`,
        },
        body: 'not-valid-json{',
      })

      const response = await POST(request)
      const data = await response.json()

      // Should handle gracefully and use default paths
      expect(response.status).toBe(200)
      expect(data.type).toBe('multiple')
    })

    it('should handle unexpected errors gracefully', async () => {
      // Force an error by making revalidatePath throw on all calls
      revalidatePath.mockImplementation(() => {
        throw new Error('Unexpected cache error')
      })

      const request = createRequest({
        headers: {
          Authorization: `Bearer ${validSecret}`,
        },
        body: {
          path: '/blog',
        },
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(500)
      expect(data.message).toBe('Internal server error')
    })
  })

  describe('Edge cases', () => {
    it('should handle special characters in path', async () => {
      const request = createRequest({
        headers: {
          Authorization: `Bearer ${validSecret}`,
        },
        body: {
          path: '/blog/posts/hello-world-123_test',
        },
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(revalidatePath).toHaveBeenCalledWith('/blog/posts/hello-world-123_test')
    })

    it('should handle special characters in tag', async () => {
      const request = createRequest({
        headers: {
          Authorization: `Bearer ${validSecret}`,
        },
        body: {
          type: 'tag',
          tag: 'inventory-2024',
        },
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(revalidateTag).toHaveBeenCalledWith('inventory-2024')
    })

    it('should handle root path revalidation', async () => {
      const request = createRequest({
        headers: {
          Authorization: `Bearer ${validSecret}`,
        },
        body: {
          path: '/',
        },
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(revalidatePath).toHaveBeenCalledWith('/')
    })

    it('should handle paths with query parameters', async () => {
      const request = createRequest({
        headers: {
          Authorization: `Bearer ${validSecret}`,
        },
        body: {
          path: '/inventory?page=1',
        },
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(revalidatePath).toHaveBeenCalledWith('/inventory?page=1')
    })

    it('should handle multiple revalidations in sequence', async () => {
      // First revalidation
      const request1 = createRequest({
        headers: {
          Authorization: `Bearer ${validSecret}`,
        },
        body: {
          path: '/blog',
        },
      })

      const response1 = await POST(request1)
      expect(response1.status).toBe(200)

      // Second revalidation
      const request2 = createRequest({
        headers: {
          Authorization: `Bearer ${validSecret}`,
        },
        body: {
          type: 'tag',
          tag: 'posts',
        },
      })

      const response2 = await POST(request2)
      expect(response2.status).toBe(200)

      expect(revalidatePath).toHaveBeenCalledWith('/blog')
      expect(revalidateTag).toHaveBeenCalledWith('posts')
    })
  })

  describe('Security', () => {
    it('should not leak information about valid paths in error messages', async () => {
      const request = createRequest({
        headers: {
          Authorization: 'Bearer wrong-token',
        },
        body: {
          path: '/admin/secret-path',
        },
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(401)
      expect(data.message).toBe('Unauthorized')
      // Should not reveal path information
      expect(JSON.stringify(data)).not.toContain('secret-path')
    })

    it('should use environment variable for secret', async () => {
      // This test verifies the code reads from process.env.REVALIDATE_SECRET
      // The secret is set in src/test/setup.ts as 'test-secret-token'
      // and cannot be changed at runtime due to module-level constant

      const request = createRequest({
        headers: {
          Authorization: `Bearer ${validSecret}`, // Using the same secret as setup.ts
        },
        body: {
          path: '/blog',
        },
      })

      const response = await POST(request)
      expect(response.status).toBe(200)
    })
  })
})

describe('GET /api/revalidate', () => {
  it('should return API status and usage information', async () => {
    const response = await GET()
    const data = await response.json()

    expect(response.status).toBe(200)
    expect(data.status).toBe('ok')
    expect(data.message).toBeDefined()
    expect(data.usage).toBeDefined()
    expect(data.usage.method).toBe('POST')
    expect(data.usage.headers).toBeDefined()
    expect(data.usage.body).toBeDefined()
  })

  it('should include documentation in GET response', async () => {
    const response = await GET()
    const data = await response.json()

    expect(data.usage.body.type).toBeDefined()
    expect(data.usage.body.path).toBeDefined()
    expect(data.usage.body.tag).toBeDefined()
  })
})
