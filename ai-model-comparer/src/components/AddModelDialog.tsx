import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import AddModelForm from './AddModelForm'
import { type AIModel } from '@/data/models'

interface AddModelDialogProps {
  onModelAdded: (model: AIModel) => void
  initialData?: Partial<AIModel>
  trigger?: React.ReactNode
}

export default function AddModelDialog({
  onModelAdded,
  initialData,
  trigger,
}: AddModelDialogProps) {
  const [open, setOpen] = useState(false)

  const handleSubmit = async (data: AIModel) => {
    onModelAdded(data)
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button className="bg-purple-600 hover:bg-purple-700">
            <Plus className="mr-2 h-4 w-4" />
            הוסף מודל
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] bg-[#121212] border-[#2a2a2a]">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            {initialData ? 'עריכת מודל' : 'הוספת מודל חדש'}
          </DialogTitle>
        </DialogHeader>
        <AddModelForm
          initialData={initialData}
          onSubmit={handleSubmit}
          onCancel={() => setOpen(false)}
        />
      </DialogContent>
    </Dialog>
  )
} 