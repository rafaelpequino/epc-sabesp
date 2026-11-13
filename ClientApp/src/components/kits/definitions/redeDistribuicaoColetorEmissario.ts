import {
  YES_NO_OPTIONS,
  formatNumber,
  parseNumber,
  type KitDefinition,
  type KitResult,
  type KitValues,
} from '../kitDefinition'

// TEMPORÁRIO: as listas de opções são exemplos do protótipo até virem da API/banco.
const TERRAIN_OPTIONS = [
  { value: 'solo-firme-abaixo-na', label: 'Solo firme e abaixo do N.A.' },
  { value: 'solo-firme-acima-na', label: 'Solo firme e acima do N.A.' },
]

const PIPE_MATERIAL_OPTIONS = [
  { value: 'ferro-fundido', label: 'Ferro fundido' },
  { value: 'pvc', label: 'PVC' },
  { value: 'pead', label: 'PEAD' },
]

const PIPE_DIAMETER_OPTIONS = [
  { value: '0,150', label: '0,150' },
  { value: '0,200', label: '0,200' },
  { value: '0,300', label: '0,300' },
]

const ROAD_POSITION_OPTIONS = [
  { value: 'via-publica-terco', label: 'Via pública - terço' },
  { value: 'via-publica-eixo', label: 'Via pública - eixo' },
  { value: 'passeio', label: 'Passeio' },
]

const PAVEMENT_OPTIONS = [
  { value: 'asfaltica', label: 'Via em pavimentação asfáltica' },
  { value: 'terra', label: 'Via em terra' },
]

const TRAFFIC_OPTIONS = [
  { value: 'a', label: 'Tipo A' },
  { value: 'b', label: 'Tipo B' },
  { value: 'c', label: 'Tipo C' },
]

const MANHOLE_MATERIAL_OPTIONS = [
  { value: 'plastico', label: 'Plástico' },
  { value: 'concreto', label: 'Concreto' },
]

const SHORING_OPTIONS = [
  { value: 'sem-escoramento', label: 'Sem escoramento' },
  { value: 'pontaleteamento', label: 'Pontaleteamento' },
  { value: 'descontinuo', label: 'Descontínuo' },
]

const IO_OPTIONS = [
  { value: '2025-11', label: 'Novembro/2025' },
  { value: '2025-10', label: 'Outubro/2025' },
]

// TEMPORÁRIO: o cálculo real (preços, BDI) ainda será implementado; por ora só as premissas
// derivadas diretamente dos dados informados são calculadas.
function calculate(values: KitValues): KitResult {
  const extension = parseNumber(values.extension)
  const initialDepth = parseNumber(values.initialDepth)
  const finalDepth = parseNumber(values.finalDepth)
  const averageDepth =
    initialDepth !== null && finalDepth !== null ? formatNumber((initialDepth + finalDepth) / 2) : '—'

  return {
    metrics: [
      { label: 'Total com BDI', value: 'R$ —' },
      { label: 'Valor com BDI por metro', value: 'R$ — / m' },
      { label: 'Extensão considerada', value: extension !== null ? `${formatNumber(extension)} m` : '—' },
    ],
    premisesTitle: 'Premissas técnicas consideradas (sem preços)',
    premises: [
      { premise: 'Profundidade média de projeto', value: averageDepth, unit: 'm' },
      { premise: 'Profundidade mínima da vala', value: 'Conforme NBR / tipo de tubo', unit: 'm' },
      { premise: 'Profundidade de escavação', value: 'Calculada', unit: 'm' },
      { premise: 'Largura de vala', value: 'Projeto / mínimo normativo', unit: 'm' },
      { premise: 'Recomposição de pavimento', value: 'Conforme município e tráfego', unit: '—' },
    ],
  }
}

