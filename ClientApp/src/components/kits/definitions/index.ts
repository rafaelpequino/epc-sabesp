import type { KitDefinition } from '../kitDefinition'
import redeDistribuicaoColetorEmissario from './redeDistribuicaoColetorEmissario'

// Para publicar um novo kit: criar a definição neste diretório, registrá-la aqui com o mesmo
// `id` do kit em `services/kitsService.ts` e mudar o status dele para 'available'.
const KIT_DEFINITIONS: Record<string, KitDefinition> = {
  'rede-distribuicao-coletor-emissario': redeDistribuicaoColetorEmissario,
}

export function getKitDefinition(kitId: string): KitDefinition | null {
  return KIT_DEFINITIONS[kitId] ?? null
}
