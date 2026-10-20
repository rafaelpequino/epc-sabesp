import type { IconName } from '../common/Icon'

export type NavItem = {
  label: string
  to: string
  icon: IconName
  end?: boolean
}

export type NavSection = {
  title?: string
  items: NavItem[]
}

export const SISTEMA_BASE_PATH = '/sistema'

export const NAV_SECTIONS: NavSection[] = [
  {
    items: [{ label: 'Início', to: SISTEMA_BASE_PATH, icon: 'home', end: true }],
  },
  {
    title: 'DRC',
    items: [
      { label: 'Kits DRC', to: `${SISTEMA_BASE_PATH}/kits-drc`, icon: 'briefcase' },
      { label: 'Mapeador IA', to: `${SISTEMA_BASE_PATH}/mapeador-ia`, icon: 'search' },
    ],
  },
  {
    title: 'Demandas',
    items: [
      { label: 'Nova Demanda', to: `${SISTEMA_BASE_PATH}/demandas/nova`, icon: 'filePlus' },
      { label: 'Fila de Aprovação', to: `${SISTEMA_BASE_PATH}/demandas/fila-aprovacao`, icon: 'inbox' },
    ],
  },
  {
    title: 'Bancos',
    items: [
      { label: 'Cotações', to: `${SISTEMA_BASE_PATH}/cotacoes`, icon: 'tag' },
      { label: 'Fornecedores', to: `${SISTEMA_BASE_PATH}/fornecedores`, icon: 'users' },
      { label: 'Planilhas Padrão', to: `${SISTEMA_BASE_PATH}/planilhas`, icon: 'file' },
      { label: 'Peças de Aço', to: `${SISTEMA_BASE_PATH}/bancos/pecas-aco`, icon: 'hexagon' },
    ],
  },
]
