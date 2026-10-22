import { useState, type ChangeEvent, type FormEvent } from 'react'
import Button from '../common/Button'
import ConfirmDialog from '../common/ConfirmDialog'
import Field from '../common/Field'
import { FIELD_CLASSES, TEXTAREA_CLASSES } from '../common/fieldClasses'
import Icon from '../common/Icon'
import IconButton from '../common/IconButton'
import TextInput from '../common/TextInput'
import PageHeader, { type BreadcrumbItem } from '../layout/PageHeader'
import { SETORES, type CotacaoWarning } from '../../services/cotacoesService'
import { getFornecedores } from '../../services/fornecedoresService'
import {
  EMPTY_COTACAO_FORM_VALUES,
  EMPTY_SUPPLIERS,
  type CotacaoFormValues,
  type QuoteAttachment,
  type QuoteFields,
  type SupplierQuote,
} from './cotacaoFormValues'

const MAX_ITEM_LENGTH = 100
const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024

const SPREADSHEET_FIELD_ORDER: (keyof QuoteFields)[] = [
  'sector',
  'item',
  'originalIo',
  'unit',
  'correctedSupplierPrice',
  'installationPrice',
  'adoptedSupplierPrice',
  'adoptedAverage',
  'cleanedAverage',
  'lowestPrice',
  'arithmeticMean',
  'median',
]

type CotacaoFormPageProps = {
  title: string
  breadcrumbs: BreadcrumbItem[]
  onCancel: () => void
  formId: string
  initialValues?: CotacaoFormValues
  warning?: CotacaoWarning
}

