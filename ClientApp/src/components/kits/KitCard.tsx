import { Link } from 'react-router-dom'
import Icon from '../common/Icon'
import { IconBadge } from '../dashboard/Panel'
import { KIT_FILTER_GROUPS, type DrcKit } from '../../services/kitsService'

const TAG_LABELS = Object.fromEntries(
  KIT_FILTER_GROUPS.flatMap((group) => group.options).map((option) => [option.id, option.label]),
)

function KitTags({ tags }: { tags: DrcKit['tags'] }) {
  return (
    <ul className="mt-4 flex flex-wrap gap-1.5">
      {tags.map((tag) => (
        <li key={tag} className="rounded-full bg-brand-50 px-2.5 py-0.5 text-xs font-semibold text-brand-700">
          {TAG_LABELS[tag]}
        </li>
      ))}
    </ul>
  )
}

function KitCard({ kit }: { kit: DrcKit }) {
  const isAvailable = kit.status === 'available'

  return (
    <article className="flex flex-col overflow-hidden rounded-2xl border border-line bg-white shadow-sm">
      <div className={`h-1 ${isAvailable ? 'bg-brand' : 'bg-accent-yellow'}`} aria-hidden="true" />

      <div className="flex-1 p-5">
        {isAvailable ? (
          <IconBadge icon={kit.icon} className="size-14 rounded-full" />
        ) : (
          <span className="grid size-14 place-items-center rounded-full bg-accent-yellow/20 text-accent-yellow">
            <Icon name={kit.icon} className="size-7" />
          </span>
        )}

        <h2 className={`mt-4 text-lg font-bold ${isAvailable ? 'text-ink' : 'text-ink-muted'}`}>{kit.title}</h2>
        <p className={`mt-2 text-sm ${isAvailable ? 'text-ink-muted' : 'text-ink-muted/70'}`}>{kit.description}</p>
        <KitTags tags={kit.tags} />
      </div>

      {isAvailable ? (
        <Link
          to={kit.to}
          className="flex items-center justify-between gap-3 border-t border-line bg-brand-50 px-5 py-3.5 text-sm font-semibold text-brand-600 transition-colors hover:bg-brand-100"
        >
          Acessar KIT
          <Icon name="arrowRight" className="size-4" />
        </Link>
      ) : (
        <div className="flex items-center justify-between gap-3 border-t border-line bg-page px-5 py-3.5 text-sm font-semibold text-ink-muted">
          Em breve
          <Icon name="lock" className="size-4" />
        </div>
      )}
    </article>
  )
}

export default KitCard
