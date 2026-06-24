'use client';

import { useCallback, useState } from 'react';
import {
  Download,
  Settings,
  Play,
  Pause,
  Square,
  RotateCcw,
  Loader2,
  FolderOpen,
  FolderCog,
  Film,
  FileArchive,
  type LucideIcon,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from '@/components/ui/tooltip';
import { useStoryboardStore } from '@/lib/store/storyboard-store';
import { JobProgress as JobProgressComponent } from './JobProgress';
import { toast } from 'sonner';

type ToolbarTone = 'default' | 'warning' | 'danger';

function ToolbarButton({
  tooltip,
  icon: Icon,
  label,
  onClick,
  disabled,
  spin,
  tone = 'default',
}: {
  tooltip: string;
  icon: LucideIcon;
  label: string;
  onClick: () => void;
  disabled?: boolean;
  spin?: boolean;
  tone?: ToolbarTone;
}) {
  const toneClass =
    tone === 'warning'
      ? 'text-amber-600 hover:text-amber-700 hover:bg-amber-50 dark:text-amber-400 dark:hover:bg-amber-950/30'
      : tone === 'danger'
      ? 'text-destructive hover:bg-destructive/10'
      : '';
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className={`h-8 text-xs gap-1.5 px-2.5 ${toneClass}`}
          onClick={onClick}
          disabled={disabled}
        >
          <Icon className={`h-3.5 w-3.5 ${spin ? 'animate-spin' : ''}`} aria-hidden="true" />
          <span className="hidden md:inline">{label}</span>
        </Button>
      </TooltipTrigger>
      <TooltipContent side="bottom">{tooltip}</TooltipContent>
    </Tooltip>
  );
}

