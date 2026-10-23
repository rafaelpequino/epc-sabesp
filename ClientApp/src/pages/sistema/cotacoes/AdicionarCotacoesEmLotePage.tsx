import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Button from '../../../components/common/Button'
import Field from '../../../components/common/Field'
import { FIELD_CLASSES } from '../../../components/common/fieldClasses'
import Icon from '../../../components/common/Icon'
import IconButton from '../../../components/common/IconButton'
import SelectField from '../../../components/common/SelectField'
import {
  BulkParseError,
  matchFornecedores,
  parseBulkClipboard,
  resolveFornecedorId,
  type BulkCotacao,
} from '../../../components/cotacoes/colarExcel'
import { COTACOES_PATH } from '../../../components/cotacoes/cotacoesPaths'
import PageHeader from '../../../components/layout/PageHeader'
import { SETORES, formatPrice } from '../../../services/cotacoesService'
import { getFornecedores } from '../../../services/fornecedoresService'

type Feedback = { message: string; isError: boolean }
type DetailKind = 'precos' | 'empresas'
type DetailView = { id: string; kind: DetailKind }

const SUPPLIER_LIST_ID = 'bulk-supplier-options'
const SECTOR_OPTIONS = [
  { value: '', label: 'Selecione o setor' },
  ...SETORES.map((setor) => ({ value: setor, label: setor })),
]
const SINGLE_SECTOR_OPTIONS = [
  { value: '', label: 'Definir setor único' },
  ...SETORES.map((setor) => ({ value: setor, label: setor })),
]

const LINK_BUTTON_CLASSES =
  'inline-flex h-11 items-center gap-1.5 rounded-lg border border-brand px-3 text-xs font-bold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand'

