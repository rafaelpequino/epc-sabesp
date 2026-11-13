import { useState, type FormEvent } from 'react'
import Button from '../common/Button'
import KitFieldInput from './KitFieldInput'
import KitResultPanel from './KitResultPanel'
import { getDefaultValues, type KitDefinition, type KitResult } from './kitDefinition'

const GRID_CLASSES = 'grid gap-4 sm:grid-cols-2 xl:grid-cols-4'

type KitCalculatorProps = {
  definition: KitDefinition
}

function KitCalculator({ definition }: KitCalculatorProps) {
  const [values, setValues] = useState(() => getDefaultValues(definition))
  const [result, setResult] = useState<KitResult | null>(null)

  function updateValue(fieldId: string, value: string) {
    setValues((current) => ({ ...current, [fieldId]: value }))
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setResult(definition.calculate(values))
  }

  function handleReset() {
    setValues(getDefaultValues(definition))
    setResult(null)
  }

  return (
    <>
      <form
        className="flex flex-col gap-6 rounded-2xl border border-line bg-white p-4 shadow-sm sm:p-5"
        onSubmit={handleSubmit}
      >
        {definition.sections.map((section) => (
          <section key={section.id} className="flex flex-col gap-4">
            {section.title && (
              <h2 className="border-b border-line pb-2 text-sm font-extrabold uppercase text-brand-700">
                {section.title}
              </h2>
            )}
            <div className={GRID_CLASSES}>
              {section.fields.map((field) => (
                <KitFieldInput
                  key={field.id}
                  field={field}
                  value={values[field.id] ?? ''}
                  onChange={(value) => updateValue(field.id, value)}
                />
              ))}
            </div>
          </section>
        ))}

        <div className="flex flex-wrap items-center justify-between gap-4">
          <p className="text-sm text-ink-muted">* Campos obrigatórios.</p>
          <div className="flex flex-wrap gap-3">
            <Button variant="outline" onClick={handleReset}>
              Limpar
            </Button>
            <Button type="submit">Calcular orçamento</Button>
          </div>
        </div>
      </form>

      {result && <KitResultPanel result={result} />}
    </>
  )
}

export default KitCalculator
