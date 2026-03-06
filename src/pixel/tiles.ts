import { PALETTE, ARCHETYPE_COLORS } from './palette'

export const TILE_SIZE = 32

export const TILE_IDS = {
  EMPTY: 0,
  FLOOR: 1,
  WALL_TOP: 2,
  WALL_SIDE: 3,
  DOOR: 4,
  DESK: 5,
  HALLWAY: 6,
  FLOOR_ALT: 7,
  WALL_CORNER_TL: 8,
  WALL_CORNER_TR: 9,
  WALL_BOTTOM: 10,
  MONITOR: 11,
  PLANT: 12,
  CHAIR: 13,
} as const

export type TileId = (typeof TILE_IDS)[keyof typeof TILE_IDS]

export type RoomDef = {
  id: string
  name: string
  archetype: string
  summary: string
  bonusHint: string
  x: number
  y: number
  w: number
  h: number
}

export const OFFICE_ROOMS: RoomDef[] = [
  { id: 'hq',        name: 'HQ',          archetype: 'executive',   summary: 'A leadership visit stabilizes reputation and boosts all strategy lines slightly.', bonusHint: '+REP, all cards +5%', x: 8,  y: 5,  w: 6, h: 5 },
  { id: 'eng',       name: 'Engineering', archetype: 'engineering', summary: 'Sharpen technical execution and soften tech crises.', bonusHint: 'Open Source/Operations +', x: 1,  y: 1,  w: 5, h: 4 },
  { id: 'product',   name: 'Product',     archetype: 'product',     summary: 'Convert roadmap clarity into stronger product and platform moves.', bonusHint: 'Growth/Monetization +', x: 16, y: 1,  w: 5, h: 4 },
  { id: 'growth',    name: 'Growth',      archetype: 'growth',      summary: 'Push launches, media spikes, and user momentum harder.', bonusHint: 'Growth +, media bias', x: 1,  y: 11, w: 5, h: 4 },
  { id: 'revenue',   name: 'Revenue',     archetype: 'revenue',     summary: 'Lean into enterprise capture and deal flow.', bonusHint: 'Monetization/Finance +', x: 16, y: 11, w: 5, h: 4 },
  { id: 'community', name: 'Community',   archetype: 'community',   summary: 'Strengthen trust, contributors, and ecosystem goodwill.', bonusHint: 'Community/TRUST, OSS +', x: 1,  y: 6,  w: 5, h: 4 },
  { id: 'finance',   name: 'Finance',     archetype: 'finance',     summary: 'Buy runway and prepare for regulators or investors.', bonusHint: '+Cash, Finance/Operations +', x: 16, y: 6,  w: 5, h: 4 },
  { id: 'platform',  name: 'Platform',    archetype: 'operations',  summary: 'Accelerate ecosystem flywheels and combo-heavy turns.', bonusHint: 'Synergy +, ecosystem bias', x: 8,  y: 12, w: 6, h: 4 },
]

export const MAP_WIDTH = 22
export const MAP_HEIGHT = 17

export function buildTileMap(): number[][] {
  const map: number[][] = Array.from({ length: MAP_HEIGHT }, () =>
    Array(MAP_WIDTH).fill(TILE_IDS.EMPTY)
  )

  for (const room of OFFICE_ROOMS) {
    for (let dy = 0; dy < room.h; dy++) {
      for (let dx = 0; dx < room.w; dx++) {
        const tx = room.x + dx
        const ty = room.y + dy

        if (dy === 0 && dx === 0) {
          map[ty][tx] = TILE_IDS.WALL_CORNER_TL
        } else if (dy === 0 && dx === room.w - 1) {
          map[ty][tx] = TILE_IDS.WALL_CORNER_TR
        } else if (dy === 0) {
          map[ty][tx] = TILE_IDS.WALL_TOP
        } else if (dy === room.h - 1) {
          map[ty][tx] = TILE_IDS.WALL_BOTTOM
        } else if (dx === 0 || dx === room.w - 1) {
          map[ty][tx] = TILE_IDS.WALL_SIDE
        } else {
          map[ty][tx] = ((dx + dy) % 2 === 0) ? TILE_IDS.FLOOR : TILE_IDS.FLOOR_ALT
        }
      }
    }

    const doorX = room.x + Math.floor(room.w / 2)
    const doorY = room.y + room.h - 1
    map[doorY][doorX] = TILE_IDS.DOOR

    if (room.w >= 4 && room.h >= 3) {
      map[room.y + 1][room.x + 1] = TILE_IDS.DESK
      map[room.y + 1][room.x + 2] = TILE_IDS.MONITOR
      if (room.w >= 5) {
        map[room.y + 1][room.x + room.w - 2] = TILE_IDS.PLANT
      }
    }
  }

  // hallways connecting rooms
  const hallwayTiles: [number, number][] = []

  // Vertical hallway left side
  for (let y = 5; y <= 11; y++) { hallwayTiles.push([0, y]) }
  // Vertical hallway right side
  for (let y = 5; y <= 11; y++) { hallwayTiles.push([21, y]) }
  // Horizontal hallway top
  for (let x = 6; x <= 15; x++) { hallwayTiles.push([x, 0]) }
  // Horizontal hallway bottom
  for (let x = 6; x <= 15; x++) { hallwayTiles.push([x, 16]) }

  // Central hallways connecting to HQ
  for (let x = 6; x <= 7; x++) {
    for (let y = 5; y <= 9; y++) hallwayTiles.push([x, y])
  }
  for (let x = 14; x <= 15; x++) {
    for (let y = 5; y <= 9; y++) hallwayTiles.push([x, y])
  }
  for (let x = 8; x <= 13; x++) {
    hallwayTiles.push([x, 10])
    hallwayTiles.push([x, 11])
  }

  for (const [hx, hy] of hallwayTiles) {
    if (hy >= 0 && hy < MAP_HEIGHT && hx >= 0 && hx < MAP_WIDTH && map[hy][hx] === TILE_IDS.EMPTY) {
      map[hy][hx] = TILE_IDS.HALLWAY
    }
  }

  return map
}

