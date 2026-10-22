import { useMemo } from 'react'
import { Navigate, useLocation, useNavigate } from 'react-router-dom'
import Button from '../../../components/common/Button'
import CotacaoFormPage from '../../../components/cotacoes/CotacaoFormPage'
import { toCotacaoFormValues } from '../../../components/cotacoes/cotacaoFormValues'
import {
  COTACOES_PATH,
  VISUALIZAR_COTACAO_PATH,
  isCotacaoState,
  type EditarCotacaoState,
  type VisualizarCotacaoState,
} from '../../../components/cotacoes/cotacoesPaths'
import PageHeader, { type BreadcrumbItem } from '../../../components/layout/PageHeader'
import { COTACAO_EDIT_WARNING, formatQuoteCode, getCotacaoDetalhe } from '../../../services/cotacoesService'

function EditarCotacaoPage() {
  const navigate = useNavigate()
  const { state } = useLocation()
  const navigationState = isCotacaoState(state) ? (state as EditarCotacaoState) : null
  const cotacao = useMemo(() => getCotacaoDetalhe(navigationState?.id ?? ''), [navigationState?.id])

  // Acesso direto pela URL (sem passar pela lista ou pela visualização): volta para as cotações.
  if (!navigationState) return <Navigate to={COTACOES_PATH} replace />

  if (!cotacao) {
    return (
      <div className="flex flex-col gap-4">
        <PageHeader
          title="Cotação não encontrada"
          breadcrumbs={[
            { label: 'Início', to: '/sistema' },
            { label: 'Cotações', to: COTACOES_PATH },
            { label: 'Editar cotação' },
          ]}
          actions={
            <Button variant="outline" onClick={() => navigate(COTACOES_PATH)}>
              Voltar
            </Button>
          }
        />
        <p className="rounded-2xl border border-dashed border-line bg-white p-8 text-center text-sm text-ink-muted">
          Não encontramos a cotação solicitada.
        </p>
      </div>
    )
  }

  const code = formatQuoteCode(cotacao.id)
  const cameFromVisualizar = navigationState.fromVisualizar === true
  const visualizarState: VisualizarCotacaoState = { id: cotacao.id }
  const breadcrumbs: BreadcrumbItem[] = [
    { label: 'Início', to: '/sistema' },
    { label: 'Cotações', to: COTACOES_PATH },
    ...(cameFromVisualizar
      ? [{ label: `Visualizar cotação #${code}`, to: VISUALIZAR_COTACAO_PATH, state: visualizarState }]
      : []),
    { label: 'Editar cotação' },
  ]

  function handleCancel() {
    if (cameFromVisualizar) navigate(VISUALIZAR_COTACAO_PATH, { state: visualizarState })
    else navigate(COTACOES_PATH)
  }

  return (
    <CotacaoFormPage
      key={cotacao.id}
      title={`Editar cotação #${code}`}
      breadcrumbs={breadcrumbs}
      onCancel={handleCancel}
      formId="editar-cotacao-form"
      initialValues={toCotacaoFormValues(cotacao)}
      warning={COTACAO_EDIT_WARNING}
    />
  )
}

export default EditarCotacaoPage
