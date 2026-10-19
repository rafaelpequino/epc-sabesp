import Icon from '../common/Icon'
import { KIT_FILTER_GROUPS, type KitFilterGroup, type KitFilterId } from '../../services/kitsService'

type KitFiltersProps = {
  activeFilter: KitFilterId | null
  onChange: (filter: KitFilterId | null) => void
}

type FilterChipsProps = {
  group: KitFilterGroup
  activeFilter: KitFilterId | null
  onChange: (filter: KitFilterId | null) => void
}

function FilterChips({ group, activeFilter, onChange }: FilterChipsProps) {
  const labelId = `filter-group-${group.id}`

  return (
    <div role="group" aria-labelledby={labelId} className="flex flex-col gap-2">
      <span id={labelId} className="text-xs font-bold uppercase tracking-wide text-ink-muted">
        {group.label}
      </span>
      <div className="flex flex-wrap gap-2">
        {group.options.map((option) => {
          const isActive = activeFilter === option.id

          return (
            <button
              key={option.id}
              type="button"
              aria-pressed={isActive}
              onClick={() => onChange(isActive ? null : option.id)}
              className={`inline-flex min-h-10 cursor-pointer items-center rounded-full border px-4 text-sm font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand ${
                isActive
                  ? 'border-brand bg-brand text-white'
                  : 'border-line bg-white text-ink hover:border-brand hover:bg-brand-50'
              }`}
            >
              {option.label}
            </button>
          )
        })}
      </div>
    </div>
  )
}

function KitFilters({ activeFilter, onChange }: KitFiltersProps) {
  const [rede, metodo] = KIT_FILTER_GROUPS

  return (
    <section className="rounded-2xl border border-line bg-white p-4 shadow-sm" aria-label="Filtros de kits">
      <header className="flex flex-wrap items-center gap-x-3 gap-y-1">
        <Icon name="filter" className="size-4 text-brand" />
        <h2 className="text-sm font-bold text-ink">Filtros</h2>
        {activeFilter && (
          <button
            type="button"
            onClick={() => onChange(null)}
            className="ml-auto inline-flex min-h-8 cursor-pointer items-center gap-1 rounded-lg px-2 text-xs font-semibold text-brand-600 transition-colors hover:bg-brand-50"
          >
            <Icon name="close" className="size-3.5" />
            Limpar filtro
          </button>
        )}
      </header>

      <div className="@container mt-4">
        <div className="flex flex-col gap-4 @min-[22rem]:flex-row @min-[22rem]:items-stretch @min-[22rem]:gap-6">
          <FilterChips group={rede} activeFilter={activeFilter} onChange={onChange} />
          <div className="h-px bg-line @min-[22rem]:h-auto @min-[22rem]:w-px" aria-hidden="true" />
          <FilterChips group={metodo} activeFilter={activeFilter} onChange={onChange} />
        </div>
      </div>
    </section>
  )
}

export default KitFilters
