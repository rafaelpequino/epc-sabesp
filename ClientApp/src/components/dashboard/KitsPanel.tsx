import type { DashboardOverview } from '../../services/dashboardService'
import Icon from '../common/Icon'
import { Panel } from './Panel'

function KitsPanel({ kits }: { kits: DashboardOverview['kits'] }) {
  const maxQuotations = Math.max(...kits.ranking.map((kit) => kit.quotations), 1)

  return (
    <Panel icon="tag" title="KITS" subtitle="Quantidade de cotações por kit" to="/sistema/kits-drc">
      <ul className="divide-y divide-line">
        {kits.ranking.map((kit) => (
          <li key={kit.name} className="flex items-center gap-3 py-2.5">
            <div className="flex-1">
              <p className="text-xs font-semibold text-ink">{kit.name}</p>
              <div className="mt-1.5 h-1.5 rounded-full bg-brand-100">
                <div
                  className="h-full rounded-full bg-brand"
                  style={{ width: `${(kit.quotations / maxQuotations) * 100}%` }}
                />
              </div>
            </div>
            <span className="text-sm font-bold text-ink">{kit.quotations}</span>
            <span className="w-14 text-xs text-ink-muted">cotações</span>
            <Icon name="chevronRight" className="size-4 text-ink-muted" />
          </li>
        ))}
      </ul>
    </Panel>
  )
}

export default KitsPanel
