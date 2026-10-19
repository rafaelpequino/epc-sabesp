import type { ReactNode } from 'react'
import type { DashboardOverview } from '../../services/dashboardService'
import Icon from '../common/Icon'
import { IconBadge, formatNumber } from './Panel'
import type { IconName } from '../common/Icon'

type SummaryCardProps = {
  icon: IconName
  title: string
  children: ReactNode
}

function SummaryCard({ icon, title, children }: SummaryCardProps) {
  return (
    <section className="rounded-2xl border border-line bg-linear-to-br from-brand-50 to-white p-4 shadow-sm">
      <header className="flex items-center gap-3">
        <IconBadge icon={icon} />
        <h2 className="text-xs font-bold uppercase tracking-wide text-brand-700">{title}</h2>
      </header>
      {children}
    </section>
  )
}

function Metric({ value, label }: { value: number; label: string }) {
  return (
    <div>
      <p className="text-4xl font-extrabold text-ink">{formatNumber(value)}</p>
      <p className="text-sm text-ink-muted">{label}</p>
    </div>
  )
}

function OverviewCards({ data }: { data: DashboardOverview }) {
  return (
    <div className="grid gap-4 xl:grid-cols-3">
      <SummaryCard icon="tag" title="DRC">
        <div className="mt-2 flex flex-wrap items-center gap-x-5 gap-y-3">
          <div>
            <Metric value={data.kits.total} label="Kits cadastrados no sistema" />
          </div>
        </div>
      </SummaryCard>

      <SummaryCard icon="users" title="Demandas">
        <div className="mt-2 flex flex-wrap items-center gap-x-6 gap-y-3">
          <Metric value={data.demands.open} label="Em aberto" />
          <div className="self-stretch border-l border-line" />
          <Metric value={data.demands.finished} label="Finalizadas" />
          <span className="ml-auto grid size-11 place-items-center rounded-full bg-accent-green/15 text-accent-green">
            <Icon name="check" className="size-6" />
          </span>
        </div>
      </SummaryCard>

      <SummaryCard icon="database" title="Bancos">
        <div className="mt-2 flex items-center justify-between">
          <Metric value={data.banks.total} label="Bancos cadastrados" />
          <Icon name="database" className="size-16 text-brand-200" />
        </div>
      </SummaryCard>
    </div>
  )
}

export default OverviewCards
