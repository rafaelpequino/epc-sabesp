import type { ComponentPropsWithoutRef } from 'react'
import Icon, { type IconName } from './Icon'

const VARIANT_CLASSES = {
  primary: 'bg-brand text-white hover:bg-brand-600 focus-visible:outline-brand',
  outline: 'border border-brand bg-white text-brand-600 hover:bg-brand-50 focus-visible:outline-brand',
  warning: 'bg-accent-yellow text-ink hover:bg-accent-yellow/80 focus-visible:outline-accent-yellow-700',
  danger: 'bg-red-600 text-white hover:bg-red-700 focus-visible:outline-red-600',
} as const

type ButtonProps = Omit<ComponentPropsWithoutRef<'button'>, 'className'> & {
  variant?: keyof typeof VARIANT_CLASSES
  icon?: IconName
}

function Button({ variant = 'primary', icon, type = 'button', children, ...props }: ButtonProps) {
  return (
    <button
      type={type}
      className={`inline-flex min-h-11 min-w-32 cursor-pointer items-center justify-center gap-2 rounded-lg px-5 text-sm font-bold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 ${VARIANT_CLASSES[variant]}`}
      {...props}
    >
      {icon && <Icon name={icon} className="size-4" />}
      {children}
    </button>
  )
}

export default Button