export function drawTile(
  ctx: CanvasRenderingContext2D,
  tileId: TileId,
  x: number,
  y: number,
  archetype?: string
) {
  const s = TILE_SIZE
  const p = s / 16 // pixel unit: scales all detail proportionally
  const accent = archetype ? (ARCHETYPE_COLORS[archetype] ?? PALETTE.textDim) : PALETTE.textDim

  switch (tileId) {
    case TILE_IDS.EMPTY:
      ctx.fillStyle = PALETTE.bg
      ctx.fillRect(x, y, s, s)
      break

    case TILE_IDS.FLOOR:
      ctx.fillStyle = '#2a2f4a'
      ctx.fillRect(x, y, s, s)
      ctx.fillStyle = '#313660'
      ctx.fillRect(x, y, s, p)
      ctx.fillRect(x, y, p, s)
      break

    case TILE_IDS.FLOOR_ALT:
      ctx.fillStyle = '#262b44'
      ctx.fillRect(x, y, s, s)
      ctx.fillStyle = '#2e3350'
      ctx.fillRect(x + s - p, y, p, s)
      ctx.fillRect(x, y + s - p, s, p)
      break

    case TILE_IDS.WALL_TOP: {
      ctx.fillStyle = accent
      ctx.fillRect(x, y, s, s)
      ctx.fillStyle = PALETTE.black
      ctx.fillRect(x, y + s - 2 * p, s, 2 * p)
      ctx.globalAlpha = 0.3
      ctx.fillStyle = '#fff'
      ctx.fillRect(x + 2 * p, y + 2 * p, s - 4 * p, 3 * p)
      ctx.globalAlpha = 1
      break
    }

    case TILE_IDS.WALL_CORNER_TL: {
      ctx.fillStyle = accent
      ctx.fillRect(x, y, s, s)
      ctx.fillStyle = PALETTE.black
      ctx.fillRect(x, y + s - 2 * p, s, 2 * p)
      ctx.fillRect(x, y, 2 * p, s)
      ctx.globalAlpha = 0.25
      ctx.fillStyle = '#fff'
      ctx.fillRect(x + 3 * p, y + 2 * p, 4 * p, 3 * p)
      ctx.globalAlpha = 1
      break
    }

    case TILE_IDS.WALL_CORNER_TR: {
      ctx.fillStyle = accent
      ctx.fillRect(x, y, s, s)
      ctx.fillStyle = PALETTE.black
      ctx.fillRect(x, y + s - 2 * p, s, 2 * p)
      ctx.fillRect(x + s - 2 * p, y, 2 * p, s)
      ctx.globalAlpha = 0.25
      ctx.fillStyle = '#fff'
      ctx.fillRect(x + 2 * p, y + 2 * p, 4 * p, 3 * p)
      ctx.globalAlpha = 1
      break
    }

    case TILE_IDS.WALL_SIDE: {
      ctx.fillStyle = '#1f2238'
      ctx.fillRect(x, y, s, s)
      ctx.fillStyle = accent
      ctx.globalAlpha = 0.35
      ctx.fillRect(x, y, s, s)
      ctx.globalAlpha = 1
      ctx.fillStyle = PALETTE.black
      ctx.fillRect(x, y, 2 * p, s)
      ctx.fillRect(x + s - 2 * p, y, 2 * p, s)
      break
    }

    case TILE_IDS.WALL_BOTTOM: {
      ctx.fillStyle = '#1a1d30'
      ctx.fillRect(x, y, s, s)
      ctx.fillStyle = accent
      ctx.globalAlpha = 0.2
      ctx.fillRect(x, y, s, s)
      ctx.globalAlpha = 1
      ctx.fillStyle = PALETTE.black
      ctx.fillRect(x, y, s, 2 * p)
      ctx.fillRect(x, y, 2 * p, s)
      ctx.fillRect(x + s - 2 * p, y, 2 * p, s)
      break
    }

    case TILE_IDS.DOOR: {
      ctx.fillStyle = '#2a2f4a'
      ctx.fillRect(x, y, s, s)
      ctx.fillStyle = PALETTE.accentGold
      ctx.fillRect(x + 4 * p, y, s - 8 * p, s)
      ctx.fillStyle = PALETTE.brown
      ctx.fillRect(x + 5 * p, y + p, s - 10 * p, s - 2 * p)
      ctx.fillStyle = PALETTE.highlight
      ctx.fillRect(x + s / 2 + p, y + s / 2, 2 * p, 2 * p)
      break
    }

    case TILE_IDS.HALLWAY: {
      ctx.fillStyle = '#1e2132'
      ctx.fillRect(x, y, s, s)
      ctx.fillStyle = '#252840'
      ctx.fillRect(x + 2 * p, y + 2 * p, s - 4 * p, s - 4 * p)
      break
    }

    case TILE_IDS.DESK: {
      ctx.fillStyle = '#2a2f4a'
      ctx.fillRect(x, y, s, s)
      ctx.fillStyle = PALETTE.brown
      ctx.fillRect(x + p, y + 4 * p, s - 2 * p, 6 * p)
      ctx.fillStyle = PALETTE.brownLight
      ctx.fillRect(x + 2 * p, y + 5 * p, s - 4 * p, 4 * p)
      ctx.fillStyle = PALETTE.black
      ctx.fillRect(x + 3 * p, y + 10 * p, 2 * p, 4 * p)
      ctx.fillRect(x + s - 5 * p, y + 10 * p, 2 * p, 4 * p)
      break
    }

    case TILE_IDS.MONITOR: {
      ctx.fillStyle = '#2a2f4a'
      ctx.fillRect(x, y, s, s)
      ctx.fillStyle = '#333c57'
      ctx.fillRect(x + 2 * p, y + 2 * p, s - 4 * p, 8 * p)
      ctx.fillStyle = '#597dce'
      ctx.fillRect(x + 3 * p, y + 3 * p, s - 6 * p, 6 * p)
      ctx.fillStyle = '#94b0c2'
      ctx.fillRect(x + 4 * p, y + 4 * p, 3 * p, p)
      ctx.fillRect(x + 4 * p, y + 6 * p, 5 * p, p)
      ctx.fillStyle = PALETTE.black
      ctx.fillRect(x + 6 * p, y + 10 * p, 4 * p, 2 * p)
      ctx.fillRect(x + 5 * p, y + 12 * p, 6 * p, 2 * p)
      break
    }

    case TILE_IDS.PLANT: {
      ctx.fillStyle = '#2a2f4a'
      ctx.fillRect(x, y, s, s)
      ctx.fillStyle = '#73c64a'
      ctx.fillRect(x + 4 * p, y + 2 * p, 3 * p, 3 * p)
      ctx.fillRect(x + 7 * p, y + 3 * p, 3 * p, 3 * p)
      ctx.fillRect(x + 3 * p, y + 5 * p, 4 * p, 2 * p)
      ctx.fillStyle = '#5d8c3a'
      ctx.fillRect(x + 5 * p, y + 4 * p, 2 * p, 2 * p)
      ctx.fillStyle = PALETTE.brown
      ctx.fillRect(x + 5 * p, y + 8 * p, 4 * p, 6 * p)
      ctx.fillStyle = PALETTE.brownLight
      ctx.fillRect(x + 4 * p, y + 12 * p, 6 * p, 3 * p)
      break
    }

    case TILE_IDS.CHAIR: {
      ctx.fillStyle = '#2a2f4a'
      ctx.fillRect(x, y, s, s)
      ctx.fillStyle = '#566c86'
      ctx.fillRect(x + 4 * p, y + 3 * p, 8 * p, 6 * p)
      ctx.fillStyle = '#333c57'
      ctx.fillRect(x + 5 * p, y + 9 * p, 6 * p, 4 * p)
      break
    }
  }
}

export function getRoomAtTile(tx: number, ty: number): RoomDef | null {
  for (const room of OFFICE_ROOMS) {
    if (tx >= room.x && tx < room.x + room.w && ty >= room.y && ty < room.y + room.h) {
      return room
    }
  }
  return null
}
