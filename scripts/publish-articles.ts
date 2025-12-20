#!/usr/bin/env tsx
/**
 * Publish articles to Payload CMS via D1 database
 */

import { markdownToLexical, generateSlug } from './markdown-to-lexical'

interface ArticleData {
  title: string
  markdown: string
  tags: string[]
  metaTitle?: string
  metaDescription?: string
  publishedDate?: string
}

const articles: ArticleData[] = [
  // Articles will be added here
]

async function publishArticles() {
  console.log(`📝 Publishing ${articles.length} articles...`)

  for (let i = 0; i < articles.length; i++) {
    const article = articles[i]
    const slug = generateSlug(article.title)
    const content = markdownToLexical(article.markdown)
    const publishedDate = article.publishedDate || new Date().toISOString()
    const metaTitle = article.metaTitle || article.title
    const metaDescription = article.metaDescription || `Learn about ${article.title}`

    // Insert into posts table
    const insertPostSQL = `
      INSERT INTO posts (title, slug, content, published_date, meta_title, meta_description, updated_at, created_at)
      VALUES (
        '${escapeSQLString(article.title)}',
        '${escapeSQLString(slug)}',
        '${escapeSQLString(JSON.stringify(content))}',
        '${publishedDate}',
        '${escapeSQLString(metaTitle)}',
        '${escapeSQLString(metaDescription)}',
        '${new Date().toISOString()}',
        '${new Date().toISOString()}'
      )
    `

    console.log(`\n[${i + 1}/${articles.length}] Publishing: ${article.title}`)
    console.log(`   Slug: ${slug}`)
    console.log(`   Tags: ${article.tags.join(', ')}`)

    try {
      // Execute insert
      const { execSync } = await import('child_process')
      execSync(`wrangler d1 execute D1 --remote --command "${insertPostSQL.replace(/"/g, '\\"')}"`, {
        stdio: 'inherit',
      })

      // Get the post ID
      const getIdSQL = `SELECT id FROM posts WHERE slug = '${escapeSQLString(slug)}'`
      const result = execSync(`wrangler d1 execute D1 --remote --command "${getIdSQL.replace(/"/g, '\\"')}"`, {
        encoding: 'utf-8',
      })

      const postId = extractPostId(result)

      if (postId && article.tags.length > 0) {
        // Insert tags
        for (let j = 0; j < article.tags.length; j++) {
          const tag = article.tags[j]
          const insertTagSQL = `
            INSERT INTO posts_tags (order_num, parent_id, value)
            VALUES (${j + 1}, ${postId}, '${escapeSQLString(tag)}')
          `
          execSync(`wrangler d1 execute D1 --remote --command "${insertTagSQL.replace(/"/g, '\\"')}"`, {
            stdio: 'inherit',
          })
        }
      }

      console.log(`   ✅ Published successfully (ID: ${postId})`)
    } catch (error) {
      console.error(`   ❌ Failed to publish: ${error}`)
    }
  }

  console.log(`\n✨ Done! Published ${articles.length} articles.`)
}

function escapeSQLString(str: string): string {
  return str.replace(/'/g, "''").replace(/\n/g, '\\n').replace(/\r/g, '\\r')
}

function extractPostId(output: string): number | null {
  const match = output.match(/"id":\s*(\d+)/)
  return match ? parseInt(match[1]) : null
}

publishArticles().catch(console.error)
