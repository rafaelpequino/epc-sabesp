import { useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import Button from '../../../components/common/Button'
import Field from '../../../components/common/Field'
import { FIELD_CLASSES } from '../../../components/common/fieldClasses'
import TextInput from '../../../components/common/TextInput'
import PageHeader from '../../../components/layout/PageHeader'
import { SETORES } from '../../../services/cotacoesService'

const MAX_DESCRIPTION_LENGTH = 100
const FORM_ID = 'intencao-cotacao-form'

function IntencaoCotacaoPage() {
  const navigate = useNavigate()
  const [sector, setSector] = useState('')
  const [description, setDescription] = useState('')
  const [feedback, setFeedback] = useState<string | null>(null)

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setFeedback('A intenção não foi registrada: a integração com a API ainda não está disponível.')
  }

  return (
    <div className="flex flex-col gap-4">
      <PageHeader
        title="Intenção de Cotação"
        breadcrumbs={[
          { label: 'Início', to: '/sistema' },
          { label: 'Cotações', to: '/sistema/cotacoes' },
          { label: 'Intenção de cotação' },
        ]}
        actions={
          <>
            <Button variant="outline" icon="close" onClick={() => navigate('/sistema/cotacoes')}>
              Cancelar
            </Button>
            <Button type="submit" form={FORM_ID} icon="check">
              Salvar
            </Button>
          </>
        }
      />

      {feedback && (
        <p role="alert" className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm font-semibold text-red-700">
          {feedback}
        </p>
      )}

      <form
        id={FORM_ID}
        className="flex flex-col gap-5 rounded-2xl border border-line bg-white p-4 shadow-sm sm:p-5"
        onSubmit={handleSubmit}
      >
        <p className="text-sm text-ink-muted">
          Registre uma cotação ainda pendente. Apenas <strong className="text-ink">Setor</strong> e{' '}
          <strong className="text-ink">Descrição</strong> são obrigatórios. O status ficará como{' '}
          <span className="rounded-full bg-accent-yellow/20 px-2 py-0.5 text-xs font-bold text-ink">Pendente</span>.
        </p>

        <Field id="intention-sector" label="Setor *">
          <select
            id="intention-sector"
            required
            value={sector}
            onChange={(event) => setSector(event.target.value)}
            className={FIELD_CLASSES}
          >
            <option value="">Selecione um setor</option>
            {SETORES.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </Field>

        <Field
          id="intention-description"
          label="Descrição do item *"
          hint={`(máx. ${MAX_DESCRIPTION_LENGTH} caracteres)`}
        >
          <TextInput
            id="intention-description"
            required
            maxLength={MAX_DESCRIPTION_LENGTH}
            value={description}
            onChange={setDescription}
            placeholder="Descrição do item"
          />
        </Field>
      </form>
    </div>
  )
}

export default IntencaoCotacaoPage
