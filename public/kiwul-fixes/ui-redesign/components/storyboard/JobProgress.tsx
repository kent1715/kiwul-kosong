'use client';

import { useEffect, useRef, useCallback } from 'react';
import {
  Loader2,
  CheckCircle2,
  XCircle,
  Pause,
  Square,
  type LucideIcon,
} from 'lucide-react';
import { useStoryboardStore } from '@/lib/store/storyboard-store';

/**
 * Status visual metadata for the active job.
 * `color` is a CSS variable reference (defined in globals.css) so the palette
 * stays centralized and themeable.
 */
const JOB_STATUS_META: Record<
  string,
  { color: string; label: string; icon: LucideIcon; spin: boolean }
> = {
  queued: { color: 'var(--status-queued)', label: 'Queued', icon: Loader2, spin: true },
  running: { color: 'var(--status-running)', label: 'Running', icon: Loader2, spin: true },
  paused: { color: 'var(--status-running)', label: 'Paused', icon: Pause, spin: false },
  stopped: { color: 'var(--status-failed)', label: 'Stopped', icon: Square, spin: false },
  completed: { color: 'var(--status-completed)', label: 'Completed', icon: CheckCircle2, spin: false },
  failed: { color: 'var(--status-failed)', label: 'Failed', icon: XCircle, spin: false },
};

export function JobProgress() {
  const {
    currentProject,
    activeJob,
    setActiveJob,
    updateSceneFromJob,
    isPolling,
    setIsPolling,
    setScenes,
  } = useStoryboardStore();
  const pollingRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const pollJobStatus = useCallback(async () => {
    if (!activeJob) return;
    try {
      const res = await fetch(`/api/storyboard/jobs/${activeJob.job_id}`);
      const data = await res.json();
      if (data.ok && data.job_id) {
        const job = {
          job_id: data.job_id,
          status: data.status,
          progress: data.progress,
          updated_scenes: data.updated_scenes || [],
        };
        setActiveJob(job);

        // Update scenes from job
        if (job.updated_scenes && job.updated_scenes.length > 0) {
          updateSceneFromJob(job.updated_scenes);
        }

        // Force refresh scenes from database so completed videos/images appear in UI
        if (currentProject?.id) {
          try {
            const sceneRes = await fetch(`/api/storyboard/${currentProject.id}/scenes`, {
              cache: 'no-store',
            });
            const sceneData = await sceneRes.json();
            if (sceneData.ok && Array.isArray(sceneData.scenes)) {
              setScenes(sceneData.scenes);
            }
          } catch {
            // Silently fail scene refresh
          }
        }

        // Stop polling if job is done
        if (['completed', 'stopped', 'failed'].includes(job.status)) {
          setIsPolling(false);
          if (pollingRef.current) {
            clearInterval(pollingRef.current);
            pollingRef.current = null;
          }
        }
      }
    } catch {
      // Silently fail polling
    }
  }, [activeJob, currentProject?.id, setActiveJob, updateSceneFromJob, setIsPolling, setScenes]);

  // Start/stop polling
  useEffect(() => {
    if (isPolling && activeJob && !pollingRef.current) {
      pollingRef.current = setInterval(pollJobStatus, 3000);
    }
    if (!isPolling && pollingRef.current) {
      clearInterval(pollingRef.current);
      pollingRef.current = null;
    }
    return () => {
      if (pollingRef.current) {
        clearInterval(pollingRef.current);
        pollingRef.current = null;
      }
    };
  }, [isPolling, activeJob, pollJobStatus]);

  // Start polling when job starts
  useEffect(() => {
    if (activeJob && ['running', 'queued'].includes(activeJob.status) && !isPolling) {
      setIsPolling(true);
    }
  }, [activeJob, isPolling, setIsPolling]);

  if (!activeJob) return null;

  const { progress, status } = activeJob;
  const totalTasks = progress.total_tasks || 0;
  const completedTasks = progress.completed_tasks || 0;
  const failedTasks = progress.failed_tasks || 0;
  const runningTasks = progress.running_tasks || 0;
  const queuedTasks = progress.queued_tasks || 0;

  const percent = totalTasks > 0 ? Math.round(((completedTasks + failedTasks) / totalTasks) * 100) : 0;

  const meta = JOB_STATUS_META[status] || JOB_STATUS_META.running;
  const StatusIcon = meta.icon;

  return (
    <div className="border-t bg-muted/40 px-4 py-2.5">
      <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
        {/* Status badge */}
        <div className="flex items-center gap-2 text-xs">
          <StatusIcon
            className={`h-3.5 w-3.5 ${meta.spin ? 'animate-spin' : ''}`}
            style={{ color: meta.color }}
            aria-hidden="true"
          />
          <span className="font-medium text-foreground">Job</span>
          <span className="font-semibold" style={{ color: meta.color }}>
            {meta.label}
          </span>
        </div>

        {/* Progress bar (h-2, rounded-full, colored by status) */}
        <div className="flex-1 min-w-[140px] max-w-md">
          <div
            className="relative h-2 w-full overflow-hidden rounded-full bg-muted-foreground/15"
            role="progressbar"
            aria-valuenow={percent}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label={`Job progress: ${percent}%`}
          >
            <div
              className="h-full rounded-full transition-all duration-500 ease-out"
              style={{
                width: `${percent}%`,
                backgroundColor: meta.color,
              }}
            />
          </div>
        </div>

        {/* Percentage + counts */}
        <div className="text-xs font-medium tabular-nums">
          {percent}%
          <span className="ml-1.5 text-muted-foreground">
            ({completedTasks}/{totalTasks})
          </span>
        </div>

        {/* Per-state counters */}
        <div className="hidden sm:flex items-center gap-3 text-xs">
          <span className="flex items-center gap-1.5">
            <span
              className="h-1.5 w-1.5 rounded-full"
              style={{ backgroundColor: 'var(--status-completed)' }}
              aria-hidden="true"
            />
            <span className="text-muted-foreground tabular-nums">{completedTasks} done</span>
          </span>
          <span className="flex items-center gap-1.5">
            <span
              className="h-1.5 w-1.5 rounded-full"
              style={{ backgroundColor: 'var(--status-failed)' }}
              aria-hidden="true"
            />
            <span className="text-muted-foreground tabular-nums">{failedTasks} fail</span>
          </span>
          <span className="flex items-center gap-1.5">
            <span
              className="h-1.5 w-1.5 rounded-full"
              style={{ backgroundColor: 'var(--status-running)' }}
              aria-hidden="true"
            />
            <span className="text-muted-foreground tabular-nums">{runningTasks} running</span>
          </span>
          <span className="flex items-center gap-1.5">
            <span
              className="h-1.5 w-1.5 rounded-full"
              style={{ backgroundColor: 'var(--status-pending)' }}
              aria-hidden="true"
            />
            <span className="text-muted-foreground tabular-nums">{queuedTasks} queued</span>
          </span>
        </div>
      </div>
    </div>
  );
}
