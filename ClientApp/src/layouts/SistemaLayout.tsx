import { useEffect, useState } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import Header from '../components/layout/Header'
import Sidebar from '../components/layout/Sidebar'

const SIDEBAR_ID = 'sidebar'

function SistemaLayout() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { pathname } = useLocation()

  useEffect(() => {
    setIsMenuOpen(false)
  }, [pathname])

  useEffect(() => {
    if (!isMenuOpen) return

    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setIsMenuOpen(false)
    }

    window.addEventListener('keydown', closeOnEscape)
    return () => window.removeEventListener('keydown', closeOnEscape)
  }, [isMenuOpen])

  return (
    <div className="fixed inset-0 flex flex-col bg-page">
      <Header
        isMenuOpen={isMenuOpen}
        onMenuToggle={() => setIsMenuOpen((open) => !open)}
        menuControlsId={SIDEBAR_ID}
      />
      <div className="flex min-h-0 flex-1">
        <Sidebar id={SIDEBAR_ID} isOpen={isMenuOpen} />
        <div
          className={`fixed bottom-0 left-0 right-0 top-14 z-30 bg-ink/40 transition-opacity duration-300 ease-out motion-reduce:transition-none lg:hidden ${
            isMenuOpen ? 'opacity-100' : 'pointer-events-none opacity-0'
          }`}
          onClick={() => setIsMenuOpen(false)}
          aria-hidden="true"
        />
        <main className="min-w-0 flex-1 overflow-y-auto px-4 py-5 sm:px-7 sm:py-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default SistemaLayout
