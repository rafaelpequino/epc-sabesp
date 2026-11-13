import { useMemo, useState } from 'react'
import { Navigate, useLocation, useNavigate, useParams } from 'react-router-dom'
import Button from '../../components/common/Button'
import Tabs, { getTabId, getTabPanelId } from '../../components/common/Tabs'
import { getKitDefinition } from '../../components/kits/definitions'
import KitCalculator from '../../components/kits/KitCalculator'
import KitHistoryTable from '../../components/kits/KitHistoryTable'
import PageHeader from '../../components/layout/PageHeader'
import { KITS_DRC_PATH, getDrcKit, getKitCalculations } from '../../services/kitsService'

type KitTabId = 'calculadora' | 'historico'

const KIT_TABS: { id: KitTabId; label: string }[] = [
  { id: 'calculadora', label: 'Calculadora' },
  { id: 'historico', label: 'Histórico de cálculos' },
]

// Página única para todos os kits: o kit e seus campos vêm do `kitId` da URL.
function KitDrcPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const { kitId = '' } = useParams()
  const kit = useMemo(() => getDrcKit(kitId), [kitId])
  const calculations = useMemo(() => getKitCalculations(kitId), [kitId])
  const [activeTab, setActiveTab] = useState<KitTabId>('calculadora')

  // Volta para a página de origem; com acesso direto pela URL (sem histórico), cai na lista de kits.
  function handleBack() {
    if (location.key !== 'default') navigate(-1)
    else navigate(KITS_DRC_PATH)
  }

  if (!kit || kit.status !== 'available') return <Navigate to={KITS_DRC_PATH} replace />

  const definition = getKitDefinition(kit.id)

  return (
    <div className="flex flex-col gap-4">
      <PageHeader
        title={`Configuração: ${kit.title}`}
        breadcrumbs={[
          { label: 'Início', to: '/sistema' },
          { label: 'Kits DRC', to: KITS_DRC_PATH },
          { label: kit.title },
        ]}
        actions={
          <Button variant="outline" icon="arrowLeft" onClick={handleBack}>
            Voltar
          </Button>
        }
      />

      <Tabs
        label="Seções do kit"
        className="mt-3"
        tabs={KIT_TABS}
        activeTab={activeTab}
        onChange={(tabId) => setActiveTab(tabId as KitTabId)}
      />

      {/* A calculadora continua montada ao trocar de aba para não perder os dados preenchidos. */}
      <div
        role="tabpanel"
        id={getTabPanelId('calculadora')}
        aria-labelledby={getTabId('calculadora')}
        hidden={activeTab !== 'calculadora'}
        className="flex flex-col gap-4"
      >
        {definition ? (
          <KitCalculator key={kit.id} definition={definition} />
        ) : (
          <p className="rounded-2xl border border-dashed border-line bg-white p-8 text-center text-sm text-ink-muted">
            A configuração deste kit ainda não foi cadastrada.
          </p>
        )}
      </div>

      <div
        role="tabpanel"
        id={getTabPanelId('historico')}
        aria-labelledby={getTabId('historico')}
        hidden={activeTab !== 'historico'}
      >
        <KitHistoryTable calculations={calculations} />
      </div>
    </div>
  )
}

export default KitDrcPage
