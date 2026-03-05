import { ARCHETYPE_COLORS, PALETTE } from '../pixel/palette'
import { OFFICE_ROOMS, MAP_WIDTH, MAP_HEIGHT } from '../pixel/tiles'

type Props = {
  activeRoomId: string
  highlightRoomId: string
}

export function MiniMap({ activeRoomId, highlightRoomId }: Props) {
  const scale = 6

  return (
    <div className="minimap">
      <svg
        viewBox={`0 0 ${MAP_WIDTH * scale} ${MAP_HEIGHT * scale}`}
        width={MAP_WIDTH * scale}
        height={MAP_HEIGHT * scale}
      >
        <rect width={MAP_WIDTH * scale} height={MAP_HEIGHT * scale} fill={PALETTE.bg} />

        {OFFICE_ROOMS.map(room => {
          const color = ARCHETYPE_COLORS[room.archetype] ?? PALETTE.textDim
          const isActive = room.id === activeRoomId
          const isHighlight = room.id === highlightRoomId

          return (
            <g key={room.id}>
              <rect
                x={room.x * scale}
                y={room.y * scale}
                width={room.w * scale}
                height={room.h * scale}
                fill={isHighlight ? PALETTE.dangerRed : color}
                opacity={isActive ? 1 : 0.5}
                stroke={isActive ? PALETTE.highlight : 'none'}
                strokeWidth={isActive ? 2 : 0}
              />
            </g>
          )
        })}
      </svg>
    </div>
  )
}
