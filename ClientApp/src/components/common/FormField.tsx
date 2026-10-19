import type { ComponentPropsWithoutRef } from 'react'

type FormFieldProps = Omit<ComponentPropsWithoutRef<'input'>, 'id'> & {
  id: string
  label: string
}

function FormField({ id, label, ...inputProps }: FormFieldProps) {
  return (
    <div className="flex flex-col gap-2.5">
      <label className="text-[13px] font-semibold text-[#243747]" htmlFor={id}>
        {label}
      </label>
      <input
        className="h-[49px] w-full rounded-[9px] border border-line px-[15px] text-sm text-[#243747] outline-none transition-[border-color,box-shadow] placeholder:text-[#7c8994] focus:border-brand focus:ring-4 focus:ring-brand-100"
        id={id}
        {...inputProps}
      />
    </div>
  )
}

export default FormField
