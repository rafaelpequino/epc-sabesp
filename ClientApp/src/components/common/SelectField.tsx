import type { ComponentPropsWithoutRef } from 'react'
import Icon from './Icon'

type SelectOption = { value: string; label: string }

type SelectFieldProps = Omit<ComponentPropsWithoutRef<'select'>, 'id' | 'className' | 'children'> & {
  id: string
  label: string
  options: SelectOption[]
  hideLabel?: boolean
  className?: string
}

function SelectField({ id, label, options, hideLabel = false, className = '', ...selectProps }: SelectFieldProps) {
  return (
    <div className={`flex min-w-0 flex-col gap-1.5 ${className}`}>
      <label
        className={hideLabel ? 'sr-only' : 'text-xs font-bold uppercase tracking-wide text-ink-muted'}
        htmlFor={id}
      >
        {label}
      </label>
      <div className="relative">
        <select
          id={id}
          className="h-11 w-full cursor-pointer appearance-none rounded-lg border border-line bg-white pl-3.5 pr-10 text-sm font-semibold text-ink outline-none transition-[border-color,box-shadow] hover:border-brand focus:border-brand focus:ring-4 focus:ring-brand-100"
          {...selectProps}
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <Icon
          name="chevronDown"
          className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-brand"
        />
      </div>
    </div>
  )
}

export default SelectField
