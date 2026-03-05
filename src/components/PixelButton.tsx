type Props = {
  children: React.ReactNode
  onClick?: () => void
  className?: string
  disabled?: boolean
  variant?: 'default' | 'primary' | 'danger'
}

export function PixelButton({ children, onClick, className = '', disabled, variant = 'default' }: Props) {
  return (
    <button
      className={`pixel-btn ${variant} ${className}`}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  )
}
