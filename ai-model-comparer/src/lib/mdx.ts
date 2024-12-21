import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'

const contentDirectory = path.join(process.cwd(), 'src/content')

export interface FrontMatter {
  title: string
  description: string
  [key: string]: any
}

export interface MDXContent {
  slug: string
  frontMatter: FrontMatter
  content: string
}

export function getMDXContent(filename: string): MDXContent {
  const filePath = path.join(contentDirectory, `${filename}.mdx`)
  const fileContents = fs.readFileSync(filePath, 'utf8')
  const { data, content } = matter(fileContents)
  
  return {
    slug: filename,
    frontMatter: data as FrontMatter,
    content
  }
}

export function getAllMDXFiles(): string[] {
  return fs.readdirSync(contentDirectory)
    .filter(file => file.endsWith('.mdx'))
    .map(file => file.replace(/\.mdx$/, ''))
}
