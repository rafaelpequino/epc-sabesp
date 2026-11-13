type Tab = { id: string; label: string }

type TabsProps = {
  tabs: Tab[]
  activeTab: string
  onChange: (tabId: string) => void
  label: string
  className?: string
}

export function getTabId(tabId: string): string {
  return `tab-${tabId}`
}

export function getTabPanelId(tabId: string): string {
  return `tabpanel-${tabId}`
}

function Tabs({ tabs, activeTab, onChange, label, className = '' }: TabsProps) {
  return (
    <div role="tablist" aria-label={label} className={`flex gap-6 border-b border-line ${className}`}>
      {tabs.map((tab) => {
        const isActive = tab.id === activeTab

        return (
          <button
            key={tab.id}
            id={getTabId(tab.id)}
            type="button"
            role="tab"
            aria-selected={isActive}
            aria-controls={getTabPanelId(tab.id)}
            onClick={() => onChange(tab.id)}
            className={`-mb-px border-b-2 px-1 pb-3 text-sm font-bold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand ${
              isActive
                ? 'border-brand text-brand-700'
                : 'border-transparent text-ink-muted hover:text-brand-600'
            }`}
          >
            {tab.label}
          </button>
        )
      })}
    </div>
  )
}

export default Tabs
