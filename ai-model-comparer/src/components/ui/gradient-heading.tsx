import { cn } from "@/lib/utils"

interface GradientHeadingProps {
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'
  children: React.ReactNode
  className?: string
}

export function GradientHeading({ 
  as: Component = 'h1', 
  children, 
  className 
}: GradientHeadingProps) {
  return (
    <Component 
      className={cn(
        "text-black dark:text-transparent dark:bg-clip-text dark:bg-gradient-to-r dark:from-[#a78bfa] dark:via-[#818cf8] dark:to-[#a78bfa] font-bold",
        className
      )}
    >
      {children}
    </Component>
  )
}