export function TopToolbar() {
  const {
    currentProject,
    activeJob,
    setLoadJsonDialogOpen,
    setProviderSettingsDialogOpen,
    setProjectListDialogOpen,
    setActiveJob,
    loadProject,
  } = useStoryboardStore();

  const [generating, setGenerating] = useState<string | null>(null);

  const isJobRunning = activeJob?.status === 'running' || activeJob?.status === 'queued';

  const handleExport = useCallback(async () => {
    if (!currentProject) return;
    try {
      const res = await fetch(`/api/storyboard/${currentProject.id}/export`);
      const data = await res.json();
      if (data.project) {
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${currentProject.title || 'storyboard'}_final.json`;
        a.click();
        URL.revokeObjectURL(url);
        toast.success('JSON diekspor');
      } else {
        toast.error(data.error || 'Ekspor gagal');
      }
    } catch {
      toast.error('Ekspor gagal');
    }
  }, [currentProject]);

  const handleGenerate = useCallback(async (mode: string) => {
    if (!currentProject) return;
    setGenerating(mode);
    try {
      const res = await fetch(`/api/storyboard/${currentProject.id}/generate-all`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mode,
          skip_locked: true,
          failed_only: mode === 'failed_only',
          concurrency: { image: 1, video: 1 },
        }),
      });
      const data = await res.json();
      if (data.ok) {
        setActiveJob({
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
        toast.success(`Generate dimulai (${mode})`);
      } else {
        toast.error(data.error || 'Gagal memulai generate');
      }
    } catch {
      toast.error('Gagal memulai generate');
    } finally {
      setGenerating(null);
    }
  }, [currentProject, setActiveJob]);

  const handleRenderFinalVideo = async () => {
    if (!currentProject?.id) return

    try {
      const res = await fetch(`/api/storyboard/${currentProject.id}/render`, {
        method: 'POST',
      })

      const data = await res.json()

      if (!data.ok) {
        alert(data.error || 'Render final video failed')
        console.error('[render final video]', data)
        return
      }

      alert('Final video berhasil dirender.')
    } catch (error) {
      console.error('[render final video]', error)
      alert('Render final video gagal.')
    }
  };

  const handleDownloadFinalVideo = () => {
    if (!currentProject?.id) return
    window.open(`/api/storyboard/${currentProject.id}/download/final?v=${Date.now()}`, '_blank')
  };

  const handleJobControl = useCallback(async (action: 'pause' | 'resume' | 'stop') => {
    if (!activeJob) return;
    try {
      const res = await fetch(`/api/storyboard/jobs/${activeJob.job_id}/${action}`, {
        method: 'POST',
      });
      const data = await res.json();
      if (data.ok) {
        toast.success(`Job ${action} berhasil`);
        setActiveJob({
          ...activeJob,
          status: action === 'pause' ? 'paused' : action === 'resume' ? 'running' : 'stopped',
        });
      } else {
        toast.error(data.error || `Gagal ${action} job`);
      }
    } catch {
      toast.error(`Gagal ${action} job`);
    }
  }, [activeJob, setActiveJob]);

  const handleAspectRatioChange = useCallback(async (value: string) => {
    if (!currentProject) return;
    try {
      const res = await fetch(`/api/storyboard/${currentProject.id}/update`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ aspect_ratio: value }),
      });
      const data = await res.json();
      if (data.ok) {
        loadProject(
          { ...currentProject, aspect_ratio: value },
          useStoryboardStore.getState().scenes
        );
        toast.success('Aspect ratio diperbarui');
      }
    } catch {
      toast.error('Gagal mengubah aspect ratio');
    }
  }, [currentProject, loadProject]);

  const handleDownloadZip = useCallback(async (type: 'images' | 'videos' | 'project') => {
    if (!currentProject) return;
    try {
      const res = await fetch(`/api/storyboard/${currentProject.id}/download?type=${type}`);
      if (res.ok) {
        const blob = await res.blob();
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${currentProject.title || 'storyboard'}_${type}.zip`;
        a.click();
        URL.revokeObjectURL(url);
      } else {
        const data = await res.json();
        toast.error(data.error || 'Unduhan gagal');
      }
    } catch {
      toast.error('Unduhan gagal');
    }
  }, [currentProject]);

  if (!currentProject) return null;

  return (
    <>
      <div className="flex items-center gap-1.5 px-4 py-2 overflow-x-auto border-b bg-background/95 backdrop-blur shrink-0">
        {/* Group 1: Aspect ratio selector + render + generate */}
        <Select
          value={currentProject.aspect_ratio}
          onValueChange={handleAspectRatioChange}
        >
          <SelectTrigger size="sm" className="h-8 w-[120px] text-xs">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="9:16">9:16 Portrait</SelectItem>
            <SelectItem value="16:9">16:9 Landscape</SelectItem>
          </SelectContent>
        </Select>

        <Separator orientation="vertical" className="h-5 mx-1" />

        <ToolbarButton
          tooltip="Render the final composite video"
          onClick={handleRenderFinalVideo}
          disabled={!currentProject}
          icon={Film}
          label="Render Final"
        />

        <ToolbarButton
          tooltip="Download the rendered final video"
          onClick={handleDownloadFinalVideo}
          disabled={!currentProject}
          icon={Download}
          label="Download Final"
        />

        <ToolbarButton
          tooltip="Retry generation for failed scenes only"
          onClick={() => handleGenerate('failed_only')}
          disabled={isJobRunning || !!generating}
          icon={generating === 'failed_only' ? Loader2 : RotateCcw}
          label="Retry Failed"
          spin={generating === 'failed_only'}
        />

        {/* Group 2: Job controls (visible only while a job is running) */}
        {isJobRunning && (
          <>
            <Separator orientation="vertical" className="h-5 mx-1" />
            <ToolbarButton
              tooltip={activeJob?.status === 'paused' ? 'Resume the running job' : 'Pause the running job'}
              onClick={() => handleJobControl(activeJob?.status === 'paused' ? 'resume' : 'pause')}
              icon={activeJob?.status === 'paused' ? Play : Pause}
              label={activeJob?.status === 'paused' ? 'Lanjut' : 'Jeda'}
              tone="warning"
            />
            <ToolbarButton
              tooltip="Stop the running job"
              onClick={() => handleJobControl('stop')}
              icon={Square}
              label="Stop"
              tone="danger"
            />
          </>
        )}

        {/* Group 3 (right side): Project / Load / Export / ZIP / Providers */}
        <div className="ml-auto flex items-center gap-1.5">
          <Separator orientation="vertical" className="h-5 mx-1" />
          <ToolbarButton
            tooltip="Open project list"
            onClick={() => setProjectListDialogOpen(true)}
            icon={FolderCog}
            label="Projects"
          />
          <ToolbarButton
            tooltip="Load a storyboard JSON file"
            onClick={() => setLoadJsonDialogOpen(true)}
            icon={FolderOpen}
            label="Load JSON"
          />
          <ToolbarButton
            tooltip="Export project as JSON"
            onClick={handleExport}
            icon={Download}
            label="Export"
          />
          <ToolbarButton
            tooltip="Download all assets as ZIP"
            onClick={() => handleDownloadZip('project')}
            icon={FileArchive}
            label="ZIP"
          />
          <ToolbarButton
            tooltip="Configure AI providers"
            onClick={() => setProviderSettingsDialogOpen(true)}
            icon={Settings}
            label="Providers"
          />
        </div>
      </div>

      {/* Job Progress Bar */}
      {activeJob && <JobProgressComponent />}
    </>
  );
}
