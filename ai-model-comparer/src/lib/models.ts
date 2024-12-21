import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'

const modelsDirectory = path.join(process.cwd(), 'src/content/models')

export interface ModelData {
  name: string
  description: string
  features: string[]
  disadvantages: string[]
  usageNotes: string
}

export function getAllModels(): ModelData[] {
  const fileNames = fs.readdirSync(modelsDirectory)
  
  return fileNames
    .filter(fileName => fileName.endsWith('.md'))
    .map(fileName => {
      const fullPath = path.join(modelsDirectory, fileName)
      const fileContents = fs.readFileSync(fullPath, 'utf8')
      const { data } = matter(fileContents)
      
      return {
        name: data.name,
        description: data.description,
        features: data.features || [],
        disadvantages: data.disadvantages || [],
        usageNotes: data.usageNotes
      }
    })
}
