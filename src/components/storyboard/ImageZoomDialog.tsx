'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { ZoomIn, ZoomOut, RotateCcw, X } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'

interface ImageZoomDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  src: string | null
  alt?: string
}

export function ImageZoomDialog({
  open,
  onOpenChange,
  src,
  alt = 'Image preview',
}: ImageZoomDialogProps) {
  // Inner component is mounted fresh each time the dialog opens.
  // This avoids setState-in-effect patterns by leveraging natural remount.
  if (!open || !src) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="hidden" showCloseButton={false}>
          <DialogTitle className="sr-only">Image preview</DialogTitle>
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <ImageZoomContent src={src} alt={alt} onClose={() => onOpenChange(false)} />
    </Dialog>
  )
}

function ImageZoomContent({
  src,
  alt,
  onClose,
}: {
  src: string
  alt: string
  onClose: () => void
}) {
  const [scale, setScale] = useState(1)
  const [translate, setTranslate] = useState({ x: 0, y: 0 })
  const [isDragging, setIsDragging] = useState(false)
  const dragRef = useRef<{ startX: number; startY: number; originX: number; originY: number } | null>(null)

  const handleZoomIn = useCallback(() => {
    setScale((s) => Math.min(s + 0.25, 5))
  }, [])

  const handleZoomOut = useCallback(() => {
    setScale((s) => {
      const next = Math.max(s - 0.25, 0.25)
      if (next <= 1) setTranslate({ x: 0, y: 0 })
      return next
    })
  }, [])

  const handleReset = useCallback(() => {
    setScale(1)
    setTranslate({ x: 0, y: 0 })
  }, [])

  // Wheel zoom — only active while mounted (i.e. dialog open)
  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      e.preventDefault()
      setScale((s) => {
        const next = s - e.deltaY * 0.001
        const clamped = Math.max(0.25, Math.min(next, 5))
        if (clamped <= 1) setTranslate({ x: 0, y: 0 })
        return clamped
      })
    }
    window.addEventListener('wheel', handleWheel, { passive: false })
    return () => window.removeEventListener('wheel', handleWheel)
  }, [])

  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      if (scale <= 1) return
      dragRef.current = {
        startX: e.clientX,
        startY: e.clientY,
        originX: translate.x,
        originY: translate.y,
      }
      setIsDragging(true)
    },
    [scale, translate]
  )

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!dragRef.current) return
    const dx = e.clientX - dragRef.current.startX
    const dy = e.clientY - dragRef.current.startY
    setTranslate({
      x: dragRef.current.originX + dx,
      y: dragRef.current.originY + dy,
    })
  }, [])

  const handleMouseUp = useCallback(() => {
    dragRef.current = null
    setIsDragging(false)
  }, [])

  return (
    <DialogContent
      className="max-w-none w-screen h-screen p-0 border-0 bg-black/95 rounded-none flex flex-col"
      showCloseButton={false}
    >
      <DialogTitle className="sr-only">Image preview</DialogTitle>

      {/* Toolbar */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 z-10 flex items-center gap-1.5 bg-black/60 backdrop-blur border border-white/10 rounded-full px-2 py-1.5">
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-white hover:bg-white/10"
          onClick={handleZoomOut}
          aria-label="Zoom out"
        >
          <ZoomOut className="h-4 w-4" />
        </Button>
        <span className="text-xs text-white/80 tabular-nums min-w-[3rem] text-center">
          {Math.round(scale * 100)}%
        </span>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-white hover:bg-white/10"
          onClick={handleZoomIn}
          aria-label="Zoom in"
        >
          <ZoomIn className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-white hover:bg-white/10"
          onClick={handleReset}
          aria-label="Reset zoom"
        >
          <RotateCcw className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-white hover:bg-white/10"
          onClick={onClose}
          aria-label="Close"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>

      {/* Image */}
      <div
        className="flex-1 flex items-center justify-center overflow-hidden relative"
        style={{ cursor: scale > 1 ? 'grab' : 'default' }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        <img
          src={src}
          alt={alt}
          draggable={false}
          className="max-w-full max-h-full object-contain select-none"
          style={{
            transform: `translate(${translate.x}px, ${translate.y}px) scale(${scale})`,
            transition: isDragging ? 'none' : 'transform 0.15s ease-out',
            cursor: scale > 1 ? (isDragging ? 'grabbing' : 'grab') : 'default',
          }}
        />
      </div>
    </DialogContent>
  )
}
