import type { KitResult } from './kitDefinition'

function KitResultPanel({ result }: { result: KitResult }) {
  return (
    <section
      aria-labelledby="kit-result-title"
      className="flex flex-col gap-5 rounded-2xl border border-line bg-white p-4 shadow-sm sm:p-5"
    >
      <div>
        <h2 id="kit-result-title" className="text-lg font-bold text-ink">
          Resultado do cálculo
        </h2>
        <p className="mt-1 text-sm text-ink-muted">
          Valores demonstrativos — o cálculo de preços ainda não está disponível.
        </p>
      </div>

      <dl className="grid gap-3 sm:grid-cols-3">
        {result.metrics.map((metric) => (
          <div key={metric.label} className="rounded-xl border border-line bg-page p-4">
            <dt className="text-xs font-bold uppercase text-ink-muted">{metric.label}</dt>
            <dd className="mt-2 text-2xl font-extrabold text-brand-700">{metric.value}</dd>
          </div>
        ))}
      </dl>

      <div>
        <h3 className="border-b border-line pb-2 text-sm font-extrabold uppercase text-brand-700">
          {result.premisesTitle}
        </h3>
        <div className="mt-3 overflow-x-auto rounded-xl border border-line">
          <table className="w-full min-w-[32rem] border-collapse text-left text-sm">
            <thead>
              <tr className="bg-brand-50 text-xs font-bold text-brand-700">
                <th scope="col" className="px-4 py-3">
                  Premissa
                </th>
                <th scope="col" className="px-4 py-3">
                  Valor considerado
                </th>
                <th scope="col" className="px-4 py-3">
                  Unidade
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line text-xs text-ink">
              {result.premises.map((premise) => (
                <tr key={premise.premise}>
                  <td className="px-4 py-3">{premise.premise}</td>
                  <td className="px-4 py-3">{premise.value}</td>
                  <td className="px-4 py-3 text-ink-muted">{premise.unit}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  )
}

export default KitResultPanel
