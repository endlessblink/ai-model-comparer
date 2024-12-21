import { useMemo } from 'react'
import { getMDXContent } from '@/lib/mdx'
import { MDXProvider } from '@mdx-js/react'
import * as runtime from 'react/jsx-runtime'
import { evaluate } from '@mdx-js/mdx'
import { cn } from '@/lib/utils'

interface MDXContentProps {
  filename: string
  className?: string
}

const components = {
  h1: ({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h1 className={cn("scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl", className)} {...props} />
  ),
  h2: ({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h2 className={cn("scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0", className)} {...props} />
  ),
  h3: ({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h3 className={cn("scroll-m-20 text-2xl font-semibold tracking-tight", className)} {...props} />
  ),
  ul: ({ className, ...props }: React.HTMLAttributes<HTMLUListElement>) => (
    <ul className={cn("my-6 mr-6 list-disc [&>li]:mt-2", className)} {...props} />
  ),
  p: ({ className, ...props }: React.HTMLAttributes<HTMLParagraphElement>) => (
    <p className={cn("leading-7 [&:not(:first-child)]:mt-6", className)} {...props} />
  ),
}

export function MDXContent({ filename, className }: MDXContentProps) {
  const { content, frontMatter } = getMDXContent(filename)
  
  const Component = useMemo(() => {
    const code = evaluate(content, { ...runtime })
    return code
  }, [content])

  return (
    <MDXProvider components={components}>
      <div className={cn("mdx-content", className)}>
        <Component />
      </div>
    </MDXProvider>
  )
}
