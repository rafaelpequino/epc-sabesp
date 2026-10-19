import { useMemo } from 'react'
import BanksPanel from '../../components/dashboard/BanksPanel'
import DemandsPanel from '../../components/dashboard/DemandsPanel'
import KitsPanel from '../../components/dashboard/KitsPanel'
import OverviewCards from '../../components/dashboard/OverviewCards'
import SystemSummary from '../../components/dashboard/SystemSummary'
import PageHeader from '../../components/layout/PageHeader'
import { getDashboardOverview } from '../../services/dashboardService'

function InicioPage() {
  const data = useMemo(getDashboardOverview, [])

  return (
    <div className="flex flex-col gap-4">
      <PageHeader title="Visão geral" />

      <OverviewCards data={data} />

      <div className="grid gap-4 xl:grid-cols-3">
        <KitsPanel kits={data.kits} />
        <DemandsPanel demands={data.demands} />
        <BanksPanel banks={data.banks} />
      </div>

      <SystemSummary data={data} />
    </div>
  )
}

export default InicioPage
