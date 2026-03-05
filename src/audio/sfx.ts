let audioCtx: AudioContext | null = null
let muted = false

function getCtx(): AudioContext {
  if (!audioCtx) audioCtx = new AudioContext()
  return audioCtx
}

export function setMuted(m: boolean) { muted = m }
export function isMuted() { return muted }

function playTone(freq: number, duration: number, type: OscillatorType = 'square', volume = 0.08) {
  if (muted) return
  const ctx = getCtx()
  const osc = ctx.createOscillator()
  const gain = ctx.createGain()
  osc.type = type
  osc.frequency.setValueAtTime(freq, ctx.currentTime)
  gain.gain.setValueAtTime(volume, ctx.currentTime)
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration)
  osc.connect(gain)
  gain.connect(ctx.destination)
  osc.start()
  osc.stop(ctx.currentTime + duration)
}

function playNotes(notes: Array<[number, number]>, type: OscillatorType = 'square', volume = 0.06) {
  if (muted) return
  const ctx = getCtx()
  let t = ctx.currentTime
  for (const [freq, dur] of notes) {
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.type = type
    osc.frequency.setValueAtTime(freq, t)
    gain.gain.setValueAtTime(volume, t)
    gain.gain.exponentialRampToValueAtTime(0.001, t + dur * 0.9)
    osc.connect(gain)
    gain.connect(ctx.destination)
    osc.start(t)
    osc.stop(t + dur)
    t += dur
  }
}

export function sfxCardPlay() {
  playNotes([[523, 0.06], [659, 0.06], [784, 0.08]], 'square', 0.05)
}

export function sfxEventAlert() {
  playNotes([[440, 0.1], [554, 0.1], [440, 0.12]], 'triangle', 0.07)
}

export function sfxStatUp() {
  playNotes([[392, 0.05], [523, 0.08]], 'square', 0.04)
}

export function sfxStatDown() {
  playNotes([[523, 0.05], [392, 0.08]], 'sawtooth', 0.04)
}

export function sfxDanger() {
  playNotes([[220, 0.12], [185, 0.12], [220, 0.12], [185, 0.15]], 'square', 0.08)
}

export function sfxVictory() {
  playNotes([
    [523, 0.1], [659, 0.1], [784, 0.1], [1047, 0.2],
    [784, 0.08], [1047, 0.3],
  ], 'square', 0.06)
}

export function sfxGameOver() {
  playNotes([
    [392, 0.15], [370, 0.15], [349, 0.15], [330, 0.3],
  ], 'sawtooth', 0.06)
}

export function sfxClick() {
  playTone(800, 0.04, 'square', 0.03)
}

export function sfxEndTurn() {
  playNotes([[440, 0.06], [349, 0.06], [440, 0.1]], 'triangle', 0.04)
}

export function sfxSynergy() {
  playNotes([
    [523, 0.06], [659, 0.06], [784, 0.06], [1047, 0.06], [1319, 0.12],
  ], 'square', 0.05)
}
