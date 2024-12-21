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
        "group relative rounded-2xl bg-[#1a1a1a] transition-all duration-300 min-h-[280px]",
        isExpanded ? "scale-[1.02] z-10 shadow-lg" : "hover:scale-[1.02]"
      )}
    >
      <div className="absolute -inset-0.5 rounded-2xl bg-gradient-to-r from-purple-600/0 via-blue-600/0 to-cyan-500/0 opacity-0 blur transition-all duration-300 group-hover:from-purple-600/50 group-hover:via-blue-600/50 group-hover:to-cyan-500/50 group-hover:opacity-100" />
      
      <div className="relative flex h-full flex-col gap-6 rounded-2xl bg-[#1a1a1a] p-8">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            <div className="relative flex h-16 w-16 items-center justify-center rounded-xl bg-gradient-to-br from-[#2a2a2a] to-[#1f1f1f] p-3 shadow-lg">
              <div className="absolute inset-0.5 rounded-[10px] bg-gradient-to-br from-purple-500/10 to-cyan-500/10" />
              <ModelFavicon 
                name={model.name} 
                url={model.url} 
                size={36}
                className="rounded-lg bg-[#1a1a1a]"
              />
            </div>
            <div>
              <div className="flex items-center gap-3">
                <h3 className="text-2xl font-semibold text-white">{model.name}</h3>
                {model.pricing && (
                  <Badge variant="secondary" className="text-sm px-3 py-1 bg-gray-800/50">
                    {model.pricing.free_tier && model.pricing.paid_tier ? 'Freemium' :
                     model.pricing.free_tier ? 'Free' : 'Paid Only'}
                  </Badge>
                )}
                {model.url && (
                  <a
                    href={model.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    <ExternalLink className="h-5 w-5" />
                  </a>
                )}
              </div>
              <p className="text-base text-gray-400 mt-2 leading-relaxed">{model.description}</p>
            </div>
          </div>
          <div className="flex gap-2">
            {isAdmin && (
              <AddModelDialog
                initialData={model}
                onModelAdded={onEdit}
                trigger={(
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-gray-400 transition-colors hover:text-white"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <Bookmark className="h-5 w-5" />
                  </Button>
                )}
              />
            )}
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

        <div className="space-y-6">
          <div>
            <h4 className="text-lg font-medium text-gray-300 mb-2">יתרונות וחסרונות</h4>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h5 className="text-base font-medium text-gray-400 mb-1">יתרונות</h5>
                <ul className="list-disc list-inside space-y-1">
                  {model.pros?.map((pro, index) => (
                    <li key={index} className="text-base text-gray-400">{pro}</li>
                  ))}
                </ul>
              </div>
              <div>
                <h5 className="text-base font-medium text-gray-400 mb-1">חסרונות</h5>
                <ul className="list-disc list-inside space-y-1">
                  {model.cons?.map((con, index) => (
                    <li key={index} className="text-base text-gray-400">{con}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          <Button
            onClick={() => setIsExpanded(!isExpanded)}
            variant="ghost"
            className="w-full text-gray-400 hover:text-gray-300"
          >
            {isExpanded ? (
              <ChevronUp className="h-4 w-4 ml-2" />
            ) : (
              <ChevronDown className="h-4 w-4 ml-2" />
            )}
            {isExpanded ? "הצג פחות" : "הצג עוד"}
          </Button>

          {isExpanded && (
            <div className="space-y-6 mt-4">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <h4 className="text-lg font-medium text-gray-300 mb-2">תכונות</h4>
                  {model.features && model.features.length > 0 && (
                    <ul className="list-disc list-inside space-y-1">
                      {model.features.map((feature, index) => (
                        <li key={index} className="text-base text-gray-400">{feature}</li>
                      ))}
                    </ul>
                  )}
                </div>
                <div>
                  <h4 className="text-lg font-medium text-gray-300 mb-2">שימושים נפוצים</h4>
                  {model.useCases && model.useCases.length > 0 && (
                    <ul className="list-disc list-inside space-y-1">
                      {model.useCases.map((useCase, index) => (
                        <li key={index} className="text-base text-gray-400">{useCase}</li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>

              {model.pricing && (
                <div>
                  <h4 className="text-lg font-medium text-gray-300 mb-2">תמחור</h4>
                  <div className="flex flex-wrap gap-2">
                    {model.pricing.free_tier && (
                      <Badge variant="outline" className="text-base px-4 py-1">
                        חינמי: {model.pricing.free_tier}
                      </Badge>
                    )}
                    {model.pricing.paid_tier && (
                      <Badge variant="outline" className="text-base px-4 py-1">
                        בתשלום: {model.pricing.paid_tier}
                      </Badge>
                    )}
                    {model.pricing.enterprise && (
                      <Badge variant="outline" className="text-base px-4 py-1">
                        ארגוני: {model.pricing.enterprise}
                      </Badge>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="flex justify-center mt-auto">
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