import { useAuth } from '../../auth/AuthContext'
import sabespIcon from '../../assets/images/sabesp-icon.png'
import Icon from '../common/Icon'

type HeaderProps = {
  isMenuOpen: boolean
  onMenuToggle: () => void
  menuControlsId: string
}

function Header({ isMenuOpen, onMenuToggle, menuControlsId }: HeaderProps) {
  const { user } = useAuth()
  const displayName = user?.name ?? ''

  return (
    <header className="flex h-14 shrink-0 items-center justify-between border-b border-line bg-white px-4 sm:px-5">
      <div className="flex items-center gap-3 sm:gap-4">
        <button
          type="button"
          onClick={onMenuToggle}
          aria-label={isMenuOpen ? 'Fechar menu' : 'Abrir menu'}
          aria-expanded={isMenuOpen}
          aria-controls={menuControlsId}
          className="-ml-1.5 grid size-10 cursor-pointer place-items-center rounded-lg text-ink transition-colors hover:bg-brand-50 lg:hidden"
        >
          <Icon name={isMenuOpen ? 'close' : 'menu'} className="size-6" />
        </button>
        <img className="h-8 object-contain" src={sabespIcon} alt="Sabesp" />
        <span className="hidden h-6 w-px bg-line md:block" aria-hidden="true" />
        <span className="hidden text-base font-bold text-ink md:inline">EPC - Projetos Estratégicos</span>
      </div>

      <div className="flex items-center gap-2.5">
        <span className="grid size-8 place-items-center rounded-full bg-brand text-sm font-bold text-white">
          {displayName.charAt(0).toUpperCase()}
        </span>
        <span className="hidden text-sm font-semibold text-ink sm:inline">{displayName}</span>
        <Icon name="chevronDown" className="size-4 text-ink-muted" />
      </div>
    </header>
  )
}

export default Header
