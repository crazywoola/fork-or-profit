import { ARCHETYPE_COLORS, PALETTE } from '../pixel/palette'

type PixelIconProps = {
  name: string
  size?: number
  color?: string
  className?: string
}

type IconDef = { paths: string; defaultColor: string }

const ICONS: Record<string, IconDef> = {
  // --- Phase icons ---
  'phase-event':    { paths: 'M8 1 L10 6 L8 5 L6 6Z M6 7 L10 7 L9 14 L7 14Z', defaultColor: PALETTE.accentGold },
  'phase-action':   { paths: 'M3 2 L13 2 L13 14 L3 14Z M5 4 L11 4 L11 6 L5 6Z M5 8 L11 8 L11 10 L5 10Z', defaultColor: PALETTE.engBlue },
  'phase-resolve':  { paths: 'M2 12 L2 6 L4 6 L4 12Z M6 12 L6 4 L8 4 L8 12Z M10 12 L10 2 L12 2 L12 12Z M1 13 L15 13 L15 15 L1 15Z', defaultColor: PALETTE.healthGreen },

  // --- Log type icons ---
  'log-event':      { paths: 'M8 1 L10 6 L8 5 L6 6Z M6 7 L10 7 L9 14 L7 14Z', defaultColor: PALETTE.accentGold },
  'log-action':     { paths: 'M3 3 L13 3 L13 13 L3 13Z M5 5 L8 5 L8 7 L5 7Z M5 9 L11 9 L11 11 L5 11Z', defaultColor: PALETTE.engBlue },
  'log-decision':   { paths: 'M4 2 L12 2 L14 8 L8 14 L2 8Z M7 6 L9 6 L9 8 L7 8Z M7 10 L9 10 L9 11 L7 11Z', defaultColor: PALETTE.growthPink },
  'log-system':     { paths: 'M6 2 L10 2 L10 4 L12 4 L12 8 L14 8 L14 12 L10 12 L10 14 L6 14 L6 12 L2 12 L2 8 L4 8 L4 4 L6 4Z M7 7 L9 7 L9 9 L7 9Z', defaultColor: PALETTE.textDim },

  // --- Stat icons ---
  'cash':           { paths: 'M5 3 L11 3 L13 5 L13 11 L11 13 L5 13 L3 11 L3 5Z M7 5 L9 5 L9 7 L10 7 L10 9 L9 9 L9 11 L7 11 L7 9 L6 9 L6 7 L7 7Z', defaultColor: PALETTE.cashGold },
  'revenue':        { paths: 'M2 13 L2 9 L5 9 L5 13Z M6 13 L6 6 L9 6 L9 13Z M10 13 L10 3 L13 3 L13 13Z M1 14 L15 14 L15 15 L1 15Z', defaultColor: PALETTE.orange },
  'community':      { paths: 'M5 3 L7 3 L7 5 L5 5Z M9 3 L11 3 L11 5 L9 5Z M3 7 L5 7 L5 9 L3 9Z M11 7 L13 7 L13 9 L11 9Z M7 9 L9 9 L9 11 L7 11Z M5 12 L11 12 L11 14 L5 14Z', defaultColor: PALETTE.communityTeal },
  'growth':         { paths: 'M2 12 L5 8 L8 10 L14 3 M14 3 L14 7 M14 3 L10 3', defaultColor: PALETTE.growthPink },
  'reputation':     { paths: 'M8 1 L10 6 L15 6 L11 9 L12 14 L8 11 L4 14 L5 9 L1 6 L6 6Z', defaultColor: PALETTE.accentGold },
  'control':        { paths: 'M7 2 L9 2 L9 4 L11 4 L11 6 L14 6 L14 8 L11 8 L11 10 L14 10 L14 12 L11 12 L9 12 L9 14 L7 14 L7 12 L5 12 L2 12 L2 10 L5 10 L5 8 L2 8 L2 6 L5 6 L5 4 L7 4Z M7 7 L9 7 L9 9 L7 9Z', defaultColor: PALETTE.engBlue },
  'dev_speed':      { paths: 'M3 5 L8 2 L13 5 L13 8 L8 11 L3 8Z M5 6 L8 4 L11 6 L11 7 L8 9 L5 7Z M7 12 L9 12 L9 14 L7 14Z', defaultColor: PALETTE.engBlue },
  'stability':      { paths: 'M4 12 L8 3 L12 12Z M7 10 L9 10 L9 12 L7 12Z M7 7 L9 7 L9 9 L7 9Z', defaultColor: PALETTE.healthGreen },
  'pressure':       { paths: 'M3 14 L3 4 L5 4 L5 14Z M4 3 L4 2 M7 14 L7 2 L9 2 L9 14Z M11 14 L11 6 L13 6 L13 14Z M2 15 L14 15', defaultColor: PALETTE.dangerRed },
  'trust':          { paths: 'M8 3 L12 6 L12 10 L8 14 L4 10 L4 6Z M7 7 L9 7 L9 8 L10 8 L10 10 L9 10 L9 11 L7 11 L7 10 L6 10 L6 8 L7 8Z', defaultColor: PALETTE.communityTeal },
  'risk':           { paths: 'M3 13 L8 2 L13 13Z M7 7 L9 7 L9 10 L7 10Z M7 11 L9 11 L9 13 L7 13Z', defaultColor: PALETTE.dangerRed },

  // --- Card category icons ---
  'cat-opensource':  { paths: 'M4 3 L6 3 L6 6 L10 6 L10 3 L12 3 L12 6 L14 6 L14 8 L12 8 L12 13 L4 13 L4 8 L2 8 L2 6 L4 6Z', defaultColor: '#73c64a' },
  'cat-monetize':    { paths: 'M5 3 L11 3 L13 5 L13 11 L11 13 L5 13 L3 11 L3 5Z M7 5 L9 5 L9 7 L10 7 L10 9 L9 9 L9 11 L7 11 L7 9 L6 9 L6 7 L7 7Z', defaultColor: '#f4b41b' },
  'cat-growth':      { paths: 'M2 12 L5 8 L8 10 L14 3 M14 3 L14 7 M14 3 L10 3', defaultColor: '#d77bba' },
  'cat-operations':  { paths: 'M6 2 L10 2 L10 4 L12 4 L12 8 L14 8 L14 12 L10 12 L10 14 L6 14 L6 12 L2 12 L2 8 L4 8 L4 4 L6 4Z M7 7 L9 7 L9 9 L7 9Z', defaultColor: '#597dce' },
  'cat-finance':     { paths: 'M2 4 L14 4 L14 6 L13 6 L13 12 L14 12 L14 14 L2 14 L2 12 L3 12 L3 6 L2 6Z M6 7 L8 7 L8 11 L6 11Z M10 8 L11 8 L11 10 L10 10Z', defaultColor: '#dad45e' },

  // --- Event category icons ---
  'evt-community':   { paths: 'M5 3 L7 3 L7 5 L5 5Z M9 3 L11 3 L11 5 L9 5Z M7 8 L9 8 L9 10 L7 10Z M4 11 L12 11 L12 14 L4 14Z', defaultColor: '#6dc2ca' },
  'evt-competition': { paths: 'M3 3 L7 3 L7 7 L3 7Z M9 3 L13 3 L13 7 L9 7Z M6 9 L10 9 L10 13 L6 13Z M7 3 L9 5 M9 3 L7 5', defaultColor: '#d04648' },
  'evt-ecosystem':   { paths: 'M7 2 L9 2 L9 5 L12 5 L12 7 L9 7 L9 10 L12 10 L12 12 L9 12 L9 14 L7 14 L7 12 L4 12 L4 10 L7 10 L7 7 L4 7 L4 5 L7 5Z', defaultColor: '#73c64a' },
  'evt-media':       { paths: 'M3 4 L13 4 L13 11 L3 11Z M5 6 L7 8 L5 10Z M8 6 L11 6 L11 10 L8 10Z M6 12 L10 12 L10 14 L6 14Z', defaultColor: '#d77bba' },
  'evt-tech':        { paths: 'M3 3 L13 3 L13 11 L3 11Z M5 5 L7 5 L7 6 L5 6Z M9 5 L11 5 L11 6 L9 6Z M5 8 L11 8 L11 9 L5 9Z M6 12 L10 12 L10 13 L6 13Z M7 13 L9 13 L9 14 L7 14Z', defaultColor: '#597dce' },
  'evt-market':      { paths: 'M2 13 L2 9 L5 9 L5 13Z M6 13 L6 5 L9 5 L9 13Z M10 13 L10 7 L13 7 L13 13Z M1 14 L14 14', defaultColor: '#f4b41b' },
  'evt-regulation':  { paths: 'M4 2 L12 2 L12 4 L9 4 L9 10 L12 10 L12 14 L4 14 L4 10 L7 10 L7 4 L4 4Z', defaultColor: '#d04648' },

  // --- AP gem ---
  'ap-gem':          { paths: 'M8 2 L13 8 L8 14 L3 8Z M8 4 L11 8 L8 12 L5 8Z', defaultColor: PALETTE.engBlue },

  // --- UI icons ---
  'lock':            { paths: 'M5 7 L5 5 C5 2 11 2 11 5 L11 7 L12 7 L12 14 L4 14 L4 7Z M6 7 L10 7 L10 5 C10 3 6 3 6 5Z M7 10 L9 10 L9 12 L7 12Z', defaultColor: PALETTE.dangerRed },
  'dice':            { paths: 'M2 2 L14 2 L14 14 L2 14Z M5 5 L6 5 L6 6 L5 6Z M10 5 L11 5 L11 6 L10 6Z M7 8 L9 8 L9 9 L7 9Z M5 10 L6 10 L6 11 L5 11Z M10 10 L11 10 L11 11 L10 11Z', defaultColor: PALETTE.text },
  'play':            { paths: 'M4 2 L13 8 L4 14Z', defaultColor: PALETTE.healthGreen },
  'close':           { paths: 'M3 3 L5 3 L8 6 L11 3 L13 3 L13 5 L10 8 L13 11 L13 13 L11 13 L8 10 L5 13 L3 13 L3 11 L6 8 L3 5Z', defaultColor: PALETTE.dangerRed },
  'arrow-left':      { paths: 'M10 2 L4 8 L10 14 L12 12 L8 8 L12 4Z', defaultColor: PALETTE.text },
  'arrow-right':     { paths: 'M6 2 L12 8 L6 14 L4 12 L8 8 L4 4Z', defaultColor: PALETTE.text },
  'star':            { paths: 'M8 1 L10 6 L15 6 L11 9 L12 14 L8 11 L4 14 L5 9 L1 6 L6 6Z', defaultColor: PALETTE.accentGold },
  'cursor':          { paths: 'M4 2 L12 8 L8 8 L10 14 L8 13 L6 8 L4 8Z', defaultColor: PALETTE.highlight },
}

