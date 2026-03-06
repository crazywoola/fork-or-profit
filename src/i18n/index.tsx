import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import { UI_MESSAGES, type UiMessages } from './messages'

export type Locale = 'en' | 'zh'

const DEFAULT_LOCALE: Locale = 'en'

let currentLocale: Locale = DEFAULT_LOCALE

type I18nContextValue = {
  locale: Locale
  messages: UiMessages
  setLocale: (locale: Locale) => void
}

const I18nContext = createContext<I18nContextValue | null>(null)

export function getCurrentLocale(): Locale {
  return currentLocale
}

export function setCurrentLocale(locale: Locale) {
  currentLocale = locale
}

export function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(DEFAULT_LOCALE)

  useEffect(() => {
    setCurrentLocale(locale)
  }, [locale])

  const messages = useMemo(() => UI_MESSAGES[locale] ?? UI_MESSAGES.en, [locale])
  const value = useMemo<I18nContextValue>(() => ({
    locale,
    messages,
    setLocale: setLocaleState,
  }), [locale, messages])

  return (
    <I18nContext.Provider value={value}>
      {children}
    </I18nContext.Provider>
  )
}

export function useI18n() {
  const value = useContext(I18nContext)
  if (!value) {
    throw new Error('useI18n must be used within I18nProvider')
  }
  return value
}
