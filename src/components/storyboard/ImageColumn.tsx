'use client'

import { useCallback, useRef, useState } from 'react'
import {
  Upload,
  Download,
  ImageIcon,
  Loader2,
  Clock,
  ZoomIn,
} from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from '@/components/ui/tooltip'
import { useStoryboardStore, type SceneData } from '@/lib/store/storyboard-store'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'
import { SceneStatusBadge } from './SceneStatusBadge'
import { ImageZoomDialog } from './ImageZoomDialog'

export function ImageColumn() {
  const scenes = useStoryboardStore((s) => s.scenes)
  const selectedSceneId = useStoryboardStore((s) => s.selectedSceneId)
  const selectScene = useStoryboardStore((s) => s.selectScene)
  const [zoomSrc, setZoomSrc] = useState<string | null>(null)

  return (
    <>
      <div className="flex flex-col h-full">
        <div className="md:hidden flex items-center gap-2 px-4 py-3 border-b bg-muted/30">
          <span
            className="h-2 w-2 rounded-full shrink-0"
            style={{ backgroundColor: 'var(--col-image)' }}
            aria-hidden="true"
          />
          <span className="text-xs font-semibold uppercase tracking-wide text-foreground/80">
            Image
          </span>
          <Badge variant="secondary" className="ml-auto h-5 px-1.5 text-xs tabular-nums">
            {scenes.filter((s) => s.image_status === 'completed').length}/{scenes.length}
          </Badge>
        </div>

        <div className="flex-1 min-h-0 overflow-y-auto custom-scrollbar p-3 space-y-3">
          {scenes.length === 0 ? (
            <div className="text-center text-xs text-muted-foreground py-12">
              No scenes. Load a storyboard JSON to begin.
            </div>
          ) : (
            scenes.map((scene) => (
              <ImageSceneCard
                key={scene.scene_id}
                scene={scene}
                selected={selectedSceneId === scene.scene_id}
                onSelect={() => selectScene(scene.scene_id)}
                onZoom={() => setZoomSrc(scene.image_path)}
              />
            ))
          )}
        </div>
      </div>

      <ImageZoomDialog
        open={!!zoomSrc}
        onOpenChange={(o) => !o && setZoomSrc(null)}
        src={zoomSrc}
        alt="Scene image"
      />
    </>
  )
}

function ImageSceneCard({
  scene,
  selected,
  onSelect,
  onZoom,
}: {
  scene: SceneData
  selected: boolean
  onSelect: () => void
  onZoom: () => void
}) {
  const updateScene = useStoryboardStore((s) => s.updateScene)
  const replaceScene = useStoryboardStore((s) => s.replaceScene)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [uploading, setUploading] = useState(false)

  const handleUpload = useCallback(
    async (file: File) => {
      setUploading(true)
      try {
        const formData = new FormData()
        formData.append('file', file)

        const res = await fetch(
          `/api/storyboard/${scene.project_id}/scenes/${scene.scene_id}/image`,
          { method: 'POST', body: formData }
        )
        const data = await res.json()

        if (data.ok) {
          // Optimistic update with new path
          updateScene(scene.scene_id, {
            image_path: data.image_path,
            image_status: 'completed',
            // Video must be regenerated since image changed
            video_status: 'pending',
            video_path: null,
            error_message: null,
          })
          toast.success('Image uploaded')
        } else {
          toast.error(data.error || 'Upload failed')
        }
      } catch (err) {
        toast.error(err instanceof Error ? err.message : 'Upload failed')
      } finally {
        setUploading(false)
      }
    },
    [scene.project_id, scene.scene_id, updateScene]
  )

  const handleDownload = useCallback(async () => {
    if (!scene.image_path) return
    try {
      const res = await fetch(scene.image_path)
      if (!res.ok) throw new Error('Failed to fetch image')
      const blob = await res.blob()
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `${scene.scene_id}.png`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Download failed')
    }
  }, [scene.image_path, scene.scene_id])

  const hasImage = scene.image_status === 'completed' && !!scene.image_path

  return (
    <Card
      className={cn(
        'gap-0 py-0 px-0 overflow-hidden cursor-pointer transition-all',
        selected
          ? 'ring-2 ring-[var(--col-image)]/40 border-[var(--col-image)]/30'
          : 'hover:border-[var(--col-image)]/30'
      )}
      onClick={onSelect}
    >
      <div className="flex items-center gap-2 px-3 py-2 border-b bg-muted/30">
        <span
          className="flex h-6 min-w-6 px-1.5 items-center justify-center rounded text-[10px] font-bold text-white shrink-0 tabular-nums"
          style={{ backgroundColor: 'var(--col-image)' }}
        >
          {String(scene.scene_number).padStart(2, '0')}
        </span>
        <span className="text-xs font-mono text-muted-foreground truncate">
          {scene.scene_id}
        </span>
        <div className="ml-auto flex items-center gap-1.5 shrink-0">
          <SceneStatusBadge status={scene.image_status} compact />
          <span className="flex items-center gap-1 text-xs text-muted-foreground">
            <Clock className="h-3 w-3" aria-hidden="true" />
            <span className="tabular-nums">{scene.duration}s</span>
          </span>
        </div>
      </div>

      <div className="p-3 space-y-2.5">
        {/* Image preview / drop zone */}
        {hasImage ? (
          <div className="relative group rounded-md overflow-hidden border bg-muted/30">
            <img
              src={scene.image_path}
              alt={`Scene ${scene.scene_number} image`}
              className="w-full h-auto max-h-72 object-contain bg-black/5"
              onClick={(e) => {
                e.stopPropagation()
                onZoom()
              }}
            />
            <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="secondary"
                    size="icon"
                    className="h-7 w-7 bg-background/80 backdrop-blur"
                    onClick={(e) => {
                      e.stopPropagation()
                      onZoom()
                    }}
                    aria-label="Zoom image"
                  >
                    <ZoomIn className="h-3.5 w-3.5" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Zoom</TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="secondary"
                    size="icon"
                    className="h-7 w-7 bg-background/80 backdrop-blur"
                    onClick={(e) => {
                      e.stopPropagation()
                      handleDownload()
                    }}
                    aria-label="Download image"
                  >
                    <Download className="h-3.5 w-3.5" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Download</TooltipContent>
              </Tooltip>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-8 border-2 border-dashed border-muted-foreground/20 rounded-md bg-muted/20">
            <ImageIcon className="h-8 w-8 text-muted-foreground/40 mb-2" aria-hidden="true" />
            <p className="text-xs text-muted-foreground">No image uploaded</p>
          </div>
        )}

        {/* Upload button */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/png,image/jpeg,image/jpg,image/webp,image/gif"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0]
            if (file) handleUpload(file)
            e.target.value = ''
          }}
        />
        <Button
          variant={hasImage ? 'outline' : 'default'}
          size="sm"
          className="w-full h-8 text-xs gap-1.5"
          style={
            !hasImage
              ? { backgroundColor: 'var(--col-image)', color: 'white' }
              : undefined
          }
          disabled={uploading || scene.locked}
          onClick={(e) => {
            e.stopPropagation()
            fileInputRef.current?.click()
          }}
        >
          {uploading ? (
            <>
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
              Uploading...
            </>
          ) : (
            <>
              <Upload className="h-3.5 w-3.5" />
              {hasImage ? 'Replace Image' : 'Upload Image'}
            </>
          )}
        </Button>

        {scene.error_message && scene.image_status === 'failed' && (
          <p className="text-xs text-destructive break-words">{scene.error_message}</p>
        )}
      </div>
    </Card>
  )
}
