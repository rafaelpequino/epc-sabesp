import { useMemo, useState, type FormEvent } from 'react'
import Button from '../../components/common/Button'
import Icon from '../../components/common/Icon'
import FornecedoresTable from '../../components/fornecedores/FornecedoresTable'
import PageHeader from '../../components/layout/PageHeader'
import { filterFornecedores, getFornecedores } from '../../services/fornecedoresService'

function FornecedoresPage() {
  const fornecedores = useMemo(getFornecedores, [])
  const [draft, setDraft] = useState('')
  const [applied, setApplied] = useState('')

  const visibleFornecedores = useMemo(() => filterFornecedores(fornecedores, applied), [fornecedores, applied])

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setApplied(draft)
  }

  function handleClear() {
    setDraft('')
    setApplied('')
  }

  return (
    <div className="flex flex-col gap-4">
      <PageHeader
        title="Fornecedores"
        breadcrumbs={[{ label: 'Início', to: '/sistema' }, { label: 'Fornecedores' }]}
        actions={<Button icon="plus">Novo Fornecedor</Button>}
      >
        Banco de fornecedores - conectado com o banco de cotações especiais
      </PageHeader>

      <form onSubmit={handleSubmit}>
        <section className="flex flex-wrap items-center gap-3 rounded-2xl border border-line bg-white p-3 shadow-sm">
          <label className="relative min-w-56 flex-1">
            <span className="sr-only">Pesquisar por nome, CNPJ ou telefone</span>
            <Icon name="search" className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-ink-muted" />
            <input
              type="search"
              value={draft}
              onChange={(event) => setDraft(event.target.value)}
              placeholder="Pesquisar por nome, CNPJ ou telefone"
              className="h-11 w-full rounded-lg border border-line bg-white               pl-10 pr-11 text-sm text-ink outline-none transition-[border-color,box-shadow] placeholder:text-ink-muted focus:border-brand focus:ring-4 focus:ring-brand-100 [&::-webkit-search-cancel-button]:appearance-none"
            />
                          {applied && (
                            <button
                              type="button"
                              onClick={handleClear}
                              aria-label="Limpar busca"
                              title="Limpar busca"
                              className="absolute right-2 top-1/2 grid size-8 -translate-y-1/2 place-items-center rounded-lg bg-brand-50 text-brand-700 transition-colors hover:bg-brand-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
                            >
                              <Icon name="close" className="size-4" />
                            </button>
                          )}          </label>
          <Button type="submit" icon="search">
            Buscar
          </Button>
        </section>
      </form>

      <div className="flex flex-col gap-1">
        {applied && (
          <p className="text-base text-ink-muted">
            Buscando por: <strong className="font-bold text-brand-700">“{applied}”</strong>
          </p>
        )}
        <p className="text-sm font-semibold text-ink-muted" role="status">
          {visibleFornecedores.length}{' '}
          {visibleFornecedores.length === 1 ? 'fornecedor encontrado' : 'fornecedores encontrados'}
        </p>
      </div>

      {visibleFornecedores.length > 0 ? (
        <FornecedoresTable fornecedores={visibleFornecedores} />
      ) : (
        <p className="rounded-2xl border border-dashed border-line bg-white p-8 text-center text-sm text-ink-muted">
          Nenhum fornecedor encontrado para a busca realizada.
        </p>
      )}
    </div>
  )
}

export default FornecedoresPage