function ToggleButton({ isOpen, label, onClick }: { isOpen: boolean; label: string; onClick: () => void }) {
  return (
    <button
      type="button"
      aria-expanded={isOpen}
      onClick={onClick}
      className={`${LINK_BUTTON_CLASSES} ${
        isOpen ? 'bg-brand text-white hover:bg-brand-600' : 'bg-white text-brand-600 hover:bg-brand-50'
      }`}
    >
      <Icon name="chevronDown" className={`size-3.5 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      {isOpen ? 'Ocultar' : 'Ver'} {label}
    </button>
  )
}

function PriceDetails({ cotacao }: { cotacao: BulkCotacao }) {
  const prices: [string, number][] = [
    ['Preço de forn. (corrigido)', cotacao.adotada],
    ['Preço de montagem / instalação', cotacao.precoMontagem],
    ['Preço adotado', cotacao.precoAdotado],
    ['Média adotada', cotacao.mediaAdotada],
    ['Média saneada', cotacao.mediaSaneada],
    ['Menor valor', cotacao.menorValor],
    ['Média aritmética', cotacao.mediaAritmetica],
    ['Mediana', cotacao.mediana],
  ]

  return (
    <dl className="grid grid-cols-[repeat(auto-fill,minmax(min(100%,11rem),1fr))] gap-3">
      {prices.map(([label, value]) => (
        <div key={label} className="min-w-0 rounded-xl border border-line bg-white p-3">
          <dt className="text-xs font-semibold text-ink-muted">{label}</dt>
          <dd className="mt-1 break-words text-sm font-bold text-ink">{formatPrice(value)}</dd>
        </div>
      ))}
    </dl>
  )
}

type CompanyDetailsProps = {
  cotacao: BulkCotacao
  onNameChange: (index: number, nome: string) => void
}

function CompanyDetails({ cotacao, onNameChange }: CompanyDetailsProps) {
  if (cotacao.empresas.length === 0) return <p className="text-sm text-ink-muted">Nenhuma empresa informada.</p>

  return (
    <ul className="grid grid-cols-[repeat(auto-fill,minmax(min(100%,18rem),1fr))] gap-3">
      {cotacao.empresas.map((empresa, index) => {
        const inputId = `bulk-supplier-${cotacao.id}-${index}`

        return (
          <li key={index} className="flex min-w-0 flex-col gap-2 rounded-xl border border-line bg-white p-3">
            <Field id={inputId} label={`Empresa ${index + 1}`}>
              <div className="relative">
                <Icon
                  name="search"
                  className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-ink-muted"
                />
                <input
                  id={inputId}
                  list={SUPPLIER_LIST_ID}
                  value={empresa.nome}
                  onChange={(event) => onNameChange(index, event.target.value)}
                  placeholder="Selecione ou procure..."
                  className={`${FIELD_CLASSES} pl-10`}
                />
              </div>
            </Field>
            <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1 text-xs">
              <span className={empresa.fornecedorId ? 'font-semibold text-brand-700' : 'text-ink-muted'}>
                {empresa.fornecedorId ? 'Fornecedor cadastrado' : 'Será criado como novo fornecedor'}
              </span>
              <strong className="text-sm text-ink">{formatPrice(empresa.valor)}</strong>
            </div>
          </li>
        )
      })}
    </ul>
  )
}

type PreviewItemProps = {
  cotacao: BulkCotacao
  position: number
  openKind: DetailKind | null
  onSetorChange: (setor: string) => void
  onCompanyNameChange: (index: number, nome: string) => void
  onToggle: (kind: DetailKind) => void
  onRemove: () => void
}

function PreviewItem({
  cotacao,
  position,
  openKind,
  onSetorChange,
  onCompanyNameChange,
  onToggle,
  onRemove,
}: PreviewItemProps) {
  const companyCount = cotacao.empresas.filter((empresa) => empresa.nome).length

  return (
    <li className="flex flex-col gap-4 rounded-xl border border-l-4 border-line border-l-brand bg-white p-4 shadow-md">
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 flex-1 items-start gap-3">
          <span className="grid size-8 shrink-0 place-items-center rounded-full bg-brand-50 text-sm font-bold text-brand-700">
            {position}
          </span>
          <div className="min-w-0">
            <h3 className="break-words text-base font-bold text-ink">{cotacao.item || 'Sem descrição'}</h3>
            <p className="mt-0.5 break-words text-sm text-ink-muted">
              I0 original: <span className="font-semibold text-ink">{cotacao.i0Original || '—'}</span>
              <span aria-hidden="true"> · </span>
              Unidade: <span className="font-semibold text-ink">{cotacao.unidade || '—'}</span>
            </p>
          </div>
        </div>
        <IconButton icon="trash" label={`Remover ${cotacao.item}`} title="Remover" onClick={onRemove} />
      </div>

      <div className="flex flex-wrap items-end gap-2 border-t border-line pt-3">
        <div className="w-48 shrink-0">
          <SelectField
            id={`bulk-sector-${cotacao.id}`}
            label="Setor"
            hideLabel
            value={cotacao.setor}
            options={SECTOR_OPTIONS}
            onChange={(event) => onSetorChange(event.target.value)}
          />
        </div>
        <ToggleButton isOpen={openKind === 'precos'} label="preços" onClick={() => onToggle('precos')} />
        <ToggleButton
          isOpen={openKind === 'empresas'}
          label={`empresas (${companyCount})`}
          onClick={() => onToggle('empresas')}
        />
      </div>

      {openKind && (
        <div className="rounded-xl bg-page p-3">
          {openKind === 'precos' ? (
            <PriceDetails cotacao={cotacao} />
          ) : (
            <CompanyDetails cotacao={cotacao} onNameChange={onCompanyNameChange} />
          )}
        </div>
      )}
    </li>
  )
}

function AdicionarCotacoesEmLotePage() {
  const navigate = useNavigate()
  const fornecedores = useMemo(getFornecedores, [])
  const [cotacoes, setCotacoes] = useState<BulkCotacao[]>([])
  const [detail, setDetail] = useState<DetailView | null>(null)
  const [feedback, setFeedback] = useState<Feedback | null>(null)

  const hasCotacoes = cotacoes.length > 0

  function showError(message: string) {
    setFeedback({ message, isError: true })
  }

  async function handlePaste() {
    if (!navigator.clipboard?.readText) {
      showError('Não foi possível acessar a área de transferência neste navegador.')
      return
    }

    let text: string
    try {
      text = await navigator.clipboard.readText()
    } catch {
      showError('Erro ao ler dados da área de transferência. Verifique as permissões do navegador.')
      return
    }

    if (!text || text.trim() === '') {
      showError('Nenhum dado encontrado na área de transferência!')
      return
    }

    try {
      setCotacoes(matchFornecedores(parseBulkClipboard(text), fornecedores))
      setDetail(null)
      setFeedback(null)
    } catch (error) {
      showError(error instanceof BulkParseError ? error.message : 'Não foi possível processar os dados colados.')
    }
  }

  function updateSetor(id: string | null, setor: string) {
    setCotacoes((current) =>
      current.map((cotacao) => (id === null || cotacao.id === id ? { ...cotacao, setor } : cotacao)),
    )
  }

  function updateCompanyName(id: string, index: number, nome: string) {
    setCotacoes((current) =>
      current.map((cotacao) =>
        cotacao.id !== id
          ? cotacao
          : {
              ...cotacao,
              empresas: cotacao.empresas.map((empresa, empresaIndex) =>
                empresaIndex === index
                  ? { ...empresa, nome, fornecedorId: resolveFornecedorId(nome, fornecedores) }
                  : empresa,
              ),
            },
      ),
    )
  }

  function removeCotacao(id: string) {
    setCotacoes((current) => current.filter((cotacao) => cotacao.id !== id))
    setDetail((current) => (current?.id === id ? null : current))
  }

  function reset() {
    setCotacoes([])
    setDetail(null)
    setFeedback(null)
  }

  function toggleDetail(id: string, kind: DetailKind) {
    setDetail((current) => (current?.id === id && current.kind === kind ? null : { id, kind }))
  }

  function handleSave() {
    if (cotacoes.some((cotacao) => !cotacao.setor)) {
      showError('Defina o setor de todas as cotações antes de salvar.')
      return
    }

    showError('As cotações não foram salvas: a integração com a API ainda não está disponível.')
  }

  return (
    <div className="flex flex-col gap-4">
      <PageHeader
        title="Importação em Massa de Cotações"
        breadcrumbs={[
          { label: 'Início', to: '/sistema' },
          { label: 'Cotações', to: COTACOES_PATH },
          { label: 'Adicionar em lote' },
        ]}
        actions={
          <>
            <Button variant="outline" icon="close" onClick={() => navigate(COTACOES_PATH)}>
              Cancelar
            </Button>
            {hasCotacoes && (
              <Button icon="check" onClick={handleSave}>
                Salvar todas as cotações
              </Button>
            )}
          </>
        }
      />

      {feedback && (
        <p
          role={feedback.isError ? 'alert' : 'status'}
          className={`rounded-xl border p-3 text-sm font-semibold ${
            feedback.isError ? 'border-red-200 bg-red-50 text-red-700' : 'border-brand-200 bg-brand-50 text-brand-700'
          }`}
        >
          {feedback.message}
        </p>
      )}

      {!hasCotacoes ? (
        <section className="flex flex-col items-center gap-3 rounded-2xl border border-line bg-white px-4 py-12 text-center shadow-sm">
          <Button icon="copy" onClick={handlePaste}>
            Colar do Excel
          </Button>
          <p className="text-sm text-ink-muted">
            Copie no Excel 2 linhas por cotação (nomes das empresas + dados) e cole aqui.
          </p>
        </section>
      ) : (
        <section className="flex flex-col gap-2 rounded-2xl border border-line bg-white p-4 shadow-sm">
          <datalist id={SUPPLIER_LIST_ID}>
            {fornecedores.map((fornecedor) => (
              <option key={fornecedor.id} value={fornecedor.nomeFantasia} />
            ))}
          </datalist>

          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="flex w-60 shrink-0 flex-col gap-3">
              <SelectField
                id="bulk-sector-all"
                label=""
                value=""
                options={SINGLE_SECTOR_OPTIONS}
                onChange={(event) => updateSetor(null, event.target.value)}
              />
              <p className="text-sm font-semibold text-ink-muted" role="status">
                {cotacoes.length} {cotacoes.length === 1 ? 'cotação' : 'cotações'}
              </p>
            </div>
            <Button variant="outline" icon="close" onClick={reset}>
              Limpar e recomeçar
            </Button>
          </div>

          <ul className="flex flex-col gap-4 rounded-xl bg-page p-3 sm:p-4">
            {cotacoes.map((cotacao, index) => (
              <PreviewItem
                key={cotacao.id}
                cotacao={cotacao}
                position={index + 1}
                openKind={detail?.id === cotacao.id ? detail.kind : null}
                onSetorChange={(setor) => updateSetor(cotacao.id, setor)}
                onCompanyNameChange={(index, nome) => updateCompanyName(cotacao.id, index, nome)}
                onToggle={(kind) => toggleDetail(cotacao.id, kind)}
                onRemove={() => removeCotacao(cotacao.id)}
              />
            ))}
          </ul>
        </section>
      )}

    </div>
  )
}

export default AdicionarCotacoesEmLotePage
