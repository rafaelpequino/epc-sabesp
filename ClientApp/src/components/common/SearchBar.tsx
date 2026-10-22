import Button from './Button'
import Icon from './Icon'

type SearchBarProps = {
  value: string
  onChange: (value: string) => void
  placeholder: string
  label: string
  showClear: boolean
  onClear: () => void
}

// Deve ficar dentro de um <form>: o botão "Buscar" envia o formulário.
function SearchBar({ value, onChange, placeholder, label, showClear, onClear }: SearchBarProps) {
  return (
    <section className="flex flex-wrap items-center gap-3 rounded-2xl border border-line bg-white p-3 shadow-sm">
      <label className="relative min-w-56 flex-1">
        <span className="sr-only">{label}</span>
        <Icon name="search" className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-ink-muted" />
        <input
          type="search"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder={placeholder}
          className="h-11 w-full rounded-lg border border-line bg-white pl-10 pr-11 text-sm text-ink outline-none transition-[border-color,box-shadow] placeholder:text-ink-muted focus:border-brand focus:ring-4 focus:ring-brand-100 [&::-webkit-search-cancel-button]:appearance-none"
        />
        {showClear && (
          <button
            type="button"
            onClick={onClear}
            aria-label="Limpar busca"
            title="Limpar busca"
            className="absolute right-2 top-1/2 grid size-8 -translate-y-1/2 place-items-center rounded-lg bg-brand-50 text-brand-700 transition-colors hover:bg-brand-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
          >
            <Icon name="close" className="size-4" />
          </button>
        )}
      </label>
      <Button type="submit" icon="search">
        Buscar
      </Button>
    </section>
  )
}

export default SearchBar
