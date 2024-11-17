interface DialogTitleProps {
  children: React.ReactNode
  className?: string
}

export function DialogTitle({ children, className = '' }: DialogTitleProps) {
  return (
    <h2 className={`text-2xl font-bold text-gray-900 dark:text-white ${className}`}>
      {children}
    </h2>
  )
} 