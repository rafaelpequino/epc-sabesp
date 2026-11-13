import Icon from '../common/Icon'
import { formatPrice } from '../../services/cotacoesService'
import type { KitCalculation } from '../../services/kitsService'

const HEADERS = ['Data', 'Projeto / FID', 'Resumo', 'Responsável', 'Total com BDI']

const PDF_LINK_CLASSES =
  'inline-flex min-h-9 items-center justify-center gap-2 rounded-lg border border-brand px-3.5 text-xs font-bold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand'

function formatDateTime(isoDate: string): string {
  return new Date(isoDate).toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' })
}

function KitHistoryTable({ calculations }: { calculations: KitCalculation[] }) {
  if (calculations.length === 0) {
    return (
      <p className="rounded-2xl border border-dashed border-line bg-white p-8 text-center text-sm text-ink-muted">
        Nenhum cálculo realizado para este kit.
      </p>
    )
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
              <span className="sr-only">Relatório em PDF</span>
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-line text-xs text-ink">
          {calculations.map((calculation) => (
            <tr key={calculation.id} className="transition-colors hover:bg-brand-50/60">
              <td className="px-4 py-3.5">{formatDateTime(calculation.createdAt)}</td>
              <td className="px-4 py-3.5 font-semibold">{calculation.project}</td>
              <td className="px-4 py-3.5">{calculation.summary}</td>
              <td className="px-4 py-3.5">{calculation.responsavel}</td>
              <td className="px-4 py-3.5">{formatPrice(calculation.totalWithBdi)}</td>
              <td className="px-4 py-3.5">
                <div className="flex justify-end gap-2">
                  <a
                    href={calculation.pdfUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`Visualizar PDF do cálculo ${calculation.project}`}
                    className={`${PDF_LINK_CLASSES} bg-white text-brand-600 hover:bg-brand-50`}
                  >
                    <Icon name="eye" className="size-4" />
                    Visualizar
                  </a>
                  <a
                    href={calculation.pdfUrl}
                    download={calculation.pdfFileName}
                    aria-label={`Baixar PDF do cálculo ${calculation.project}`}
                    className={`${PDF_LINK_CLASSES} bg-brand text-white hover:bg-brand-600`}
                  >
                    <Icon name="download" className="size-4" />
                    Baixar
                  </a>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default KitHistoryTable
