const HAN_RE = /\p{Script=Han}/gu
const HAN_SINGLE_RE = /\p{Script=Han}/u

export function containsHan(text: string): boolean {
  return HAN_SINGLE_RE.test(text)
}

export function englishText(input: string | undefined | null, fallback = 'N/A'): string {
  if (!input) return fallback

  const normalized = input
    .replace(HAN_RE, '')
    .replace(/[「」【】]/g, ' ')
    .replace(/[（）]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()

  if (!normalized) return fallback
  return normalized
}

export function titleFromId(id: string): string {
  return id
    .split(/[-_]/g)
    .filter(Boolean)
    .map(w => w[0].toUpperCase() + w.slice(1))
    .join(' ')
}
