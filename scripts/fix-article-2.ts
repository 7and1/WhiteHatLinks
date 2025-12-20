/**
 * Fix specific article with complete content
 */
import fs from 'fs'
import { markdownToLexical, generateSlug } from './markdown-to-lexical'

const JWT_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiY29sbGVjdGlvbiI6InVzZXJzIiwiZW1haWwiOiJoZWxsb0B3aGl0ZWhhdGxpbmsub3JnIiwic2lkIjoiOWMwMzNlODMtZTFmOS00NmFhLWI5MjItODExYWU2ZTJlZWYzIiwiaWF0IjoxNzY2MTk3Mjk2LCJleHAiOjE3NjYyMDQ0OTZ9.6gtQnN0yRxdUAgnHz9bUaAcKFm195lzsoE1UIFCWkbo'
const API_URL = 'https://whitehatlinks.7and1.workers.dev/api'

const TARGET_SLUG = 'types-of-link-building-outreach-which-strategy-wor'
const SOURCE_FILE = '/tmp/article-2-complete.md'

async function getArticle(slug: string) {
  const response = await fetch(`${API_URL}/posts?where[slug][equals]=${slug}&limit=1`, {
    headers: {
      Authorization: `JWT ${JWT_TOKEN}`,
    },
  })

  if (!response.ok) {
    throw new Error(`Failed to get article: ${response.statusText}`)
  }

  const data = await response.json()
  return data.docs[0]
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

async function main() {
  console.log('🔄 Fixing article with complete content...\n')

  // Check file exists
  if (!fs.existsSync(SOURCE_FILE)) {
    console.error(`❌ Source file not found: ${SOURCE_FILE}`)
    return
  }

  const stats = fs.statSync(SOURCE_FILE)
  console.log(`📄 Source file: ${SOURCE_FILE}`)
  console.log(`📊 File size: ${stats.size} bytes\n`)

  // Read markdown content
  const markdownContent = fs.readFileSync(SOURCE_FILE, 'utf-8')

  // Extract title
  const titleMatch = markdownContent.match(/^#\s+(.+)$/m)
  const title = titleMatch ? titleMatch[1] : 'Unknown'

  console.log(`📝 Title: ${title}`)

  // Get article
  console.log(`🔍 Finding article with slug: ${TARGET_SLUG}`)
  const article = await getArticle(TARGET_SLUG)

  if (!article) {
    console.error('❌ Article not found')
    return
  }

  console.log(`✓ Found: ${article.title}\n`)

  // Convert to Lexical
  console.log('🔄 Converting markdown to Lexical...')
  const lexicalContent = markdownToLexical(markdownContent.trim())

  const nodeCount = lexicalContent.root.children.length
  console.log(`✓ Converted: ${nodeCount} content nodes\n`)

  // Update article
  console.log('📤 Updating article...')
  await updateArticle(article.id, lexicalContent)

  console.log('✅ Article updated successfully!\n')
  console.log(`🌐 View at: https://whitehatlinks.7and1.workers.dev/blog/${TARGET_SLUG}`)
}

main().catch(console.error)
