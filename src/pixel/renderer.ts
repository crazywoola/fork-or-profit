import { PALETTE, ARCHETYPE_COLORS } from './palette'
import {
  TILE_SIZE, MAP_WIDTH, MAP_HEIGHT,
  buildTileMap, drawTile, OFFICE_ROOMS, getRoomAtTile,
  type RoomDef,
} from './tiles'
import {
  ARCHETYPE_SPRITES, drawSprite,
} from './sprites'
import {
  type AnimatedSprite,
  createOfficeNPCs,
  updateNPC,
} from './animations'

export type OfficeRenderer = {
  canvas: HTMLCanvasElement
  destroy: () => void
  setActiveRoom: (id: string) => void
  setHighlightRoom: (id: string) => void
  onRoomClick: (cb: (roomId: string) => void) => void
}

const SPRITE_SCALE = 2

export function createOfficeRenderer(canvas: HTMLCanvasElement): OfficeRenderer {
  const ctx = canvas.getContext('2d')!
  ctx.imageSmoothingEnabled = false

  const offscreen = document.createElement('canvas')
  const offCtx = offscreen.getContext('2d')!
  offCtx.imageSmoothingEnabled = false

  const logicalW = MAP_WIDTH * TILE_SIZE
  const logicalH = MAP_HEIGHT * TILE_SIZE
  offscreen.width = logicalW
  offscreen.height = logicalH

  const tileMap = buildTileMap()

  let activeRoom = 'hq'
  let highlightRoom = ''
  let clickCallback: ((roomId: string) => void) | null = null
  let destroyed = false

  const npcs: AnimatedSprite[] = []
  for (const room of OFFICE_ROOMS) {
    const count = room.id === 'hq' ? 4 : 2 + Math.floor(Math.random() * 3)
    npcs.push(...createOfficeNPCs(room.id, room.archetype, room.x, room.y, room.w, room.h, count))
  }

  let lastTime = performance.now()
  let animFrame = 0

  function resize() {
    const dpr = window.devicePixelRatio || 1
    const w = canvas.clientWidth
    const h = canvas.clientHeight
    canvas.width = Math.floor(w * dpr)
    canvas.height = Math.floor(h * dpr)
  }

  function drawRoomLabel(room: RoomDef, isActive: boolean, isHighlight: boolean) {
    const cx = (room.x + room.w / 2) * TILE_SIZE
    const cy = room.y * TILE_SIZE - 4

    offCtx.font = 'bold 14px monospace'
    offCtx.textAlign = 'center'
    offCtx.textBaseline = 'bottom'

    const label = room.name
    const tw = offCtx.measureText(label).width + 12

    if (isHighlight) {
      offCtx.fillStyle = PALETTE.dangerRed
    } else if (isActive) {
      offCtx.fillStyle = PALETTE.accentGold
    } else {
      offCtx.fillStyle = PALETTE.panelBg
    }

    const lx = Math.floor(cx - tw / 2)
    const ly = cy - 17
    offCtx.fillRect(lx, ly, tw, 20)

    offCtx.strokeStyle = isActive ? PALETTE.highlight : isHighlight ? PALETTE.dangerRed : PALETTE.textMuted
    offCtx.lineWidth = 1
    offCtx.strokeRect(lx, ly, tw, 20)

    offCtx.fillStyle = isActive || isHighlight ? PALETTE.black : PALETTE.text
    offCtx.fillText(label, cx, cy)
  }

  function render() {
    if (destroyed) return

    const now = performance.now()
    const dt = Math.min((now - lastTime) / 1000, 0.1)
    lastTime = now

    offCtx.fillStyle = PALETTE.bg
    offCtx.fillRect(0, 0, logicalW, logicalH)

    for (let ty = 0; ty < MAP_HEIGHT; ty++) {
      for (let tx = 0; tx < MAP_WIDTH; tx++) {
        const tileId = tileMap[ty][tx] as any
        const room = getRoomAtTile(tx, ty)
        drawTile(offCtx, tileId, tx * TILE_SIZE, ty * TILE_SIZE, room?.archetype)
      }
    }

    for (const room of OFFICE_ROOMS) {
      const isActive = room.id === activeRoom
      const isHighlight = room.id === highlightRoom

      if (isHighlight) {
        const pulse = Math.sin(now / 200) * 0.15 + 0.2
        offCtx.fillStyle = PALETTE.dangerRed
        offCtx.globalAlpha = pulse
        offCtx.fillRect(room.x * TILE_SIZE, room.y * TILE_SIZE, room.w * TILE_SIZE, room.h * TILE_SIZE)
        offCtx.globalAlpha = 1
      }

      if (isActive) {
        offCtx.strokeStyle = PALETTE.highlight
        offCtx.lineWidth = 3
        offCtx.strokeRect(
          room.x * TILE_SIZE + 2,
          room.y * TILE_SIZE + 2,
          room.w * TILE_SIZE - 4,
          room.h * TILE_SIZE - 4
        )
      }

      drawRoomLabel(room, isActive, isHighlight)
    }

    for (const npc of npcs) {
      const room = OFFICE_ROOMS.find(r => npc.id.startsWith(r.id))
      if (room) {
        updateNPC(npc, dt, room.x, room.y, room.w, room.h)
      }
      const spriteSheet = ARCHETYPE_SPRITES[npc.archetype] ?? ARCHETYPE_SPRITES.engineering
      const frame = spriteSheet.frames[npc.frame % spriteSheet.frames.length]
      const px = npc.tileX * TILE_SIZE + TILE_SIZE * 0.25
      const py = npc.tileY * TILE_SIZE - SPRITE_SCALE
      drawSprite(offCtx, frame, px, py, SPRITE_SCALE)
    }

    ctx.fillStyle = PALETTE.bg
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    ctx.imageSmoothingEnabled = false

    const srcRatio = logicalW / logicalH
    const dstRatio = canvas.width / canvas.height
    let dw: number, dh: number, dx: number, dy: number
    if (dstRatio > srcRatio) {
      dh = canvas.height
      dw = Math.floor(dh * srcRatio)
      dx = Math.floor((canvas.width - dw) / 2)
      dy = 0
    } else {
      dw = canvas.width
      dh = Math.floor(dw / srcRatio)
      dx = 0
      dy = Math.floor((canvas.height - dh) / 2)
    }
    ctx.drawImage(offscreen, 0, 0, logicalW, logicalH, dx, dy, dw, dh)

    animFrame = requestAnimationFrame(render)
  }

  function canvasToLogical(clientX: number, clientY: number): [number, number] | null {
    const rect = canvas.getBoundingClientRect()
    const dpr = window.devicePixelRatio || 1
    const cw = rect.width * dpr
    const ch = rect.height * dpr

    const srcRatio = logicalW / logicalH
    const dstRatio = cw / ch
    let dw: number, dh: number, dx: number, dy: number
    if (dstRatio > srcRatio) {
      dh = ch
      dw = Math.floor(dh * srcRatio)
      dx = Math.floor((cw - dw) / 2)
      dy = 0
    } else {
      dw = cw
      dh = Math.floor(dw / srcRatio)
      dx = 0
      dy = Math.floor((ch - dh) / 2)
    }

    const px = (clientX - rect.left) * dpr - dx
    const py = (clientY - rect.top) * dpr - dy
    if (px < 0 || py < 0 || px > dw || py > dh) return null
    return [(px / dw) * logicalW, (py / dh) * logicalH]
  }

  function handleClick(e: MouseEvent) {
    const pos = canvasToLogical(e.clientX, e.clientY)
    if (!pos) return
    const tx = Math.floor(pos[0] / TILE_SIZE)
    const ty = Math.floor(pos[1] / TILE_SIZE)
    const room = getRoomAtTile(tx, ty)
    if (room && clickCallback) {
      clickCallback(room.id)
    }
  }

  const resizeObs = new ResizeObserver(() => resize())
  resizeObs.observe(canvas)
  resize()

  canvas.addEventListener('click', handleClick)
  animFrame = requestAnimationFrame(render)

  return {
    canvas,
    destroy() {
      destroyed = true
      cancelAnimationFrame(animFrame)
      resizeObs.disconnect()
      canvas.removeEventListener('click', handleClick)
    },
    setActiveRoom(id: string) { activeRoom = id },
    setHighlightRoom(id: string) { highlightRoom = id },
    onRoomClick(cb) { clickCallback = cb },
  }
}
