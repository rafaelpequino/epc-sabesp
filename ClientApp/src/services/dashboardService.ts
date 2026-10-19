export type KitSummary = { name: string; quotations: number }
export type BankSummary = { key: 'cotacoes' | 'fornecedores' | 'planilhas' | 'pecasAco'; label: string; records: number }
export type DemandTrendPoint = { date: string; value: number }

export type DashboardOverview = {
  kits: { total: number; totalQuotations: number; ranking: KitSummary[] }
  demands: { open: number; finished: number; trend: DemandTrendPoint[] }
  banks: { total: number; items: BankSummary[] }
}

// TEMPORÁRIO: dados fictícios até existir API/banco.
export function getDashboardOverview(): DashboardOverview {
  return {
    kits: {
      total: 12,
      totalQuotations: 235,
      ranking: [
        { name: 'Kit 001 - Residencial', quotations: 68 },
        { name: 'Kit 002 - Comercial', quotations: 52 },
        { name: 'Kit 003 - Industrial', quotations: 41 },
        { name: 'Kit 004 - Saneamento', quotations: 28 },
        { name: 'Kit 005 - Infraestrutura', quotations: 18 },
      ],
    },
    demands: {
      open: 8,
      finished: 24,
      trend: [
        { date: '21/07', value: 3 },
        { date: '22/07', value: 6 },
        { date: '23/07', value: 4 },
        { date: '24/07', value: 5 },
        { date: '25/07', value: 4 },
        { date: '26/07', value: 7 },
      ],
    },
    banks: {
      total: 4,
      items: [
        { key: 'cotacoes', label: 'Cotações', records: 1248 },
        { key: 'fornecedores', label: 'Fornecedores', records: 542 },
        { key: 'planilhas', label: 'Planilhas', records: 306 },
        { key: 'pecasAco', label: 'Peças de Aço', records: 128 },
      ],
    },
  }
}
