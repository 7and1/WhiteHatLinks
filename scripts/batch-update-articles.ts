/**
 * Batch update all published articles with fixed Markdown parsing
 */
import fs from 'fs'
import path from 'path'
import { markdownToLexical, generateSlug } from './markdown-to-lexical'

const JWT_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiY29sbGVjdGlvbiI6InVzZXJzIiwiZW1haWwiOiJoZWxsb0B3aGl0ZWhhdGxpbmsub3JnIiwic2lkIjoiMTVlYjQzN2ItYWU5Mi00NTVlLTk4MjgtMjk2Y2UxMzFhMGJlIiwiaWF0IjoxNzY2MTk4NjI4LCJleHAiOjE3NjYyMDU4Mjh9.3OtP2_QjXIrrxekCUiRax9nrmp0rWEsYAX3yFLMfUik'
const API_URL = 'https://whitehatlinks-production.7and1.workers.dev/api'

// Try multiple possible article directories
const possibleDirs = [
  '/tmp',
  '/Volumes/SSD/skills/content/whitehatlinks-articles',
  '/Volumes/SSD/dev/links/WhiteHatLinks/articles',
]

interface ArticleMetadata {
  title: string
  description?: string
  category?: string
  tags?: string[]
}

async function getArticles() {
  const response = await fetch(`${API_URL}/posts?limit=100`, {
    headers: {
      Authorization: `JWT ${JWT_TOKEN}`,
    },
  })

  if (!response.ok) {
    throw new Error(`Failed to get articles: ${response.statusText}`)
  }

  const data = await response.json()
  return data.docs
}

async function updateArticle(id: string, content: any) {
  const response = await fetch(`${API_URL}/posts/${id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `JWT ${JWT_TOKEN}`,
    },
    body: JSON.stringify({ content }),
  })

  if (!response.ok) {
    const error = await response.text()
    throw new Error(`Failed to update article: ${error}`)
  }

  return response.json()
}

function findMarkdownFiles(): string[] {
  const files: string[] = []

  for (const dir of possibleDirs) {
    if (fs.existsSync(dir)) {
      const dirFiles = fs.readdirSync(dir)
        .filter(f => f.endsWith('.md') && !f.includes('MARKDOWN_FIX'))
        .map(f => path.join(dir, f))
      files.push(...dirFiles)
    }
  }

  return files
}

function parseMetadataFromMarkdown(markdown: string): ArticleMetadata {
  // Try parsing front matter first
  const frontMatterMatch = markdown.match(/^---\n([\s\S]+?)\n---\n/)
  if (frontMatterMatch) {
    const frontMatter = frontMatterMatch[1]
    const metadata: any = {}

    frontMatter.split('\n').forEach(line => {
      const [key, ...valueParts] = line.split(':')
      const value = valueParts.join(':').trim()
      if (key && value) {
        if (key === 'tags') {
          metadata[key] = value
            .replace(/[\[\]]/g, '')
            .split(',')
            .map(t => t.trim())
            .filter(Boolean)
        } else {
          metadata[key as keyof ArticleMetadata] = value
        }
      }
    })

    return metadata as ArticleMetadata
  }

  // Fallback: extract title from first heading
  const titleMatch = markdown.match(/^#\s+(.+)$/m)
  return {
    title: titleMatch ? titleMatch[1] : 'Untitled',
  }
}

async function main() {
  console.log('🔄 Starting batch update process...\n')

  // Get all published articles
  console.log('📚 Fetching published articles...')
  const articles = await getArticles()
  console.log(`Found ${articles.length} published articles\n`)

  // Find all markdown files
  console.log('🔍 Searching for markdown source files...')
  const markdownFiles = findMarkdownFiles()
  console.log(`Found ${markdownFiles.length} markdown files\n`)

  if (markdownFiles.length === 0) {
    console.error('❌ No markdown files found in any of these directories:')
    possibleDirs.forEach(dir => console.error(`   - ${dir}`))
    return
  }

  let updated = 0
  let skipped = 0
  let failed = 0

  // Process each markdown file
  for (const filePath of markdownFiles) {
    try {
      console.log(`\n📄 Processing: ${path.basename(filePath)}`)

      const markdownContent = fs.readFileSync(filePath, 'utf-8')
      const metadata = parseMetadataFromMarkdown(markdownContent)

      if (!metadata.title) {
        console.log('   ⚠️  Skipped: No title found')
        skipped++
        continue
      }

      const slug = generateSlug(metadata.title)

      // Find matching article - try exact match first, then partial match
      let article = articles.find((a: any) => a.slug === slug)

      if (!article) {
        // Try partial match (in case CMS truncated the slug)
        article = articles.find((a: any) =>
          a.slug.startsWith(slug.substring(0, 50)) ||
          slug.startsWith(a.slug.substring(0, 50))
        )
      }

      if (!article) {
        console.log(`   ⚠️  Skipped: No matching article found`)
        console.log(`      Generated slug: ${slug}`)
        skipped++
        continue
      }

      console.log(`   ✓ Matched article: ${article.slug}`)

      // Extract content (remove front matter if exists)
      let content = markdownContent
      const frontMatterMatch = markdownContent.match(/^---\n[\s\S]+?\n---\n/)
      if (frontMatterMatch) {
        content = markdownContent.substring(frontMatterMatch[0].length)
      }

      // Convert to Lexical
      const lexicalContent = markdownToLexical(content.trim())

      // Update article
      console.log(`   🔄 Updating: ${metadata.title}`)
      await updateArticle(article.id, lexicalContent)
      console.log(`   ✅ Updated successfully!`)
      updated++

      // Small delay to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 500))

    } catch (error) {
      console.error(`   ❌ Failed: ${error}`)
      failed++
    }
  }

  console.log('\n' + '='.repeat(60))
  console.log('📊 Update Summary:')
  console.log(`✅ Updated:  ${updated}`)
  console.log(`⚠️  Skipped:  ${skipped}`)
  console.log(`❌ Failed:   ${failed}`)
  console.log(`📝 Total:    ${markdownFiles.length}`)
  console.log('='.repeat(60))

  if (updated > 0) {
    console.log('\n🌐 View articles at: https://whitehatlinks.7and1.workers.dev/blog\n')
  }
}

main().catch(console.error)
