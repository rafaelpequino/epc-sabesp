import Icon, { type IconName } from './Icon'

type IconButtonProps = {
  icon: IconName
  label: string
  title?: string
  size?: string
  onClick?: () => void
}

// Padrão de cores por ação: exclusão em vermelho, edição em amarelo, demais em azul.
function getToneClasses(icon: IconName): string {
  if (icon === 'trash') return 'text-red-600 hover:bg-red-50 hover:text-red-700 focus-visible:outline-red-600'
  if (icon === 'pencil') {
    return 'text-accent-yellow-700 hover:bg-accent-yellow/20 hover:text-ink focus-visible:outline-accent-yellow-700'
  }
  return 'text-ink-muted hover:bg-brand-100 hover:text-brand-700 focus-visible:outline-brand'
}

function IconButton({ icon, label, title = label, size = 'size-8', onClick }: IconButtonProps) {
  return (
    <button
      type="button"
      aria-label={label}
      title={title}
      onClick={onClick}
      className={`grid ${size} shrink-0 cursor-pointer place-items-center rounded-lg transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 ${getToneClasses(icon)}`}
    >
      <Icon name={icon} className="size-4" />
    </button>
  )
}

export default IconButton
