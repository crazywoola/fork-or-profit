import { ARCHETYPE_COLORS, PALETTE } from './palette'

export type SpriteFrame = string[][]

export type SpriteSheet = {
  width: number
  height: number
  frames: SpriteFrame[]
}

const T = '' // transparent

function makeCharSprite(skin: string, hair: string, shirt: string): SpriteSheet {
  const S = skin
  const H = hair
  const C = shirt
  const E = PALETTE.black
  const W = PALETTE.white

  const stand: SpriteFrame = [
    [T, T, H, H, H, T, T, T],
    [T, H, H, H, H, H, T, T],
    [T, H, E, S, E, H, T, T],
    [T, S, S, S, S, S, T, T],
    [T, T, C, C, C, T, T, T],
    [T, C, C, C, C, C, T, T],
    [T, C, C, C, C, C, T, T],
    [T, T, C, T, C, T, T, T],
    [T, T, S, T, S, T, T, T],
    [T, S, S, T, S, S, T, T],
  ]

  const walk1: SpriteFrame = [
    [T, T, H, H, H, T, T, T],
    [T, H, H, H, H, H, T, T],
    [T, H, E, S, E, H, T, T],
    [T, S, S, S, S, S, T, T],
    [T, T, C, C, C, T, T, T],
    [T, C, C, C, C, C, T, T],
    [T, C, C, C, C, C, T, T],
    [T, S, C, T, C, T, T, T],
    [T, T, S, T, T, S, T, T],
    [T, T, T, T, S, S, T, T],
  ]

  const walk2: SpriteFrame = [
    [T, T, H, H, H, T, T, T],
    [T, H, H, H, H, H, T, T],
    [T, H, E, S, E, H, T, T],
    [T, S, S, S, S, S, T, T],
    [T, T, C, C, C, T, T, T],
    [T, C, C, C, C, C, T, T],
    [T, C, C, C, C, C, T, T],
    [T, T, C, T, C, S, T, T],
    [T, S, T, T, S, T, T, T],
    [T, S, S, T, T, T, T, T],
  ]

  return { width: 8, height: 10, frames: [stand, walk1, stand, walk2] }
}

const SKIN = '#f4c89a'
const SKIN2 = '#d4a574'

export const ARCHETYPE_SPRITES: Record<string, SpriteSheet> = {
  executive: makeCharSprite(SKIN, '#3e2a1d', '#1a1c2c'),
  engineering: makeCharSprite(SKIN, '#333c57', '#597dce'),
  product: makeCharSprite(SKIN2, '#5d3b2e', '#73c64a'),
  growth: makeCharSprite(SKIN, '#d04648', '#d77bba'),
  revenue: makeCharSprite(SKIN2, '#1a1c2c', '#e8a027'),
  community: makeCharSprite(SKIN, '#597dce', '#6dc2ca'),
  finance: makeCharSprite(SKIN, '#dad45e', '#333c57'),
  operations: makeCharSprite(SKIN2, '#94b0c2', '#566c86'),
  risk: makeCharSprite(SKIN, '#d04648', '#d04648'),
  people: makeCharSprite(SKIN2, '#73c64a', '#73c64a'),
  data: makeCharSprite(SKIN, '#597dce', '#333c57'),
  support: makeCharSprite(SKIN2, '#6dc2ca', '#6dc2ca'),
  design: makeCharSprite(SKIN, '#d77bba', '#d77bba'),
}

export function makeNPCPortrait(archetype: string): SpriteFrame {
  const color = ARCHETYPE_COLORS[archetype] ?? PALETTE.textDim
  const S = SKIN
  const H = color
  const E = PALETTE.black
  const W = PALETTE.white
  const C = color

  return [
    [T, T, T, T, H, H, H, H, H, H, T, T, T, T, T, T],
    [T, T, T, H, H, H, H, H, H, H, H, T, T, T, T, T],
    [T, T, H, H, H, H, H, H, H, H, H, H, T, T, T, T],
    [T, T, H, H, H, H, H, H, H, H, H, H, T, T, T, T],
    [T, T, H, S, S, S, S, S, S, S, S, H, T, T, T, T],
    [T, T, S, S, E, W, S, S, E, W, S, S, T, T, T, T],
    [T, T, S, S, E, E, S, S, E, E, S, S, T, T, T, T],
    [T, T, S, S, S, S, S, S, S, S, S, S, T, T, T, T],
    [T, T, S, S, S, S, E, E, S, S, S, S, T, T, T, T],
    [T, T, T, S, S, S, S, S, S, S, S, T, T, T, T, T],
    [T, T, T, T, S, S, S, S, S, S, T, T, T, T, T, T],
    [T, T, T, C, C, C, C, C, C, C, C, T, T, T, T, T],
    [T, T, C, C, C, C, C, C, C, C, C, C, T, T, T, T],
    [T, C, C, C, C, C, C, C, C, C, C, C, C, T, T, T],
    [T, C, C, C, C, C, C, C, C, C, C, C, C, T, T, T],
    [T, T, C, C, C, T, T, T, T, C, C, C, T, T, T, T],
  ]
}

export function drawSprite(
  ctx: CanvasRenderingContext2D,
  frame: SpriteFrame,
  x: number,
  y: number,
  scale: number = 1
) {
  for (let row = 0; row < frame.length; row++) {
    for (let col = 0; col < frame[row].length; col++) {
      const color = frame[row][col]
      if (color === '') continue
      ctx.fillStyle = color
      ctx.fillRect(
        Math.floor(x + col * scale),
        Math.floor(y + row * scale),
        Math.ceil(scale),
        Math.ceil(scale)
      )
    }
  }
}
