import { useMemo, useState, type FormEvent } from 'react'
import Button from '../../components/common/Button'
import SearchBar from '../../components/common/SearchBar'
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
        <SearchBar
          value={draft}
          onChange={setDraft}
          placeholder="Pesquisar por nome, CNPJ ou telefone"
          label="Pesquisar por nome, CNPJ ou telefone"
          showClear={applied !== ''}
          onClear={handleClear}
        />
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
