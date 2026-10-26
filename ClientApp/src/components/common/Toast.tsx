import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import Icon from './Icon'

const VARIANT_CLASSES = {
  success: 'border-brand-700 bg-brand text-white',
  error: 'border-red-800 bg-red-600 text-white',
} as const

const DEFAULT_DURATION_MS = { success: 3000, error: 6000 } as const
const EXIT_MS = 250

type ToastProps = {
  message: string
  variant?: keyof typeof VARIANT_CLASSES
  durationMs?: number
  onClose: () => void
}

// Alerta flutuante, renderizado no body para ficar acima de todo o conteúdo.
function Toast({ message, variant = 'error', durationMs, onClose }: ToastProps) {
  const [isLeaving, setIsLeaving] = useState(false)
  const onCloseRef = useRef(onClose)

  useEffect(() => {
    onCloseRef.current = onClose
  }, [onClose])

  useEffect(() => {
    setIsLeaving(false)
    const leaveTimer = window.setTimeout(() => setIsLeaving(true), durationMs ?? DEFAULT_DURATION_MS[variant])
    return () => window.clearTimeout(leaveTimer)
  }, [message, variant, durationMs])

  useEffect(() => {
    if (!isLeaving) return
    const closeTimer = window.setTimeout(() => onCloseRef.current(), EXIT_MS)
    return () => window.clearTimeout(closeTimer)
  }, [isLeaving])

  return createPortal(
    <div className="pointer-events-none fixed inset-x-0 top-4 z-[1000] flex justify-center px-4">
      <div
        role={variant === 'error' ? 'alert' : 'status'}
        className={`pointer-events-auto flex w-full max-w-lg items-center gap-3 rounded-xl border-2 px-4 py-3 text-sm font-bold shadow-2xl ring-4 ring-black/10 ${
          VARIANT_CLASSES[variant]
        } ${isLeaving ? 'toast-exit' : 'toast-enter'}`}
      >
        <Icon name={variant === 'error' ? 'close' : 'check'} className="size-5 shrink-0" />
        <p className="flex-1">{message}</p>
        <button
          type="button"
          aria-label="Fechar alerta"
          onClick={() => setIsLeaving(true)}
          className="shrink-0 rounded-md p-1 hover:bg-white/20 focus-visible:outline-2 focus-visible:outline-white"
        >
          <Icon name="close" className="size-4" />
        </button>
      </div>
    </div>,
    document.body,
  )
}

export default Toast
