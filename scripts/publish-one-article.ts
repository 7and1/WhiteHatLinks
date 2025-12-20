#!/usr/bin/env tsx
/**
 * Publish article to Payload CMS via REST API
 * Checks word count and enhances if needed
 */

import fs from 'fs'
import { exec } from 'child_process'
import { promisify } from 'util'

const execAsync = promisify(exec)

const JWT_TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiY29sbGVjdGlvbiI6InVzZXJzIiwiZW1haWwiOiJoZWxsb0B3aGl0ZWhhdGxpbmsub3JnIiwic2lkIjoiMDRmYzZkNWMtMDAzMS00ZjM2LTk0YTgtNDM2YTY2ZjhkY2M4IiwiaWF0IjoxNzY2MTM3MzA4LCJleHAiOjE3NjYxNDQ1MDh9.j2vxKybYfF_cz80M0NH__hXWKTKgtgXvMSdeOTbmDxo"
const API_URL = "https://whitehatlinks.7and1.workers.dev/api"

interface ArticleMetadata {
  title: string
  slug: string
  tags: string[]
  metaTitle: string
  metaDescription: string
}

function countWords(text: string): number {
  return text.trim().split(/\s+/).filter(word => word.length > 0).length
}

function extractMetadata(markdown: string): ArticleMetadata {
  const lines = markdown.split('\n')
  const title = lines[0].replace(/^#\s+/, '').trim()
  const slug = title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')

  // Extract first paragraph as meta description
  const paragraphs = markdown.split('\n\n').filter(p => !p.startsWith('#') && p.trim().length > 0)
  const metaDescription = paragraphs[0]?.substring(0, 160) || `Learn about ${title}`

  return {
    title,
    slug,
    tags: ['Outreach Templates'],
    metaTitle: title.substring(0, 60),
    metaDescription,
  }
}

function markdownToLexical(markdown: string) {
  const lines = markdown.split('\n')
  const children: any[] = []

  for (const line of lines) {
    if (!line.trim()) continue

    // Headings
    const headingMatch = line.match(/^(#{1,6})\s+(.+)$/)
    if (headingMatch) {
      const level = headingMatch[1].length
      const text = headingMatch[2]
      children.push({
        type: 'heading',
        tag: `h${level}`,
        children: [{ type: 'text', text, format: 0, mode: 'normal', style: '', detail: 0, version: 1 }],
        direction: 'ltr',
        format: '',
        indent: 0,
        version: 1,
      })
      continue
    }

    // Lists
    const bulletMatch = line.match(/^[\-\*]\s+(.+)$/)
    if (bulletMatch) {
      children.push({
        type: 'list',
        listType: 'bullet',
        start: 1,
        tag: 'ul',
        children: [{
          type: 'listitem',
          value: 1,
          children: [{ type: 'text', text: bulletMatch[1], format: 0, mode: 'normal', style: '', detail: 0, version: 1 }],
          direction: 'ltr',
          format: '',
          indent: 0,
          version: 1,
        }],
        direction: 'ltr',
        format: '',
        indent: 0,
        version: 1,
      })
      continue
    }

    // Regular paragraph
    children.push({
      type: 'paragraph',
      children: [{ type: 'text', text: line, format: 0, mode: 'normal', style: '', detail: 0, version: 1 }],
      direction: 'ltr',
      format: '',
      indent: 0,
      version: 1,
    })
  }

  return {
    root: {
      type: 'root',
      children,
      direction: 'ltr',
      format: '',
      indent: 0,
      version: 1,
    },
  }
}

async function publishArticle(markdownPath: string) {
  console.log(`\n📄 Processing: ${markdownPath}`)

  // Read markdown
  const markdown = fs.readFileSync(markdownPath, 'utf-8')
  const wordCount = countWords(markdown)

  console.log(`   Word count: ${wordCount}`)

  if (wordCount < 2000) {
    console.log(`   ❌ 字数不足 2000 words (${wordCount} words)`)
    console.log(`   需要补充 ${2000 - wordCount} 个单词`)
    return false
  }

  // Extract metadata
  const metadata = extractMetadata(markdown)
  console.log(`   Title: ${metadata.title}`)
  console.log(`   Slug: ${metadata.slug}`)

  // Convert to Lexical
  const content = markdownToLexical(markdown)

  // Prepare payload
  const payload = {
    title: metadata.title,
    slug: metadata.slug,
    content,
    publishedDate: new Date().toISOString(),
    tags: metadata.tags,
    metaTitle: metadata.metaTitle,
    metaDescription: metadata.metaDescription,
  }

  // Save payload to temp file
  const payloadPath = '/tmp/payload.json'
  fs.writeFileSync(payloadPath, JSON.stringify(payload))

  try {
    // Post to API
    const curlCmd = `curl -s -X POST "${API_URL}/posts" \
      -H "Authorization: JWT ${JWT_TOKEN}" \
      -H "Content-Type: application/json" \
      -d @${payloadPath}`

    const { stdout } = await execAsync(curlCmd)
    const response = JSON.parse(stdout)

    if (response.doc && response.doc.id) {
      console.log(`   ✅ 发布成功 (ID: ${response.doc.id})`)
      return true
    } else {
      console.log(`   ❌ 发布失败:`, response)
      return false
    }
  } catch (error) {
    console.log(`   ❌ 发布出错:`, error)
    return false
  }
}

// Get markdown file from command line
const markdownPath = process.argv[2]
if (!markdownPath) {
  console.error('Usage: tsx publish-one-article.ts <markdown-file>')
  process.exit(1)
}

publishArticle(markdownPath)
