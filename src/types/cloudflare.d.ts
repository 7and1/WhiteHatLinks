/**
 * Cloudflare Workers Environment Bindings
 *
 * Type definitions for Cloudflare Workers bindings used in the application.
 * These bindings are configured in wrangler.jsonc and available via the env object.
 */

/**
 * Cloudflare Workers Environment
 * Add all your bindings here
 */
export interface CloudflareEnv {
  /**
   * Rate limiting KV namespace
   * Used for distributed rate limiting across worker instances
   */
  RATE_LIMIT_KV?: KVNamespace

  /**
   * D1 Database
   * SQLite database for inventory and application data
   */
  D1?: D1Database

  /**
   * R2 Bucket
   * Object storage for media and files
   */
  R2?: R2Bucket

  /**
   * Assets binding
   * Static assets served from the edge
   */
  ASSETS?: Fetcher

  /**
   * Environment variables
   */
  NODE_ENV?: string
  NEXT_PUBLIC_SERVER_URL?: string
  PAYLOAD_SECRET?: string
  REVALIDATE_SECRET?: string
  RESEND_API_KEY?: string
  NEXT_PUBLIC_SENTRY_DSN?: string
  NEXT_PUBLIC_APP_VERSION?: string
  NEXT_PUBLIC_SITE_URL?: string
  NEXT_PUBLIC_CF_WEB_ANALYTICS_TOKEN?: string
}

/**
 * Extend Next.js request with Cloudflare bindings
 */
declare module 'next/server' {
  interface NextRequest {
    env?: CloudflareEnv
  }
}

/**
 * Global Cloudflare types (if not already available)
 */
declare global {
  /**
   * KV Namespace interface
   */
  interface KVNamespace {
    get(key: string, options?: KVNamespaceGetOptions<undefined>): Promise<string | null>
    get<Type = unknown>(key: string, type: 'json'): Promise<Type | null>
    get(key: string, type: 'arrayBuffer'): Promise<ArrayBuffer | null>
    get(key: string, type: 'stream'): Promise<ReadableStream | null>
    getWithMetadata<Metadata = unknown>(
      key: string,
      options?: KVNamespaceGetOptions<undefined>
    ): Promise<{ value: string | null; metadata: Metadata | null }>

    put(
      key: string,
      value: string | ArrayBuffer | ReadableStream,
      options?: KVNamespacePutOptions
    ): Promise<void>

    delete(key: string): Promise<void>

    list<Metadata = unknown>(options?: KVNamespaceListOptions): Promise<KVNamespaceListResult<Metadata>>
  }

  interface KVNamespaceGetOptions<Type> {
    type?: Type
    cacheTtl?: number
  }

  interface KVNamespacePutOptions {
    expiration?: number
    expirationTtl?: number
    metadata?: unknown
  }

  interface KVNamespaceListOptions {
    prefix?: string
    limit?: number
    cursor?: string
  }

  interface KVNamespaceListResult<Metadata = unknown> {
    keys: Array<{
      name: string
      expiration?: number
      metadata?: Metadata
    }>
    list_complete: boolean
    cursor?: string
  }

  /**
   * D1 Database interface
   */
  interface D1Database {
    prepare(query: string): D1PreparedStatement
    dump(): Promise<ArrayBuffer>
    batch<T = unknown>(statements: D1PreparedStatement[]): Promise<D1Result<T>[]>
    exec<T = unknown>(query: string): Promise<D1Result<T>>
  }

  interface D1PreparedStatement {
    bind(...values: unknown[]): D1PreparedStatement
    first<T = unknown>(colName?: string): Promise<T | null>
    run<T = unknown>(): Promise<D1Result<T>>
    all<T = unknown>(): Promise<D1Result<T>>
    raw<T = unknown>(options?: D1RawOptions): Promise<T[]>
  }

  interface D1Result<T = unknown> {
    results?: T[]
    success: boolean
    error?: string
    meta: {
      duration: number
      size_after?: number
      rows_read?: number
      rows_written?: number
    }
  }

  interface D1RawOptions {
    columnNames?: boolean
  }

  /**
   * R2 Bucket interface
   */
  interface R2Bucket {
    get(key: string): Promise<R2Object | null>
    put(key: string, value: ReadableStream | ArrayBuffer | string): Promise<R2Object>
    delete(key: string): Promise<void>
    list(options?: R2ListOptions): Promise<R2Objects>
  }

  interface R2Object {
    key: string
    version: string
    size: number
    etag: string
    httpEtag: string
    uploaded: Date
    body: ReadableStream
    bodyUsed: boolean
    arrayBuffer(): Promise<ArrayBuffer>
    text(): Promise<string>
    json<T = unknown>(): Promise<T>
  }

  interface R2ListOptions {
    limit?: number
    prefix?: string
    cursor?: string
  }

  interface R2Objects {
    objects: R2Object[]
    truncated: boolean
    cursor?: string
  }

  /**
   * Fetcher interface for assets
   */
  interface Fetcher {
    fetch(input: RequestInfo, init?: RequestInit): Promise<Response>
  }
}

export {}
