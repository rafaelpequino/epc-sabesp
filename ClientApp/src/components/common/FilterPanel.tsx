import { useId, useState, type ReactNode } from 'react'
import Icon from './Icon'

type FilterPanelProps = {
  label: string
  hasActiveFilters: boolean
  onClear: () => void
  clearLabel: string
  children: ReactNode
}

function FilterPanel({ label, hasActiveFilters, onClear, clearLabel, children }: FilterPanelProps) {
  const [isOpen, setIsOpen] = useState(false)
  const contentId = useId()

  return (
    <section className="rounded-2xl border border-line bg-white p-4 shadow-sm" aria-label={label}>
      <header className="flex flex-wrap items-center gap-x-3 gap-y-1">
        <button
          type="button"
          onClick={() => setIsOpen((open) => !open)}
          aria-expanded={isOpen}
          aria-controls={contentId}
          className="-m-1 inline-flex min-h-8 cursor-pointer items-center gap-3 rounded-lg p-1 transition-colors hover:bg-brand-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
        >
          <Icon name="filter" className="size-4 text-brand" />
          <span className="text-sm font-bold text-ink">Filtros</span>
          {hasActiveFilters && <span className="size-2 rounded-full bg-brand" aria-label="Filtros ativos" />}
          <Icon name="chevronDown" className={`size-4 text-brand transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </button>
        {hasActiveFilters && (
          <button
            type="button"
            onClick={onClear}
            className="ml-auto inline-flex min-h-8 cursor-pointer items-center gap-1 rounded-lg px-2 text-xs font-semibold text-brand-600 transition-colors hover:bg-brand-50"
          >
            <Icon name="close" className="size-3.5" />
            {clearLabel}
          </button>
        )}
      </header>

      {isOpen && (
        <div id={contentId} className="mt-4">
          {children}
        </div>
      )}
    </section>
  )
}

export default FilterPanel
