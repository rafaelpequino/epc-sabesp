import type { ReactNode } from 'react'

type FieldProps = {
  id: string
  label: string
  children: ReactNode
  hint?: ReactNode
}

function Field({ id, label, children, hint }: FieldProps) {
  return (
    <div className="flex min-w-0 flex-col gap-1.5">
      <label htmlFor={id} className="text-sm font-semibold text-ink">
        {label}
        {hint && <span className="ml-1 font-normal text-ink-muted">{hint}</span>}
      </label>
      {children}
    </div>
  )
}

export default Field
