'use client'

import { useCallback, useEffect, useState } from 'react'
import { Volume2, Clock } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Textarea } from '@/components/ui/textarea'
import { useStoryboardStore, type SceneData } from '@/lib/store/storyboard-store'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'

export function VoColumn() {
  const scenes = useStoryboardStore((s) => s.scenes)
  const selectedSceneId = useStoryboardStore((s) => s.selectedSceneId)
  const selectScene = useStoryboardStore((s) => s.selectScene)

  return (
    <div className="flex flex-col h-full">
      {/* Mobile column header */}
      <div className="md:hidden flex items-center gap-2 px-4 py-3 border-b bg-muted/30">
        <span
          className="h-2 w-2 rounded-full shrink-0"
          style={{ backgroundColor: 'var(--col-vo)' }}
          aria-hidden="true"
        />
        <span className="text-xs font-semibold uppercase tracking-wide text-foreground/80">
          Voice Over
        </span>
        <Badge variant="secondary" className="ml-auto h-5 px-1.5 text-xs tabular-nums">
          {scenes.length}
        </Badge>
      </div>

      <div className="flex-1 min-h-0 overflow-y-auto custom-scrollbar p-3 space-y-3">
        {scenes.length === 0 ? (
          <div className="text-center text-xs text-muted-foreground py-12">
            No scenes. Load a storyboard JSON to begin.
          </div>
        ) : (
          scenes.map((scene) => (
            <VoSceneCard
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

function VoSceneCard({
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
  const [value, setValue] = useState(scene.vo || '')
  const [saving, setSaving] = useState(false)
  const [dirty, setDirty] = useState(false)

  // Sync local value if upstream changes (e.g. after load or save)
  useEffect(() => {
    if (!dirty) {
      setValue(scene.vo || '')
    }
  }, [scene.vo, dirty])

  const handleBlur = useCallback(async () => {
    if (!dirty) return
    setSaving(true)
    try {
      // Optimistic local update
      updateScene(scene.scene_id, { vo: value })

      const res = await fetch(
        `/api/storyboard/${scene.project_id}/scenes/${scene.scene_id}`,
        {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ vo: value }),
        }
      )
      const data = await res.json()
      if (data.ok && data.scene) {
        replaceScene(scene.scene_id, data.scene)
        setDirty(false)
      } else {
        toast.error(data.error || 'Failed to save VO')
      }
    } catch {
      toast.error('Failed to save VO')
    } finally {
      setSaving(false)
    }
  }, [dirty, value, scene.scene_id, scene.project_id, updateScene, replaceScene])

  return (
    <Card
      className={cn(
        'gap-0 py-0 px-0 overflow-hidden cursor-pointer transition-all',
        selected
          ? 'ring-2 ring-[var(--col-vo)]/40 border-[var(--col-vo)]/30'
          : 'hover:border-[var(--col-vo)]/30'
      )}
      onClick={onSelect}
    >
      <div className="flex items-center gap-2 px-3 py-2 border-b bg-muted/30">
        <span
          className="flex h-6 min-w-6 px-1.5 items-center justify-center rounded text-[10px] font-bold text-white shrink-0 tabular-nums"
          style={{ backgroundColor: 'var(--col-vo)' }}
        >
          {String(scene.scene_number).padStart(2, '0')}
        </span>
        <span className="text-xs font-mono text-muted-foreground truncate">
          {scene.scene_id}
        </span>
        <span className="ml-auto flex items-center gap-1 text-xs text-muted-foreground shrink-0">
          <Clock className="h-3 w-3" aria-hidden="true" />
          <span className="tabular-nums">{scene.duration}s</span>
        </span>
      </div>

      <div className="p-3 space-y-2">
        <div className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
          <Volume2 className="h-3.5 w-3.5" style={{ color: 'var(--col-vo)' }} aria-hidden="true" />
          <span>Voice Over</span>
          {saving && (
            <span className="ml-auto text-xs text-muted-foreground animate-pulse">saving…</span>
          )}
        </div>
        <Textarea
          value={value}
          onChange={(e) => {
            setValue(e.target.value)
            setDirty(true)
          }}
          onBlur={handleBlur}
          onClick={(e) => e.stopPropagation()}
          placeholder="Voice over text..."
          className="min-h-[80px] text-sm resize-y !field-sizing-fixed"
          style={{ fieldSizing: 'content' } as React.CSSProperties}
        />
      </div>
    </Card>
  )
}
