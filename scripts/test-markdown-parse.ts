import { markdownToLexical } from './markdown-to-lexical'

// Test cases
const testCases = [
  '**Real Example:**',
  '**Bold Text** with normal text',
  'Normal text with **bold** in middle',
  '*Italic text*',
  '**Bold** and *italic* mixed',
  '`code text`',
  '[Link text](https://example.com)',
  '**Real Example:** This is a test with **multiple bold** sections',
]

console.log('Testing Markdown to Lexical conversion:\n')

testCases.forEach((test, index) => {
  console.log(`\n=== Test ${index + 1}: "${test}" ===`)
  const result = markdownToLexical(test)
  console.log(JSON.stringify(result, null, 2))
})

// Test the specific case from the article
const articleSnippet = `**Real Example:**

"Hi [Name], I noticed you wrote about [topic]. I just published a related guide on [your topic]. Would you consider linking to it from your article?"

This approach works because:`

console.log('\n\n=== Article Snippet Test ===')
console.log(articleSnippet)
console.log('\n--- Converted Result ---')
const result = markdownToLexical(articleSnippet)
console.log(JSON.stringify(result, null, 2))
