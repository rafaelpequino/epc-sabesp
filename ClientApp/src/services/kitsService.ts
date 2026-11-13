import { createSamplePdfUrl } from './samplePdf'

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

// Um filtro ativo por grupo (no máximo uma rede e um método); os grupos se somam.
export type KitFilterSelection = Partial<Record<KitFilterGroup['id'], KitFilterId>>

export function filterKits(kits: DrcKit[], selection: KitFilterSelection): DrcKit[] {
  const selectedTags = Object.values(selection)
  return kits.filter((kit) => selectedTags.every((tag) => kit.tags.includes(tag)))
}

export type DrcKit = {
  id: string
  title: string
  description: string
  icon: 'waves' | 'road'
  tags: KitFilterId[]
  status: 'available' | 'soon'
}

export const KITS_DRC_PATH = '/sistema/kits-drc'

export function getKitPath(kitId: string): string {
  return `${KITS_DRC_PATH}/${kitId}`
}

export type KitCalculation = {
  id: string
  createdAt: string
  project: string
  summary: string
  totalWithBdi: number
  responsavel: string
  pdfFileName: string
  pdfUrl: string
}

// TEMPORÁRIO: histórico fictício até existir API/banco. O PDF é simulado em memória.
export function getKitCalculations(kitId: string): KitCalculation[] {
  if (kitId !== 'rede-distribuicao-coletor-emissario') return []

  const responsavel = 'Rafael Pequino Freire'
  const entries = [
    { id: '3', createdAt: '2026-11-12T14:32:00', project: 'FID 12345', summary: '100 m · Ferro fundido · DN 0,200', totalWithBdi: 184250.9 },
    { id: '2', createdAt: '2026-11-05T09:10:00', project: 'FID 12310', summary: '250 m · PVC · DN 0,150', totalWithBdi: 312980.45 },
    { id: '1', createdAt: '2026-10-28T16:48:00', project: 'FID 12288', summary: '80 m · PEAD · DN 0,300', totalWithBdi: 129400 },
  ]

  return entries.map((entry) => {
    const pdfFileName = `calculo-${kitId}-${entry.id}.pdf`
    return { ...entry, responsavel, pdfFileName, pdfUrl: createSamplePdfUrl(`Calculo ${entry.project}`) }
  })
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
    },
    {
      id: 'recomposicao-asfaltica-isolada',
      title: 'Recomposição Asfáltica Isolada',
      description: 'Cálculo de tapa-buraco e fresagem.',
      icon: 'road',
      tags: ['agua', 'esgoto', 'vca'],
      status: 'soon',
    },
  ]
}

export function getDrcKit(id: string): DrcKit | null {
  return getDrcKits().find((kit) => kit.id === id) ?? null
}
