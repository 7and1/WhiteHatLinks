/**
 * Fix all articles with incomplete content
 */
import fs from 'fs'
import path from 'path'
import { markdownToLexical } from './markdown-to-lexical'

const JWT_TOKEN =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiY29sbGVjdGlvbiI6InVzZXJzIiwiZW1haWwiOiJoZWxsb0B3aGl0ZWhhdGxpbmsub3JnIiwic2lkIjoiMTVlYjQzN2ItYWU5Mi00NTVlLTk4MjgtMjk2Y2UxMzFhMGJlIiwiaWF0IjoxNzY2MTk4NjI4LCJleHAiOjE3NjYyMDU4Mjh9.3OtP2_QjXIrrxekCUiRax9nrmp0rWEsYAX3yFLMfUik'
const API_URL = 'https://whitehatlinks-production.7and1.workers.dev/api'

// Articles that need fixing (slug prefix -> source file)
const articlesToFix: Record<string, string> = {
  'writing-outreach-emails-that-get-replies-templates':
    '/tmp/article-5-complete.md',
  'outreach-metrics-kpis-track-and-improve-your-numbe':
    '/tmp/article-8-final.md',
  'building-long-term-relationships-through-outreach-':
    '/tmp/article-10-complete.md',
  'outreach-for-different-industries-customize-your-a':
    '/tmp/article-11-complete.md',
}

async function getArticles() {
  const response = await fetch(`${API_URL}/posts?limit=20`, {
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

async function main() {
  console.log('🔄 Fixing articles with incomplete content...\n')

  // Get all articles
  const articles = await getArticles()

  let fixed = 0
  let skipped = 0

  for (const [slugPrefix, sourceFile] of Object.entries(articlesToFix)) {
    console.log(`\n📄 Processing: ${slugPrefix}`)

    // Check if source file exists
    if (!fs.existsSync(sourceFile)) {
      console.log(`   ⚠️  Source file not found: ${sourceFile}`)
      skipped++
      continue
    }

    const stats = fs.statSync(sourceFile)
    console.log(`   📊 File size: ${stats.size} bytes`)

    // Find matching article
    const article = articles.find((a: any) => a.slug.startsWith(slugPrefix))

    if (!article) {
      console.log(`   ⚠️  Article not found`)
      skipped++
      continue
    }

    console.log(`   ✓ Found: ${article.title}`)

    // Read and convert content
    const markdownContent = fs.readFileSync(sourceFile, 'utf-8')
    const lexicalContent = markdownToLexical(markdownContent.trim())

    const nodeCount = lexicalContent.root.children.length
    console.log(`   🔄 Converting: ${nodeCount} nodes`)

    // Update
    await updateArticle(article.id, lexicalContent)
    console.log(`   ✅ Updated!`)

    fixed++

    // Small delay
    await new Promise((resolve) => setTimeout(resolve, 500))
  }

  console.log('\n' + '='.repeat(60))
  console.log('📊 Fix Summary:')
  console.log(`✅ Fixed:   ${fixed}`)
  console.log(`⚠️  Skipped: ${skipped}`)
  console.log('='.repeat(60))
  console.log('\n🌐 View at: https://whitehatlinks.7and1.workers.dev/blog\n')
}

main().catch(console.error)
