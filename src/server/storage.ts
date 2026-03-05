export type D1Value = string | number | boolean | null

export const getD1 = (env: { DB: D1Database }) => env.DB
export const getKV = (env: { KV: KVNamespace }) => env.KV

export async function d1Query<T>(
  db: D1Database,
  sql: string,
  params: D1Value[] = []
): Promise<T[]> {
  const statement = db.prepare(sql)
  const result = params.length ? await statement.bind(...params).all<T>() : await statement.all<T>()
  return result.results ?? []
}

export async function d1Exec(
  db: D1Database,
  sql: string,
  params: D1Value[] = []
): Promise<D1Result> {
  const statement = db.prepare(sql)
  return params.length ? await statement.bind(...params).run() : await statement.run()
}

export async function kvGetJson<T>(kv: KVNamespace, key: string): Promise<T | null> {
  const value = await kv.get(key)
  if (value === null) return null

  try {
    return JSON.parse(value) as T
  } catch {
    return null
  }
}

export async function kvPutJson(
  kv: KVNamespace,
  key: string,
  value: unknown,
  options?: KVNamespacePutOptions
): Promise<void> {
  await kv.put(key, JSON.stringify(value), options)
}

export async function kvGetText(kv: KVNamespace, key: string): Promise<string | null> {
  return kv.get(key)
}

export async function kvPutText(
  kv: KVNamespace,
  key: string,
  value: string,
  options?: KVNamespacePutOptions
): Promise<void> {
  await kv.put(key, value, options)
}
