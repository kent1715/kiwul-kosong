'use client';

import { useCallback, useState } from 'react';
import { motion } from 'framer-motion';
import {
  Upload,
  Clapperboard,
  Moon,
  Sun,
  Sparkles,
  Save,
  Eye,
  Pencil,
  MoreHorizontal,
  FileText,
  ImageIcon,
  Film,
  type LucideIcon,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from '@/components/ui/tooltip';
import { useTheme } from 'next-themes';
import { useStoryboardStore } from '@/lib/store/storyboard-store';
import { TopToolbar } from './TopToolbar';
import { ReferencePanel } from './ReferencePanel';
import { StorylineColumn } from './StorylineColumn';
import { BackgroundColumn } from './BackgroundColumn';
import { GambarColumn } from './GambarColumn';
import { VideoColumn } from './VideoColumn';
import { LoadJsonDialog } from './LoadJsonDialog';
import { ProviderSettingsDialog } from './ProviderSettingsDialog';
import { ProjectListDialog } from './ProjectListDialog';
import { toast } from 'sonner';

type MobileTab = 'storyline' | 'background' | 'gambar' | 'video';

interface ColumnMeta {
  key: MobileTab;
  name: string;
  colorVar: string;
  icon: LucideIcon;
}

const COLUMN_META: ColumnMeta[] = [
  { key: 'storyline', name: 'Storyline', colorVar: 'var(--col-storyline)', icon: FileText },
  { key: 'background', name: 'Background', colorVar: 'var(--col-background)', icon: ImageIcon },
  { key: 'gambar', name: 'Action Image', colorVar: 'var(--col-image)', icon: ImageIcon },
  { key: 'video', name: 'Video', colorVar: 'var(--col-video)', icon: Film },
];

export function StoryboardStudio() {
  const { currentProject, setLoadJsonDialogOpen, setProjectListDialogOpen } = useStoryboardStore();
  const { theme, setTheme } = useTheme();
  const [mobileTab, setMobileTab] = useState<MobileTab>('storyline');

  const handleGenerateAll = useCallback(async () => {
    if (!currentProject) return;
    try {
      const res = await fetch(`/api/storyboard/${currentProject.id}/generate-all`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mode: 'image_and_video',
          skip_locked: true,
          failed_only: false,
          concurrency: { image: 1, video: 1 },
        }),
      });
      const data = await res.json();
      if (data.ok) {
        useStoryboardStore.getState().setActiveJob({
          job_id: data.job_id,
          status: 'running',
          progress: {
            total_tasks: data.total_tasks || 0,
            completed_tasks: 0,
            failed_tasks: 0,
            queued_tasks: data.total_tasks || 0,
            running_tasks: 0,
          },
          updated_scenes: [],
        });
        toast.success('Generate All dimulai');
      } else {
        toast.error(data.error || 'Gagal memulai generate');
      }
    } catch {
      toast.error('Gagal memulai generate');
    }
  }, [currentProject]);

  const handleSave = useCallback(async () => {
    if (!currentProject) return;
    try {
      const scenes = useStoryboardStore.getState().scenes;
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
      }));

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
      });
      const data = await res.json();
      if (data.ok) {
        toast.success(`Project tersimpan (${data.updated_scenes} scene diperbarui)`);
      } else {
        toast.error(data.error || 'Gagal menyimpan');
      }
    } catch {
      toast.error('Gagal menyimpan');
    }
  }, [currentProject]);

  // Empty state - no project loaded
  if (!currentProject) {
    return (
      <div className="relative flex flex-col min-h-screen bg-background overflow-hidden">
        {/* Subtle background gradient/pattern */}
        <div
          className="pointer-events-none absolute inset-0 opacity-70"
          style={{
            background:
              'radial-gradient(55% 55% at 50% 30%, color-mix(in oklch, var(--col-storyline) 10%, transparent) 0%, transparent 70%), radial-gradient(45% 45% at 80% 80%, color-mix(in oklch, var(--col-background) 10%, transparent) 0%, transparent 70%), radial-gradient(40% 40% at 15% 75%, color-mix(in oklch, var(--col-image) 8%, transparent) 0%, transparent 70%)',
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
            {/* Clapperboard icon in colored circular badge */}
            <div className="mx-auto mb-8 flex h-20 w-20 items-center justify-center rounded-full border bg-primary/5 shadow-sm">
              <Clapperboard className="h-10 w-10 text-primary" />
            </div>

            <h1 className="text-3xl font-bold tracking-tight mb-3">Kiwul Storyboard Studio</h1>
            <p className="text-muted-foreground text-base mb-8">
              Create, manage, and generate AI-powered storyboard content. Load a JSON file to get started.
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
                <FileText className="h-4 w-4" />
                Buka Project
              </Button>
            </div>

            <div className="text-xs text-muted-foreground space-y-1">
              <p>Supported formats: JSON with project and scenes</p>
              <p>Required fields: project.title, scenes[].scene_id, vo, image_prompt, video_prompt, duration</p>
            </div>
          </motion.div>
        </div>

        {/* Footer */}
        <footer className="relative border-t px-4 py-2 text-xs text-muted-foreground flex items-center justify-between mt-auto">
          <span>Kiwul Storyboard Studio v1.0</span>
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
    );
  }

  // Project loaded
  const scenes = useStoryboardStore.getState().scenes;
  const totalScenes = scenes.length;
  const bgCompleted = scenes.filter((s) => s.background_status === 'completed').length;
  const imgCompleted = scenes.filter((s) => s.image_status === 'completed').length;
  const vidCompleted = scenes.filter((s) => s.video_status === 'completed').length;

  const columnCounts: Record<MobileTab, number> = {
    storyline: totalScenes,
    background: bgCompleted,
    gambar: imgCompleted,
    video: vidCompleted,
  };

  const now = new Date();
  const timestamp = `${now.toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long' })}, ${now.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}`;

  return (
    <div className="flex flex-col h-screen bg-background">
      <LoadJsonDialog />
      <ProviderSettingsDialog />
      <ProjectListDialog />

      {/* Header bar (h-14) */}
      <header className="flex items-center justify-between gap-3 px-4 h-14 border-b bg-background/95 backdrop-blur shrink-0">
        <div className="flex items-center gap-3 min-w-0">
          {/* Small Clapperboard icon in colored badge */}
          <div className="flex h-8 w-8 items-center justify-center rounded-md border bg-primary/5 shrink-0">
            <Clapperboard className="h-4 w-4 text-primary" />
          </div>
          <span className="text-sm font-semibold shrink-0">Kiwul Studio</span>
          <Separator orientation="vertical" className="h-5 shrink-0" />
          <div className="flex items-center gap-1.5 min-w-0">
            <span className="font-semibold text-sm truncate" title={currentProject.title}>
              {currentProject.title}
            </span>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 text-muted-foreground shrink-0"
                >
                  <Pencil className="h-3 w-3" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="bottom">Edit project title</TooltipContent>
            </Tooltip>
          </div>
          <span className="hidden lg:inline text-xs text-muted-foreground ml-1 truncate">
            {timestamp}
          </span>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <Button
            size="sm"
            className="h-9 text-xs gap-1.5"
            style={{ backgroundColor: 'var(--col-storyline)', color: 'white' }}
            onClick={handleGenerateAll}
          >
            <Sparkles className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Generate All</span>
            <span className="sm:hidden">Generate</span>
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="h-9 text-xs gap-1.5"
            onClick={handleSave}
          >
            <Save className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Simpan</span>
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="h-9 text-xs gap-1.5 hidden sm:inline-flex"
          >
            <Eye className="h-3.5 w-3.5" />
            Preview
          </Button>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" className="h-9 w-9">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="bottom">More actions</TooltipContent>
          </Tooltip>
        </div>
      </header>

      {/* Column headers (h-10, desktop only) */}
      <div className="hidden md:grid grid-cols-4 h-10 border-b bg-muted/30 shrink-0">
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
          const isActive = mobileTab === col.key;
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
          );
        })}
      </div>

      {/* TopToolbar (kept as-is, rendered below column headers) */}
      <TopToolbar />

      {/* ReferencePanel (kept as-is) */}
      <ReferencePanel />

      {/* Main content: 4-column grid (desktop) */}
      <div className="hidden md:grid flex-1 min-h-0 grid-cols-4 divide-x divide-border overflow-hidden">
        <div className="overflow-y-auto custom-scrollbar">
          <StorylineColumn />
        </div>
        <div className="overflow-y-auto custom-scrollbar">
          <BackgroundColumn />
        </div>
        <div className="overflow-y-auto custom-scrollbar">
          <GambarColumn />
        </div>
        <div className="overflow-y-auto custom-scrollbar">
          <VideoColumn />
        </div>
      </div>

      {/* Mobile single-column content */}
      <div className="md:hidden flex-1 min-h-0 overflow-y-auto custom-scrollbar">
        {mobileTab === 'storyline' && <StorylineColumn />}
        {mobileTab === 'background' && <BackgroundColumn />}
        {mobileTab === 'gambar' && <GambarColumn />}
        {mobileTab === 'video' && <VideoColumn />}
      </div>

      {/* Footer (h-8) */}
      <footer className="flex items-center justify-between gap-3 px-4 h-8 border-t bg-background text-xs text-muted-foreground shrink-0">
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
  );
}
