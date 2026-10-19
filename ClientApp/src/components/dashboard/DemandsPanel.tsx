import type { DashboardOverview } from '../../services/dashboardService'
import { Panel } from './Panel'

const DONUT_RADIUS = 40
const DONUT_CIRCUMFERENCE = 2 * Math.PI * DONUT_RADIUS
const CHART = { width: 300, height: 70, padding: 8 }

function DonutChart({ finished, open }: { finished: number; open: number }) {
  const total = finished + open
  const finishedLength = total === 0 ? 0 : (finished / total) * DONUT_CIRCUMFERENCE

  return (
    <div className="relative size-30 shrink-0">
      <svg viewBox="0 0 100 100" className="size-full -rotate-90" role="img" aria-label="Status das demandas">
        <circle cx="50" cy="50" r={DONUT_RADIUS} fill="none" strokeWidth="12"         className="stroke-accent-yellow" />
        <circle
          cx="50"
          cy="50"
          r={DONUT_RADIUS}
          fill="none"
          strokeWidth="12"
                  className="stroke-accent-green"
          strokeDasharray={`${finishedLength} ${DONUT_CIRCUMFERENCE}`}
        />
      </svg>
      <div className="absolute inset-0 grid place-content-center text-center">
        <span className="text-2xl font-extrabold leading-none text-ink">{total}</span>
        <span className="text-[11px] text-ink-muted">Total</span>
      </div>
    </div>
  )
}

function Legend({ label, value, percent, dotClassName }: { label: string; value: number; percent: number; dotClassName: string }) {
  return (
    <li className="flex items-center gap-2 text-xs">
      <span className={`size-2.5 rounded-full ${dotClassName}`} />
      <span className="flex-1 text-ink-muted">{label}</span>
      <span className="w-6 text-right font-bold text-ink">{value}</span>
      <span className="w-10 text-right text-ink-muted">{percent}%</span>
    </li>
  )
}

function TrendChart({ trend }: { trend: DashboardOverview['demands']['trend'] }) {
  const values = trend.map((point) => point.value)
  const min = Math.min(...values)
  const range = Math.max(...values) - min || 1
  const stepX = (CHART.width - CHART.padding * 2) / Math.max(trend.length - 1, 1)

  const points = trend.map((point, index) => ({
    x: CHART.padding + index * stepX,
    y: CHART.padding + (1 - (point.value - min) / range) * (CHART.height - CHART.padding * 2),
  }))

  return (
    <div>
      <svg viewBox={`0 0 ${CHART.width} ${CHART.height}`} className="h-18 w-full" role="img" aria-label="Evolução das demandas">
        <polyline
          points={points.map((point) => `${point.x},${point.y}`).join(' ')}
          fill="none"
          className="stroke-brand"
          strokeWidth="2"
          strokeLinejoin="round"
        />
        {points.map((point) => (
          <circle key={point.x} cx={point.x} cy={point.y} r="3" className="fill-brand" />
        ))}
      </svg>
      <div className="flex justify-between text-[10px] text-ink-muted">
        {trend.map((point) => (
          <span key={point.date}>{point.date}</span>
        ))}
      </div>
    </div>
  )
}

function DemandsPanel({ demands }: { demands: DashboardOverview['demands'] }) {
  const total = demands.open + demands.finished
  const finishedPercent = total === 0 ? 0 : Math.round((demands.finished / total) * 100)

  return (
    <Panel icon="users" title="Demandas" subtitle="Status das demandas" to="/sistema/demandas/fila-aprovacao">
      <div className="flex items-center gap-4">
        <DonutChart finished={demands.finished} open={demands.open} />
        <ul className="flex flex-1 flex-col gap-3">
          <Legend label="Finalizadas" value={demands.finished} percent={finishedPercent} dotClassName="bg-accent-green" />
          <Legend label="Em aberto" value={demands.open} percent={100 - finishedPercent} dotClassName="bg-accent-yellow" />
        </ul>
      </div>
      <div className="mt-3 border-t border-line pt-3">
        <h3 className="mb-1 text-xs font-semibold text-ink">Evolução das demandas</h3>
        <TrendChart trend={demands.trend} />
      </div>
    </Panel>
  )
}

export default DemandsPanel
