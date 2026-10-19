import type { ReactNode } from 'react'

type PageHeaderProps = {
  title: string
  children?: ReactNode
}

function PageHeader({ title, children }: PageHeaderProps) {
  return (
    <header>
      <h1 className="text-2xl font-extrabold text-ink sm:text-3xl">{title}</h1>
      {children && <p className="text-sm text-ink-muted">{children}</p>}
    </header>
  )
}

export default PageHeader
