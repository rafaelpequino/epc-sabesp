import { formatIo, type CotacaoDetalhe } from '../../services/cotacoesService'

export const MAX_SUPPLIERS = 6

export type QuoteFields = {
  sector: string
  item: string
  originalIo: string
  unit: string
  correctedSupplierPrice: string
  installationPrice: string
  adoptedSupplierPrice: string
  adoptedAverage: string
  cleanedAverage: string
  lowestPrice: string
  arithmeticMean: string
  median: string
  justification: string
}

export type SupplierQuote = { name: string; price: string }

// `file` só existe em anexos recém-selecionados; anexos já salvos virão da API.
export type QuoteAttachment = {
  id: string
  name: string
  sizeBytes: number
  description: string
  file?: File
}

export type CotacaoFormValues = {
  fields: QuoteFields
  suppliers: SupplierQuote[]
  attachments: QuoteAttachment[]
}

export const EMPTY_SUPPLIERS: SupplierQuote[] = Array.from({ length: MAX_SUPPLIERS }, () => ({
  name: '',
  price: '',
}))

export const EMPTY_COTACAO_FORM_VALUES: CotacaoFormValues = {
  fields: {
    sector: '',
    item: '',
    originalIo: '',
    unit: '',
    correctedSupplierPrice: '',
    installationPrice: '',
    adoptedSupplierPrice: '',
    adoptedAverage: '',
    cleanedAverage: '',
    lowestPrice: '',
    arithmeticMean: '',
    median: '',
    justification: '',
  },
  suppliers: EMPTY_SUPPLIERS,
  attachments: [],
}

function formatInputNumber(value: number | null): string {
  return value === null ? '' : value.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

export function toCotacaoFormValues(cotacao: CotacaoDetalhe): CotacaoFormValues {
  const suppliers = EMPTY_SUPPLIERS.map((empty, index) => {
    const empresa = cotacao.empresas[index]
    return empresa ? { name: empresa.name, price: formatInputNumber(empresa.price) } : empty
  })

  return {
    fields: {
      sector: cotacao.setor,
      item: cotacao.item,
      originalIo: cotacao.io ? formatIo(cotacao.io) : '',
      unit: cotacao.unidade,
      correctedSupplierPrice: formatInputNumber(cotacao.precoFornecedorCorrigido),
      installationPrice: formatInputNumber(cotacao.precoMontagem),
      adoptedSupplierPrice: formatInputNumber(cotacao.preco),
      adoptedAverage: formatInputNumber(cotacao.mediaAdotada),
      cleanedAverage: formatInputNumber(cotacao.mediaSaneada),
      lowestPrice: formatInputNumber(cotacao.menorValor),
      arithmeticMean: formatInputNumber(cotacao.mediaAritmetica),
      median: formatInputNumber(cotacao.mediana),
      justification: cotacao.justificativa,
    },
    suppliers,
    attachments: cotacao.anexos.map((anexo) => ({
      id: anexo.id,
      name: anexo.fileName,
      sizeBytes: anexo.sizeBytes,
      description: anexo.description,
    })),
  }
}
