// Contrato de um kit DRC: cada kit é descrito por dados (campos de entrada) e por uma função
// de cálculo (saída). A tela genérica (`KitCalculator`) renderiza qualquer definição, então
// criar ou editar um kit não exige mexer em componentes nem em rotas.

export type KitFieldOption = { value: string; label: string }

type KitFieldBase = {
  id: string
  label: string
  required?: boolean
  defaultValue?: string
}

export type KitTextField = KitFieldBase & {
  type: 'text'
  placeholder?: string
}

export type KitNumberField = KitFieldBase & {
  type: 'number'
  placeholder?: string
}

export type KitSelectField = KitFieldBase & {
  type: 'select'
  options: KitFieldOption[]
  // Texto da opção vazia (ex.: "Selecione"). Sem ele, o select não tem opção vazia.
  emptyLabel?: string
}

export type KitField = KitTextField | KitNumberField | KitSelectField

export type KitSection = {
  id: string
  // Seções sem título (ex.: dados de identificação) aparecem sem cabeçalho.
  title?: string
  fields: KitField[]
}

export type KitValues = Record<string, string>

export type KitResultMetric = { label: string; value: string }

export type KitPremise = { premise: string; value: string; unit: string }

export type KitResult = {
  metrics: KitResultMetric[]
  premisesTitle: string
  premises: KitPremise[]
}

export type KitDefinition = {
  sections: KitSection[]
  calculate: (values: KitValues) => KitResult
}

export const YES_NO_OPTIONS: KitFieldOption[] = [
  { value: 'sim', label: 'Sim' },
  { value: 'nao', label: 'Não' },
]

export function getDefaultValues(definition: KitDefinition): KitValues {
  return Object.fromEntries(
    definition.sections.flatMap((section) => section.fields.map((field) => [field.id, field.defaultValue ?? ''])),
  )
}

// Os campos numéricos usam vírgula decimal ("1,50"); o cálculo precisa de número.
export function parseNumber(value: string | undefined): number | null {
  const normalized = (value ?? '').trim().replace(',', '.')
  if (normalized === '') return null
  const parsed = Number(normalized)
  return Number.isFinite(parsed) ? parsed : null
}

export function formatNumber(value: number): string {
  return value.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}
