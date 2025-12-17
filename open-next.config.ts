// open-next.config.ts for Cloudflare Workers deployment
import type { OpenNextConfig } from '@opennextjs/cloudflare'

const config: OpenNextConfig = {
  // Default (server) functions run with Node.js compatibility on Cloudflare Workers
  default: {
    override: {
      wrapper: 'cloudflare-node',
      converter: 'edge',
      proxyExternalRequest: 'fetch',
      // Note: Using 'dummy' for caching as full ISR support is still in development
      incrementalCache: 'dummy',
      tagCache: 'dummy',
      queue: 'dummy',
    },
  },
  // Avoid bundling built-ins already available in Workers
  edgeExternals: ['node:crypto'],
  // Middleware stays on the edge
  middleware: {
    external: true,
    override: {
      wrapper: 'cloudflare-edge',
      converter: 'edge',
      proxyExternalRequest: 'fetch',
      incrementalCache: 'dummy',
      tagCache: 'dummy',
      queue: 'dummy',
    },
  },
}

export default config
