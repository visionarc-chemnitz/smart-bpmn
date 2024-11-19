interface DialogHeaderProps {
  children: React.ReactNode
  className?: string
}

export function DialogHeader({ children, className = '' }: DialogHeaderProps) {
  return (
    <div className={`space-y-2 ${className}`}>
      {children}
    </div>
  )
} 