import { useMemo, useState } from 'react'
import { Navigate, useLocation, useNavigate } from 'react-router-dom'
import Button from '../../../components/common/Button'
import ConfirmDialog from '../../../components/common/ConfirmDialog'
import Icon, { type IconName } from '../../../components/common/Icon'
import CotacaoStatusBadge from '../../../components/cotacoes/CotacaoStatusBadge'
import {
  COTACOES_PATH,
  EDITAR_COTACAO_PATH,
  isCotacaoState,
  type EditarCotacaoState,
} from '../../../components/cotacoes/cotacoesPaths'
import PageHeader from '../../../components/layout/PageHeader'
import {
  COTACAO_DELETE_UNAVAILABLE_MESSAGE,
  COTACAO_DELETE_WARNING,
  formatIo,
  formatPrice,
  formatQuoteCode,
  getCotacaoDetalhe,
  type CotacaoAnexo,
  type CotacaoDetalhe,
} from '../../../services/cotacoesService'


const EMPTY_VALUE = '—'

const ATTACHMENT_LINK_CLASSES =
  'inline-flex min-h-9 items-center justify-center gap-2 rounded-lg border border-brand px-3.5 text-xs font-bold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand'

function formatOptionalPrice(value: number | null): string {
  return value === null ? EMPTY_VALUE : formatPrice(value)
}

function formatFileSize(bytes: number): string {
  if (bytes < 1024 * 1024) return `${Math.max(1, Math.round(bytes / 1024))} KB`
  return `${(bytes / (1024 * 1024)).toLocaleString('pt-BR', { maximumFractionDigits: 1 })} MB`
}

function SectionTitle({ icon, children }: { icon: IconName; children: string }) {
  return (
    <h2 className="flex items-center gap-2.5 text-lg font-bold text-ink">
      <span className="grid size-8 place-items-center rounded-lg bg-brand-50 text-brand-700">
        <Icon name={icon} className="size-4" />
      </span>
      {children}
    </h2>
  )
}

function HeroInfo({ icon, label, value }: { icon: IconName; label: string; value: string }) {
  return (
    <div className="flex items-center gap-2 text-sm text-white/90">
      <Icon name={icon} className="size-4 text-white/70" />
      <span className="text-white/70">{label}:</span>
      <strong className="font-semibold text-white">{value}</strong>
    </div>
  )
}

function PriceTile({ label, value, highlight = false }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div className={`rounded-xl border p-3.5 ${highlight ? 'border-brand bg-brand-50' : 'border-line bg-page'}`}>
      <dt className="text-xs font-semibold text-ink-muted">{label}</dt>
      <dd className={`mt-1 text-base font-bold ${highlight ? 'text-brand-700' : 'text-ink'}`}>{value}</dd>
    </div>
  )
}

function CotacaoHero({ cotacao }: { cotacao: CotacaoDetalhe }) {
  return (
    <section className="overflow-hidden rounded-2xl bg-gradient-to-br from-brand-700 to-brand p-6 text-white shadow-md sm:p-7">
      <div className="flex flex-wrap items-start justify-between gap-6">
        <div className="flex min-w-0 flex-col gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-full bg-white/15 px-3 py-0.5 text-xs font-bold">{cotacao.setor}</span>
            <CotacaoStatusBadge status={cotacao.status} />
          </div>
          <h2 className="text-2xl font-extrabold leading-tight break-words">{cotacao.item}</h2>
          <div className="flex flex-wrap gap-x-6 gap-y-1.5">
            <HeroInfo icon="calendar" label="I0 original" value={formatIo(cotacao.io)} />
            <HeroInfo icon="tag" label="Unidade" value={cotacao.unidade} />
            <HeroInfo icon="user" label="Responsável" value={cotacao.responsavel} />
          </div>
        </div>      </div>
    </section>
  )
}

