import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { marked } from 'marked'

const contentDirectory = path.join(process.cwd(), 'src/content')

export interface ContentData {
  content: string
  html: string
}

export function getContent(section: string): ContentData {
  const fullPath = path.join(contentDirectory, section, 'main.md')
  const fileContents = fs.readFileSync(fullPath, 'utf8')
  const { content } = matter(fileContents)
  
  return {
    content,
    html: marked(content)
  }
}

export function getAllSections(): string[] {
  return fs.readdirSync(contentDirectory)
    .filter(file => {
      const fullPath = path.join(contentDirectory, file)
      return fs.statSync(fullPath).isDirectory()
    })
}
