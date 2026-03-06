import { PixelIcon } from './PixelIcon'
import { getArchetypeLabel, getFactionLabel } from '../i18n/content'
import { useI18n } from '../i18n'
import type { RoomDef } from '../pixel/tiles'

type Props = {
  rooms: RoomDef[]
  activeRoomId: string
  pendingThreats: string[]
  factionReputation: Record<string, number>
  onHoverRoom: (roomId: string) => void
  onChooseRoom: (roomId: string) => void
}

const ROOM_CALLOUTS: Record<string, { immediate: string; emphasis: string; future: string; faction: string }> = {
  hq: {
    immediate: 'Immediate bonus: reputation +1',
    emphasis: 'All card categories gain a small tactical edge this round.',
    future: 'Future tilt: leadership, partnership, and acquisition beats show up more often.',
    faction: 'Favored faction: investors',
  },
  eng: {
    immediate: 'Immediate bonus: stability +1',
    emphasis: 'Best for Open Source and Operations turns.',
    future: 'Future tilt: fewer tech meltdowns, more infrastructure/ecosystem opportunities.',
    faction: 'Favored faction: ecosystem',
  },
  product: {
    immediate: 'Immediate bonus: growth +1',
    emphasis: 'Best for Growth and Monetization route-setting.',
    future: 'Future tilt: platform shifts, integrations, and competitive pivots.',
    faction: 'Favored faction: enterprise',
  },
  growth: {
    immediate: 'Immediate bonus: growth +1, reputation +1',
    emphasis: 'Best for launch spikes, PR, and momentum conversion.',
    future: 'Future tilt: media beats and user surges arrive more often.',
    faction: 'Favored faction: community and enterprise',
  },
  revenue: {
    immediate: 'Immediate bonus: revenue +1',
    emphasis: 'Best for Monetization and Finance turns.',
    future: 'Future tilt: enterprise contracts and partner routes get stronger.',
    faction: 'Favored faction: enterprise',
  },
  community: {
    immediate: 'Immediate bonus: community +1, trust +1',
    emphasis: 'Best for Open Source snowball and social resilience.',
    future: 'Future tilt: contributor boons, migration waves, and community drama.',
    faction: 'Favored faction: community',
  },
  finance: {
    immediate: 'Immediate bonus: cash +2',
    emphasis: 'Best for runway stabilization and finance-heavy turns.',
    future: 'Future tilt: investor, regulatory, and acquisition pressure changes.',
    faction: 'Favored faction: investors and regulators',
  },
  platform: {
    immediate: 'Immediate bonus: dev speed +1, growth +1',
    emphasis: 'Best for synergy turns and ecosystem scaling.',
    future: 'Future tilt: ecosystem explosion, standardization, and integration arcs.',
    faction: 'Favored faction: ecosystem',
  },
}

export function PlanningPanel({
  rooms,
  activeRoomId,
  pendingThreats,
  factionReputation,
  onHoverRoom,
  onChooseRoom,
}: Props) {
  const { messages } = useI18n()
  const selectedRoom = rooms.find(room => room.id === activeRoomId) ?? rooms[0]
  const callout = ROOM_CALLOUTS[selectedRoom.id]

  return (
    <div className="planning-panel">
      <div className="planning-header">
        <div className="planning-header-copy">
          <span className="planning-kicker">{messages.planning.kicker}</span>
          <h3>{messages.planning.title}</h3>
          <p>{messages.planning.description}</p>
        </div>
        <div className="planning-threat-box">
          <span className="planning-side-label">{messages.planning.incomingPressure}</span>
          {pendingThreats.length > 0 ? (
            pendingThreats.slice(0, 3).map((threat, idx) => (
              <span key={idx} className="planning-threat-chip">{threat}</span>
            ))
          ) : (
            <span className="planning-threat-chip safe">{messages.planning.noThreat}</span>
          )}
        </div>
      </div>

      <div className="planning-layout">
        <div className="planning-room-grid">
          {rooms.map(room => (
            <button
              key={room.id}
              className={`planning-room-card ${room.id === activeRoomId ? 'active' : ''}`}
              onMouseEnter={() => onHoverRoom(room.id)}
              onFocus={() => onHoverRoom(room.id)}
              onClick={() => onChooseRoom(room.id)}
            >
              <div className="planning-room-card-head">
                <span className="planning-room-name">{room.name}</span>
                <span className="planning-room-type">{getArchetypeLabel(room.archetype)}</span>
              </div>
              <p className="planning-room-summary">{room.summary}</p>
              <div className="planning-room-foot">
                <span className="planning-room-bonus">{room.bonusHint}</span>
                <span className="planning-room-cta">
                  <PixelIcon name="cursor" size={10} />
                  {messages.planning.commitVisit}
                </span>
              </div>
            </button>
          ))}
        </div>

        <div className="planning-preview-card">
          <div className="planning-preview-head">
            <span className="planning-kicker">{messages.planning.selectedRoom}</span>
            <h4>{selectedRoom.name}</h4>
            <p>{selectedRoom.summary}</p>
          </div>

          <div className="planning-preview-block">
            <span className="planning-side-label">{messages.planning.immediateImpact}</span>
            <p>{callout.immediate}</p>
          </div>

          <div className="planning-preview-block">
            <span className="planning-side-label">{messages.planning.strategicEmphasis}</span>
            <p>{callout.emphasis}</p>
            <p className="planning-subtle">{selectedRoom.bonusHint}</p>
          </div>

          <div className="planning-preview-block">
            <span className="planning-side-label">{messages.planning.futureWeighting}</span>
            <p>{callout.future}</p>
          </div>

          <div className="planning-preview-block">
            <span className="planning-side-label">{messages.planning.factionPressure}</span>
            <div className="planning-faction-grid">
              {Object.entries(factionReputation).map(([key, value]) => (
                <span key={key} className="planning-faction-chip">{getFactionLabel(key)}: {value}/10</span>
              ))}
            </div>
            <p className="planning-subtle">{callout.faction}</p>
          </div>

          <button className="pixel-btn primary planning-commit-btn" onClick={() => onChooseRoom(selectedRoom.id)}>
            {messages.planning.enterRoom(selectedRoom.name)}
          </button>
        </div>
      </div>
    </div>
  )
}
