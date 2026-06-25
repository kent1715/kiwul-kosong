'use client'

import { useCallback, useState } from 'react'
import {
  Save,
  Download,
  Settings,
  Moon,
  Sun,
  Pencil,
  Check,
  X,
  FolderOpen,
  Upload,
  Clapperboard,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from '@/components/ui/tooltip'
import { useTheme } from 'next-themes'
import { useStoryboardStore } from '@/lib/store/storyboard-store'
import { toast } from 'sonner'

export function TopToolbar() {
  const { currentProject, scenes, updateProjectMeta, setProviderSettingsDialogOpen } =
    useStoryboardStore()
  const { theme, setTheme } = useTheme()
  const [editingTitle, setEditingTitle] = useState(false)
  const [titleDraft, setTitleDraft] = useState(currentProject?.title || '')
  const [saving, setSaving] = useState(false)
  const [exporting, setExporting] = useState(false)

  const handleStartEdit = useCallback(() => {
    setTitleDraft(currentProject?.title || '')
    setEditingTitle(true)
  }, [currentProject?.title])

  const handleCancelEdit = useCallback(() => {
    setEditingTitle(false)
  }, [])

  const handleSaveTitle = useCallback(async () => {
    if (!currentProject) return
    const newTitle = titleDraft.trim()
    if (!newTitle) {
      toast.error('Title cannot be empty')
      return
    }
    setSaving(true)
    try {
      const res = await fetch(`/api/storyboard/${currentProject.id}/save`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          project: { title: newTitle },
          scenes: [],
        }),
      })
      const data = await res.json()
      if (data.ok) {
        updateProjectMeta({ title: newTitle })
        setEditingTitle(false)
        toast.success('Title updated')
      } else {
        toast.error(data.error || 'Failed to update title')
      }
    } catch {
      toast.error('Failed to update title')
    } finally {
      setSaving(false)
    }
  }, [currentProject, titleDraft, updateProjectMeta])

  const handleSave = useCallback(async () => {
    if (!currentProject) return
    setSaving(true)
    try {
      const sceneUpdates = scenes.map((s) => ({
        scene_id: s.scene_id,
        vo: s.vo,
        image_prompt: s.image_prompt,
        video_prompt: s.video_prompt,
        negative_prompt: s.negative_prompt,
        locked: s.locked,
        duration: s.duration,
        image_status: s.image_status,
        video_status: s.video_status,
      }))

      const res = await fetch(`/api/storyboard/${currentProject.id}/save`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          project: {
            title: currentProject.title,
            aspect_ratio: currentProject.aspect_ratio,
            resolution: currentProject.resolution,
            style: currentProject.style,
            status: currentProject.status,
          },
          scenes: sceneUpdates,
        }),
      })
      const data = await res.json()
      if (data.ok) {
        toast.success(`Project saved (${data.updated_scenes} scenes)`)
      } else {
        toast.error(data.error || 'Failed to save')
      }
    } catch {
      toast.error('Failed to save')
    } finally {
      setSaving(false)
    }
  }, [currentProject, scenes])

  const handleExport = useCallback(async () => {
    if (!currentProject) return
    setExporting(true)
    try {
      // Build the export JSON locally from store state
      const exportData = {
        project: {
          title: currentProject.title,
          language: currentProject.language,
          aspect_ratio: currentProject.aspect_ratio,
          resolution: currentProject.resolution,
          duration_seconds: currentProject.duration_seconds,
          style: currentProject.style,
        },
        scenes: scenes.map((s) => ({
          scene_id: s.scene_id,
          scene_number: s.scene_number,
          duration: s.duration,
          vo: s.vo,
          image_prompt: s.image_prompt,
          video_prompt: s.video_prompt,
          negative_prompt: s.negative_prompt,
          image_status: s.image_status,
          video_status: s.video_status,
        })),
      }

      const blob = new Blob([JSON.stringify(exportData, null, 2)], {
        type: 'application/json',
      })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      const safeName =
        currentProject.title.replace(/[^a-z0-9_-]+/gi, '_').toLowerCase() || 'storyboard'
      a.download = `${safeName}.json`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
      toast.success('Exported storyboard JSON')
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Export failed')
    } finally {
      setExporting(false)
    }
  }, [currentProject, scenes])

  if (!currentProject) return null

  return (
    <header className="flex items-center justify-between gap-3 px-4 h-14 border-b bg-background/95 backdrop-blur shrink-0">
      <div className="flex items-center gap-3 min-w-0">
        <div className="flex h-8 w-8 items-center justify-center rounded-md border bg-primary/5 shrink-0">
          <Clapperboard className="h-4 w-4 text-primary" />
        </div>
        <span className="text-sm font-semibold shrink-0 hidden sm:inline">Storyboard</span>
        <Separator orientation="vertical" className="h-5 shrink-0 hidden sm:block" />
        <div className="flex items-center gap-1.5 min-w-0">
          {editingTitle ? (
            <div className="flex items-center gap-1">
              <Input
                value={titleDraft}
                onChange={(e) => setTitleDraft(e.target.value)}
                className="h-7 text-sm w-[200px] sm:w-[280px]"
                autoFocus
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleSaveTitle()
                  if (e.key === 'Escape') handleCancelEdit()
                }}
                disabled={saving}
              />
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7"
                    onClick={handleSaveTitle}
                    disabled={saving}
                    aria-label="Save title"
                  >
                    <Check className="h-3.5 w-3.5" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Save title</TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7"
                    onClick={handleCancelEdit}
                    disabled={saving}
                    aria-label="Cancel"
                  >
                    <X className="h-3.5 w-3.5" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Cancel</TooltipContent>
              </Tooltip>
            </div>
          ) : (
            <>
              <span
                className="font-semibold text-sm truncate"
                title={currentProject.title}
              >
                {currentProject.title}
              </span>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 text-muted-foreground shrink-0"
                    onClick={handleStartEdit}
                    aria-label="Edit project title"
                  >
                    <Pencil className="h-3 w-3" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="bottom">Edit project title</TooltipContent>
              </Tooltip>
            </>
          )}
        </div>
      </div>

      <div className="flex items-center gap-1.5 shrink-0">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className="h-9 text-xs gap-1.5"
              onClick={() => useStoryboardStore.getState().setLoadJsonDialogOpen(true)}
            >
              <Upload className="h-3.5 w-3.5" />
              <span className="hidden md:inline">Load JSON</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>Load new storyboard JSON</TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className="h-9 text-xs gap-1.5"
              onClick={() => useStoryboardStore.getState().setProjectListDialogOpen(true)}
            >
              <FolderOpen className="h-3.5 w-3.5" />
              <span className="hidden md:inline">Projects</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>Open existing project</TooltipContent>
        </Tooltip>

        <Separator orientation="vertical" className="h-5 mx-0.5 hidden sm:block" />

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className="h-9 text-xs gap-1.5"
              onClick={handleSave}
              disabled={saving}
            >
              <Save className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">{saving ? 'Saving...' : 'Save'}</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>Save all scenes</TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className="h-9 text-xs gap-1.5"
              onClick={handleExport}
              disabled={exporting}
            >
              <Download className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">{exporting ? 'Exporting...' : 'Export'}</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>Export storyboard JSON</TooltipContent>
        </Tooltip>

        <Separator orientation="vertical" className="h-5 mx-0.5 hidden sm:block" />

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-9 w-9"
              onClick={() => setProviderSettingsDialogOpen(true)}
              aria-label="Provider settings"
            >
              <Settings className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Video provider settings</TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-9 w-9"
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </Button>
          </TooltipTrigger>
          <TooltipContent>Toggle theme</TooltipContent>
        </Tooltip>
      </div>
    </header>
  )
}
