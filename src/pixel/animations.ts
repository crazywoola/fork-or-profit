export type AnimatedSprite = {
  id: string
  archetype: string
  tileX: number
  tileY: number
  frame: number
  frameTimer: number
  direction: 'left' | 'right'
  wanderTimer: number
  targetX: number
  targetY: number
  moving: boolean
}

export function createOfficeNPCs(
  roomId: string,
  archetype: string,
  roomX: number,
  roomY: number,
  roomW: number,
  roomH: number,
  count: number
): AnimatedSprite[] {
  const npcs: AnimatedSprite[] = []
  const innerX = roomX + 1
  const innerY = roomY + 1
  const innerW = roomW - 2
  const innerH = roomH - 2

  for (let i = 0; i < Math.min(count, 6); i++) {
    const tx = innerX + 1 + (i % Math.max(1, innerW - 1))
    const ty = innerY + 1 + Math.floor(i / Math.max(1, innerW - 1))
    npcs.push({
      id: `${roomId}-npc-${i}`,
      archetype,
      tileX: tx,
      tileY: Math.min(ty, innerY + innerH - 1),
      frame: 0,
      frameTimer: Math.random() * 2,
      direction: Math.random() > 0.5 ? 'right' : 'left',
      wanderTimer: 1 + Math.random() * 3,
      targetX: tx,
      targetY: Math.min(ty, innerY + innerH - 1),
      moving: false,
    })
  }
  return npcs
}

export function updateNPC(npc: AnimatedSprite, dt: number, roomX: number, roomY: number, roomW: number, roomH: number) {
  npc.frameTimer += dt
  if (npc.frameTimer > 0.25) {
    npc.frameTimer = 0
    if (npc.moving) {
      npc.frame = (npc.frame + 1) % 4
    } else {
      npc.frame = 0
    }
  }

  npc.wanderTimer -= dt
  if (npc.wanderTimer <= 0) {
    npc.wanderTimer = 2 + Math.random() * 4
    const innerX = roomX + 2
    const innerY = roomY + 2
    const innerW = roomW - 3
    const innerH = roomH - 3
    npc.targetX = innerX + Math.floor(Math.random() * Math.max(1, innerW))
    npc.targetY = innerY + Math.floor(Math.random() * Math.max(1, innerH))
    npc.moving = true
  }

  if (npc.moving) {
    const dx = npc.targetX - npc.tileX
    const dy = npc.targetY - npc.tileY
    if (Math.abs(dx) < 0.05 && Math.abs(dy) < 0.05) {
      npc.tileX = npc.targetX
      npc.tileY = npc.targetY
      npc.moving = false
      npc.frame = 0
    } else {
      const speed = 1.5 * dt
      if (Math.abs(dx) > 0.05) {
        npc.tileX += Math.sign(dx) * Math.min(speed, Math.abs(dx))
        npc.direction = dx > 0 ? 'right' : 'left'
      }
      if (Math.abs(dy) > 0.05) {
        npc.tileY += Math.sign(dy) * Math.min(speed, Math.abs(dy))
      }
    }
  }
}
