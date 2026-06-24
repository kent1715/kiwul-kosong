'use client';

import { useCallback } from 'react';
import { Lock, Unlock, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from '@/components/ui/tooltip';
import { useStoryboardStore, SceneData } from '@/lib/store/storyboard-store';
import { SceneStatusBadge } from './SceneStatusBadge';

function getStatusLabel(status: string, type: 'img' | 'vid'): string {
  switch (status) {
    case 'completed': return 'Selesai';
    case 'running': return 'Diproses';
    case 'queued': return 'Antrian';
    case 'pending': return 'Menunggu';
    case 'failed': return 'Gagal';
    case 'skipped': return 'Dilewati';
    default: return status;
  }
}

export function StorylineColumn() {
  const { scenes, selectedSceneId, selectScene, updateScene, currentProject } = useStoryboardStore();

  const handleFieldChange = useCallback(
    (sceneId: string, field: keyof SceneData, value: string | number | boolean) => {
      updateScene(sceneId, { [field]: value });
    },
    [updateScene]
  );

  const handleToggleLock = useCallback(
    async (sceneId: string, currentLocked: boolean, e: React.MouseEvent) => {
      e.stopPropagation();
      updateScene(sceneId, { locked: !currentLocked });
      if (currentProject) {
        try {
          await fetch(`/api/storyboard/${currentProject.id}/scenes/${sceneId}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ locked: !currentLocked }),
          });
        } catch {}
      }
    },
    [updateScene, currentProject]
  );

  if (scenes.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
        <div
          className="mb-3 flex h-12 w-12 items-center justify-center rounded-full border"
          style={{ backgroundColor: 'color-mix(in oklch, var(--col-storyline) 8%, transparent)' }}
        >
          <Clock className="h-5 w-5" style={{ color: 'var(--col-storyline)' }} aria-hidden="true" />
        </div>
        <p className="text-sm font-medium text-muted-foreground">Belum ada scene</p>
        <p className="text-xs text-muted-foreground mt-1">Load storyboard JSON untuk memulai</p>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-1">
      {scenes.map((scene, index) => {
        const isSelected = scene.scene_id === selectedSceneId;
        const voPreview = scene.vo.length > 60 ? scene.vo.slice(0, 60) + '…' : scene.vo;

        return (
          <div
            key={scene.scene_id}
            className="relative pl-12 pb-4"
            onClick={() => selectScene(scene.scene_id)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                selectScene(scene.scene_id);
              }
            }}
          >
            {/* Timeline dot & line */}
            <div className="absolute left-0 top-0 bottom-0 flex flex-col items-center">
              <div
                className={`h-8 w-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0 z-10 border transition-colors ${
                  isSelected
                    ? 'text-white'
                    : 'bg-card text-muted-foreground hover:text-foreground'
                }`}
                style={
                  isSelected
                    ? {
                        backgroundColor: 'var(--col-storyline)',
                        borderColor: 'var(--col-storyline)',
                      }
                    : {
                        backgroundColor: 'color-mix(in oklch, var(--col-storyline) 8%, var(--card))',
                        borderColor: 'color-mix(in oklch, var(--col-storyline) 30%, var(--border))',
                      }
                }
                aria-label={`Scene ${scene.scene_number}`}
              >
                {String(scene.scene_number).padStart(2, '0')}
              </div>
              {index < scenes.length - 1 && (
                <div
                  className="w-px flex-1 mt-1"
                  style={{
                    backgroundColor: 'color-mix(in oklch, var(--col-storyline) 25%, transparent)',
                  }}
                  aria-hidden="true"
                />
              )}
            </div>

            {/* Card */}
            <div
              className={`rounded-xl border p-4 space-y-3 transition-all cursor-pointer ${
                isSelected
                  ? 'border-col-storyline shadow-sm'
                  : 'border-border bg-card hover:border-col-storyline/40'
              } ${scene.locked ? 'opacity-75' : ''}`}
              style={
                isSelected
                  ? { backgroundColor: 'color-mix(in oklch, var(--col-storyline) 5%, var(--card))' }
                  : undefined
              }
            >
              {/* Card Header */}
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <Badge
                      variant="secondary"
                      className="h-5 text-xs px-1.5 font-medium tabular-nums"
                    >
                      Scene {String(scene.scene_number).padStart(2, '0')}
                    </Badge>
                    {scene.locked && (
                      <Badge
                        variant="outline"
                        className="h-5 text-xs px-1.5 font-medium gap-1 text-amber-600 dark:text-amber-400 border-amber-500/40 bg-amber-500/10"
                      >
                        <Lock className="h-3 w-3" aria-hidden="true" />
                        Locked
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm font-medium truncate text-foreground">
                    {voPreview || <span className="text-muted-foreground italic">Tanpa VO</span>}
                  </p>
                </div>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 shrink-0"
                      onClick={(e) => handleToggleLock(scene.scene_id, scene.locked, e)}
                      aria-label={scene.locked ? 'Unlock scene' : 'Lock scene'}
                    >
                      {scene.locked ? (
                        <Lock className="h-3.5 w-3.5 text-amber-500" />
                      ) : (
                        <Unlock className="h-3.5 w-3.5 text-muted-foreground" />
                      )}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="bottom">
                    {scene.locked ? 'Unlock scene' : 'Lock scene'}
                  </TooltipContent>
                </Tooltip>
              </div>

              {/* VO / Narasi */}
              <div className="space-y-1.5">
                <label className="text-xs text-muted-foreground font-medium uppercase tracking-wide">
                  VO / Narasi
                </label>
                <Textarea
                  value={scene.vo}
                  onChange={(e) => handleFieldChange(scene.scene_id, 'vo', e.target.value)}
                  className="min-h-[60px] text-xs resize-none"
                  placeholder="Tulis narasi / voice-over untuk scene ini..."
                />
              </div>

              {/* Status badges */}
              <div className="flex items-center gap-1.5 flex-wrap">
                <SceneStatusBadge
                  status={scene.image_status}
                  label={`IMG: ${getStatusLabel(scene.image_status, 'img')}`}
                />
                <SceneStatusBadge
                  status={scene.video_status}
                  label={`VID: ${getStatusLabel(scene.video_status, 'vid')}`}
                />
              </div>

              {/* Duration */}
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground pt-0.5 border-t">
                <Clock className="h-3 w-3" aria-hidden="true" />
                <span>Durasi: <span className="font-medium text-foreground tabular-nums">{scene.duration}s</span></span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
