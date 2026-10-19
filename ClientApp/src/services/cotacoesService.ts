export type CotacaoStatus = 'pendente' | 'cancelada' | 'concluida'

export type Cotacao = {
  id: string
  io: { month: number; year: number } | null
  setor: string
  item: string
  preco: number
  responsavel: string
  fornecedor: string
  status: CotacaoStatus
  propostas: number
}

export type CotacaoFilters = {
  search: string
  setor: string | null
  responsavel: string
  fornecedor: string
  fromMonth: string
  fromYear: string
  toMonth: string
  toYear: string
}

export const EMPTY_COTACAO_FILTERS: CotacaoFilters = {
  search: '',
  setor: null,
  responsavel: '',
  fornecedor: '',
  fromMonth: '',
  fromYear: '',
  toMonth: '',
  toYear: '',
}

export const COTACAO_STATUS_LABELS: Record<CotacaoStatus, string> = {
  pendente: 'Pendente',
  cancelada: 'Cancelada',
  concluida: 'Concluída',
}

export const MONTH_LABELS = [
  'Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez',
]

export const SETORES = ['Civil', 'Consultiva', 'Elétrica', 'Mecânica']

// TEMPORÁRIO: dados fictícios até existir API/banco.
export function getCotacoes(): Cotacao[] {
  const responsavel = 'Rafael Pequino Freire'

  return [
    { id: '1', io: null, setor: 'Consultiva', item: 'VVV', preco: 0, responsavel, fornecedor: 'Fornecedor Alfa', status: 'pendente', propostas: 1 },
    { id: '2', io: { month: 7, year: 2026 }, setor: 'Civil', item: 'ITEM EXEMPLO', preco: 316.67, responsavel, fornecedor: 'Fornecedor Alfa', status: 'cancelada', propostas: 0 },
    { id: '3', io: { month: 7, year: 2026 }, setor: 'Civil', item: 'ITEM EXEMPLO', preco: 316.67, responsavel, fornecedor: 'Fornecedor Beta', status: 'concluida', propostas: 2 },
    { id: '4', io: { month: 7, year: 2026 }, setor: 'Civil', item: 'ITEM EXEMPLO', preco: 316.67, responsavel, fornecedor: 'Fornecedor Beta', status: 'concluida', propostas: 0 },
    { id: '5', io: { month: 7, year: 2026 }, setor: 'Civil', item: 'ITEM EXEMPLO', preco: 316.67, responsavel, fornecedor: 'Fornecedor Gama', status: 'concluida', propostas: 0 },
  ]
}

export function uniqueValues(cotacoes: Cotacao[], field: 'responsavel' | 'fornecedor'): string[] {
  return [...new Set(cotacoes.map((cotacao) => cotacao[field]))].sort((a, b) => a.localeCompare(b, 'pt-BR'))
}

export function availableYears(cotacoes: Cotacao[]): number[] {
  const years = cotacoes.flatMap((cotacao) => (cotacao.io ? [cotacao.io.year] : []))
  return [...new Set(years)].sort((a, b) => b - a)
}

function toMonthIndex(year: string, month: string, defaultMonth: number): number | null {
  if (!year) return null
  return Number(year) * 12 + (month ? Number(month) : defaultMonth)
}

export function filterCotacoes(cotacoes: Cotacao[], filters: CotacaoFilters): Cotacao[] {
  const search = filters.search.trim().toLocaleLowerCase('pt-BR')
  const from = toMonthIndex(filters.fromYear, filters.fromMonth, 1)
  const to = toMonthIndex(filters.toYear, filters.toMonth, 12)

  return cotacoes.filter((cotacao) => {
    if (search && !cotacao.item.toLocaleLowerCase('pt-BR').includes(search)) return false
    if (filters.setor && cotacao.setor !== filters.setor) return false
    if (filters.responsavel && cotacao.responsavel !== filters.responsavel) return false
    if (filters.fornecedor && cotacao.fornecedor !== filters.fornecedor) return false

    if (from !== null || to !== null) {
      if (!cotacao.io) return false
      const index = cotacao.io.year * 12 + cotacao.io.month
      if (from !== null && index < from) return false
      if (to !== null && index > to) return false
    }

    return true
  })
}
