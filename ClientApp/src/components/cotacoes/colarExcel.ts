import type { Fornecedor } from '../../services/fornecedoresService'

export const COMPANY_FIRST_COLUMN = 14
export const COMPANY_SLOTS = 6

function normalizeText(value: string | undefined): string {
  return (value || '')
    .toString()
    .trim()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/ç/gi, 'c')
    .toUpperCase()
}

// ---------------------------------------------------------------------------
// Nova cotação: 2 linhas (nomes das empresas + dados). Valores monetários em texto ("316.67").
// ---------------------------------------------------------------------------

export type CotacaoColada = {
  idOriginal: string
  item: string
  unidade: string
  precoFornCorrigido: string
  precoMontagem: string
  precoAdotado: string
  mediaAdotada: string
  mediaSaneada: string
  menorValor: string
  mediaAritmetica: string
  mediana: string
  nomesEmpresas: string[]
  valoresEmpresas: string[]
  justificativa: string
}

function parseMoneyString(value: string | undefined): string {
  if (!value || value.trim() === '') return ''
  const cleaned = value.replace(/R\$\s*/g, '').trim().replace(/\./g, '').replace(',', '.')
  return cleaned || ''
}

// Não aplicar trim ao texto inteiro: os TABs iniciais da linha de nomes definem as colunas.
export function parseCotacaoClipboard(text: string): CotacaoColada {
  const lines = text.split(/\r?\n/).filter((line) => line.replace(/\t/g, '').trim().length > 0)

  if (lines.length < 2) {
    throw new Error('Cole exatamente 2 linhas: nomes das empresas e dados da cotação.')
  }

  const namesLine = lines[0].split('\t')
  const valuesLine = lines[1].split('\t')

  const cell = (index: number) => (index < valuesLine.length ? valuesLine[index] : '')
  const money = (index: number) => parseMoneyString(cell(index))
  const upper = (index: number) => normalizeText(cell(index))

  const companyColumns = Array.from({ length: COMPANY_SLOTS }, (_, i) => COMPANY_FIRST_COLUMN + i)

  return {
    idOriginal: upper(0),
    item: upper(1),
    unidade: upper(2),
    precoFornCorrigido: money(3),
    precoMontagem: money(4),
    precoAdotado: money(6),
    mediaAdotada: upper(8),
    mediaSaneada: money(9),
    menorValor: money(10),
    mediaAritmetica: money(11),
    mediana: money(12),
    nomesEmpresas: companyColumns.map((column) => normalizeText(namesLine[column])),
    valoresEmpresas: companyColumns.map(money),
    justificativa: upper(20),
  }
}

// ---------------------------------------------------------------------------
// Adicionar em lote: N cotações, 2 linhas cada. Valores monetários numéricos.
// ---------------------------------------------------------------------------

export type BulkEmpresa = { nome: string; valor: number; fornecedorId: string | null }

export type BulkCotacao = {
  id: string
  setor: string
  i0Original: string
  item: string
  unidade: string
  adotada: number
  precoMontagem: number
  precoAdotado: number
  mediaAdotada: number
  mediaSaneada: number
  menorValor: number
  mediaAritmetica: number
  mediana: number
  empresas: BulkEmpresa[]
  justificativa: string
}

export class BulkParseError extends Error {}

const BULK_MIN_COLUMNS = 21
const BULK_LAST_COMPANY_COLUMN = 18

function parseMoneyNumber(value: string | undefined): number {
  if (!value || value === '') return 0
  const cleaned = value.toString().replace(/R\$/g, '').replace(/\./g, '').replace(/,/g, '.').trim()
  const parsed = parseFloat(cleaned)
  return Number.isNaN(parsed) ? 0 : parsed
}

export function parseBulkClipboard(text: string): BulkCotacao[] {
  const lines = text.split('\n').filter((line) => line.trim() !== '')

  if (lines.length < 2 || lines.length % 2 !== 0) {
    throw new BulkParseError('Cada cotação deve ter 2 linhas (nomes das empresas + dados da cotação).')
  }

  const cotacoes: BulkCotacao[] = []

  for (let i = 0; i < lines.length; i += 2) {
    const nomes = lines[i].split('\t')
    const dados = lines[i + 1].split('\t')

    if (dados.length < BULK_MIN_COLUMNS) continue

    const empresas: BulkEmpresa[] = []
    for (let j = COMPANY_FIRST_COLUMN; j <= BULK_LAST_COMPANY_COLUMN; j++) {
      const nome = normalizeText((nomes[j] || '').trim())
      const valor = parseMoneyNumber(dados[j])
      if (nome || valor > 0) empresas.push({ nome, valor, fornecedorId: null })
    }

    cotacoes.push({
      id: `bulk_${Date.now()}_${i}`,
      setor: '',
      i0Original: normalizeText(dados[0]),
      item: normalizeText(dados[1]),
      unidade: normalizeText(dados[2]),
      adotada: parseMoneyNumber(dados[3]),
      precoMontagem: parseMoneyNumber(dados[4]),
      precoAdotado: parseMoneyNumber(dados[6]),
      mediaAdotada: parseMoneyNumber(dados[8]),
      mediaSaneada: parseMoneyNumber(dados[9]),
      menorValor: parseMoneyNumber(dados[10]),
      mediaAritmetica: parseMoneyNumber(dados[11]),
      mediana: parseMoneyNumber(dados[12]),
      empresas,
      justificativa: normalizeText((dados[20] || '').replace(/\r/g, '').trim()),
    })
  }

  if (cotacoes.length === 0) {
    throw new BulkParseError('Nenhuma cotação válida foi encontrada!')
  }

  return cotacoes
}

function normalizeForMatch(value: string): string {
  return value
    .trim()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
}

function findFornecedor(nome: string, fornecedores: Fornecedor[]): Fornecedor | undefined {
  const target = normalizeForMatch(nome)
  const normalized = fornecedores.map((fornecedor) => ({
    fornecedor,
    name: normalizeForMatch(fornecedor.nomeFantasia),
  }))

  return (
    normalized.find((candidate) => candidate.name === target) ??
    normalized.find((candidate) => candidate.name.includes(target) || target.includes(candidate.name))
  )?.fornecedor
}

// Usado na edição manual do nome: só vincula quando há um cadastro com o mesmo nome.
export function resolveFornecedorId(nome: string, fornecedores: Fornecedor[]): string | null {
  const target = normalizeForMatch(nome)
  if (!target) return null
  return fornecedores.find((fornecedor) => normalizeForMatch(fornecedor.nomeFantasia) === target)?.id ?? null
}

export function matchFornecedores(cotacoes: BulkCotacao[], fornecedores: Fornecedor[]): BulkCotacao[] {
  return cotacoes.map((cotacao) => ({
    ...cotacao,
    empresas: cotacao.empresas.map((empresa) => {
      if (!empresa.nome || empresa.fornecedorId) return empresa
      return { ...empresa, fornecedorId: findFornecedor(empresa.nome, fornecedores)?.id ?? null }
    }),
  }))
}
