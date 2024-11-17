interface DialogContentProps {
  children: React.ReactNode
  className?: string
}

export function DialogContent({ children, className = '' }: DialogContentProps) {
  return (
    <div className={`p-6 sm:p-8 max-w-[90vw] sm:max-w-[600px] ${className}`}>
      {children}
    </div>
  )
} 