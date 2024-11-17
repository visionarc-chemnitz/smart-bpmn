import { motion, AnimatePresence } from 'framer-motion'
import { useEffect } from 'react'
import { createPortal } from 'react-dom'

interface DialogProps {
  open: boolean
  onOpenChange: () => void
  children: React.ReactNode
  className?: string
}

export function Dialog({ open, onOpenChange, children, className = '' }: DialogProps) {
  // Handle ESC key press
  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onOpenChange()
    }
    
    if (open) {
      window.addEventListener('keydown', handleEsc)
      // Prevent body scroll when dialog is open
      document.body.style.overflow = 'hidden'
    }
    
    return () => {
      window.removeEventListener('keydown', handleEsc)
      document.body.style.overflow = 'unset'
    }
  }, [open, onOpenChange])

  return createPortal(
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onOpenChange}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
          />
          
          {/* Dialog Container */}
          <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
            {/* Dialog */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: "spring", duration: 0.5 }}
              className="w-full max-w-[550px]" // Added max-width constraint
            >
              <div className={`bg-white dark:bg-gray-800 rounded-2xl shadow-xl max-h-[90vh] overflow-y-auto ${className}`}>
                {children}
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>,
    document.body
  )
} 