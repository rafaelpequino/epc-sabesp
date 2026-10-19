import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import Icon, { type IconName } from '../common/Icon'

export function IconBadge({ icon, className = 'size-11' }: { icon: IconName; className?: string }) {
  return (
    <span className={`grid shrink-0 place-items-center rounded-xl bg-brand-100 text-brand ${className}`}>
      <Icon name={icon} className="size-1/2" />
    </span>
  )
}

type PanelProps = {
  icon: IconName
  title: string
  subtitle: string
  to: string
  children: ReactNode
}

export function Panel({ icon, title, subtitle, to, children }: PanelProps) {
  return (
    <section className="rounded-2xl border border-line bg-white p-4 shadow-sm">
      <header className="flex items-start gap-3">
        <IconBadge icon={icon} />
        <div className="flex-1">
          <h2 className="text-base font-bold text-ink">{title}</h2>
          <p className="text-xs text-ink-muted">{subtitle}</p>
        </div>
        <Link className="flex items-center gap-1 text-xs font-semibold text-brand-600 hover:underline" to={to}>
          Ver todos <Icon name="arrowRight" className="size-3.5" />
        </Link>
      </header>
      <div className="mt-3">{children}</div>
    </section>
  )
}

export function formatNumber(value: number): string {
  return value.toLocaleString('pt-BR')
}
