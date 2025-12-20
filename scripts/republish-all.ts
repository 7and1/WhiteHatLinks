/**
 * Republish all articles with fixed Markdown parsing
 */
import fs from 'fs'
import path from 'path'
import { markdownToLexical, generateSlug } from './markdown-to-lexical'

const JWT_TOKEN =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiY29sbGVjdGlvbiI6InVzZXJzIiwiZW1haWwiOiJoZWxsb0B3aGl0ZWhhdGxpbmsub3JnIiwic2lkIjoiMDRmYzZkNWMtMDAzMS00ZjM2LTk0YTgtNDM2YTY2ZjhkY2M4IiwiaWF0IjoxNzY2MTM3MzA4LCJleHAiOjE3NjYxNDQ1MDh9.j2vxKybYfF_cz80M0NH__hXWKTKgtgXvMSdeOTbmDxo'
const API_URL = 'https://whitehatlinks.7and1.workers.dev/api'

const articlesDir = '/Volumes/SSD/skills/content/whitehatlinks-articles'

interface ArticleMetadata {
  title: string
  description: string
  category: string
  tags: string[]
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
    body: JSON.stringify(content),
  })

  if (!response.ok) {
    const error = await response.text()
    throw new Error(`Failed to update article: ${error}`)
  }

  return response.json()
}

async function main() {
  console.log('🔄 Starting republish process...\n')

  // Get all articles
  console.log('📚 Fetching existing articles...')
  const existingArticles = await getArticles()
  console.log(`Found ${existingArticles.length} articles\n`)

  // Get all markdown files
  const files = fs.readdirSync(articlesDir).filter(f => f.endsWith('.md'))
  console.log(`Found ${files.length} markdown files\n`)

  let updated = 0
  let skipped = 0

  for (const file of files) {
    const filePath = path.join(articlesDir, file)
    const markdownContent = fs.readFileSync(filePath, 'utf-8')

    // Parse front matter
    const frontMatterMatch = markdownContent.match(/^---\n([\s\S]+?)\n---\n/)
    if (!frontMatterMatch) {
      console.log(`⚠️  Skipping ${file}: No front matter found`)
      skipped++
      continue
    }

    const frontMatter = frontMatterMatch[1]
    const metadata: Partial<ArticleMetadata> = {}

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
          metadata[key as keyof ArticleMetadata] = value as any
        }
      }
    })

    if (!metadata.title) {
      console.log(`⚠️  Skipping ${file}: No title found`)
      skipped++
      continue
    }

    const slug = generateSlug(metadata.title)

    // Find existing article
    const existingArticle = existingArticles.find((a: any) => a.slug === slug)

    if (!existingArticle) {
      console.log(`⚠️  Skipping ${file}: Article not found in CMS (slug: ${slug})`)
      skipped++
      continue
    }

    // Convert content
    const contentWithoutFrontMatter = markdownContent.substring(
      frontMatterMatch[0].length,
    )
    const lexicalContent = markdownToLexical(contentWithoutFrontMatter.trim())

    // Update article
    console.log(`🔄 Updating: ${metadata.title}`)
    try {
      await updateArticle(existingArticle.id, {
        content: lexicalContent,
      })
      console.log(`✅ Updated successfully\n`)
      updated++
    } catch (error) {
      console.error(`❌ Failed to update: ${error}\n`)
      skipped++
    }

    // Small delay to avoid rate limiting
    await new Promise(resolve => setTimeout(resolve, 500))
  }

  console.log('\n' + '='.repeat(50))
  console.log('📊 Summary:')
  console.log(`✅ Updated: ${updated}`)
  console.log(`⚠️  Skipped: ${skipped}`)
  console.log(`📝 Total: ${files.length}`)
  console.log('='.repeat(50))
}

main().catch(console.error)
