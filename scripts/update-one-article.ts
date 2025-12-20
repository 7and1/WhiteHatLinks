/**
 * Update one article to test the fixed Markdown parsing
 */
import fs from 'fs'
import { markdownToLexical, generateSlug } from './markdown-to-lexical'

const API_URL = 'http://localhost:3000/api'

// Target slug to update
const TARGET_SLUG = 'writing-outreach-emails-that-get-replies-templates'

async function login() {
  const response = await fetch(`${API_URL}/users/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: 'hello@whitehatlink.org',
      password: 'admin123456',
    }),
  })

  if (!response.ok) {
    const error = await response.text()
    throw new Error(`Login failed: ${error}`)
  }

  const data = await response.json()
  return data.token
}

async function getArticles(token: string) {
  const response = await fetch(`${API_URL}/posts?limit=100`, {
    headers: {
      Authorization: `JWT ${token}`,
    },
  })

  if (!response.ok) {
    throw new Error(`Failed to get articles: ${response.statusText}`)
  }

  const data = await response.json()
  return data.docs
}

async function updateArticle(token: string, id: string, content: any) {
  const response = await fetch(`${API_URL}/posts/${id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `JWT ${token}`,
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
  console.log('🔄 Testing fixed Markdown parsing...\n')

  // Login
  console.log('🔐 Logging in...')
  const token = await login()
  console.log('✅ Logged in\n')

  // Get all articles
  console.log('📚 Fetching articles...')
  const articles = await getArticles(token)
  const article = articles.find((a: any) => a.slug === TARGET_SLUG)

  if (!article) {
    console.error(`❌ Article with slug "${TARGET_SLUG}" not found`)
    return
  }

  console.log(`Found article: "${article.title}"\n`)

  // Create test markdown with Real Example
  const testMarkdown = `# Test Article

This is a test paragraph with **bold text** and *italic text*.

## How to Write Effective Outreach Emails

**Real Example:**

"Hi [Name], I noticed you wrote about [topic]. I just published a related guide on [your topic]. Would you consider linking to it from your article?"

This approach works because:

- It shows you read their content
- It provides value
- It's specific and personalized

**Another Bold Section:** This has more content.

[Link to something](https://example.com)

\`code example\`

**Multiple** bold **sections** in one paragraph.
`

  console.log('Converting markdown to Lexical...')
  const lexicalContent = markdownToLexical(testMarkdown)

  console.log('\n--- Lexical Content Preview ---')
  console.log(JSON.stringify(lexicalContent, null, 2).substring(0, 1000) + '...\n')

  // Update article
  console.log(`🔄 Updating article: ${article.title}`)
  try {
    await updateArticle(token, article.id, {
      content: lexicalContent,
    })
    console.log(`✅ Updated successfully!`)
    console.log(
      `\n🌐 View at: http://localhost:3000/blog/${TARGET_SLUG}\n`,
    )
  } catch (error) {
    console.error(`❌ Failed to update: ${error}`)
  }
}

main().catch(console.error)
