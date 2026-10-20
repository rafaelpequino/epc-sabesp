import { Link } from 'react-router-dom'
import type { BankSummary, DashboardOverview } from '../../services/dashboardService'
import type { IconName } from '../common/Icon'
import Icon from '../common/Icon'
import { IconBadge, Panel, formatNumber } from './Panel'

const BANK_ICONS: Record<BankSummary['key'], IconName> = {
  cotacoes: 'file',
  fornecedores: 'users',
  planilhas: 'file',
  pecasAco: 'hexagon',
}

const BANK_PATHS: Partial<Record<BankSummary['key'], string>> = {
  cotacoes: '/sistema/cotacoes',
  fornecedores: '/sistema/fornecedores',
  planilhas: '/sistema/planilhas',
}

const BANK_ROW_CLASSES = 'flex items-center gap-3 rounded-xl border border-line px-3 py-2'

function BanksPanel({ banks }: { banks: DashboardOverview['banks'] }) {
  const maxRecords = Math.max(...banks.items.map((bank) => bank.records), 1)

  return (
    <Panel icon="database" title="Bancos" subtitle="Registros por banco" to="/sistema/cotacoes">
      <ul className="flex flex-col gap-2">
        {banks.items.map((bank) => {
          const path = BANK_PATHS[bank.key]
          const content = (
            <>
              <IconBadge icon={BANK_ICONS[bank.key]} className="size-9" />
              <span className="w-24 text-xs font-semibold text-ink">{bank.label}</span>
              <span className="w-10 text-right text-sm font-bold text-ink">{formatNumber(bank.records)}</span>
              <div className="h-1.5 flex-1 rounded-full bg-brand-100">
                <div
                  className="h-full rounded-full bg-brand"
                  style={{ width: `${(bank.records / maxRecords) * 100}%` }}
                />
              </div>
              <Icon name="chevronRight" className="size-4 text-ink-muted" />
            </>
          )

          return (
            <li key={bank.key}>
              {path ? (
                <Link
                  to={path}
                  className={`${BANK_ROW_CLASSES} cursor-pointer transition-colors hover:bg-brand-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand`}
                >
                  {content}
                </Link>
              ) : (
                <div className={BANK_ROW_CLASSES}>{content}</div>
              )}
            </li>
          )
        })}
      </ul>
    </Panel>
  )
}

export default BanksPanel
