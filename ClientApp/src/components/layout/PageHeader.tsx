import type { ReactNode } from 'react'

type PageHeaderProps = {
  title: string
  children?: ReactNode
  actions?: ReactNode
}

function PageHeader({ title, children, actions }: PageHeaderProps) {
  return (
    <header className="flex flex-wrap items-end justify-between gap-x-6 gap-y-3">
      <div>
        <h1 className="text-2xl font-extrabold text-ink sm:text-3xl">{title}</h1>
        {children && <p className="text-sm text-ink-muted">{children}</p>}
      </div>
      {actions && <div className="flex flex-wrap gap-3">{actions}</div>}
    </header>
  )
}

export default PageHeader
