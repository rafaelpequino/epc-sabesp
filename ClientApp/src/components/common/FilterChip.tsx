type FilterChipProps = {
  label: string
  isActive: boolean
  onClick: () => void
}

function FilterChip({ label, isActive, onClick }: FilterChipProps) {
  return (
    <button
      type="button"
      aria-pressed={isActive}
      onClick={onClick}
      className={`inline-flex min-h-10 cursor-pointer items-center rounded-full border px-4 text-sm font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand ${
        isActive
          ? 'border-brand bg-brand text-white'
          : 'border-line bg-white text-ink hover:border-brand hover:bg-brand-50'
      }`}
    >
      {label}
    </button>
  )
}

export default FilterChip
