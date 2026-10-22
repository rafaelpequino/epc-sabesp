import FilterChip from '../common/FilterChip'
import FilterPanel from '../common/FilterPanel'
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
            <FilterChip
              key={option.id}
              label={option.label}
              isActive={isActive}
              onClick={() => onChange(isActive ? null : option.id)}
            />
          )
        })}
      </div>
    </div>
  )
}

function KitFilters({ activeFilter, onChange }: KitFiltersProps) {
  const [rede, metodo] = KIT_FILTER_GROUPS

  return (
    <FilterPanel
      label="Filtros de kits"
      hasActiveFilters={activeFilter !== null}
      onClear={() => onChange(null)}
      clearLabel="Limpar filtro"
    >
      <div className="@container">
        <div className="flex flex-col gap-4 @min-[22rem]:flex-row @min-[22rem]:items-stretch @min-[22rem]:gap-6">
          <FilterChips group={rede} activeFilter={activeFilter} onChange={onChange} />
          <div className="h-px bg-line @min-[22rem]:h-auto @min-[22rem]:w-px" aria-hidden="true" />
          <FilterChips group={metodo} activeFilter={activeFilter} onChange={onChange} />
        </div>
      </div>
    </FilterPanel>
  )
}

export default KitFilters