const redeDistribuicaoColetorEmissario: KitDefinition = {
  calculate,
  sections: [
    {
      id: 'identificacao',
      fields: [
        { id: 'project', type: 'text', label: 'Identificação do projeto / FID', placeholder: 'Ex.: FID 12345' },
        {
          id: 'city',
          type: 'select',
          label: 'Município',
          emptyLabel: 'Selecione',
          options: [{ value: 'sao-paulo', label: 'São Paulo' }],
        },
        { id: 'io', type: 'select', label: 'Mês/Ano I0', options: IO_OPTIONS, defaultValue: '2025-11' },
        { id: 'extension', type: 'number', label: 'Extensão do trecho (m)', required: true, defaultValue: '100' },
      ],
    },
    {
      id: 'servico-tubulacao',
      title: '1. Características do serviço e tubulação',
      fields: [
        {
          id: 'terrain',
          type: 'select',
          label: 'Tipo de terreno',
          required: true,
          options: TERRAIN_OPTIONS,
          defaultValue: 'solo-firme-abaixo-na',
        },
        {
          id: 'pipeMaterial',
          type: 'select',
          label: 'Material da tubulação',
          required: true,
          options: PIPE_MATERIAL_OPTIONS,
          defaultValue: 'ferro-fundido',
        },
        {
          id: 'pipeSupply',
          type: 'select',
          label: 'Fornecimento de tubos pela contratada?',
          options: YES_NO_OPTIONS,
          defaultValue: 'sim',
        },
        {
          id: 'pipeDiameter',
          type: 'select',
          label: 'Diâmetro do tubo (m)',
          required: true,
          options: PIPE_DIAMETER_OPTIONS,
          defaultValue: '0,200',
        },
        {
          id: 'roadPosition',
          type: 'select',
          label: 'Posição da tubulação na via',
          options: ROAD_POSITION_OPTIONS,
          defaultValue: 'via-publica-terco',
        },
        {
          id: 'pavementType',
          type: 'select',
          label: 'Tipo de pavimento',
          options: PAVEMENT_OPTIONS,
          defaultValue: 'asfaltica',
        },
        { id: 'traffic', type: 'select', label: 'Categoria de tráfego', options: TRAFFIC_OPTIONS, defaultValue: 'c' },
      ],
    },
    {
      id: 'pocos',
      title: '2. Poços de visita e inspeção',
      fields: [
        { id: 'maxManholeDistance', type: 'number', label: 'Distância máxima entre PVs (m)', defaultValue: '100' },
        { id: 'manholeCount', type: 'number', label: 'Quantidade de PVs no trecho', defaultValue: '2' },
        { id: 'dropManholeCount', type: 'number', label: 'PVs com tubo de queda', defaultValue: '0' },
        {
          id: 'manholeMaterial',
          type: 'select',
          label: 'Material do PV',
          options: MANHOLE_MATERIAL_OPTIONS,
          defaultValue: 'plastico',
        },
        {
          id: 'coverSupply',
          type: 'select',
          label: 'Fornecimento de tampão pela contratada?',
          options: YES_NO_OPTIONS,
          defaultValue: 'sim',
        },
        { id: 'inspectionWellCount', type: 'number', label: 'Quantidade de poços de inspeção', defaultValue: '0' },
        {
          id: 'inspectionWellMaterial',
          type: 'select',
          label: 'Material do poço de inspeção',
          options: MANHOLE_MATERIAL_OPTIONS,
          defaultValue: 'plastico',
        },
      ],
    },
    {
      id: 'escavacao-reaterro',
      title: '3. Profundidade, escavação e reaterro',
      fields: [
        { id: 'initialDepth', type: 'number', label: 'Profundidade inicial (m)', defaultValue: '1,50' },
        { id: 'finalDepth', type: 'number', label: 'Profundidade final (m)', defaultValue: '2,50' },
        { id: 'trenchWidth', type: 'number', label: 'Largura da vala - projeto (m)', defaultValue: '0,80' },
        {
          id: 'shoring',
          type: 'select',
          label: 'Tipo de escoramento',
          options: SHORING_OPTIONS,
          defaultValue: 'sem-escoramento',
        },
        { id: 'spoilDistance', type: 'number', label: 'Distância de bota-fora (km)', defaultValue: '15' },
        { id: 'swelling', type: 'number', label: 'Empolamento (%)', defaultValue: '30' },
        { id: 'soilReplacement', type: 'number', label: 'Troca de solo (%)', defaultValue: '10' },
        { id: 'disposalDistance', type: 'number', label: 'Distância de jazida (km)', defaultValue: '20' },
      ],
    },
    {
      id: 'esgotamento-rebaixamento',
      title: '4. Esgotamento e rebaixamento',
      fields: [
        { id: 'trenchDrainage', type: 'select', label: 'Esgotamento de vala?', options: YES_NO_OPTIONS, defaultValue: 'sim' },
        {
          id: 'dewatering',
          type: 'select',
          label: 'Rebaixamento do lençol freático?',
          options: YES_NO_OPTIONS,
          defaultValue: 'sim',
        },
        { id: 'secondLine', type: 'select', label: 'Incluir segunda linha?', options: YES_NO_OPTIONS, defaultValue: 'sim' },
        { id: 'dewateringPercent', type: 'number', label: 'Rebaixamento (%)', defaultValue: '100' },
        { id: 'dewateringMobilizations', type: 'number', label: 'Mobilizações para rebaixamento', defaultValue: '0' },
      ],
    },
    {
      id: 'pavimentacao-interferencias',
      title: '5. Pavimentação, recomposição e interferências',
      fields: [
        { id: 'recompositionWidth', type: 'number', label: 'Largura da faixa de recomposição (m)', defaultValue: '1' },
        {
          id: 'rollingLane',
          type: 'select',
          label: 'Recompõe faixa de rolamento?',
          options: YES_NO_OPTIONS,
          defaultValue: 'sim',
        },
        { id: 'millingMobilizations', type: 'number', label: 'Mobilizações de fresagem', defaultValue: '0' },
        { id: 'asphaltCoverThickness', type: 'number', label: 'Espessura capa asfáltica - projeto (m)', defaultValue: '0,05' },
        { id: 'binderThickness', type: 'number', label: 'Espessura binder - projeto (m)', defaultValue: '0' },
        { id: 'baseThickness', type: 'number', label: 'Espessura base - projeto (m)', defaultValue: '0,15' },
        { id: 'subgradeReinforcement', type: 'number', label: 'Reforço subleito - projeto (m)', defaultValue: '0' },
        { id: 'sidewalkThickness', type: 'number', label: 'Espessura passeio - projeto (m)', defaultValue: '0,07' },
        { id: 'soilBackfill', type: 'number', label: 'Aterro com solo - projeto (m)', defaultValue: '1' },
        { id: 'envelope', type: 'number', label: 'Envoltória - projeto (m)', defaultValue: '0,20' },
        { id: 'sandSupport', type: 'number', label: 'Apoio em areia - projeto (m)', defaultValue: '0,10' },
        { id: 'gravelSupport', type: 'number', label: 'Apoio em brita - projeto (m)', defaultValue: '0' },
        { id: 'soilSupport', type: 'number', label: 'Apoio em solo - projeto (m)', defaultValue: '0' },
        { id: 'pedestrianCrossings', type: 'number', label: 'Passadiços para pedestres (un)', defaultValue: '0' },
        { id: 'vehicleCrossings', type: 'number', label: 'Passadiços para veículos (un)', defaultValue: '0' },
        { id: 'poleShoring', type: 'number', label: 'Escoramento para postes (un)', defaultValue: '0' },
      ],
    },
  ],
}

export default redeDistribuicaoColetorEmissario