function CotacaoFormPage({
  title,
  breadcrumbs,
  onCancel,
  formId,
  initialValues = EMPTY_COTACAO_FORM_VALUES,
  warning,
}: CotacaoFormPageProps) {
  const [fields, setFields] = useState(initialValues.fields)
  const [suppliers, setSuppliers] = useState(initialValues.suppliers)
  const [attachments, setAttachments] = useState<QuoteAttachment[]>(initialValues.attachments)
  const [feedback, setFeedback] = useState<{ message: string; isError: boolean } | null>(null)
  const [isConfirmingSave, setIsConfirmingSave] = useState(false)

  function updateField(field: keyof QuoteFields, value: string) {
    setFields((current) => ({ ...current, [field]: value }))
  }

  function updateSupplier(index: number, field: keyof SupplierQuote, value: string) {
    setSuppliers((current) =>
      current.map((supplier, supplierIndex) =>
        supplierIndex === index ? { ...supplier, [field]: value } : supplier,
      ),
    )
  }

  async function handlePasteSpreadsheet() {
    if (!navigator.clipboard?.readText) {
      setFeedback({
        message: 'Não foi possível acessar a área de transferência neste navegador.',
        isError: true,
      })
      return
    }

    try {
      const clipboardText = await navigator.clipboard.readText()
      const row = clipboardText.trimEnd().split(/\r?\n/, 1)[0]
      const columns = row?.split('\t')

      if (!columns || columns.length < 2 || !columns.some((column) => column.trim())) {
        setFeedback({
          message: 'Copie uma linha da planilha antes de colar os dados.',
          isError: true,
        })
        return
      }

      setFields((current) => {
        const pastedFields = { ...current }
        SPREADSHEET_FIELD_ORDER.forEach((field, index) => {
          if (columns[index] !== undefined) {
            pastedFields[field] = columns[index].trim()
          }
        })
        return pastedFields
      })

      const supplierValues = EMPTY_SUPPLIERS.map((supplier, index) => ({
        name: columns[SPREADSHEET_FIELD_ORDER.length + index * 2]?.trim() ?? supplier.name,
        price: columns[SPREADSHEET_FIELD_ORDER.length + index * 2 + 1]?.trim() ?? supplier.price,
      }))
      setSuppliers(supplierValues)
      setFeedback({ message: 'Dados da planilha preenchidos.', isError: false })
    } catch {
      setFeedback({
        message: 'A área de transferência não pôde ser lida. Verifique a permissão do navegador.',
        isError: true,
      })
    }
  }

  function handleFileSelection(event: ChangeEvent<HTMLInputElement>) {
    const selectedFiles = Array.from(event.currentTarget.files ?? [])
    const validFiles: QuoteAttachment[] = []
    const errors: string[] = []

    selectedFiles.forEach((file) => {
      const isPdf = file.type === 'application/pdf' || file.name.toLocaleLowerCase('pt-BR').endsWith('.pdf')
      if (!isPdf) {
        errors.push(`${file.name}: selecione apenas arquivos PDF.`)
      } else if (file.size > MAX_FILE_SIZE_BYTES) {
        errors.push(`${file.name}: o arquivo excede o limite de 10 MB.`)
      } else {
        validFiles.push({ id: crypto.randomUUID(), name: file.name, sizeBytes: file.size, description: '', file })
      }
    })

    setAttachments((current) => [...current, ...validFiles])
    setFeedback(
      errors.length > 0
        ? { message: errors.join(' '), isError: true }
        : validFiles.length > 0
          ? { message: `${validFiles.length} arquivo(s) adicionado(s).`, isError: false }
          : null,
    )
    event.currentTarget.value = ''
  }

  function saveQuote() {
    setFeedback({
      message: 'A cotação não foi salva: a integração com a API ainda não está disponível.',
      isError: true,
    })
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (warning) {
      setIsConfirmingSave(true)
      return
    }
    saveQuote()
  }

  function handleConfirmSave() {
    setIsConfirmingSave(false)
    saveQuote()
  }

  function removeAttachment(id: string) {
    setAttachments((current) => current.filter((attachment) => attachment.id !== id))
  }

  return (
    <div className="flex w-full flex-col gap-5">
      <PageHeader
        title={title}
        breadcrumbs={breadcrumbs}
        actions={
          <>
            <Button variant="outline" icon="close" onClick={onCancel}>
              Cancelar
            </Button>
            <Button type="submit" form={formId} icon="check" variant={warning ? 'warning' : 'primary'}>
              Salvar
            </Button>
          </>
        }
      >
      </PageHeader>

      <form id={formId} className="flex flex-col gap-5" onSubmit={handleSubmit}>
        <section className="flex flex-col gap-4 rounded-2xl border border-line bg-white p-4 shadow-sm sm:p-5">
          {warning && (
            <div
              role="alert"
              className="rounded-xl border border-accent-yellow bg-accent-yellow/15 p-4 text-sm font-semibold text-ink"
            >
              <p>
                {warning.before}
                {warning.highlight}
                {warning.after}
              </p>
            </div>
          )}
          <Field id="sector" label="Setor *">
            <select
              id="sector"
              required
              value={fields.sector}
              onChange={(event) => updateField('sector', event.target.value)}
              className={FIELD_CLASSES}
            >
              <option value="">Selecione um setor</option>
              {SETORES.map((sector) => (
                <option key={sector} value={sector}>
                  {sector}
                </option>
              ))}
            </select>
          </Field>

          <div className="rounded-xl border border-dashed border-brand-200 bg-brand-50 p-3">
            <div className="[&>button]:w-full">
              <Button type="button" variant="outline" icon="copy" onClick={handlePasteSpreadsheet}>
                Colar dados da planilha
              </Button>
            </div>
            <p className="mt-2 text-center text-xs text-ink-muted">
              Cole uma linha separada por tabulações, na ordem dos campos exibidos.
            </p>
          </div>

          <Field id="item" label="Item *" hint={`(máx. ${MAX_ITEM_LENGTH} caracteres)`}>
            <TextInput
              id="item"
              value={fields.item}
              onChange={(value) => updateField('item', value)}
              placeholder="Descrição do item"
              required
              maxLength={MAX_ITEM_LENGTH}
            />
          </Field>

          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <Field id="originalIo" label="I0 original da cotação *">
              <TextInput
                id="originalIo"
                value={fields.originalIo}
                onChange={(value) => updateField('originalIo', value)}
                placeholder="Ex.: JAN/00"
                required
              />
            </Field>
            <Field id="unit" label="Unidade *">
              <TextInput
                id="unit"
                value={fields.unit}
                onChange={(value) => updateField('unit', value)}
                placeholder="Ex.: Un., m², kg"
                required
              />
            </Field>
            <Field id="correctedSupplierPrice" label="Adotada — preço de forn. (corrigido) *">
              <TextInput
                id="correctedSupplierPrice"
                value={fields.correctedSupplierPrice}
                onChange={(value) => updateField('correctedSupplierPrice', value)}
                placeholder="0,00"
                required
                inputMode="decimal"
              />
            </Field>
            <Field id="installationPrice" label="Preço de montagem / instalação">
              <TextInput
                id="installationPrice"
                value={fields.installationPrice}
                onChange={(value) => updateField('installationPrice', value)}
                placeholder="0,00"
                inputMode="decimal"
              />
            </Field>
            <Field id="adoptedSupplierPrice" label="Preço de forn. adotado *">
              <TextInput
                id="adoptedSupplierPrice"
                value={fields.adoptedSupplierPrice}
                onChange={(value) => updateField('adoptedSupplierPrice', value)}
                placeholder="0,00"
                required
                inputMode="decimal"
              />
            </Field>
            <Field id="adoptedAverage" label="Média adotada">
              <TextInput
                id="adoptedAverage"
                value={fields.adoptedAverage}
                onChange={(value) => updateField('adoptedAverage', value)}
                placeholder="Digite aqui"
                inputMode="decimal"
              />
            </Field>
            <Field id="cleanedAverage" label="Média saneada">
              <TextInput
                id="cleanedAverage"
                value={fields.cleanedAverage}
                onChange={(value) => updateField('cleanedAverage', value)}
                placeholder="0,00"
                inputMode="decimal"
              />
            </Field>
            <Field id="lowestPrice" label="Menor valor">
              <TextInput
                id="lowestPrice"
                value={fields.lowestPrice}
                onChange={(value) => updateField('lowestPrice', value)}
                placeholder="0,00"
                inputMode="decimal"
              />
            </Field>
            <Field id="arithmeticMean" label="Média aritmética">
              <TextInput
                id="arithmeticMean"
                value={fields.arithmeticMean}
                onChange={(value) => updateField('arithmeticMean', value)}
                placeholder="0,00"
                inputMode="decimal"
              />
            </Field>
            <Field id="median" label="Mediana">
              <TextInput
                id="median"
                value={fields.median}
                onChange={(value) => updateField('median', value)}
                placeholder="0,00"
                inputMode="decimal"
              />
            </Field>
          </div>
        </section>

        <section className="rounded-2xl border border-line bg-white p-4 shadow-sm sm:p-5">
          <div className="mb-4 border-b border-line pb-3">
            <h2 className="text-lg font-bold text-ink">Preços das empresas</h2>
            <p className="mt-1 text-sm text-ink-muted">Informe os fornecedores consultados e os respectivos valores.</p>
          </div>
          <datalist id="supplier-options">
            {getFornecedores().map((supplier) => (
              <option key={supplier.id} value={supplier.nomeFantasia} />
            ))}
          </datalist>
          <div className="grid gap-4 xl:grid-cols-2">
            {suppliers.map((supplier, index) => (
              <div
                key={index}
                className="grid gap-3 rounded-xl border border-line bg-brand-50/50 p-4 sm:grid-cols-2"
              >
                <Field id={`supplier-${index}`} label={`Nome da empresa ${index + 1}${index === 0 ? ' *' : ''}`}>
                  <div className="relative">
                    <Icon
                      name="search"
                      className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-ink-muted"
                    />
                    <input
                      id={`supplier-${index}`}
                      list="supplier-options"
                      value={supplier.name}
                      onChange={(event) => updateSupplier(index, 'name', event.target.value)}
                      placeholder="Selecione ou procure..."
                      required={index === 0}
                      className={`${FIELD_CLASSES} pl-10`}
                    />
                  </div>
                </Field>
                <Field id={`supplier-price-${index}`} label={`Valor empresa ${index + 1}`}>
                  <TextInput
                    id={`supplier-price-${index}`}
                    value={supplier.price}
                    onChange={(value) => updateSupplier(index, 'price', value)}
                    placeholder="0,00"
                    inputMode="decimal"
                  />
                </Field>
              </div>
            ))}
          </div>
        </section>

        <section className="flex flex-col gap-5 rounded-2xl border border-line bg-white p-4 shadow-sm sm:p-5">
          <Field id="justification" label="Justificativa do preço adotado">
            <textarea
              id="justification"
              value={fields.justification}
              onChange={(event) => updateField('justification', event.target.value)}
              placeholder="Digite a justificativa..."
              rows={4}
              className={TEXTAREA_CLASSES}
            />
          </Field>

          <div>
            <div className="mb-3 border-b border-line pb-3">
              <h2 className="text-lg font-bold text-ink">Anexos (PDFs)</h2>
            </div>
            <label htmlFor="attachments" className="mb-2 block text-sm font-semibold text-ink">
              Adicionar anexos PDF
            </label>
            <input
              id="attachments"
              type="file"
              accept="application/pdf,.pdf"
              multiple
              onChange={handleFileSelection}
              className="block w-full rounded-lg border border-line bg-white text-sm text-ink file:mr-4 file:min-h-11 file:border-0 file:bg-brand-50 file:px-4 file:font-semibold file:text-brand-700 hover:file:bg-brand-100"
            />
            <p className="mt-2 text-sm text-ink-muted">
              Máximo de 10 MB por arquivo. Informe uma descrição para cada anexo.
            </p>

            {attachments.length > 0 && (
              <ul className="mt-4 flex flex-col gap-3">
                {attachments.map((attachment) => (
                  <li
                    key={attachment.id}
                    className="grid gap-3 rounded-xl border border-line bg-brand-50/50 p-3 sm:grid-cols-[minmax(0,1fr)_minmax(16rem,1fr)_auto] sm:items-end"
                  >
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-ink">{attachment.name}</p>
                      <p className="text-xs text-ink-muted">
                        {(attachment.sizeBytes / (1024 * 1024)).toFixed(2)} MB
                      </p>
                    </div>
                    <Field id={`attachment-description-${attachment.id}`} label="Descrição do arquivo *">
                      <input
                        id={`attachment-description-${attachment.id}`}
                        value={attachment.description}
                        onChange={(event) =>
                          setAttachments((current) =>
                            current.map((item) =>
                              item.id === attachment.id ? { ...item, description: event.target.value } : item,
                            ),
                          )
                        }
                        placeholder="Descreva este arquivo"
                        required
                        className={FIELD_CLASSES}
                      />
                    </Field>
                    <IconButton
                      icon="trash"
                      label={`Remover ${attachment.name}`}
                      title="Remover"
                      size="size-10"
                      onClick={() => removeAttachment(attachment.id)}
                    />
                  </li>
                ))}
              </ul>
            )}
          </div>
        </section>

        {feedback && (
          <p
            role={feedback.isError ? 'alert' : 'status'}
            className={`rounded-xl border p-3 text-sm font-semibold ${
              feedback.isError
                ? 'border-red-200 bg-red-50 text-red-700'
                : 'border-brand-200 bg-brand-50 text-brand-700'
            }`}
          >
            {feedback.message}
          </p>
        )}
      </form>

      {warning && isConfirmingSave && (
        <ConfirmDialog
          title="Confirmar alterações"
          tone="warning"
          warning={warning}
          question="Deseja realmente salvar as alterações?"
          onConfirm={handleConfirmSave}
          onCancel={() => setIsConfirmingSave(false)}
        />
      )}
    </div>
  )
}

export default CotacaoFormPage
