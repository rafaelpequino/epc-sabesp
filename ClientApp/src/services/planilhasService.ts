export type PlanilhaVersao = {
  id: string
  io: { month: number; year: number }
  responsavel: string
}

export type Planilha = {
  id: string
  nome: string
  setor: string
  versoes: PlanilhaVersao[]
}

// TEMPORÁRIO: dados fictícios até existir API/banco.
export function getPlanilhas(): Planilha[] {
  return [
    {
      id: 'eletrica',
      nome: 'Planilha Padrão Elétrica',
      setor: 'Elétrica',
      versoes: [
        { id: 'e1', io: { month: 3, year: 2026 }, responsavel: 'Rafael Pequino Freire' },
        { id: 'e2', io: { month: 5, year: 2026 }, responsavel: 'Rafael Pequino Freire' },
        { id: 'e3', io: { month: 7, year: 2026 }, responsavel: 'Lucas Oliveira' },
        { id: 'e4', io: { month: 9, year: 2026 }, responsavel: 'Lucas Oliveira' },
      ],
    },
    {
      id: 'civil',
      nome: 'Planilha Padrão Civil',
      setor: 'Civil',
      versoes: [
        { id: 'c1', io: { month: 2, year: 2026 }, responsavel: 'Rafael Pequino Freire' },
        { id: 'c2', io: { month: 4, year: 2026 }, responsavel: 'Lucas Oliveira' },
        { id: 'c3', io: { month: 6, year: 2026 }, responsavel: 'Fernando Santos' },
      ],
    },
  ]
}

