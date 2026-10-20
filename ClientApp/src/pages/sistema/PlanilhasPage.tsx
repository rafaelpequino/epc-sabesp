import { useMemo } from 'react'
import PlanilhaCard from '../../components/planilhas/PlanilhaCard'
import Button from '../../components/common/Button'
import PageHeader from '../../components/layout/PageHeader'
import { getPlanilhas } from '../../services/planilhasService'

function PlanilhasPage() {
  const planilhas = useMemo(getPlanilhas, [])

  return (
    <div className="flex flex-col gap-4">
      <PageHeader title="Planilhas" actions={<Button icon="plus">Adicionar planilha</Button>}>
        Organize e consulte as planilhas compartilhadas por setor.
      </PageHeader>

      {planilhas.map((planilha) => (
        <PlanilhaCard key={planilha.id} planilha={planilha} />
      ))}
    </div>
  )
}

export default PlanilhasPage
