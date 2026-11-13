import Field from '../common/Field'
import { FIELD_CLASSES } from '../common/fieldClasses'
import TextInput from '../common/TextInput'
import type { KitField } from './kitDefinition'

type KitFieldInputProps = {
  field: KitField
  value: string
  onChange: (value: string) => void
}

function KitFieldInput({ field, value, onChange }: KitFieldInputProps) {
  const inputId = `kit-${field.id}`
  const label = field.required ? `${field.label} *` : field.label

  if (field.type === 'select') {
    return (
      <Field id={inputId} label={label}>
        <select
          id={inputId}
          required={field.required}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className={FIELD_CLASSES}
        >
          {field.emptyLabel !== undefined && <option value="">{field.emptyLabel}</option>}
          {field.options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </Field>
    )
  }

  const isNumber = field.type === 'number'

  return (
    <Field id={inputId} label={label}>
      <TextInput
        id={inputId}
        value={value}
        onChange={(nextValue) => onChange(isNumber ? nextValue.replace(/[^\d,.]/g, '') : nextValue)}
        placeholder={field.placeholder ?? (isNumber ? '0' : '')}
        required={field.required}
        inputMode={isNumber ? 'decimal' : 'text'}
      />
    </Field>
  )
}

export default KitFieldInput
