'use client'

import { useCallback, useEffect, useState } from 'react'
import {
  Film,
  Download,
  Loader2,
  Clock,
  Play,
  AlertCircle,
} from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from '@/components/ui/tooltip'
import { useStoryboardStore, type SceneData } from '@/lib/store/storyboard-store'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'
import { SceneStatusBadge } from './SceneStatusBadge'

export function VideoColumn() {
  const scenes = useStoryboardStore((s) => s.scenes)
  const selectedSceneId = useStoryboardStore((s) => s.selectedSceneId)
  const selectScene = useStoryboardStore((s) => s.selectScene)

  return (
    <div className="flex flex-col h-full">
      <div className="md:hidden flex items-center gap-2 px-4 py-3 border-b bg-muted/30">
        <span
          className="h-2 w-2 rounded-full shrink-0"
          style={{ backgroundColor: 'var(--col-video)' }}
          aria-hidden="true"
        />
        <span className="text-xs font-semibold uppercase tracking-wide text-foreground/80">
          Video
        </span>
        <Badge variant="secondary" className="ml-auto h-5 px-1.5 text-xs tabular-nums">
          {scenes.filter((s) => s.video_status === 'completed').length}/{scenes.length}
        </Badge>
      </div>

      <div className="flex-1 min-h-0 overflow-y-auto custom-scrollbar p-3 space-y-3">
        {scenes.length === 0 ? (
          <div className="text-center text-xs text-muted-foreground py-12">
            No scenes. Load a storyboard JSON to begin.
          </div>
        ) : (
          scenes.map((scene) => (
            <VideoSceneCard
              key={scene.scene_id}
              scene={scene}
              selected={selectedSceneId === scene.scene_id}
              onSelect={() => selectScene(scene.scene_id)}
            />
          ))
        )}
      </div>
    </div>
  )
}

