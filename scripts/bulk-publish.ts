#!/usr/bin/env tsx

import fs from 'fs'
import { exec } from 'child_process'
import { promisify } from 'util'

const execAsync = promisify(exec)

const JWT_TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiY29sbGVjdGlvbiI6InVzZXJzIiwiZW1haWwiOiJoZWxsb0B3aGl0ZWhhdGxpbmsub3JnIiwic2lkIjoiMDRmYzZkNWMtMDAzMS00ZjM2LTk0YTgtNDM2YTY2ZjhkY2M4IiwiaWF0IjoxNzY2MTM3MzA4LCJleHAiOjE3NjYxNDQ1MDh9.j2vxKybYfF_cz80M0NH__hXWKTKgtgXvMSdeOTbmDxo"

interface ArticleData {
  title: string
  slug: string
  markdown: string
  tags: string[]
  publishedDate: string
}

const articles: ArticleData[] = JSON.parse(process.argv[2])

async function publishToD1() {
  console.log(`\n📚 准备发布 ${articles.length} 篇文章到 D1 数据库...\n`)

  for (const article of articles) {
    const wordCount = article.markdown.trim().split(/\s+/).length
    console.log(`📝 ${article.title}`)
    console.log(`   字数: ${wordCount} words`)

    if (wordCount < 2000) {
      console.log(`   ❌ 字数不足 2000 (缺少 ${2000 - wordCount} 个单词)`)
      continue
    }

    // 简化的 content JSON (只保留文本)
    const contentJson = {
      root: {
        type: 'root',
        children: article.markdown.split('\n\n').map(para => ({
          type: 'paragraph',
          children: [{ type: 'text', text: para, format: 0, mode: 'normal', style: '', detail: 0, version: 1 }],
          direction: 'ltr',
          format: '',
          indent: 0,
          version: 1
        })),
        direction: 'ltr',
        format: '',
        indent: 0,
        version: 1
      }
    }

    const escapedTitle = article.title.replace(/'/g, "''")
    const escapedSlug = article.slug.replace(/'/g, "''")
    const escapedContent = JSON.stringify(contentJson).replace(/'/g, "''")
    const escapedMeta = article.title.substring(0, 160).replace(/'/g, "''")

    const insertSQL = `INSERT INTO posts (title, slug, content, published_date, meta_title, meta_description, updated_at, created_at) VALUES ('${escapedTitle}', '${escapedSlug}', '${escapedContent}', '${article.publishedDate}', '${escapedTitle.substring(0, 60)}', '${escapedMeta}', datetime('now'), datetime('now'))`

    try {
      await execAsync(`wrangler d1 execute D1 --remote --command "${insertSQL.replace(/"/g, '\\"')}"`)

      // 获取插入的ID
      const getIdSQL = `SELECT id FROM posts WHERE slug = '${escapedSlug}'`
      const { stdout } = await execAsync(`wrangler d1 execute D1 --remote --command "${getIdSQL.replace(/"/g, '\\"')}"`)

      const idMatch = stdout.match(/"id":\s*(\d+)/)
      const postId = idMatch ? parseInt(idMatch[1]) : null

      if (postId && article.tags.length > 0) {
        // 插入tags
        for (let i = 0; i < article.tags.length; i++) {
          const tag = article.tags[i].replace(/'/g, "''")
          const tagSQL = `INSERT INTO posts_tags (order_num, parent_id, value) VALUES (${i + 1}, ${postId}, '${tag}')`
          await execAsync(`wrangler d1 execute D1 --remote --command "${tagSQL.replace(/"/g, '\\"')}"`)
        }
      }

      console.log(`   ✅ 发布成功 (ID: ${postId})`)
    } catch (error: any) {
      console.log(`   ❌ 发布失败: ${error.message}`)
    }
  }

  console.log(`\n✨ 发布完成!`)
}

publishToD1().catch(console.error)
