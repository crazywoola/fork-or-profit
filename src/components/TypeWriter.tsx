import { useEffect, useState, useCallback } from 'react'

type Props = {
  text: string
  speed?: number
  onComplete?: () => void
  className?: string
  skipSignal?: boolean
}

export function TypeWriter({ text, speed = 30, onComplete, className, skipSignal }: Props) {
  const [displayed, setDisplayed] = useState('')
  const [done, setDone] = useState(false)

  useEffect(() => {
    setDisplayed('')
    setDone(false)
    let i = 0
    const id = setInterval(() => {
      i++
      if (i >= text.length) {
        setDisplayed(text)
        setDone(true)
        clearInterval(id)
        onComplete?.()
      } else {
        setDisplayed(text.slice(0, i))
      }
    }, speed)
    return () => clearInterval(id)
  }, [text, speed])

  // External skip trigger (keyboard shortcut from parent)
  useEffect(() => {
    if (skipSignal && !done) {
      setDisplayed(text)
      setDone(true)
      onComplete?.()
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [skipSignal])

  const skip = useCallback(() => {
    if (!done) {
      setDisplayed(text)
      setDone(true)
      onComplete?.()
    }
  }, [done, text, onComplete])

  return (
    <span className={className} onClick={skip}>
      {displayed}
      {!done && <span className="tw-cursor">▌</span>}
    </span>
  )
}