function VideoSceneCard({
  scene,
  selected,
  onSelect,
}: {
  scene: SceneData
  selected: boolean
  onSelect: () => void
}) {
  const updateScene = useStoryboardStore((s) => s.updateScene)
  const replaceScene = useStoryboardStore((s) => s.replaceScene)
  const [generating, setGenerating] = useState(false)
  const [promptValue, setPromptValue] = useState(scene.video_prompt || '')
  const [dirty, setDirty] = useState(false)
  const [savingPrompt, setSavingPrompt] = useState(false)

  // Sync local prompt value if upstream changes (e.g. after load or save)
  useEffect(() => {
    if (!dirty) {
      setPromptValue(scene.video_prompt || '')
    }
  }, [scene.video_prompt, dirty])

  const canGenerate =
    scene.image_status === 'completed' &&
    !!scene.image_path &&
    !scene.locked &&
    !generating

  const handleGenerate = useCallback(async () => {
    if (!canGenerate) return
    setGenerating(true)
    updateScene(scene.scene_id, {
      video_status: 'running',
      error_message: null,
      video_path: null,
    })

    try {
      const res = await fetch(
        `/api/storyboard/${scene.project_id}/scenes/${scene.scene_id}/video`,
        { method: 'POST' }
      )
      const data = await res.json()

      if (data.ok) {
        updateScene(scene.scene_id, {
          video_status: 'completed',
          video_path: data.video_path,
          error_message: null,
        })
        toast.success('Video generated')
      } else {
        updateScene(scene.scene_id, {
          video_status: 'failed',
          error_message: data.error || 'Generation failed',
        })
        toast.error(data.error || 'Video generation failed')
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Network error'
      updateScene(scene.scene_id, {
        video_status: 'failed',
        error_message: msg,
      })
      toast.error(msg)
    } finally {
      setGenerating(false)
    }
  }, [canGenerate, scene.project_id, scene.scene_id, updateScene])

  const handleDownload = useCallback(async () => {
    if (!scene.video_path) return
    try {
      const res = await fetch(scene.video_path)
      if (!res.ok) throw new Error('Failed to fetch video')
      const blob = await res.blob()
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `${scene.scene_id}.mp4`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Download failed')
    }
  }, [scene.video_path, scene.scene_id])

  const handlePromptBlur = useCallback(async () => {
    if (!dirty) return
    setSavingPrompt(true)
    try {
      updateScene(scene.scene_id, { video_prompt: promptValue })

      const res = await fetch(
        `/api/storyboard/${scene.project_id}/scenes/${scene.scene_id}`,
        {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ video_prompt: promptValue }),
        }
      )
      const data = await res.json()
      if (data.ok && data.scene) {
        replaceScene(scene.scene_id, data.scene)
        setDirty(false)
      } else {
        toast.error(data.error || 'Failed to save prompt')
      }
    } catch {
      toast.error('Failed to save prompt')
    } finally {
      setSavingPrompt(false)
    }
  }, [dirty, promptValue, scene.scene_id, scene.project_id, updateScene, replaceScene])

  const hasVideo = scene.video_status === 'completed' && !!scene.video_path
  const isRunning = scene.video_status === 'running' || generating

  return (
    <Card
      className={cn(
        'gap-0 py-0 px-0 overflow-hidden cursor-pointer transition-all',
        selected
          ? 'ring-2 ring-[var(--col-video)]/40 border-[var(--col-video)]/30'
          : 'hover:border-[var(--col-video)]/30'
      )}
      onClick={onSelect}
    >
      <div className="flex items-center gap-2 px-3 py-2 border-b bg-muted/30">
        <span
          className="flex h-6 min-w-6 px-1.5 items-center justify-center rounded text-[10px] font-bold text-white shrink-0 tabular-nums"
          style={{ backgroundColor: 'var(--col-video)' }}
        >
          {String(scene.scene_number).padStart(2, '0')}
        </span>
        <span className="text-xs font-mono text-muted-foreground truncate">
          {scene.scene_id}
        </span>
        <div className="ml-auto flex items-center gap-1.5 shrink-0">
          <SceneStatusBadge status={scene.video_status} compact />
          <span className="flex items-center gap-1 text-xs text-muted-foreground">
            <Clock className="h-3 w-3" aria-hidden="true" />
            <span className="tabular-nums">{scene.duration}s</span>
          </span>
        </div>
      </div>

      <div className="p-3 space-y-2.5">
        {/* Video player / placeholder */}
        {hasVideo ? (
          <div className="relative rounded-md overflow-hidden border bg-black">
            <video
              src={scene.video_path}
              controls
              playsInline
              className="w-full h-auto max-h-72 object-contain"
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        ) : isRunning ? (
          <div className="flex flex-col items-center justify-center py-8 border-2 border-[var(--col-video)]/30 border-dashed rounded-md bg-[var(--col-video)]/5">
            <Loader2 className="h-8 w-8 animate-spin mb-2" style={{ color: 'var(--col-video)' }} aria-hidden="true" />
            <p className="text-xs font-medium" style={{ color: 'var(--col-video)' }}>
              Generating video...
            </p>
            <p className="text-xs text-muted-foreground mt-0.5">
              This may take several minutes
            </p>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-8 border-2 border-dashed border-muted-foreground/20 rounded-md bg-muted/20">
            <Film className="h-8 w-8 text-muted-foreground/40 mb-2" aria-hidden="true" />
            <p className="text-xs text-muted-foreground">No video generated</p>
          </div>
        )}

        {/* Video prompt editor */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground flex items-center gap-1.5">
              <Play className="h-3 w-3" style={{ color: 'var(--col-video)' }} aria-hidden="true" />
              Video Prompt
              {savingPrompt && (
                <span className="text-xs text-muted-foreground animate-pulse">saving…</span>
              )}
            </span>
          </div>
          <Textarea
            value={promptValue}
            onChange={(e) => {
              setPromptValue(e.target.value)
              setDirty(true)
            }}
            onBlur={handlePromptBlur}
            onClick={(e) => e.stopPropagation()}
            placeholder="Video prompt for WAN 2.2 i2v..."
            className="min-h-[60px] text-xs resize-y !field-sizing-fixed"
            style={{ fieldSizing: 'content' } as React.CSSProperties}
          />
        </div>

        {/* Action buttons */}
        <div className="flex gap-1.5">
          <Button
            size="sm"
            className="flex-1 h-8 text-xs gap-1.5"
            style={{ backgroundColor: 'var(--col-video)', color: 'white' }}
            disabled={!canGenerate}
            onClick={(e) => {
              e.stopPropagation()
              handleGenerate()
            }}
          >
            {isRunning ? (
              <>
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Film className="h-3.5 w-3.5" />
                {hasVideo ? 'Regenerate' : 'Generate Video'}
              </>
            )}
          </Button>
          {hasVideo && (
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8 shrink-0"
                  onClick={(e) => {
                    e.stopPropagation()
                    handleDownload()
                  }}
                  aria-label="Download video"
                >
                  <Download className="h-3.5 w-3.5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Download video</TooltipContent>
            </Tooltip>
          )}
        </div>

        {/* Error message */}
        {scene.video_status === 'failed' && scene.error_message && (
          <div className="flex items-start gap-1.5 p-2 rounded-md border border-destructive/30 bg-destructive/10 text-destructive text-xs">
            <AlertCircle className="h-3 w-3 shrink-0 mt-0.5" aria-hidden="true" />
            <span className="break-words">{scene.error_message}</span>
          </div>
        )}

        {/* Hint: missing image */}
        {scene.image_status !== 'completed' && (
          <p className="text-xs text-amber-600 dark:text-amber-400 flex items-center gap-1">
            <AlertCircle className="h-3 w-3 shrink-0" aria-hidden="true" />
            Upload an image first to enable video generation.
          </p>
        )}
      </div>
    </Card>
  )
}
