import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { X } from "lucide-react" // For close button

interface ValueDialogProps {
  isOpen: boolean
  onClose: () => void
  value: {
    title: string
    icon: React.ReactNode
    description: string
    longDescription: string
    keyPoints: string[]
  } | null
}

export function ValueDialog({ isOpen, onClose, value }: ValueDialogProps) {

  if (!value) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[550px] p-0 overflow-hidden">
        {/* Header */}
        <div className="relative p-6 pb-0">
          <button
            onClick={onClose}
            className="absolute right-4 top-4 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>

          <div className="flex items-center gap-4 mb-6">
            <div className="p-3 rounded-xl bg-gradient-to-br from-primary-100 to-primary-50 dark:from-primary-900/30 dark:to-primary-800/20 text-primary-500 dark:text-primary-400 shadow-sm">
              {value.icon}
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                {value.title}
              </h3>
              {/* <p className="text-sm text-gray-500 dark:text-gray-400">
                {value.longDescription}
              </p> */}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 pt-0 space-y-6">
          <p className="text-base text-gray-700 dark:text-gray-300 leading-relaxed">
            {value.longDescription}
          </p>
          
          {/* <div className="space-y-4">
            <h4 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
              <span className="h-1 w-1 rounded-full bg-primary-500"></span>
              Key Aspects
            </h4>
            <ul className="grid gap-3">
              {value.keyPoints.map((point, index) => (
                <motion.li
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-start gap-3 text-gray-600 dark:text-gray-300"
                >
                  <div className="h-2 w-2 rounded-full bg-primary-500 mt-2 shrink-0" />
                  <span className="text-sm">{point}</span>
                </motion.li>
              ))}
            </ul>
          </div> */}
        </div>
      </DialogContent>
    </Dialog>
  )
} 