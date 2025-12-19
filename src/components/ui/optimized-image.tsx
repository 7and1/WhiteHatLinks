/**
 * Optimized Image Component for Cloudflare Workers
 *
 * Since Cloudflare Workers doesn't support Next.js image optimization,
 * this component provides image loading best practices:
 * - Lazy loading by default
 * - Responsive images
 * - Blur placeholder support
 * - Proper alt text enforcement
 * - fetchpriority for critical images
 *
 * For production image optimization, consider using:
 * - Cloudflare Images: https://www.cloudflare.com/products/cloudflare-images/
 * - External CDN with image optimization
 */

import { forwardRef, type ImgHTMLAttributes } from 'react'
import { cn } from '@/lib/utils'

interface OptimizedImageProps extends Omit<ImgHTMLAttributes<HTMLImageElement>, 'alt'> {
  /**
   * Alternative text for the image (required for accessibility)
   */
  alt: string

  /**
   * Image source URL
   */
  src: string

  /**
   * Loading behavior
   * - "lazy": Defer loading until viewport proximity (default)
   * - "eager": Load immediately (use for above-the-fold images)
   */
  loading?: 'lazy' | 'eager'

  /**
   * Fetch priority for critical images
   * - "high": Critical above-the-fold images
   * - "low": Below-the-fold images
   * - "auto": Browser decides (default)
   */
  fetchPriority?: 'high' | 'low' | 'auto'

  /**
   * Blur placeholder data URL (optional)
   * Generate with: https://blurha.sh/ or similar tools
   */
  placeholder?: string

  /**
   * Additional CSS classes
   */
  className?: string

  /**
   * Image width (required for responsive images)
   */
  width?: number

  /**
   * Image height (required for responsive images)
   */
  height?: number
}

/**
 * Optimized Image Component
 *
 * Usage:
 * ```tsx
 * // Lazy-loaded image (default)
 * <OptimizedImage
 *   src="/path/to/image.jpg"
 *   alt="Description"
 *   width={800}
 *   height={600}
 * />
 *
 * // Critical above-the-fold image
 * <OptimizedImage
 *   src="/hero.jpg"
 *   alt="Hero image"
 *   loading="eager"
 *   fetchPriority="high"
 *   width={1200}
 *   height={630}
 * />
 *
 * // With blur placeholder
 * <OptimizedImage
 *   src="/image.jpg"
 *   alt="Description"
 *   placeholder="data:image/svg+xml;base64,..."
 *   width={800}
 *   height={600}
 * />
 * ```
 */
export const OptimizedImage = forwardRef<HTMLImageElement, OptimizedImageProps>(
  (
    {
      src,
      alt,
      loading = 'lazy',
      fetchPriority = 'auto',
      placeholder,
      className,
      width,
      height,
      ...props
    },
    ref
  ) => {
    // Validate required props
    if (!src) {
      console.error('OptimizedImage: src prop is required')
      return null
    }

    if (!alt) {
      console.error('OptimizedImage: alt prop is required for accessibility')
      return null
    }

    return (
      <img
        ref={ref}
        src={src}
        alt={alt}
        loading={loading}
        fetchPriority={fetchPriority}
        width={width}
        height={height}
        className={cn(
          // Prevent layout shift with aspect ratio
          width && height && 'aspect-auto',
          // Smooth image loading transition
          'transition-opacity duration-300',
          // Blur effect while loading (if placeholder provided)
          placeholder && 'bg-muted',
          className
        )}
        style={{
          // Blur placeholder background
          ...(placeholder && {
            backgroundImage: `url("${placeholder}")`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }),
          // Prevent layout shift
          ...(width && height && {
            aspectRatio: `${width} / ${height}`,
          }),
        }}
        {...props}
      />
    )
  }
)

OptimizedImage.displayName = 'OptimizedImage'

/**
 * Generate a simple blur placeholder SVG
 * Use this for images without a pre-generated blur hash
 */
export function generateBlurPlaceholder(color = '#e5e7eb'): string {
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10">
      <rect width="10" height="10" fill="${color}"/>
      <filter id="blur">
        <feGaussianBlur stdDeviation="2"/>
      </filter>
      <rect width="10" height="10" filter="url(#blur)"/>
    </svg>
  `
  return `data:image/svg+xml;base64,${Buffer.from(svg).toString('base64')}`
}
