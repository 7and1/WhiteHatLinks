/**
 * Convert Markdown to Lexical JSON format for Payload CMS
 */

interface LexicalNode {
  type: string
  version: number
  [key: string]: any
}

interface LexicalRoot {
  root: {
    type: 'root'
    children: LexicalNode[]
    direction: 'ltr' | null
    format: '' | 'left' | 'center' | 'right' | 'justify'
    indent: 0
    version: 1
  }
}

/**
 * Simple markdown to Lexical converter
 * Handles: headings, paragraphs, lists, bold, italic, links
 */
export function markdownToLexical(markdown: string): LexicalRoot {
  const lines = markdown.split('\n')
  const children: LexicalNode[] = []

  let inList = false
  let listType: 'bullet' | 'number' = 'bullet'
  let listItems: LexicalNode[] = []

  const flushList = () => {
    if (inList && listItems.length > 0) {
      children.push({
        type: 'list',
        listType,
        start: 1,
        tag: listType === 'bullet' ? 'ul' : 'ol',
        children: listItems,
        direction: 'ltr',
        format: '',
        indent: 0,
        version: 1,
      })
      listItems = []
      inList = false
    }
  }

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]

    // Empty line
    if (!line.trim()) {
      flushList()
      continue
    }

    // Headings
    const headingMatch = line.match(/^(#{1,6})\s+(.+)$/)
    if (headingMatch) {
      flushList()
      const level = headingMatch[1].length
      const text = headingMatch[2]
      children.push({
        type: 'heading',
        tag: `h${level}`,
        children: parseInlineText(text),
        direction: 'ltr',
        format: '',
        indent: 0,
        version: 1,
      })
      continue
    }

    // Bullet list
    const bulletMatch = line.match(/^[\-\*]\s+(.+)$/)
    if (bulletMatch) {
      if (!inList || listType !== 'bullet') {
        flushList()
        inList = true
        listType = 'bullet'
      }
      listItems.push({
        type: 'listitem',
        value: 1,
        children: parseInlineText(bulletMatch[1]),
        direction: 'ltr',
        format: '',
        indent: 0,
        version: 1,
      })
      continue
    }

    // Numbered list
    const numberedMatch = line.match(/^\d+\.\s+(.+)$/)
    if (numberedMatch) {
      if (!inList || listType !== 'number') {
        flushList()
        inList = true
        listType = 'number'
      }
      listItems.push({
        type: 'listitem',
        value: listItems.length + 1,
        children: parseInlineText(numberedMatch[1]),
        direction: 'ltr',
        format: '',
        indent: 0,
        version: 1,
      })
      continue
    }

    // Quote
    const quoteMatch = line.match(/^>\s+(.+)$/)
    if (quoteMatch) {
      flushList()
      children.push({
        type: 'quote',
        children: parseInlineText(quoteMatch[1]),
        direction: 'ltr',
        format: '',
        indent: 0,
        version: 1,
      })
      continue
    }

    // Horizontal rule
    if (line.match(/^(---|___|\*\*\*)$/)) {
      flushList()
      children.push({
        type: 'horizontalrule',
        version: 1,
      })
      continue
    }

    // Regular paragraph
    flushList()
    children.push({
      type: 'paragraph',
      children: parseInlineText(line),
      direction: 'ltr',
      format: '',
      indent: 0,
      version: 1,
    })
  }

  flushList()

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

/**
 * Parse inline text with bold, italic, code, links
 * Properly handles nested and overlapping formatting
 */
function parseInlineText(text: string): LexicalNode[] {
  const nodes: LexicalNode[] = []

  // Process text character by character to handle all formatting correctly
  let i = 0
  while (i < text.length) {
    // Check for bold **text**
    if (text.substring(i, i + 2) === '**') {
      const endIndex = text.indexOf('**', i + 2)
      if (endIndex !== -1) {
        const boldText = text.substring(i + 2, endIndex)
        nodes.push(createTextNode(boldText, 1))
        i = endIndex + 2
        continue
      }
    }

    // Check for italic *text* (but not if it's part of **)
    if (text[i] === '*' && text[i + 1] !== '*' && (i === 0 || text[i - 1] !== '*')) {
      const endIndex = findClosingAsterisk(text, i + 1)
      if (endIndex !== -1) {
        const italicText = text.substring(i + 1, endIndex)
        nodes.push(createTextNode(italicText, 2))
        i = endIndex + 1
        continue
      }
    }

    // Check for code `text`
    if (text[i] === '`') {
      const endIndex = text.indexOf('`', i + 1)
      if (endIndex !== -1) {
        const codeText = text.substring(i + 1, endIndex)
        nodes.push(createTextNode(codeText, 16))
        i = endIndex + 1
        continue
      }
    }

    // Check for links [text](url)
    if (text[i] === '[') {
      const closeBracket = text.indexOf(']', i + 1)
      if (closeBracket !== -1 && text[closeBracket + 1] === '(') {
        const closeParen = text.indexOf(')', closeBracket + 2)
        if (closeParen !== -1) {
          const linkText = text.substring(i + 1, closeBracket)
          const linkUrl = text.substring(closeBracket + 2, closeParen)
          nodes.push({
            type: 'link',
            url: linkUrl,
            children: [createTextNode(linkText, 0)],
            direction: 'ltr',
            format: '',
            indent: 0,
            version: 1,
          })
          i = closeParen + 1
          continue
        }
      }
    }

    // Regular text - collect until next formatting character
    let plainText = ''
    while (i < text.length &&
           text[i] !== '*' &&
           text[i] !== '`' &&
           text[i] !== '[') {
      plainText += text[i]
      i++
    }

    // If we hit a formatting character but couldn't parse it, include it as plain text
    if (plainText === '' && i < text.length) {
      plainText = text[i]
      i++
    }

    if (plainText) {
      nodes.push(createTextNode(plainText, 0))
    }
  }

  // If no nodes were created, return a single text node
  if (nodes.length === 0) {
    nodes.push(createTextNode(text, 0))
  }

  return nodes
}

/**
 * Find closing asterisk for italic, avoiding ** sequences
 */
function findClosingAsterisk(text: string, startIndex: number): number {
  for (let i = startIndex; i < text.length; i++) {
    if (text[i] === '*' && text[i + 1] !== '*' && text[i - 1] !== '*') {
      return i
    }
  }
  return -1
}

/**
 * Create a text node with formatting
 * format: 0 = none, 1 = bold, 2 = italic, 16 = code
 */
function createTextNode(text: string, format: number): LexicalNode {
  return {
    type: 'text',
    text,
    format,
    mode: 'normal',
    style: '',
    detail: 0,
    version: 1,
  }
}

/**
 * Generate slug from title
 */
export function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}
