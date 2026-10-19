import FilterPanel from '../common/FilterPanel'
import SelectField from '../common/SelectField'
import {
  MONTH_LABELS,
  SETORES,
  type CotacaoFilters as Filters,
} from '../../services/cotacoesService'

type CotacaoFiltersProps = {
  filters: Filters
  responsaveis: string[]
  fornecedores: string[]
  years: number[]
  onChange: (changes: Partial<Filters>) => void
  onClear: () => void
}

const ALL_OPTION = { value: '', label: 'Todos' }

function toOptions(values: string[]) {
  return [ALL_OPTION, ...values.map((value) => ({ value, label: value }))]
}

type PeriodSelectsProps = {
  legend: string
  idPrefix: string
  month: string
  year: string
  years: number[]
  onMonthChange: (value: string) => void
  onYearChange: (value: string) => void
}

function PeriodSelects({ legend, idPrefix, month, year, years, onMonthChange, onYearChange }: PeriodSelectsProps) {
  return (
    <fieldset className="grid min-w-0 grid-cols-2 gap-3">
      <legend className="sr-only">{legend}</legend>
      <SelectField
        id={`${idPrefix}-month`}
        label={`${legend} · Mês`}
        value={month}
        onChange={(event) => onMonthChange(event.target.value)}
        options={[
          { value: '', label: 'Mês' },
          ...MONTH_LABELS.map((label, index) => ({ value: String(index + 1), label })),
        ]}
      />
      <SelectField
        id={`${idPrefix}-year`}
        label={`${legend} · Ano`}
        value={year}
        onChange={(event) => onYearChange(event.target.value)}
        options={[
          { value: '', label: 'Ano' },
          ...years.map((value) => ({ value: String(value), label: String(value) })),
        ]}
      />
    </fieldset>
  )
}

function CotacaoFilters({ filters, responsaveis, fornecedores, years, onChange, onClear }: CotacaoFiltersProps) {
  const hasActiveFilters = Object.entries(filters).some(
    ([key, value]) => key !== 'search' && value !== '' && value !== null,
  )

  return (
    <FilterPanel
      label="Filtros de cotações"
      hasActiveFilters={hasActiveFilters}
      onClear={onClear}
      clearLabel="Limpar filtro"
    >
      <div className="flex flex-col gap-4">
        <div role="group" aria-labelledby="filter-setor" className="flex flex-col gap-2">
          <span id="filter-setor" className="text-xs font-bold uppercase tracking-wide text-ink-muted">
            Setor
          </span>
          <div className="flex flex-wrap gap-2">
            {SETORES.map((setor) => {
              const isActive = filters.setor === setor

              return (
                <button
                  key={setor}
                  type="button"
                  aria-pressed={isActive}
                  onClick={() => onChange({ setor: isActive ? null : setor })}
                  className={`inline-flex min-h-10 cursor-pointer items-center rounded-full border px-4 text-sm font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand ${
                    isActive
                      ? 'border-brand bg-brand text-white'
                      : 'border-line bg-white text-ink hover:border-brand hover:bg-brand-50'
                  }`}
                >
                  {setor}
                </button>
              )
            })}
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <SelectField
            id="filter-responsavel"
            label="Responsável"
            value={filters.responsavel}
            onChange={(event) => onChange({ responsavel: event.target.value })}
            options={toOptions(responsaveis)}
          />
          <SelectField
            id="filter-fornecedor"
            label="Fornecedor"
            value={filters.fornecedor}
            onChange={(event) => onChange({ fornecedor: event.target.value })}
            options={toOptions(fornecedores)}
          />
        </div>

        <div className="grid gap-4 rounded-xl border border-line bg-brand-50 p-3 lg:grid-cols-2">
          <PeriodSelects
            legend="I0 de"
            idPrefix="filter-from"
            month={filters.fromMonth}
            year={filters.fromYear}
            years={years}
            onMonthChange={(fromMonth) => onChange({ fromMonth })}
            onYearChange={(fromYear) => onChange({ fromYear })}
          />
          <PeriodSelects
            legend="Até"
            idPrefix="filter-to"
            month={filters.toMonth}
            year={filters.toYear}
            years={years}
            onMonthChange={(toMonth) => onChange({ toMonth })}
            onYearChange={(toYear) => onChange({ toYear })}
          />
        </div>
      </div>
    </FilterPanel>
  )
}

export default CotacaoFilters
