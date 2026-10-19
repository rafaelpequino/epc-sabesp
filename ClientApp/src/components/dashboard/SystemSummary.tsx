import type { DashboardOverview } from '../../services/dashboardService'
import type { IconName } from '../common/Icon'
import { IconBadge, formatNumber } from './Panel'

function SummaryItem({ icon, value, label }: { icon: IconName; value: number; label: string }) {
  return (
    <div className="flex items-center gap-3 border-l border-line pl-4 sm:pl-6">
      <IconBadge icon={icon} className="size-11 rounded-full" />
      <div>
        <p className="text-xl font-extrabold leading-tight text-ink">{formatNumber(value)}</p>
        <p className="text-xs text-ink-muted">{label}</p>
      </div>
    </div>
  )
}

function SystemSummary({ data }: { data: DashboardOverview }) {
  const totalDemands = data.demands.open + data.demands.finished
  const totalRecords = data.banks.items.reduce((sum, bank) => sum + bank.records, 0)

  return (
    <section className="flex flex-wrap items-center gap-x-6 gap-y-4 rounded-2xl border border-line     bg-brand-50 p-4 shadow-sm sm:gap-x-8">
      <div className="flex min-w-full flex-1 items-center gap-3 sm:min-w-0">
            <IconBadge icon="target" className="size-12" />
        <div>
          <h2 className="text-sm font-bold text-ink">Resumo do sistema</h2>
          <p className="text-xs text-ink-muted">Principais indicadores em um só lugar.</p>
        </div>
      </div>
      <SummaryItem icon="tag" value={data.kits.total} label="Kits" />
      <SummaryItem icon="users" value={totalDemands} label="Demandas" />
      <SummaryItem icon="database" value={totalRecords} label="Registros nos bancos" />
    </section>
  )
}

export default SystemSummary
