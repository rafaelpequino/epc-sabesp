export type Fornecedor = {
  id: string
  nomeFantasia: string
  cnpj: string
  telefone: string
  endereco: string
  dataCadastro: string
}

// TEMPORÁRIO: dados fictícios até existir API/banco.
export function getFornecedores(): Fornecedor[] {
  const dataCadastro = '2026-10-05'

  return [
    { id: '5', nomeFantasia: 'Empresa 1', cnpj: '00.000.000/0000-00', telefone: '(11) 1111-1111', endereco: 'Av Santos Dumont 555', dataCadastro },
    { id: '4', nomeFantasia: 'Empresa 2', cnpj: '00.000.000/0000-00', telefone: '(11) 2222-2222', endereco: 'Av Santos Dumont 555', dataCadastro },
    { id: '3', nomeFantasia: 'Empresa 3', cnpj: '00.000.000/0000-00', telefone: '(11) 3333-3333', endereco: 'Av Santos Dumont 555', dataCadastro },
    { id: '2', nomeFantasia: 'Empresa 4', cnpj: '00.000.000/0000-00', telefone: '(11) 4444-4444', endereco: 'Av Santos Dumont 555', dataCadastro },
    { id: '1', nomeFantasia: 'Empresa 5', cnpj: '00.000.000/0000-00', telefone: '(11) 5555-5555', endereco: 'Av Santos Dumont 555', dataCadastro },
  ]
}

function onlyDigits(value: string): string {
  return value.replace(/\D/g, '')
}

export function filterFornecedores(fornecedores: Fornecedor[], search: string): Fornecedor[] {
  const term = search.trim().toLocaleLowerCase('pt-BR')
  if (!term) return fornecedores

  const digits = onlyDigits(term)

  return fornecedores.filter(
    (fornecedor) =>
      fornecedor.nomeFantasia.toLocaleLowerCase('pt-BR').includes(term) ||
      fornecedor.cnpj.toLocaleLowerCase('pt-BR').includes(term) ||
      fornecedor.telefone.toLocaleLowerCase('pt-BR').includes(term) ||
      (digits !== '' &&
        (onlyDigits(fornecedor.cnpj).includes(digits) || onlyDigits(fornecedor.telefone).includes(digits))),
  )
}

export function formatDataCadastro(isoDate: string): string {
  const [year, month, day] = isoDate.split('-')
  return `${day}/${month}/${year}`
}
