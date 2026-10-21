import { useMemo, useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import Button from '../../../components/common/Button'
import ConfirmDialog from '../../../components/common/ConfirmDialog'
import Icon from '../../../components/common/Icon'
import CotacaoFilters from '../../../components/cotacoes/CotacaoFilters'
import CotacoesTable from '../../../components/cotacoes/CotacoesTable'
import PageHeader from '../../../components/layout/PageHeader'
import {
  COTACAO_DELETE_UNAVAILABLE_MESSAGE,
  COTACAO_DELETE_WARNING,
  EMPTY_COTACAO_FILTERS,
  availableYears,
  filterCotacoes,
  getCotacoes,
  uniqueValues,
  type Cotacao,
  type CotacaoFilters as Filters,
} from '../../../services/cotacoesService'

function CotacoesPage() {
  const navigate = useNavigate()
  const cotacoes = useMemo(getCotacoes, [])
  const [draft, setDraft] = useState<Filters>(EMPTY_COTACAO_FILTERS)
  const [applied, setApplied] = useState<Filters>(EMPTY_COTACAO_FILTERS)
  const [cotacaoToDelete, setCotacaoToDelete] = useState<Cotacao | null>(null)
  const [deleteFeedback, setDeleteFeedback] = useState<string | null>(null)

  function handleConfirmDelete() {
    setCotacaoToDelete(null)
    setDeleteFeedback(COTACAO_DELETE_UNAVAILABLE_MESSAGE)
  }

  const responsaveis = useMemo(() => uniqueValues(cotacoes, 'responsavel'), [cotacoes])
  const fornecedores = useMemo(() => uniqueValues(cotacoes, 'fornecedor'), [cotacoes])
  const years = useMemo(() => availableYears(cotacoes), [cotacoes])
  const visibleCotacoes = useMemo(() => filterCotacoes(cotacoes, applied), [cotacoes, applied])

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setApplied(draft)
  }

  function handleClearSearch() {
    setDraft({ ...draft, search: '' })
    setApplied({ ...applied, search: '' })
  }

  function handleClear() {
    const cleared = { ...EMPTY_COTACAO_FILTERS, search: draft.search }
    setDraft(cleared)
    setApplied(cleared)
  }

  return (
    <div className="flex flex-col gap-4">
      <PageHeader
        title="Cotações"
        breadcrumbs={[
          { label: 'Início', to: '/sistema' },
          { label: 'Cotações' },
        ]}
        actions={
          <>
            <Button icon="plus" onClick={() => navigate('/sistema/cotacoes/nova-cotacao')}>
              Nova Cotação
            </Button>
            <Button variant="outline" icon="upload" onClick={() => navigate('/sistema/cotacoes/adicionar-em-lote')}>
              Adicionar em Lote
            </Button>
            <Button variant="outline" icon="plus" onClick={() => navigate('/sistema/cotacoes/intencao-de-cotacao')}>
              Intenção de Cotação
            </Button>
          </>
        }
      >
        Banco de cotações especiais (não presentes no Banco de Preços da SABESP)
      </PageHeader>

      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <section className="flex flex-wrap items-center gap-3 rounded-2xl border border-line bg-white p-3 shadow-sm">
          <label className="relative min-w-56 flex-1">
            <span className="sr-only">Pesquisar por item</span>
            <Icon name="search" className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-ink-muted" />
            <input
              type="search"
              value={draft.search}
              onChange={(event) => setDraft({ ...draft, search: event.target.value })}
              placeholder="Pesquisar por item…"
              className="h-11 w-full rounded-lg border border-line bg-white pl-10 pr-11 text-sm text-ink outline-none transition-[border-color,box-shadow] placeholder:text-ink-muted focus:border-brand focus:ring-4 focus:ring-brand-100 [&::-webkit-search-cancel-button]:appearance-none"
            />
            {applied.search && (
              <button
                type="button"
                onClick={handleClearSearch}
                aria-label="Limpar busca"
                title="Limpar busca"
                className="absolute right-2 top-1/2 grid size-8 -translate-y-1/2 place-items-center rounded-lg bg-brand-50 text-brand-700 transition-colors hover:bg-brand-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
              >
                <Icon name="close" className="size-4" />
              </button>
            )}
          </label>
          <Button type="submit" icon="search">
            Buscar
          </Button>
        </section>

        <CotacaoFilters
          filters={draft}
          responsaveis={responsaveis}
          fornecedores={fornecedores}
          years={years}
          onChange={(changes) => setDraft({ ...draft, ...changes })}
          onClear={handleClear}
        />
      </form>

      <div className="flex flex-col gap-1">
        {applied.search && (
          <p className="text-base text-ink-muted">
            Buscando por: <strong className="font-bold text-brand-700">“{applied.search}”</strong>
          </p>
        )}
        <p className="text-sm font-semibold text-ink-muted" role="status">
          {visibleCotacoes.length} {visibleCotacoes.length === 1 ? 'cotação encontrada' : 'cotações encontradas'}
        </p>
      </div>

      {visibleCotacoes.length > 0 ? (
        <CotacoesTable cotacoes={visibleCotacoes} onDelete={setCotacaoToDelete} />
      ) : (
        <p className="rounded-2xl border border-dashed border-line bg-white p-8 text-center text-sm text-ink-muted">
          Nenhuma cotação encontrada para os filtros selecionados.
        </p>
      )}

      {deleteFeedback && (
        <p role="alert" className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm font-semibold text-red-700">
          {deleteFeedback}
        </p>
      )}

      {cotacaoToDelete && (
        <ConfirmDialog
          title="Excluir cotação"
          warning={COTACAO_DELETE_WARNING}
          question={`Deseja realmente excluir a cotação "${cotacaoToDelete.item}"?`}
          confirmLabel="Excluir"
          onConfirm={handleConfirmDelete}
          onCancel={() => setCotacaoToDelete(null)}
        />
      )}
    </div>
  )
}

export default CotacoesPage