export function PixelIcon({ name, size = 16, color, className }: PixelIconProps) {
  const icon = ICONS[name]
  if (!icon) return null

  const fill = color ?? icon.defaultColor

  return (
    <svg
      className={`px-icon ${className ?? ''}`}
      viewBox="0 0 16 16"
      width={size}
      height={size}
      shapeRendering="crispEdges"
      fill={fill}
      aria-hidden="true"
    >
      <path d={icon.paths} />
    </svg>
  )
}

// --- Card category to icon name mapping ---
const CARD_CAT_ICONS: Record<string, string> = {
  'Open Source': 'cat-opensource',
  'Monetization': 'cat-monetize',
  'Growth': 'cat-growth',
  'Operations': 'cat-operations',
  'Finance': 'cat-finance',
}

export function CardCategoryIcon({ category, size = 14 }: { category: string; size?: number }) {
  const name = CARD_CAT_ICONS[category]
  if (!name) return null
  return <PixelIcon name={name} size={size} />
}

// --- Event category to icon name mapping ---
const EVT_CAT_ICONS: Record<string, string> = {
  'Community': 'evt-community',
  'Competition': 'evt-competition',
  'Ecosystem': 'evt-ecosystem',
  'Media': 'evt-media',
  'Tech': 'evt-tech',
  'Market': 'evt-market',
  'Regulation': 'evt-regulation',
}

