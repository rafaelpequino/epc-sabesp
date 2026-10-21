import { NavLink } from 'react-router-dom'
import { useAuth } from '../../auth/AuthContext'
import Icon from '../common/Icon'
import { NAV_SECTIONS } from './navigation'

type SidebarProps = {
  id: string
  isOpen: boolean
}

function Sidebar({ id, isOpen }: SidebarProps) {
  const { logout } = useAuth()

  return (
    <aside
      id={id}
      className={`fixed bottom-0 left-0 top-14 z-40 flex w-61 shrink-0 flex-col overflow-y-auto border-r border-line bg-white px-2 py-3.5 transition-[translate,visibility,box-shadow] duration-300 ease-out motion-reduce:transition-none lg:visible lg:static lg:translate-x-0 lg:shadow-none lg:transition-none ${
        isOpen ? 'translate-x-0 shadow-2xl' : 'invisible -translate-x-full shadow-none'
      }`}
    >
      <nav className="flex flex-1 flex-col gap-4" aria-label="Menu principal">
        {NAV_SECTIONS.map((section, index) => (
          <div key={section.title ?? index} className="flex flex-col gap-1">
            {section.title && (
              <h2 className="px-3.5 pb-1 pt-1 text-[11px] font-bold uppercase tracking-wider text-ink-muted">
                {section.title}
              </h2>
            )}
            {section.items.map((item) =>
              item.locked ? (
                <span
                  key={item.to}
                  aria-disabled="true"
                  aria-label={`${item.label} — não disponível`}
                  title="Link não disponível"
                  className="flex cursor-not-allowed items-center gap-3 rounded-lg px-3.5 py-2.5 text-[15px] font-semibold text-ink-muted opacity-50"
                >
                  <Icon name={item.icon} />
                  {item.label}
                  <Icon name="lock" className="ml-auto size-4" />
                </span>
              ) : (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.end}
                  className={({ isActive }) =>
                    `flex items-center gap-3 rounded-lg px-3.5 py-2.5 text-[15px] font-semibold transition-colors ${
                      isActive
                        ? 'bg-brand-100 text-brand-700'
                        : 'text-ink-muted hover:bg-brand-50 hover:text-ink'
                    }`
                  }
                >
                  <Icon name={item.icon} />
                  {item.label}
                </NavLink>
              ),
            )}
          </div>
        ))}
      </nav>

      <button
        type="button"
        onClick={logout}
        className="mt-8 flex cursor-pointer items-center gap-3 rounded-lg px-3.5 py-2.5 text-[15px] font-semibold text-red-600 transition-colors hover:bg-red-50"
      >
        <Icon name="logout" />
        Sair
      </button>
    </aside>
  )
}

export default Sidebar
