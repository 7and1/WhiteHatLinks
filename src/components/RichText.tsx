'use client'

import React from 'react'

let uniqueKeyCounter = 0
function generateUniqueKey(): string {
  return `node-${++uniqueKeyCounter}-${Date.now()}`
}

interface RichTextProps {
  content: unknown
  className?: string
}

interface LexicalNode {
  type: string
  children?: LexicalNode[]
  text?: string
  format?: number
  tag?: string
  url?: string
  newTab?: boolean
  listType?: 'bullet' | 'number' | 'check'
  value?: number
  version?: number
  direction?: 'ltr' | 'rtl' | null
  indent?: number
}

interface LexicalRoot {
  root?: LexicalNode
}

// Format flags
const IS_BOLD = 1
const IS_ITALIC = 1 << 1
const IS_STRIKETHROUGH = 1 << 2
const IS_UNDERLINE = 1 << 3
const IS_CODE = 1 << 4
const IS_SUBSCRIPT = 1 << 5
const IS_SUPERSCRIPT = 1 << 6

function renderText(text: string, format: number): React.ReactNode {
  let content: React.ReactNode = text

  if (format & IS_CODE) {
    content = <code className="bg-muted px-1 py-0.5 rounded text-sm font-mono">{content}</code>
  }
  if (format & IS_BOLD) {
    content = <strong>{content}</strong>
  }
  if (format & IS_ITALIC) {
    content = <em>{content}</em>
  }
  if (format & IS_UNDERLINE) {
    content = <u>{content}</u>
  }
  if (format & IS_STRIKETHROUGH) {
    content = <s>{content}</s>
  }
  if (format & IS_SUBSCRIPT) {
    content = <sub>{content}</sub>
  }
  if (format & IS_SUPERSCRIPT) {
    content = <sup>{content}</sup>
  }

  return content
}

function renderNode(node: LexicalNode, key?: string): React.ReactNode {
  const nodeKey = key || generateUniqueKey()
  const { type, children, text, format = 0, tag, url, newTab, listType, value } = node

  // Text node
  if (type === 'text' && text !== undefined) {
    return <React.Fragment key={nodeKey}>{renderText(text, format)}</React.Fragment>
  }

  // Linebreak
  if (type === 'linebreak') {
    return <br key={nodeKey} />
  }

  // Render children
  const childContent = children?.map((child) => renderNode(child))

  // Paragraph
  if (type === 'paragraph') {
    return <p key={nodeKey}>{childContent}</p>
  }

  // Headings
  if (type === 'heading') {
    const headingTag = tag || 'h2'
    switch (headingTag) {
      case 'h1':
        return <h1 key={nodeKey}>{childContent}</h1>
      case 'h2':
        return <h2 key={nodeKey}>{childContent}</h2>
      case 'h3':
        return <h3 key={nodeKey}>{childContent}</h3>
      case 'h4':
        return <h4 key={nodeKey}>{childContent}</h4>
      case 'h5':
        return <h5 key={nodeKey}>{childContent}</h5>
      case 'h6':
        return <h6 key={nodeKey}>{childContent}</h6>
      default:
        return <h2 key={nodeKey}>{childContent}</h2>
    }
  }

  // Quote
  if (type === 'quote') {
    return <blockquote key={nodeKey}>{childContent}</blockquote>
  }

  // Lists
  if (type === 'list') {
    if (listType === 'number') {
      return <ol key={nodeKey} start={value}>{childContent}</ol>
    }
    return <ul key={nodeKey}>{childContent}</ul>
  }

  // List item
  if (type === 'listitem') {
    return <li key={nodeKey} value={value}>{childContent}</li>
  }

  // Link
  if (type === 'link' || type === 'autolink') {
    return (
      <a
        key={nodeKey}
        href={url}
        target={newTab ? '_blank' : undefined}
        rel={newTab ? 'noopener noreferrer' : undefined}
        className="text-primary hover:underline"
      >
        {childContent}
      </a>
    )
  }

  // Code block
  if (type === 'code') {
    return (
      <pre key={nodeKey} className="bg-muted p-4 rounded-lg overflow-x-auto">
        <code>{childContent}</code>
      </pre>
    )
  }

  // Horizontal rule
  if (type === 'horizontalrule') {
    return <hr key={nodeKey} />
  }

  // Root
  if (type === 'root') {
    return <React.Fragment key={nodeKey}>{childContent}</React.Fragment>
  }

  // Default: render children or nothing
  if (childContent && childContent.length > 0) {
    return <React.Fragment key={nodeKey}>{childContent}</React.Fragment>
  }

  return null
}

export function RichText({ content, className }: RichTextProps) {
  if (!content) {
    return null
  }

  const lexicalContent = content as LexicalRoot
  if (!lexicalContent.root) {
    return null
  }

  return (
    <div className={className}>
      {renderNode(lexicalContent.root, 'root')}
    </div>
  )
}

export default RichText
