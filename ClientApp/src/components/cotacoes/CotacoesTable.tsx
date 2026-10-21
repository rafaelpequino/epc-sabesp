import { useNavigate } from 'react-router-dom'
import Icon, { type IconName } from '../common/Icon'
import IconButton from '../common/IconButton'
import { formatIo, formatPrice, type Cotacao } from '../../services/cotacoesService'
import CotacaoStatusBadge from './CotacaoStatusBadge'
import {
  EDITAR_COTACAO_PATH,
  VISUALIZAR_COTACAO_PATH,
  type EditarCotacaoState,
  type VisualizarCotacaoState,
} from './cotacoesPaths'

type RowAction = { icon: IconName; label: string }

const ROW_ACTIONS: RowAction[] = [
  { icon: 'copy', label: 'Duplicar' },
  { icon: 'eye', label: 'Visualizar' },
  { icon: 'pencil', label: 'Editar' },
  { icon: 'trash', label: 'Excluir' },
]

const HEADERS = ['I0 original', 'Setor', 'Item', 'Preço de Forn. Adotado', 'Responsável', 'Status']

type CotacoesTableProps = {
  cotacoes: Cotacao[]
  onDelete: (cotacao: Cotacao) => void
}

function CotacoesTable({ cotacoes, onDelete }: CotacoesTableProps) {
  const navigate = useNavigate()

  function handleAction(action: RowAction, cotacao: Cotacao) {
    if (action.icon === 'trash') onDelete(cotacao)
    if (action.icon === 'eye') navigate(VISUALIZAR_COTACAO_PATH, { state: { id: cotacao.id } satisfies VisualizarCotacaoState })
    if (action.icon === 'pencil') navigate(EDITAR_COTACAO_PATH, { state: { id: cotacao.id } satisfies EditarCotacaoState })
  }

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
                <CotacaoStatusBadge status={cotacao.status} />
              </td>
              <td className="px-4 py-3.5 text-ink-muted">{cotacao.propostas}</td>
              <td className="px-4 py-3.5">
                <div className="flex justify-end gap-1">
                  {ROW_ACTIONS.map((action) => (
                    <IconButton
                      key={action.icon}
                      icon={action.icon}
                      label={` ${cotacao.item}`}
                      title={action.label}
                      onClick={() => handleAction(action, cotacao)}
                    />
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