function IndicatorsSection({ cotacao }: { cotacao: CotacaoDetalhe }) {
  return (
    <section className="flex flex-col gap-4 rounded-2xl border border-line bg-white p-5 shadow-sm">
      <SectionTitle icon="target">Indicadores de preço</SectionTitle>
      <dl className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        <PriceTile label="Adotada — preço de forn. (corrigido)" value={formatPrice(cotacao.precoFornecedorCorrigido)} highlight />
        <PriceTile label="Preço de montagem / instalação" value={formatOptionalPrice(cotacao.precoMontagem)} />
        <PriceTile label="Média adotada" value={formatOptionalPrice(cotacao.mediaAdotada)} />
        <PriceTile label="Média saneada" value={formatOptionalPrice(cotacao.mediaSaneada)} />
        <PriceTile label="Menor valor" value={formatOptionalPrice(cotacao.menorValor)} />
        <PriceTile label="Média aritmética" value={formatOptionalPrice(cotacao.mediaAritmetica)} />
        <PriceTile label="Mediana" value={formatOptionalPrice(cotacao.mediana)} />
      </dl>
    </section>
  )
}

function SuppliersSection({ cotacao }: { cotacao: CotacaoDetalhe }) {
  return (
    <section className="flex flex-col gap-4 rounded-2xl border border-line bg-white p-5 shadow-sm">
      <SectionTitle icon="briefcase">Preços das empresas</SectionTitle>
      {cotacao.empresas.length > 0 ? (
        <ul className="flex flex-col gap-2">
          {cotacao.empresas.map((empresa, index) => {
            return (
              <li
                key={`${empresa.name}-${index}`}
                className="flex items-center justify-between gap-3 rounded-xl border border-line px-4 py-3"
              >
                <span className="flex min-w-0 items-center gap-3">
                  <span className="grid size-7 shrink-0 place-items-center rounded-full bg-brand-100 text-xs font-bold text-brand-700">
                    {index + 1}
                  </span>
                  <span className="truncate text-sm font-semibold text-ink">{empresa.name}</span>
                </span>
                <strong className="shrink-0 text-sm text-ink">{formatOptionalPrice(empresa.price)}</strong>
              </li>
            )
          })}
        </ul>
      ) : (
        <p className="text-sm text-ink-muted">Nenhuma empresa informada.</p>
      )}
    </section>
  )
}

function AttachmentCard({ attachment }: { attachment: CotacaoAnexo }) {
  return (
    <li className="flex flex-wrap items-center gap-4 rounded-xl border border-line bg-page p-4">
      <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-brand text-white">
        <Icon name="file" className="size-5" />
      </span>

      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-bold text-ink">{attachment.fileName}</p>
        <p className="mt-0.5 text-sm text-ink">{attachment.description || 'Sem descrição.'}</p>
        <p className="mt-1 text-xs font-semibold text-ink-muted">PDF · {formatFileSize(attachment.sizeBytes)}</p>
      </div>

      <div className="flex gap-2">
        <a
          href={attachment.url}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`Visualizar ${attachment.fileName}`}
          className={`${ATTACHMENT_LINK_CLASSES} bg-white text-brand-600 hover:bg-brand-50`}
        >
          <Icon name="eye" className="size-4" />
          Visualizar
        </a>
        <a
          href={attachment.url}
          download={attachment.fileName}
          aria-label={`Baixar ${attachment.fileName}`}
          className={`${ATTACHMENT_LINK_CLASSES} bg-brand text-white hover:bg-brand-600`}
        >
          <Icon name="download" className="size-4" />
          Baixar
        </a>
      </div>
    </li>
  )
}

function AttachmentsSection({ attachments }: { attachments: CotacaoAnexo[] }) {
  return (
    <section className="flex flex-col gap-4 rounded-2xl border border-line bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between gap-3">
        <SectionTitle icon="file">Anexos</SectionTitle>
        <span className="rounded-full bg-brand-50 px-3 py-0.5 text-xs font-bold text-brand-700">
          {attachments.length} {attachments.length === 1 ? 'arquivo' : 'arquivos'}
        </span>
      </div>

      {attachments.length > 0 ? (
        <ul className="flex flex-col gap-3">
          {attachments.map((attachment) => (
            <AttachmentCard key={attachment.id} attachment={attachment} />
          ))}
        </ul>
      ) : (
        <p className="rounded-xl border border-dashed border-line p-6 text-center text-sm text-ink-muted">
          Esta cotação não possui anexos.
        </p>
      )}
    </section>
  )
}

