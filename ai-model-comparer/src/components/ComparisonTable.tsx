import { useState } from 'react'
import { type AIModel } from '@/data/models'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ExternalLink, Bookmark, ChevronDown, ChevronUp } from 'lucide-react'
import AddModelDialog from './AddModelDialog'
import { cn } from '@/lib/utils'
import { ModelFavicon } from './ModelFavicon'

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'

interface ComparisonTableProps {
  models: AIModel[]
  onEdit: (model: AIModel) => void
  onDelete: (modelId: string) => void
  isAdmin: boolean
}

const ModelCard = ({ model, onEdit, onDelete, isAdmin }: { model: AIModel } & Pick<ComparisonTableProps, 'onEdit' | 'onDelete' | 'isAdmin'>) => {
  const [isExpanded, setIsExpanded] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)

  return (
    <div 
      className={cn(
        "group relative rounded-2xl bg-[#1a1a1a] transition-all duration-300",
        isExpanded ? "scale-[1.02] z-10 shadow-lg" : "hover:scale-[1.02]"
      )}
    >
      <div className="absolute -inset-0.5 rounded-2xl bg-gradient-to-r from-purple-600/0 via-blue-600/0 to-cyan-500/0 opacity-0 blur transition-all duration-300 group-hover:from-purple-600/50 group-hover:via-blue-600/50 group-hover:to-cyan-500/50 group-hover:opacity-100" />
      
      <div className="relative flex h-full flex-col gap-4 rounded-2xl bg-[#1a1a1a] p-6">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="relative flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-[#2a2a2a] to-[#1f1f1f] p-2.5 shadow-lg">
              <div className="absolute inset-0.5 rounded-[10px] bg-gradient-to-br from-purple-500/10 to-cyan-500/10" />
              <ModelFavicon 
                name={model.name} 
                url={model.url} 
                size={28}
                className="rounded-lg bg-[#1a1a1a]"
              />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-semibold text-white">{model.name}</h3>
                {model.url && (
                  <a
                    href={model.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    <ExternalLink className="h-4 w-4" />
                  </a>
                )}
              </div>
              <p className="text-sm text-gray-400">{model.description}</p>
            </div>
          </div>
          <div className="flex gap-2">
            {isAdmin && (
              <AddModelDialog
                initialData={model}
                onModelAdded={onEdit}
                trigger={
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-gray-400 transition-colors hover:text-white"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <Bookmark className="h-5 w-5" />
                  </Button>
                }
              />
            )}
            <Button
              variant="ghost"
              size="icon" 
              className="text-gray-400 transition-colors hover:text-white"
              onClick={(e) => {
                e.stopPropagation()
                setIsExpanded(!isExpanded)
              }}
            >
              {isExpanded ? (
                <ChevronUp className="h-5 w-5" />
              ) : (
                <ChevronDown className="h-5 w-5" />
              )}
            </Button>
            {isAdmin && (
              <Button 
                variant="ghost" 
                size="icon"
                className="text-red-400 transition-colors hover:text-red-300"
                onClick={(e) => {
                  e.stopPropagation()
                  setShowDeleteDialog(true)
                }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </Button>
            )}
          </div>
        </div>
        
        <div className={cn(
          "relative transition-all duration-300",
          isExpanded ? "h-auto" : "h-[4.5rem] overflow-hidden"
        )}>
          <p className="text-sm leading-relaxed text-gray-400">{model.description}</p>
          {!isExpanded && (
            <div className="absolute bottom-0 h-6 w-full bg-gradient-to-t from-[#1a1a1a] to-transparent" />
          )}
        </div>
        
        <div className={cn(
          "space-y-3 transition-all duration-300",
          isExpanded ? "opacity-100" : "opacity-70"
        )}>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <h4 className="text-xs font-medium text-emerald-500">יתרונות</h4>
              <ul className="space-y-1">
                {model.pros.map((pro, index) => (
                  <li key={index} className="flex items-center gap-1.5 text-xs text-gray-400">
                    <div className="h-1 w-1 rounded-full bg-emerald-500/50" />
                    {pro}
                  </li>
                ))}
              </ul>
            </div>
            <div className="space-y-1.5">
              <h4 className="text-xs font-medium text-red-500">חסרונות</h4>
              <ul className="space-y-1">
                {model.cons.map((con, index) => (
                  <li key={index} className="flex items-center gap-1.5 text-xs text-gray-400">
                    <div className="h-1 w-1 rounded-full bg-red-500/50" />
                    {con}
                  </li>
                ))}
              </ul>
            </div>
          </div>
          
          {model.features && model.features.length > 0 && (
            <div className="space-y-1.5">
              <h4 className="text-xs font-medium text-gray-500">תכונות עיקריות</h4>
              <ul className="grid grid-cols-2 gap-1">
                {model.features.map((feature, index) => (
                  <li key={index} className="flex items-center gap-1.5 text-xs text-gray-400">
                    <div className="h-1 w-1 rounded-full bg-purple-500/50" />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          )}
          
          <div className="flex flex-wrap gap-1.5">
            {model.tags?.map((tag) => (
              <Badge
                key={tag}
                variant="outline"
                className="border-[#2a2a2a] bg-[#1f1f1f] px-2 py-0.5 text-xs font-normal text-gray-400 transition-colors hover:border-purple-500/30 hover:text-gray-300"
              >
                {tag}
              </Badge>
            ))}
          </div>
        </div>
        
        <div className="mt-auto flex items-center justify-between gap-2 pt-4">
          {model.url && (
            <Button 
              variant="ghost" 
              size="sm"
              className="h-8 flex-1 gap-1.5 px-3 text-sm font-normal text-gray-400 transition-colors hover:bg-[#2a2a2a] hover:text-white"
              asChild
              onClick={(e) => e.stopPropagation()}
            >
              <a href={model.url} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="h-3.5 w-3.5" />
                פתח אתר
              </a>
            </Button>
          )}
          {isAdmin && (
            <Button 
              variant="ghost" 
              size="sm"
              className="h-8 flex-1 gap-1.5 px-3 text-sm font-normal text-red-400 transition-colors hover:bg-red-500/10 hover:text-red-300"
              onClick={(e) => {
                e.stopPropagation()
                onDelete(model.id)
              }}
            >
              מחק מודל
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}

export default function ComparisonTable({
  models,
  onEdit,
  onDelete,
  isAdmin,
}: ComparisonTableProps) {
  const [modelToDelete, setModelToDelete] = useState<string | null>(null)

  const handleDeleteClick = (modelId: string) => {
    setModelToDelete(modelId)
  }

  const handleDeleteConfirm = () => {
    if (modelToDelete) {
      onDelete(modelToDelete)
      setModelToDelete(null)
    }
  }

  return (
    <>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {models.map((model) => (
          <ModelCard
            key={model.id}
            model={model}
            onEdit={onEdit}
            onDelete={handleDeleteClick}
            isAdmin={isAdmin}
          />
        ))}
      </div>

      <AlertDialog
        open={modelToDelete !== null}
        onOpenChange={() => setModelToDelete(null)}
      >
        <AlertDialogContent className="bg-[#1a1a1a] border-[#2a2a2a]">
          <AlertDialogHeader>
            <AlertDialogTitle>האם אתה בטוח?</AlertDialogTitle>
            <AlertDialogDescription>
              פעולה זו תמחק את המודל לצמיתות ולא ניתן יהיה לשחזר אותו.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="border-[#2a2a2a] hover:bg-[#2a2a2a]">
              ביטול
            </AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-600 hover:bg-red-700"
              onClick={handleDeleteConfirm}
            >
              מחיקה
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}