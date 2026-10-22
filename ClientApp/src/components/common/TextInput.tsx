import { FIELD_CLASSES } from './fieldClasses'

type TextInputProps = {
  id: string
  value: string
  onChange: (value: string) => void
  placeholder: string
  required?: boolean
  maxLength?: number
  inputMode?: 'decimal' | 'text'
}

function TextInput({ id, value, onChange, placeholder, required = false, maxLength, inputMode }: TextInputProps) {
  return (
    <input
      id={id}
      value={value}
      onChange={(event) => onChange(event.target.value)}
      placeholder={placeholder}
      required={required}
      maxLength={maxLength}
      inputMode={inputMode}
      className={FIELD_CLASSES}
    />
  )
}

export default TextInput
