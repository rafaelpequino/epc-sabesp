import type { SVGProps } from 'react'

const ICON_PATHS = {
  home: 'M3 11l9-8 9 8M5 10v10h5v-6h4v6h5V10',
  briefcase: 'M3 7h18v13H3zM9 7V4h6v3M3 13h18',
  search: 'M11 4a7 7 0 100 14 7 7 0 000-14zM21 21l-4.5-4.5',
  filePlus: 'M14 3H6v18h12V7zM14 3v4h4M12 11v6M9 14h6',
  inbox: 'M3 13l3-8h12l3 8v6H3zM3 13h5l1 3h6l1-3h5',
  tag: 'M3 12V3h9l9 9-9 9zM7.5 7.5h.01',
  users:
    'M9 11a3 3 0 100-6 3 3 0 000 6zM3 20c0-3.3 2.7-6 6-6s6 2.7 6 6M17 11a3 3 0 100-6M18 14c2.2.5 3.5 2.6 3.5 5',
  file: 'M14 3H6v18h12V7zM14 3v4h4',
  hexagon: 'M12 2l8.5 5v10L12 22l-8.5-5V7zM12 9a3 3 0 100 6 3 3 0 000-6z',
  logout: 'M9 4H4v16h5M16 8l4 4-4 4M20 12H9',
  menu: 'M4 6h16M4 12h16M4 18h16',
  waves: 'M3 7c3-3 6 3 9 0s6 3 9 0M3 12c3-3 6 3 9 0s6 3 9 0M3 17c3-3 6 3 9 0s6 3 9 0',
  road: 'M8 3L4 21M16 3l4 18M12 4v3M12 10.5v3M12 17v3',
  lock: 'M6 11h12v9H6zM8 11V8a4 4 0 018 0v3',
  filter: 'M3 5h18l-7 8v6l-4 2v-8z',
  close: 'M6 6l12 12M18 6L6 18',
  chevronRight: 'M9 6l6 6-6 6',
  chevronDown: 'M6 9l6 6 6-6',
  arrowRight: 'M5 12h14M13 6l6 6-6 6',
  database:
    'M4 6c0-1.7 3.6-3 8-3s8 1.3 8 3-3.6 3-8 3-8-1.3-8-3zM4 6v12c0 1.7 3.6 3 8 3s8-1.3 8-3V6M4 12c0 1.7 3.6 3 8 3s8-1.3 8-3',
  check: 'M5 12l5 5 9-10',
  plus: 'M12 5v14M5 12h14',
  upload: 'M12 16V4M7 9l5-5 5 5M4 20h16',
  copy: 'M9 9h11v11H9zM5 15H4V4h11v1',
  eye: 'M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12zM12 9a3 3 0 100 6 3 3 0 000-6z',
  pencil: 'M4 20l1-4L16 5l3 3L8 19zM14 7l3 3',
  trash: 'M4 7h16M9 7V4h6v3M6 7l1 13h10l1-13M10 11v6M14 11v6',
  calendar: 'M4 6h16v14H4zM4 10h16M8 3v4M16 3v4',
  download: 'M12 4v12M7 11l5 5 5-5M4 20h16',
  user: 'M12 12a4 4 0 100-8 4 4 0 000 8zM4 21c0-4.4 3.6-8 8-8s8 3.6 8 8',
  clock: 'M12 3a9 9 0 100 18 9 9 0 000-18zM12 7v5l3 2',
  target:
    'M12 3a9 9 0 100 18 9 9 0 000-18zM12 7a5 5 0 100 10 5 5 0 000-10zM12 11a1 1 0 100 2 1 1 0 000-2z',
} as const

export type IconName = keyof typeof ICON_PATHS

type IconProps = Omit<SVGProps<SVGSVGElement>, 'name'> & { name: IconName }

function Icon({ name, className = 'size-5', ...props }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
      {...props}
    >
      <path d={ICON_PATHS[name]} />
    </svg>
  )
}

export default Icon
