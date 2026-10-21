import Button from './Button'

type Tone = 'warning' | 'danger'

// O amarelo puro tem pouco contraste em texto sobre branco; usa-se o tom escuro.
const TONE_CLASSES: Record<Tone, { border: string; text: string }> = {
  danger: { border: 'border-red-300', text: 'text-red-700' },
  warning: { border: 'border-accent-yellow', text: 'text-accent-yellow-700' },
}

type ConfirmDialogProps = {
  title: string
  warning: { before: string; highlight: string; after: string }
  question: string
  confirmLabel?: string
  tone?: Tone
  onConfirm: () => void
  onCancel: () => void
}

function ConfirmDialog({
  title,
  warning,
  question,
  confirmLabel = 'Confirmar',
  tone = 'danger',
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  const toneClasses = TONE_CLASSES[tone]

  return (
    <div
      className="fixed inset-0 z-50 grid place-items-center bg-ink/50 p-4"
      onKeyDown={(event) => event.key === 'Escape' && onCancel()}
    >
      <div
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="confirm-dialog-title"
        aria-describedby="confirm-dialog-message"
        className={`flex w-full max-w-md flex-col gap-4 rounded-2xl border bg-white p-6 shadow-xl ${toneClasses.border}`}
      >
        <h2 id="confirm-dialog-title" className={`text-lg font-bold ${toneClasses.text}`}>
          {title}
        </h2>
        <p id="confirm-dialog-message" className="text-sm font-semibold text-ink">
          {warning.before}
          <span className={toneClasses.text}>{warning.highlight}</span>
          {warning.after}
        </p>
        <p className="text-sm text-ink">{question}</p>
        <div className="flex justify-end gap-3">
          <Button variant="outline" icon="close" autoFocus onClick={onCancel}>
            Cancelar
          </Button>
          <Button variant={tone} icon="check" onClick={onConfirm}>
            {confirmLabel}
          </Button>
        </div>
      </div>
    </div>
  )
}

export default ConfirmDialog
