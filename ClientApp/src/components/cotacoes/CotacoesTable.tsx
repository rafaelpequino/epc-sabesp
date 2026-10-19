import Icon, { type IconName } from '../common/Icon'
import {
  COTACAO_STATUS_LABELS,
  MONTH_LABELS,
  type Cotacao,
  type CotacaoStatus,
} from '../../services/cotacoesService'

const STATUS_STYLES: Record<CotacaoStatus, { icon: IconName; className: string }> = {
  pendente: { icon: 'clock', className: 'bg-accent-yellow/20 text-ink' },
  cancelada: { icon: 'close', className: 'bg-red-50 text-red-600' },
  concluida: { icon: 'check', className: 'bg-accent-green/15 text-accent-green' },
}

const ROW_ACTIONS: { icon: IconName; label: string }[] = [
  { icon: 'copy', label: 'Duplicar' },
  { icon: 'eye', label: 'Visualizar' },
  { icon: 'pencil', label: 'Editar' },
  { icon: 'trash', label: 'Excluir' },
]

const HEADERS = ['I0 original', 'Setor', 'Item', 'Preço de Forn. Adotado', 'Responsável', 'Status']

function formatIo(io: Cotacao['io']): string {
  if (!io) return '-'
  return `${MONTH_LABELS[io.month - 1].toUpperCase()}/${String(io.year).slice(-2)}`
}

function formatPrice(value: number): string {
  return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}

function StatusBadge({ status }: { status: CotacaoStatus }) {
  const { icon, className } = STATUS_STYLES[status]

  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-bold ${className}`}>
      <Icon name={icon} className="size-3.5" />
      {COTACAO_STATUS_LABELS[status]}
    </span>
  )
}

function CotacoesTable({ cotacoes }: { cotacoes: Cotacao[] }) {
  return (
    <div className="overflow-x-auto rounded-2xl border border-line bg-white shadow-sm">
      <table className="w-full min-w-[56rem] border-collapse text-left text-sm">
        <thead>
          <tr className="bg-brand-50 text-xs font-bold text-brand-700">
            {HEADERS.map((header) => (
              <th key={header} scope="col" className="px-4 py-3.5">
                {header}
              </th>
            ))}
            <th scope="col" className="px-4 py-3.5">
              <Icon name="copy" className="size-4" />
              <span className="sr-only">Propostas</span>
            </th>
            <th scope="col" className="px-4 py-3.5">
              <span className="sr-only">Ações</span>
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-line text-xs text-ink">
          {cotacoes.map((cotacao) => (
            <tr key={cotacao.id} className="transition-colors hover:bg-brand-50/60">
              <td className="px-4 py-3.5">{formatIo(cotacao.io)}</td>
              <td className="px-4 py-3.5">{cotacao.setor}</td>
              <td className="px-4 py-3.5 font-semibold">{cotacao.item}</td>
              <td className="px-4 py-3.5">{formatPrice(cotacao.preco)}</td>
              <td className="px-4 py-3.5">{cotacao.responsavel}</td>
              <td className="px-4 py-3.5">
                <StatusBadge status={cotacao.status} />
              </td>
              <td className="px-4 py-3.5 text-ink-muted">{cotacao.propostas}</td>
              <td className="px-4 py-3.5">
                <div className="flex justify-end gap-1">
                  {ROW_ACTIONS.map((action) => (
                    <button
                      key={action.icon}
                      type="button"
                      aria-label={`${action.label} ${cotacao.item}`}
                      title={action.label}
                      className="grid size-8 cursor-pointer place-items-center rounded-lg text-ink-muted transition-colors hover:bg-brand-100 hover:text-brand-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
                    >
                      <Icon name={action.icon} className="size-4" />
                    </button>
                  ))}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default CotacoesTable
