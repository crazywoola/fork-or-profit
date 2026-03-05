import { useEffect, useRef } from 'react'
import { createOfficeRenderer, type OfficeRenderer } from '../pixel/renderer'

type Props = {
  activeRoomId: string
  highlightRoomId: string
  onRoomSelect: (roomId: string) => void
}

export function PixelCanvas({ activeRoomId, highlightRoomId, onRoomSelect }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const rendererRef = useRef<OfficeRenderer | null>(null)

  useEffect(() => {
    if (!canvasRef.current) return
    const renderer = createOfficeRenderer(canvasRef.current)
    rendererRef.current = renderer
    renderer.onRoomClick(onRoomSelect)
    return () => renderer.destroy()
  }, [])

  useEffect(() => {
    rendererRef.current?.setActiveRoom(activeRoomId)
  }, [activeRoomId])

  useEffect(() => {
    rendererRef.current?.setHighlightRoom(highlightRoomId)
  }, [highlightRoomId])

  useEffect(() => {
    if (rendererRef.current) {
      rendererRef.current.onRoomClick(onRoomSelect)
    }
  }, [onRoomSelect])

  return <canvas ref={canvasRef} className="pixel-canvas" />
}
