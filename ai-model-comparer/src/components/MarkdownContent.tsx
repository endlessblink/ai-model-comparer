import { getContent } from '@/lib/markdown'

interface MarkdownContentProps {
  section: string
  className?: string
}

export function MarkdownContent({ section, className = '' }: MarkdownContentProps) {
  const { html } = getContent(section)
  
  return (
    <div 
      className={`prose prose-lg prose-invert max-w-none ${className}`}
      dangerouslySetInnerHTML={{ __html: html }} 
    />
  )
}
