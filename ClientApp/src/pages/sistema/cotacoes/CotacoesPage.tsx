import { useMemo, useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import Button from '../../../components/common/Button'
import ConfirmDialog from '../../../components/common/ConfirmDialog'
import SearchBar from '../../../components/common/SearchBar'
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
    setDraft({ ...EMPTY_COTACAO_FILTERS, search: draft.search })
    setApplied({ ...EMPTY_COTACAO_FILTERS, search: applied.search })
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
        <SearchBar
          value={draft.search}
          onChange={(search) => setDraft({ ...draft, search })}
          placeholder="Pesquisar por item…"
          label="Pesquisar por item"
          showClear={applied.search !== ''}
          onClear={handleClearSearch}
        />

        <CotacaoFilters
          filters={draft}
          responsaveis={responsaveis}
          fornecedores={fornecedores}
          years={years}
          onChange={(changes) => {
            setDraft({ ...draft, ...changes })
            setApplied({ ...applied, ...changes })
          }}
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
