import { Hono } from 'hono'
import type { Bindings } from './server/bindings'
import { d1Exec, d1Query, getD1, getKV, kvGetJson, kvPutJson } from './server/storage'

const app = new Hono<{ Bindings: Bindings }>()

app.get('/api/health', (c) => {
  return c.json({ ok: true, timestamp: new Date().toISOString() })
})

app.get('/api/session/:id', async (c) => {
  const id = c.req.param('id')
  const kv = getKV(c.env)
  let state = await kvGetJson<unknown>(kv, `session:${id}`)

  if (!state) {
    const db = getD1(c.env)
    const rows = await d1Query<{ state_json: string }>(
      db,
      'SELECT state_json FROM game_sessions WHERE id = ? LIMIT 1',
      [id]
    )
    const raw = rows[0]?.state_json
    if (raw) {
      try {
        state = JSON.parse(raw)
      } catch {
        state = null
      }
    }
  }

  return c.json({ ok: true, id, state })
})

app.post('/api/session/save', async (c) => {
  const payload = await c.req.json<{ id?: string; state?: unknown }>()
  if (!payload.id || typeof payload.id !== 'string' || !payload.state) {
    return c.json({ ok: false, error: 'id and state are required' }, 400)
  }

  const kv = getKV(c.env)
  await kvPutJson(kv, `session:${payload.id}`, payload.state)

  const db = getD1(c.env)
  await d1Exec(
    db,
    `CREATE TABLE IF NOT EXISTS game_sessions (
      id TEXT PRIMARY KEY,
      state_json TEXT NOT NULL,
      updated_at TEXT NOT NULL
    )`
  )
  await d1Exec(
    db,
    `INSERT INTO game_sessions (id, state_json, updated_at)
     VALUES (?, ?, ?)
     ON CONFLICT(id) DO UPDATE SET
       state_json = excluded.state_json,
       updated_at = excluded.updated_at`,
    [payload.id, JSON.stringify(payload.state), new Date().toISOString()]
  )

  return c.json({ ok: true })
})

export default app
