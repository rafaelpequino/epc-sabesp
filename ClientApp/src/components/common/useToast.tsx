import { useCallback, useRef, useState } from 'react'
import Toast from './Toast'

type ToastVariant = 'success' | 'error'
type ToastData = { id: number; message: string; variant: ToastVariant }

// Gerencia um alerta flutuante por página; um novo alerta substitui o anterior.
export function useToast() {
  const [toast, setToast] = useState<ToastData | null>(null)
  const nextId = useRef(0)

  const showToast = useCallback((message: string, variant: ToastVariant = 'error') => {
    nextId.current += 1
    setToast({ id: nextId.current, message, variant })
  }, [])

  const closeToast = useCallback(() => setToast(null), [])

  const toastElement = toast ? (
    <Toast key={toast.id} message={toast.message} variant={toast.variant} onClose={closeToast} />
  ) : null

  return { showToast, closeToast, toastElement }
}
