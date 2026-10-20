import Button from '../common/Button'
import Icon from '../common/Icon'
import { MONTH_LABELS } from '../../services/cotacoesService'
import { type Planilha } from '../../services/planilhasService'

const HEADERS = ['I0', 'Responsável']

function formatIo(io: { month: number; year: number }): string {
  return `${MONTH_LABELS[io.month - 1]}/${io.year}`
}

function PlanilhaCard({ planilha }: { planilha: Planilha }) {
  return (
    <section
      aria-label={planilha.nome}
      className="grid gap-4 rounded-2xl border border-line bg-white p-4 shadow-sm lg:grid-cols-[minmax(16rem,1fr)_2fr]"
    >
      <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-3 rounded-xl bg-brand-50 p-4 sm:p-5 lg:flex-col lg:items-start lg:justify-center lg:gap-2 lg:p-6">
        <div className="min-w-0">
          <h2 className="text-lg font-extrabold text-ink sm:text-xl">{planilha.nome}</h2>
          <p className="text-sm text-ink-muted">Setor: {planilha.setor.toUpperCase()}</p>
        </div>
        <div className="lg:hidden">
          <Button variant="outline" icon="upload">Adicionar versão</Button>
        </div>
      </div>

      <div className="flex min-w-0 flex-col gap-3">
        <header className="flex flex-wrap items-center justify-between gap-3">
          <h3 className="text-base font-bold text-ink">Versões disponíveis</h3>
          <div className="hidden lg:block">
            <Button variant="outline" icon="upload">Adicionar versão</Button>
          </div>
        </header>

        <ul className="divide-y divide-line border-y border-line text-sm text-ink lg:hidden">
          {planilha.versoes.map((versao) => (
            <li key={versao.id} className="flex items-center gap-x-3 py-3">
              <span className="inline-flex shrink-0 rounded-full bg-brand-50 px-2.5 py-0.5 text-xs font-bold text-brand-700">
                {formatIo(versao.io)}
              </span>
              <span className="flex min-w-0 flex-1 items-center gap-1.5 text-xs">
                <Icon name="user" className="size-4 shrink-0 text-ink-muted" />
                <span className="min-w-0 break-words">{versao.responsavel}</span>
              </span>
              <button
                type="button"
                aria-label={`Baixar ${planilha.nome} ${formatIo(versao.io)}`}
                title="Baixar"
                className="grid size-9 shrink-0 cursor-pointer place-items-center rounded-lg text-ink-muted transition-colors hover:bg-brand-100 hover:text-brand-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
              >
                <Icon name="download" className="size-4" />
              </button>
            </li>
          ))}
        </ul>

        <div className="hidden overflow-x-auto rounded-2xl border border-line lg:block">
          <table className="w-full border-collapse text-left text-sm">
            <thead>
              <tr className="bg-brand-50 text-xs font-bold text-brand-700">
                {HEADERS.map((header) => (
                  <th key={header} scope="col" className="px-4 py-3.5">
                    {header}
                  </th>
                ))}
                <th scope="col" className="px-4 py-3.5 text-right">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line text-xs text-ink">
              {planilha.versoes.map((versao) => (
                <tr key={versao.id} className="transition-colors hover:bg-brand-50/60">
                  <td className="px-4 py-3.5">
                    <span className="inline-flex rounded-full bg-brand-50 px-2.5 py-0.5 text-xs font-bold text-brand-700">
                      {formatIo(versao.io)}
                    </span>
                  </td>
                  <td className="px-4 py-3.5">
                    <span className="inline-flex items-center gap-2">
                      <Icon name="user" className="size-4 text-ink-muted" />
                      {versao.responsavel}
                    </span>
                  </td>
                  <td className="px-4 py-3.5">
                    <div className="flex justify-end">
                      <button
                        type="button"
                        aria-label={`Baixar ${planilha.nome} ${formatIo(versao.io)}`}
                        title="Baixar"
                        className="grid size-8 cursor-pointer place-items-center rounded-lg text-ink-muted transition-colors hover:bg-brand-100 hover:text-brand-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
                      >
                        <Icon name="download" className="size-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  )
}

export default PlanilhaCard