function VisualizarCotacaoPage() {
  const navigate = useNavigate()
  const { state } = useLocation()
  const id = isCotacaoState(state) ? state.id : null
  const cotacao = useMemo(() => getCotacaoDetalhe(id ?? ''), [id])
  const [isConfirmingDelete, setIsConfirmingDelete] = useState(false)
  const [deleteFeedback, setDeleteFeedback] = useState<string | null>(null)

  function handleConfirmDelete() {
    setIsConfirmingDelete(false)
    setDeleteFeedback(COTACAO_DELETE_UNAVAILABLE_MESSAGE)
  }

  const backButton = (
    <>
      <Button variant="outline" onClick={() => navigate(COTACOES_PATH)}>
        Voltar
      </Button>
      {cotacao && (
        <>
          <Button
            variant="warning"
            icon="pencil"
            onClick={() => navigate(EDITAR_COTACAO_PATH, { state: { id: cotacao.id, fromVisualizar: true } satisfies EditarCotacaoState })}
          >
            Editar
          </Button>
          <Button variant="danger" icon="trash" onClick={() => setIsConfirmingDelete(true)}>
            Excluir
          </Button>
        </>
      )}
    </>
  )

  // Acesso direto pela URL (sem passar pela lista ou pela edição): volta para as cotações.
  if (id === null) return <Navigate to={COTACOES_PATH} replace />

  if (!cotacao) {
    return (
      <div className="flex flex-col gap-4">
        <PageHeader
          title="Cotação não encontrada"
          breadcrumbs={[
            { label: 'Início', to: '/sistema' },
            { label: 'Cotações', to: COTACOES_PATH },
            { label: 'Visualizar cotação' },
          ]}
          actions={backButton}
        />
        <p className="rounded-2xl border border-dashed border-line bg-white p-8 text-center text-sm text-ink-muted">
          Não encontramos a cotação solicitada.
        </p>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-4">
      <PageHeader
        title={`Visualizar cotação #${formatQuoteCode(cotacao.id)}`}
        breadcrumbs={[
          { label: 'Início', to: '/sistema' },
          { label: 'Cotações', to: COTACOES_PATH },
          { label: 'Visualizar cotação' },
        ]}
        actions={backButton}
      >
        Detalhes da cotação, propostas das empresas e anexos
      </PageHeader>

      {deleteFeedback && (
        <p role="alert" className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm font-semibold text-red-700">
          {deleteFeedback}
        </p>
      )}

      <CotacaoHero cotacao={cotacao} />

      <div className="grid gap-4 lg:grid-cols-2">
        <IndicatorsSection cotacao={cotacao} />
        <SuppliersSection cotacao={cotacao} />
      </div>

      <section className="flex flex-col gap-3 rounded-2xl border border-line bg-white p-5 shadow-sm">
        <SectionTitle icon="pencil">Justificativa do preço adotado</SectionTitle>
        <p className="text-sm leading-relaxed text-ink">{cotacao.justificativa || 'Nenhuma justificativa informada.'}</p>
      </section>

      <AttachmentsSection attachments={cotacao.anexos} />

      {isConfirmingDelete && (
        <ConfirmDialog
          title="Excluir cotação"
          warning={COTACAO_DELETE_WARNING}
          question={`Deseja realmente excluir a cotação #${formatQuoteCode(cotacao.id)}?`}
          confirmLabel="Excluir"
          onConfirm={handleConfirmDelete}
          onCancel={() => setIsConfirmingDelete(false)}
        />
      )}
    </div>
  )
}

export default VisualizarCotacaoPage

