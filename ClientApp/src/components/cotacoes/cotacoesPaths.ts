export const COTACOES_PATH = '/sistema/cotacoes'
export const VISUALIZAR_COTACAO_PATH = `${COTACOES_PATH}/visualizar-cotacao`
export const EDITAR_COTACAO_PATH = `${COTACOES_PATH}/editar-cotacao`

// O id da cotação não vai na URL: ele trafega no estado da navegação (history.state),
// que sobrevive ao F5 mas não a um acesso direto pela URL.
export type VisualizarCotacaoState = { id: string }
export type EditarCotacaoState = { id: string; fromVisualizar?: boolean }

export function isCotacaoState(state: unknown): state is VisualizarCotacaoState {
  return typeof state === 'object' && state !== null && typeof (state as VisualizarCotacaoState).id === 'string'
}
