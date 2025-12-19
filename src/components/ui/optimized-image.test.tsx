import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { OptimizedImage, generateBlurPlaceholder } from './optimized-image'

describe('OptimizedImage', () => {
  describe('Basic rendering', () => {
    it('should render an image with required props', () => {
      render(
        <OptimizedImage
          src="/test-image.jpg"
          alt="Test image"
          width={800}
          height={600}
        />
      )

      const img = screen.getByRole('img', { name: 'Test image' })
      expect(img).toBeInTheDocument()
      expect(img).toHaveAttribute('src', '/test-image.jpg')
      expect(img).toHaveAttribute('alt', 'Test image')
      expect(img).toHaveAttribute('width', '800')
      expect(img).toHaveAttribute('height', '600')
    })

    it('should not render without src', () => {
      const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {})

      render(
        <OptimizedImage
          src=""
          alt="Test"
          width={800}
          height={600}
        />
      )

      expect(consoleError).toHaveBeenCalledWith('OptimizedImage: src prop is required')
      consoleError.mockRestore()
    })

    it('should not render without alt text', () => {
      const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {})

      render(
        <OptimizedImage
          src="/test.jpg"
          alt=""
          width={800}
          height={600}
        />
      )

      expect(consoleError).toHaveBeenCalledWith('OptimizedImage: alt prop is required for accessibility')
      consoleError.mockRestore()
    })
  })

  describe('Loading strategies', () => {
    it('should use lazy loading by default', () => {
      render(
        <OptimizedImage
          src="/test.jpg"
          alt="Test"
          width={800}
          height={600}
        />
      )

      const img = screen.getByRole('img')
      expect(img).toHaveAttribute('loading', 'lazy')
    })

    it('should support eager loading', () => {
      render(
        <OptimizedImage
          src="/test.jpg"
          alt="Test"
          loading="eager"
          width={800}
          height={600}
        />
      )

      const img = screen.getByRole('img')
      expect(img).toHaveAttribute('loading', 'eager')
    })

    it('should use auto fetch priority by default', () => {
      render(
        <OptimizedImage
          src="/test.jpg"
          alt="Test"
          width={800}
          height={600}
        />
      )

      const img = screen.getByRole('img')
      expect(img).toHaveAttribute('fetchpriority', 'auto')
    })

    it('should support high fetch priority', () => {
      render(
        <OptimizedImage
          src="/test.jpg"
          alt="Test"
          fetchPriority="high"
          width={800}
          height={600}
        />
      )

      const img = screen.getByRole('img')
      expect(img).toHaveAttribute('fetchpriority', 'high')
    })
  })

  describe('Dimensions and aspect ratio', () => {
    it('should set width and height attributes', () => {
      render(
        <OptimizedImage
          src="/test.jpg"
          alt="Test"
          width={1200}
          height={630}
        />
      )

      const img = screen.getByRole('img')
      expect(img).toHaveAttribute('width', '1200')
      expect(img).toHaveAttribute('height', '630')
    })

    it('should maintain aspect ratio with inline style', () => {
      render(
        <OptimizedImage
          src="/test.jpg"
          alt="Test"
          width={800}
          height={600}
        />
      )

      const img = screen.getByRole('img')
      const style = img.getAttribute('style')
      expect(style).toContain('aspect-ratio: 800 / 600')
    })
  })

  describe('Placeholder support', () => {
    it('should render with blur placeholder', () => {
      const placeholder = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAiIGhlaWdodD0iMTAiPjxyZWN0IHdpZHRoPSIxMCIgaGVpZ2h0PSIxMCIgZmlsbD0iI2U1ZTdlYiIvPjwvc3ZnPg=='

      render(
        <OptimizedImage
          src="/test.jpg"
          alt="Test"
          width={800}
          height={600}
          placeholder={placeholder}
        />
      )

      const img = screen.getByRole('img')
      const style = img.getAttribute('style')
      expect(style).toContain(`background-image: url("${placeholder}")`)
      expect(style).toContain('background-size: cover')
      expect(style).toContain('background-position: center')
    })

    it('should not set background image without placeholder', () => {
      render(
        <OptimizedImage
          src="/test.jpg"
          alt="Test"
          width={800}
          height={600}
        />
      )

      const img = screen.getByRole('img')
      const style = img.getAttribute('style')
      expect(style).not.toContain('background-image')
    })
  })

  describe('Custom styling', () => {
    it('should apply custom className', () => {
      render(
        <OptimizedImage
          src="/test.jpg"
          alt="Test"
          width={800}
          height={600}
          className="custom-class"
        />
      )

      const img = screen.getByRole('img')
      expect(img).toHaveClass('custom-class')
    })

    it('should merge custom className with default classes', () => {
      render(
        <OptimizedImage
          src="/test.jpg"
          alt="Test"
          width={800}
          height={600}
          className="custom-class"
        />
      )

      const img = screen.getByRole('img')
      expect(img).toHaveClass('custom-class')
      expect(img).toHaveClass('transition-opacity')
      expect(img).toHaveClass('duration-300')
    })
  })

  describe('HTML attributes passthrough', () => {
    it('should pass through additional HTML attributes', () => {
      render(
        <OptimizedImage
          src="/test.jpg"
          alt="Test"
          width={800}
          height={600}
          data-testid="custom-test-id"
          title="Image title"
        />
      )

      const img = screen.getByRole('img')
      expect(img).toHaveAttribute('data-testid', 'custom-test-id')
      expect(img).toHaveAttribute('title', 'Image title')
    })
  })
})

describe('generateBlurPlaceholder', () => {
  it('should generate a valid data URL', () => {
    const placeholder = generateBlurPlaceholder()

    expect(placeholder).toMatch(/^data:image\/svg\+xml;base64,/)
  })

  it('should generate placeholder with custom color', () => {
    const placeholder = generateBlurPlaceholder('#ff0000')

    expect(placeholder).toMatch(/^data:image\/svg\+xml;base64,/)

    // Decode and check if color is included
    const svg = Buffer.from(placeholder.split(',')[1], 'base64').toString('utf-8')
    expect(svg).toContain('#ff0000')
  })

  it('should use default color when not specified', () => {
    const placeholder = generateBlurPlaceholder()

    const svg = Buffer.from(placeholder.split(',')[1], 'base64').toString('utf-8')
    expect(svg).toContain('#e5e7eb')
  })

  it('should generate valid SVG structure', () => {
    const placeholder = generateBlurPlaceholder()
    const svg = Buffer.from(placeholder.split(',')[1], 'base64').toString('utf-8')

    expect(svg).toContain('<svg')
    expect(svg).toContain('xmlns="http://www.w3.org/2000/svg"')
    expect(svg).toContain('width="10"')
    expect(svg).toContain('height="10"')
    expect(svg).toContain('<rect')
    expect(svg).toContain('<filter')
    expect(svg).toContain('feGaussianBlur')
  })
})
