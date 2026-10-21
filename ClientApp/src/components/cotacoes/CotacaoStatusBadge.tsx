import Icon, { type IconName } from '../common/Icon'
import { COTACAO_STATUS_LABELS, type CotacaoStatus } from '../../services/cotacoesService'

const STATUS_STYLES: Record<CotacaoStatus, { icon: IconName; className: string }> = {
  pendente: { icon: 'clock', className: 'bg-accent-yellow/20 text-ink' },
  cancelada: { icon: 'close', className: 'bg-red-50 text-red-600' },
  concluida: { icon: 'check', className: 'bg-accent-green/15 text-accent-green' },
}

function CotacaoStatusBadge({ status }: { status: CotacaoStatus }) {
  const { icon, className } = STATUS_STYLES[status]

  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-bold ${className}`}>
      <Icon name={icon} className="size-3.5" />
      {COTACAO_STATUS_LABELS[status]}
    </span>
  )
}

export default CotacaoStatusBadge
