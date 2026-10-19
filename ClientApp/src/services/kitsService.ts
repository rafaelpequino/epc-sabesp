export type KitFilterId = 'agua' | 'esgoto' | 'vca' | 'mnd'

export type KitFilterOption = {
  id: KitFilterId
  label: string
}

export type KitFilterGroup = {
  id: 'rede' | 'metodo'
  label: string
  options: KitFilterOption[]
}

export type DrcKit = {
  id: string
  title: string
  description: string
  icon: 'waves' | 'road'
  tags: KitFilterId[]
  status: 'available' | 'soon'
  to: string
}

export const KIT_FILTER_GROUPS: KitFilterGroup[] = [
  {
    id: 'rede',
    label: 'Tipo de rede',
    options: [
      { id: 'agua', label: 'Água' },
      { id: 'esgoto', label: 'Esgoto' },
    ],
  },
  {
    id: 'metodo',
    label: 'Método construtivo',
    options: [
      { id: 'vca', label: 'VCA' },
      { id: 'mnd', label: 'MND' },
    ],
  },
]

// TEMPORÁRIO: dados fictícios até existir API/banco.
export function getDrcKits(): DrcKit[] {
  return [
    {
      id: 'rede-distribuicao-coletor-emissario',
      title: 'Rede de Distribuição / Coletor / Emissário',
      description:
        'Cálculo paramétrico de escavação, tubulação, rebaixamento, escoramento e recomposição de pavimento.',
      icon: 'waves',
      tags: ['agua', 'vca'],
      status: 'available',
      to: '/sistema/kits-drc/rede-distribuicao-coletor-emissario',
    },
    {
      id: 'recomposicao-asfaltica-isolada',
      title: 'Recomposição Asfáltica Isolada',
      description: 'Cálculo de tapa-buraco e fresagem.',
      icon: 'road',
      tags: ['agua', 'esgoto', 'vca'],
      status: 'soon',
      to: '/sistema/kits-drc/recomposicao-asfaltica-isolada',
    },
  ]
}
