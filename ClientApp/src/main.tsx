import { createRoot } from 'react-dom/client'

const rootElement = document.getElementById('root')

if (!rootElement) {
  throw new Error('Elemento raiz do frontend não encontrado.')
}

createRoot(rootElement).render(<></>)
