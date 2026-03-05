import { useEffect, useState, useCallback } from 'react'

type Props = {
  text: string
  speed?: number
  onComplete?: () => void
  className?: string
}

export function TypeWriter({ text, speed = 30, onComplete, className }: Props) {
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
