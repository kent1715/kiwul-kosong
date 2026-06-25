'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  Upload,
  Clapperboard,
  Moon,
  Sun,
  Volume2,
  ImageIcon,
  Film,
  type LucideIcon,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useTheme } from 'next-themes'
import { useStoryboardStore } from '@/lib/store/storyboard-store'
import { TopToolbar } from './TopToolbar'
import { VoColumn } from './VoColumn'
import { ImageColumn } from './ImageColumn'
import { VideoColumn } from './VideoColumn'
import { LoadJsonDialog } from './LoadJsonDialog'
import { ProviderSettingsDialog } from './ProviderSettingsDialog'
import { ProjectListDialog } from './ProjectListDialog'

type MobileTab = 'vo' | 'image' | 'video'

interface ColumnMeta {
  key: MobileTab
  name: string
  colorVar: string
  icon: LucideIcon
}

const COLUMN_META: ColumnMeta[] = [
  { key: 'vo', name: 'VO', colorVar: 'var(--col-vo)', icon: Volume2 },
  { key: 'image', name: 'Image', colorVar: 'var(--col-image)', icon: ImageIcon },
  { key: 'video', name: 'Video', colorVar: 'var(--col-video)', icon: Film },
]

export function StoryboardStudio() {
  const { currentProject, scenes, setLoadJsonDialogOpen, setProjectListDialogOpen } =
    useStoryboardStore()
  const { theme, setTheme } = useTheme()
  const [mobileTab, setMobileTab] = useState<MobileTab>('vo')

  // =====================================================================
  // EMPTY STATE
  // =====================================================================
  if (!currentProject) {
    return (
      <div className="relative flex flex-col min-h-screen bg-background overflow-hidden">
        <div
          className="pointer-events-none absolute inset-0 opacity-70"
          style={{
            background:
              'radial-gradient(55% 55% at 50% 30%, color-mix(in oklch, var(--col-vo) 10%, transparent) 0%, transparent 70%), radial-gradient(45% 45% at 80% 80%, color-mix(in oklch, var(--col-image) 10%, transparent) 0%, transparent 70%), radial-gradient(40% 40% at 15% 75%, color-mix(in oklch, var(--col-video) 8%, transparent) 0%, transparent 70%)',
          }}
          aria-hidden="true"
        />

        <LoadJsonDialog />
        <ProviderSettingsDialog />
        <ProjectListDialog />

        <div className="relative flex-1 flex items-center justify-center p-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center max-w-lg px-4"
          >
            <div className="mx-auto mb-8 flex h-20 w-20 items-center justify-center rounded-full border bg-primary/5 shadow-sm">
              <Clapperboard className="h-10 w-10 text-primary" />
            </div>

            <h1 className="text-3xl font-bold tracking-tight mb-3">
              Simple Storyboard Studio
            </h1>
            <p className="text-muted-foreground text-base mb-8">
              A lighter storyboard workflow: VO + image upload + video generation
              (WAN 2.2 i2v). Load a storyboard JSON to get started.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 justify-center mb-8">
              <Button
                size="lg"
                className="h-11 gap-2"
                onClick={() => setLoadJsonDialogOpen(true)}
              >
                <Upload className="h-4 w-4" />
                Load Storyboard JSON
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="h-11 gap-2"
                onClick={() => setProjectListDialogOpen(true)}
              >
                <Clapperboard className="h-4 w-4" />
                Open Project
              </Button>
            </div>

            <div className="text-xs text-muted-foreground space-y-1">
              <p>
                Supported: JSON with <code>project</code> and <code>scenes</code>
              </p>
              <p>
                Required fields: <code>project.title</code>,{' '}
                <code>scenes[].scene_id</code>, <code>vo</code>,{' '}
                <code>video_prompt</code>
              </p>
            </div>
          </motion.div>
        </div>

        {/* Footer */}
        <footer className="relative border-t px-4 py-2 text-xs text-muted-foreground flex items-center justify-between mt-auto">
          <span>Simple Storyboard Studio v1.0 · WAN 2.2 i2v · Image Upload</span>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </Button>
        </footer>
      </div>
    )
  }

  // =====================================================================
  // PROJECT LOADED
  // =====================================================================
  const totalScenes = scenes.length
  const imgCompleted = scenes.filter((s) => s.image_status === 'completed').length
  const vidCompleted = scenes.filter((s) => s.video_status === 'completed').length

  const columnCounts: Record<MobileTab, number> = {
    vo: totalScenes,
    image: imgCompleted,
    video: vidCompleted,
  }

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <LoadJsonDialog />
      <ProviderSettingsDialog />
      <ProjectListDialog />

      {/* Top toolbar (header h-14) */}
      <TopToolbar />

      {/* Column headers (h-10, desktop only) */}
      <div className="hidden md:grid grid-cols-3 h-10 border-b bg-muted/30 shrink-0">
        {COLUMN_META.map((col, i) => (
          <div
            key={col.key}
            className={`flex items-center gap-2 px-4 ${i < COLUMN_META.length - 1 ? 'border-r' : ''}`}
          >
            <span
              className="h-2 w-2 rounded-full shrink-0"
              style={{ backgroundColor: col.colorVar }}
              aria-hidden="true"
            />
            <span className="text-xs font-semibold uppercase tracking-wide text-foreground/80">
              {col.name}
            </span>
            <Badge
              variant="secondary"
              className="ml-auto h-5 text-xs px-1.5 tabular-nums font-medium"
            >
              {columnCounts[col.key]}
            </Badge>
          </div>
        ))}
      </div>

      {/* Mobile tab selector (h-10) */}
      <div className="flex md:hidden h-10 border-b bg-background shrink-0">
        {COLUMN_META.map((col) => {
          const isActive = mobileTab === col.key
          return (
            <button
              key={col.key}
              type="button"
              className="relative flex-1 flex items-center justify-center gap-1.5 text-sm font-medium transition-colors"
              style={isActive ? { color: col.colorVar } : undefined}
              onClick={() => setMobileTab(col.key)}
              aria-current={isActive ? 'page' : undefined}
            >
              <col.icon className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
              <span className="truncate">{col.name}</span>
              {isActive && (
                <span
                  className="absolute bottom-0 left-0 right-0 h-0.5"
                  style={{ backgroundColor: col.colorVar }}
                  aria-hidden="true"
                />
              )}
            </button>
          )
        })}
      </div>

      {/* Main content: 3-column grid (desktop) */}
      <div className="hidden md:grid flex-1 min-h-0 grid-cols-3 divide-x divide-border overflow-hidden">
        <div className="overflow-y-auto custom-scrollbar">
          <VoColumn />
        </div>
        <div className="overflow-y-auto custom-scrollbar">
          <ImageColumn />
        </div>
        <div className="overflow-y-auto custom-scrollbar">
          <VideoColumn />
        </div>
      </div>

      {/* Mobile single-column content */}
      <div className="md:hidden flex-1 min-h-0 overflow-hidden">
        {mobileTab === 'vo' && <VoColumn />}
        {mobileTab === 'image' && <ImageColumn />}
        {mobileTab === 'video' && <VideoColumn />}
      </div>

      {/* Footer (h-8, sticky bottom) */}
      <footer className="flex items-center justify-between gap-3 px-4 h-8 border-t bg-background text-xs text-muted-foreground shrink-0 mt-auto">
        <div className="flex items-center gap-2 min-w-0">
          <span className="truncate font-medium" title={currentProject.title}>
            {currentProject.title}
          </span>
          <span aria-hidden="true">·</span>
          <span className="tabular-nums">{totalScenes} scenes</span>
          <span aria-hidden="true">·</span>
          <span>{currentProject.aspect_ratio}</span>
          <span aria-hidden="true" className="hidden sm:inline">·</span>
          <span className="hidden sm:inline">{currentProject.resolution}</span>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <span className="hidden sm:inline">
            <span style={{ color: 'var(--col-image)' }}>{imgCompleted}</span>
            <span aria-hidden="true"> / </span>
            <span style={{ color: 'var(--col-video)' }}>{vidCompleted}</span>
            <span className="ml-1">done</span>
          </span>
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7"
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? <Sun className="h-3.5 w-3.5" /> : <Moon className="h-3.5 w-3.5" />}
          </Button>
        </div>
      </footer>
    </div>
  )
}
