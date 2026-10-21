import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import Icon from '../common/Icon'

export type BreadcrumbItem = {
  label: string
  to?: string
  state?: unknown
}

type PageHeaderProps = {
  title: string
  children?: ReactNode
  actions?: ReactNode
  breadcrumbs?: BreadcrumbItem[]
}

function PageHeader({ title, children, actions, breadcrumbs }: PageHeaderProps) {
  return (
    <header className="flex flex-wrap items-end justify-between gap-x-6 gap-y-3">
      <div>
        {breadcrumbs && breadcrumbs.length > 0 && (
          <nav aria-label="Caminho de navegação" className="mb-1">
            <ol className="flex flex-wrap items-center gap-1 text-xs font-semibold">
              {breadcrumbs.map((breadcrumb, index) => {
                const isCurrentPage = index === breadcrumbs.length - 1

                return (
                  <li key={`${breadcrumb.label}-${index}`} className="inline-flex items-center gap-1">
                    {index > 0 && <Icon name="chevronRight" className="size-3.5 text-brand-600/60" />}
                    {breadcrumb.to && !isCurrentPage ? (
                      <Link
                        to={breadcrumb.to}
                        state={breadcrumb.state}
                        className="rounded-sm text-brand-600/80 transition-colors hover:text-brand-700 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
                      >
                        {breadcrumb.label}
                      </Link>
                    ) : (
                      <span aria-current={isCurrentPage ? 'page' : undefined} className="cursor-default text-brand-700">
                        {breadcrumb.label}
                      </span>
                    )}
                  </li>
                )
              })}
            </ol>
          </nav>
        )}
        <h1 className="text-2xl font-extrabold text-ink sm:text-3xl">{title}</h1>
        {children && <p className="text-sm text-ink-muted">{children}</p>}
      </div>
      {actions && <div className="flex flex-wrap gap-3">{actions}</div>}
    </header>
  )
}

export default PageHeader
