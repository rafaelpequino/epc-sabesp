import { useNavigate } from 'react-router-dom'
import Button from '../../../components/common/Button'
import PageHeader from '../../../components/layout/PageHeader'

function AdicionarCotacoesEmLotePage() {
  const navigate = useNavigate()

  return (
    <div className="flex flex-col gap-4">
      <PageHeader
        title="Importação em Massa de Cotações"
        breadcrumbs={[
          { label: 'Início', to: '/sistema' },
          { label: 'Cotações', to: '/sistema/cotacoes' },
          { label: 'Adicionar em lote' },
        ]}
        actions={
          <Button variant="outline" icon="close" onClick={() => navigate('/sistema/cotacoes')}>
            Cancelar
          </Button>
        }
      />

      <section className="grid place-items-center rounded-2xl border border-line bg-white px-4 py-12 shadow-sm">
        <Button icon="copy">Colar do Excel</Button>
      </section>
    </div>
  )
}

export default AdicionarCotacoesEmLotePage
