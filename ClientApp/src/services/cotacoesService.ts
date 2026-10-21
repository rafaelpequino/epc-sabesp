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

export type CotacaoWarning = { before: string; highlight: string; after: string }

export const COTACAO_DELETE_WARNING: CotacaoWarning = {
  before: 'Atenção: você está ',
  highlight: 'excluindo uma cotação existente',
  after: '. Esta ação não poderá ser desfeita.',
}

export const COTACAO_EDIT_WARNING: CotacaoWarning = {
  before: 'Atenção: você está ',
  highlight: 'alterando uma cotação existente',
  after: '. As alterações não poderão ser desfeitas.',
}

export const COTACAO_DELETE_UNAVAILABLE_MESSAGE =
  'A cotação não foi excluída: a integração com a API ainda não está disponível.'

export const MONTH_LABELS = [
  'Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez',
]

export const SETORES = ['Civil', 'Consultiva', 'Elétrica', 'Mecânica']

// TEMPORÁRIO: dados fictícios até existir API/banco.
export function getCotacoes(): Cotacao[] {
  const responsavel = 'Rafael Pequino Freire'

  return [
    { id: '1', io: null, setor: 'Consultiva', item: 'ITEM EXEMPLO 01', preco: 123.45, responsavel, fornecedor: 'Fornecedor Alfa', status: 'pendente', propostas: 1 },
    { id: '2', io: { month: 7, year: 2026 }, setor: 'Civil', item: 'ITEM EXEMPLO 02', preco: 543.21, responsavel, fornecedor: 'Fornecedor Alfa', status: 'cancelada', propostas: 0 },
    { id: '3', io: { month: 7, year: 2026 }, setor: 'Civil', item: 'ITEM EXEMPLO 03', preco: 316.67, responsavel, fornecedor: 'Fornecedor Beta', status: 'concluida', propostas: 2 },
    { id: '4', io: { month: 7, year: 2026 }, setor: 'Civil', item: 'ITEM EXEMPLO 04', preco: 852.36, responsavel, fornecedor: 'Fornecedor Beta', status: 'concluida', propostas: 0 },
    { id: '5', io: { month: 7, year: 2026 }, setor: 'Civil', item: 'ITEM EXEMPLO 05', preco: 789.67, responsavel, fornecedor: 'Fornecedor Gama', status: 'concluida', propostas: 0 },
  ]
}

export type CotacaoAnexo = {
  id: string
  fileName: string
  description: string
  sizeBytes: number
  url: string
}

export type CotacaoPrecoEmpresa = { name: string; price: number | null }

export type CotacaoDetalhe = Cotacao & {
  unidade: string
  precoFornecedorCorrigido: number
  precoMontagem: number | null
  mediaAdotada: number | null
  mediaSaneada: number | null
  menorValor: number | null
  mediaAritmetica: number | null
  mediana: number | null
  empresas: CotacaoPrecoEmpresa[]
  justificativa: string
  anexos: CotacaoAnexo[]
}

// TEMPORÁRIO: gera um PDF mínimo em memória para simular anexos até existir API de arquivos.
function createSamplePdfUrl(title: string): string {
  const pdf = `%PDF-1.1\n1 0 obj<</Type/Catalog/Pages 2 0 R>>endobj\n2 0 obj<</Type/Pages/Kids[3 0 R]/Count 1>>endobj\n3 0 obj<</Type/Page/Parent 2 0 R/MediaBox[0 0 300 100]/Contents 4 0 R/Resources<</Font<</F1 5 0 R>>>>>>endobj\n4 0 obj<</Length 52>>stream\nBT /F1 14 Tf 20 50 Td (${title}) Tj ET\nendstream\nendobj\n5 0 obj<</Type/Font/Subtype/Type1/BaseFont/Helvetica>>endobj\ntrailer<</Root 1 0 R/Size 6>>\n%%EOF`
  return URL.createObjectURL(new Blob([pdf], { type: 'application/pdf' }))
}

// TEMPORÁRIO: dados fictícios até existir API/banco.
export function getCotacaoDetalhe(id: string): CotacaoDetalhe | null {
  const cotacao = getCotacoes().find((candidate) => candidate.id === id)
  if (!cotacao) return null

  const anexos: CotacaoAnexo[] =
    cotacao.propostas > 0
      ? [
          { id: `${id}-1`, fileName: 'proposta-comercial-alfa.pdf', description: 'Proposta comercial do Fornecedor Alfa com validade de 60 dias.', sizeBytes: 482_304, url: createSamplePdfUrl('Proposta Alfa') },
          { id: `${id}-2`, fileName: 'orcamento-beta.pdf', description: 'Orçamento do Fornecedor Beta, incluindo frete.', sizeBytes: 1_258_291, url: createSamplePdfUrl('Orcamento Beta') },
        ]
      : []

  return {
    ...cotacao,
    unidade: 'un',
    precoFornecedorCorrigido: cotacao.preco,
    precoMontagem: 45.9,
    mediaAdotada: cotacao.preco,
    mediaSaneada: 310.2,
    menorValor: 290,
    mediaAritmetica: 318.4,
    mediana: 315,
    empresas: [
      { name: 'Fornecedor Alfa', price: 290 },
      { name: 'Fornecedor Beta', price: 316.67 },
      { name: 'Fornecedor Gama', price: 340.5 },
    ],
    justificativa: 'Preço adotado com base na média das propostas válidas, desconsiderando valores discrepantes.',
    anexos,
  }
}

export function formatIo(io: Cotacao['io']): string {
  if (!io) return '-'
  return `${MONTH_LABELS[io.month - 1].toUpperCase()}/${String(io.year).slice(-2)}`
}

export function formatPrice(value: number): string {
  return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
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
