import { useNavigate } from 'react-router-dom'
import CotacaoFormPage from '../../../components/cotacoes/CotacaoFormPage'
import { COTACOES_PATH } from '../../../components/cotacoes/cotacoesPaths'


function NovaCotacaoPage() {
  const navigate = useNavigate()

  return (
    <CotacaoFormPage
      title="Nova Cotação"
      breadcrumbs={[
        { label: 'Início', to: '/sistema' },
        { label: 'Cotações', to: COTACOES_PATH },
        { label: 'Nova cotação' },
      ]}
      onCancel={() => navigate(COTACOES_PATH)}
      formId="nova-cotacao-form"
      enableSpreadsheetPaste
    />
  )
}

export default NovaCotacaoPage
