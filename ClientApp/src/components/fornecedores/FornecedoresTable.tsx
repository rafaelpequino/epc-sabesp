import { type IconName } from '../common/Icon'
import IconButton from '../common/IconButton'
import { formatDataCadastro, type Fornecedor } from '../../services/fornecedoresService'

const ROW_ACTIONS: { icon: IconName; label: string }[] = [
  { icon: 'eye', label: 'Visualizar' },
  { icon: 'pencil', label: 'Editar' },
  { icon: 'trash', label: 'Excluir' },
]

const HEADERS = ['Nome Fantasia', 'CNPJ', 'Telefone', 'Endereço', 'Data de Cadastro']

function FornecedoresTable({ fornecedores }: { fornecedores: Fornecedor[] }) {
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
              <span className="sr-only">Ações</span>
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-line text-xs text-ink">
          {fornecedores.map((fornecedor) => (
            <tr key={fornecedor.id} className="transition-colors hover:bg-brand-50/60">
              <td className="px-4 py-3.5 font-semibold">{fornecedor.nomeFantasia}</td>
              <td className="px-4 py-3.5">{fornecedor.cnpj || '-'}</td>
              <td className="px-4 py-3.5">{fornecedor.telefone || '-'}</td>
              <td className="px-4 py-3.5">{fornecedor.endereco || '-'}</td>
              <td className="px-4 py-3.5">{formatDataCadastro(fornecedor.dataCadastro)}</td>
              <td className="px-4 py-3.5">
                <div className="flex justify-end gap-1">
                  {ROW_ACTIONS.map((action) => (
                    <IconButton
                      key={action.icon}
                      icon={action.icon}
                      label={` ${fornecedor.nomeFantasia}`}
                      title={action.label}
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

export default FornecedoresTable
