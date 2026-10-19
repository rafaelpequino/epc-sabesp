import { useMemo, useState } from 'react'
import KitCard from '../../components/kits/KitCard'
import KitFilters from '../../components/kits/KitFilters'
import PageHeader from '../../components/layout/PageHeader'
import { getDrcKits, type KitFilterId } from '../../services/kitsService'

function KitsDrcPage() {
  const kits = useMemo(getDrcKits, [])
  const [activeFilter, setActiveFilter] = useState<KitFilterId | null>(null)

  const visibleKits = activeFilter ? kits.filter((kit) => kit.tags.includes(activeFilter)) : kits

  return (
    <div className="flex flex-col gap-4">
      <PageHeader title="Kits DRC">
        Orçamentação paramétrica: geração automatizada de orçamentos baseada no{' '}
        <strong className="font-bold text-brand-700">Banco de Preços da SABESP</strong>.
      </PageHeader>

      <KitFilters activeFilter={activeFilter} onChange={setActiveFilter} />

      <p className="text-sm font-semibold text-ink-muted" role="status">
        {visibleKits.length} {visibleKits.length === 1 ? 'kit encontrado' : 'kits encontrados'}
      </p>

      {visibleKits.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {visibleKits.map((kit) => (
            <KitCard key={kit.id} kit={kit} />
          ))}
        </div>
      ) : (
        <p className="rounded-2xl border border-dashed border-line bg-white p-8 text-center text-sm text-ink-muted">
          Nenhum kit encontrado para o filtro selecionado.
        </p>
      )}
    </div>
  )
}

export default KitsDrcPage