export function EventCategoryIcon({ category, size = 14 }: { category: string; size?: number }) {
  const name = EVT_CAT_ICONS[category]
  if (!name) return null
  return <PixelIcon name={name} size={size} />
}

// --- Pixel Portrait (extracted from SetupScreen) ---
export function PixelPortrait({ archetype, size = 64 }: { archetype: string; size?: number }) {
  const color = ARCHETYPE_COLORS[archetype] ?? PALETTE.textDim

  return (
    <div className="pixel-portrait" style={{ width: size, height: size }}>
      <svg viewBox="0 0 16 16" width={size} height={size} shapeRendering="crispEdges">
        <rect x="5" y="1" width="6" height="3" fill={color} />
        <rect x="4" y="2" width="8" height="4" fill={color} />
        <rect x="5" y="5" width="6" height="4" fill="#f4c89a" />
        <rect x="6" y="6" width="1" height="1" fill={PALETTE.black} />
        <rect x="9" y="6" width="1" height="1" fill={PALETTE.black} />
        <rect x="7" y="8" width="2" height="1" fill="#d4a574" />
        <rect x="4" y="9" width="8" height="4" fill={color} />
        <rect x="3" y="10" width="2" height="3" fill={color} />
        <rect x="11" y="10" width="2" height="3" fill={color} />
        <rect x="5" y="13" width="2" height="2" fill="#1a1c2c" />
        <rect x="9" y="13" width="2" height="2" fill="#1a1c2c" />
      </svg>
    </div>
  )
}

