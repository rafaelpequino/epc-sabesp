import { useMemo, useState, type FormEvent } from 'react'
import Button from '../../components/common/Button'
import Icon from '../../components/common/Icon'
import CotacaoFilters from '../../components/cotacoes/CotacaoFilters'
import CotacoesTable from '../../components/cotacoes/CotacoesTable'
import PageHeader from '../../components/layout/PageHeader'
import {
  EMPTY_COTACAO_FILTERS,
  availableYears,
  filterCotacoes,
  getCotacoes,
  uniqueValues,
  type CotacaoFilters as Filters,
} from '../../services/cotacoesService'

function CotacoesEspPage() {
  const cotacoes = useMemo(getCotacoes, [])
  const [draft, setDraft] = useState<Filters>(EMPTY_COTACAO_FILTERS)
  const [applied, setApplied] = useState<Filters>(EMPTY_COTACAO_FILTERS)

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
        actions={
          <>
            <Button icon="plus">Nova Cotação</Button>
            <Button variant="outline" icon="upload">
              Adicionar em Lote
            </Button>
            <Button variant="outline" icon="plus">
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
        <CotacoesTable cotacoes={visibleCotacoes} />
      ) : (
        <p className="rounded-2xl border border-dashed border-line bg-white p-8 text-center text-sm text-ink-muted">
          Nenhuma cotação encontrada para os filtros selecionados.
        </p>
      )}
    </div>
  )
}

export default CotacoesEspPage
