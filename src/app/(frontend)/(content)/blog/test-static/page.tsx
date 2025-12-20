import Link from 'next/link'

// Static test data
const testPosts = [
  {
    id: '1',
    slug: 'test-post-1',
    title: 'Test Post 1',
    meta_description: 'This is a test post to verify blog functionality',
    published_date: '2025-01-15',
    tags: ['Guest Posting', 'SEO']
  },
  {
    id: '2',
    slug: 'test-post-2',
    title: 'Test Post 2',
    meta_description: 'Another test post for blog verification',
    published_date: '2025-01-10',
    tags: ['Link Building', 'Content Strategy']
  },
]

export default function TestBlogPage() {
  return (
    <div className="container py-16">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <Link
            href="/blog"
            className="text-primary hover:text-primary/80 transition-colors"
          >
            ← Back to Blog
          </Link>
        </div>

        <h1 className="text-3xl font-bold mb-8">Test Static Blog Page</h1>
        <p className="text-muted-foreground mb-8">
          This is a static test page to verify blog functionality without Payload CMS dependency.
        </p>

        <div className="grid gap-6 md:grid-cols-2">
          {testPosts.map((post) => (
            <div key={post.id} className="border rounded-lg p-6">
              <div className="text-sm text-muted-foreground mb-2">
                {new Date(post.published_date).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </div>
              <h2 className="text-xl font-semibold mb-2">{post.title}</h2>
              <p className="text-muted-foreground mb-4">{post.meta_description}</p>
              {post.tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {post.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}