// --- Company Pixel Icons ---
const COMPANY_ICONS: Record<string, { paths: string; color: string }> = {
  redis:      { paths: 'M3 4 L13 4 L13 6 L3 6Z M3 7 L13 7 L13 9 L3 9Z M3 10 L13 10 L13 12 L3 12Z M5 5 L6 5 M5 8 L6 8 M5 11 L6 11', color: '#d04648' },
  mongodb:    { paths: 'M8 1 L10 5 L10 10 L8 15 L6 10 L6 5Z M7 6 L9 6 M7 8 L9 8 L9 12 L7 12Z', color: '#73c64a' },
  elastic:    { paths: 'M3 5 L7 3 L13 5 L13 7 L7 9 L3 7Z M3 8 L7 10 L13 8 L13 10 L7 12 L3 10Z', color: '#f4b41b' },
  hashicorp:  { paths: 'M4 3 L7 3 L7 7 L9 7 L9 3 L12 3 L12 13 L9 13 L9 9 L7 9 L7 13 L4 13Z', color: '#597dce' },
  gitlab:     { paths: 'M8 2 L10 6 L14 7 L8 14 L2 7 L6 6Z M6 7 L10 7', color: '#e8a027' },
  redhat:     { paths: 'M4 5 L12 5 L14 7 L14 9 L12 11 L4 11 L2 9 L2 7Z M6 7 L10 7 L10 9 L6 9Z', color: '#d04648' },
  docker:     { paths: 'M2 7 L5 7 L5 10 L2 10Z M6 7 L9 7 L9 10 L6 10Z M10 7 L13 7 L13 10 L10 10Z M6 4 L9 4 L9 6 L6 6Z M3 11 L14 11 L14 13 L3 13Z', color: '#597dce' },
  kubernetes: { paths: 'M8 2 L13 5 L13 11 L8 14 L3 11 L3 5Z M8 5 L8 11 M5 7 L11 9 M11 7 L5 9', color: '#597dce' },
  dify:       { paths: 'M8 1 L11 5 L14 7 L11 9 L13 14 L8 11 L3 14 L5 9 L2 7 L5 5Z', color: '#6dc2ca' },
}

export function CompanyPixelIcon({ templateId, size = 16 }: { templateId: string; size?: number }) {
  const icon = COMPANY_ICONS[templateId]
  if (!icon) {
    return (
      <svg className="px-icon" viewBox="0 0 16 16" width={size} height={size} shapeRendering="crispEdges" fill={PALETTE.textDim}>
        <rect x="3" y="3" width="10" height="10" />
        <rect x="5" y="6" width="6" height="1" fill={PALETTE.black} />
        <rect x="5" y="9" width="6" height="1" fill={PALETTE.black} />
      </svg>
    )
  }

  return (
    <svg className="px-icon" viewBox="0 0 16 16" width={size} height={size} shapeRendering="crispEdges" fill={icon.color}>
      <path d={icon.paths} />
    </svg>
  )
}
