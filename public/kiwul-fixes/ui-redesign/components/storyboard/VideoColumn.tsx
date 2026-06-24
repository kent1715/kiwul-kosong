'use client';

import { useCallback, useState } from 'react';
import {
  Download,
  Film,
  Loader2,
  RefreshCw,
  Play,
  Eye,
  EyeOff,
  AlertCircle,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from '@/components/ui/tooltip';
import { useStoryboardStore } from '@/lib/store/storyboard-store';
import { SceneStatusBadge } from './SceneStatusBadge';
import { toast } from 'sonner';

function getStatusLabel(status: string): string {
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

export function VideoColumn() {
  const { scenes, currentProject, updateScene, selectedSceneId, selectScene } = useStoryboardStore();
  const [generating, setGenerating] = useState<string | null>(null);
  const [generatingAllVideos, setGeneratingAllVideos] = useState(false);
  const [showPrompts, setShowPrompts] = useState(true);

  const aspectRatio = currentProject?.aspect_ratio === '16:9' ? 16 / 9 : 9 / 16;

  const handleGenerateVideo = useCallback(
    async (sceneId: string) => {
      if (!currentProject) return;
      setGenerating(sceneId);
      updateScene(sceneId, { video_status: 'running', error_message: null });
      try {
        const res = await fetch(
          `/api/storyboard/${currentProject.id}/scenes/${sceneId}/video`,
          { method: 'POST' }
        );
        const data = await res.json();
        if (data.ok) {
          updateScene(sceneId, {
            video_status: 'completed',
            video_path: data.video_path,
            error_message: null,
          });
          toast.success('Video berhasil dibuat');
        } else {
          updateScene(sceneId, {
            video_status: 'failed',
            error_message: data.error || 'Gagal membuat video',
          });
          toast.error(data.error || 'Gagal membuat video');
        }
      } catch (err) {
        updateScene(sceneId, {
          video_status: 'failed',
          error_message: err instanceof Error ? err.message : 'Unknown error',
        });
        toast.error('Gagal membuat video');
      } finally {
        setGenerating(null);
      }
    },
    [currentProject, updateScene]
  );

  const handleGenerateAllVideosColumn = useCallback(async () => {
    if (!currentProject) {
      toast.error('Project belum dipilih');
      return;
    }

    if (!scenes.length) {
      toast.error('Tidak ada scene');
      return;
    }

    setGeneratingAllVideos(true);

    let successCount = 0;
    let failedCount = 0;
    let skippedCount = 0;

    try {
      for (const scene of scenes) {
        if (scene.locked) continue;

        if (scene.image_status !== 'completed') {
          skippedCount++;
          continue;
        }

        setGenerating(scene.scene_id);
        updateScene(scene.scene_id, { video_status: 'running', error_message: null });

        try {
          const res = await fetch(
            `/api/storyboard/${currentProject.id}/scenes/${scene.scene_id}/video`,
            { method: 'POST' }
          );

          const data = await res.json();

          if (data.ok) {
            updateScene(scene.scene_id, {
              video_status: 'completed',
              video_path: data.video_path,
              error_message: null,
            });
            successCount++;
          } else {
            updateScene(scene.scene_id, {
              video_status: 'failed',
              error_message: data.error || 'Gagal membuat video',
            });
            failedCount++;
          }
        } catch (err) {
          updateScene(scene.scene_id, {
            video_status: 'failed',
            error_message: err instanceof Error ? err.message : 'Unknown error',
          });
          failedCount++;
        }
      }

      if (failedCount > 0 || skippedCount > 0) {
        toast.error(`Generate video selesai: ${successCount} sukses, ${failedCount} gagal, ${skippedCount} dilewati`);
      } else {
        toast.success(`Semua video selesai: ${successCount} scene`);
      }
    } finally {
      setGenerating(null);
      setGeneratingAllVideos(false);
    }
  }, [currentProject, scenes, updateScene]);

  const handleDownloadVideo = useCallback(
    async (sceneId: string, sceneNumber: number) => {
      if (!currentProject) return;
      try {
        const res = await fetch(
          `/api/storyboard/${currentProject.id}/scenes/${sceneId}/download/video?v=${Date.now()}`
        );
        if (res.ok) {
          const blob = await res.blob();
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = `scene_${sceneNumber}_video.mp4`;
          a.click();
          URL.revokeObjectURL(url);
        } else {
          toast.error('Gagal mengunduh video');
        }
      } catch {
        toast.error('Gagal mengunduh video');
      }
    },
    [currentProject]
  );

  return (
    <div className="flex flex-col h-full">
      {/* Sticky column header */}
      <div className="sticky top-0 z-10 bg-background/95 backdrop-blur border-b px-4 py-3 space-y-2.5">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span
              className="h-2 w-2 rounded-full shrink-0"
              style={{ backgroundColor: 'var(--col-video)' }}
              aria-hidden="true"
            />
            <span className="text-xs font-semibold uppercase tracking-wide text-foreground/80">
              Videos
            </span>
            <Badge variant="secondary" className="h-5 text-xs px-1.5 tabular-nums font-medium">
              {scenes.filter(s => s.video_status === 'completed').length}/{scenes.length}
            </Badge>
          </div>
          <label className="flex items-center gap-1.5 cursor-pointer select-none">
            <Switch
              checked={showPrompts}
              onCheckedChange={setShowPrompts}
              className="scale-90"
              aria-label="Toggle prompt visibility"
            />
            <Label className="text-xs text-muted-foreground flex items-center gap-1">
              {showPrompts ? <Eye className="h-3 w-3" /> : <EyeOff className="h-3 w-3" />}
              Prompts
            </Label>
          </label>
        </div>
        <Button
          variant="default"
          size="sm"
          className="w-full h-8 text-xs gap-1.5"
          style={{ backgroundColor: 'var(--col-video)', color: 'white' }}
          disabled={generatingAllVideos || Boolean(generating)}
          onClick={handleGenerateAllVideosColumn}
        >
          {generatingAllVideos ? (
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
          ) : (
            <RefreshCw className="h-3.5 w-3.5" />
          )}
          Generate All Videos
        </Button>
      </div>

      {/* Scene cards */}
      <div className="p-4 space-y-3 flex-1">
        {scenes.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
            <div
              className="mb-3 flex h-12 w-12 items-center justify-center rounded-full border"
              style={{ backgroundColor: 'color-mix(in oklch, var(--col-video) 8%, transparent)' }}
            >
              <Film className="h-5 w-5" style={{ color: 'var(--col-video)' }} aria-hidden="true" />
            </div>
            <p className="text-sm font-medium text-muted-foreground">Belum ada scene</p>
          </div>
        ) : (
          scenes.map((scene) => {
            const videoUrl = scene.video_path
              ? `/api/storyboard/${currentProject?.id}/scenes/${scene.scene_id}/download/video?v=${Date.now()}`
              : null;
            const isGenerating = generating === scene.scene_id;
            const isSelected = scene.scene_id === selectedSceneId;

            return (
              <div
                key={scene.scene_id}
                className={`rounded-xl border p-4 space-y-3 transition-all cursor-pointer ${
                  isSelected
                    ? 'border-col-video shadow-sm'
                    : 'border-border bg-card hover:border-col-video/40'
                }`}
                style={
                  isSelected
                    ? { backgroundColor: 'color-mix(in oklch, var(--col-video) 5%, var(--card))' }
                    : undefined
                }
                onClick={() => selectScene(scene.scene_id)}
              >
                {/* Header */}
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2 min-w-0">
                    <Badge
                      variant="secondary"
                      className="h-5 text-xs px-1.5 font-medium tabular-nums"
                    >
                      #{String(scene.scene_number).padStart(2, '0')}
                    </Badge>
                    <span className="text-xs font-medium text-muted-foreground truncate">
                      {scene.scene_id}
                    </span>
                  </div>
                  <SceneStatusBadge
                    status={scene.video_status || 'pending'}
                    label={`VID: ${getStatusLabel(scene.video_status || 'pending')}`}
                  />
                </div>

                {/* Video Preview */}
                <div className="rounded-lg border bg-muted/30 overflow-hidden">
                  <AspectRatio ratio={aspectRatio} className="bg-black/5 dark:bg-white/5">
                    {videoUrl ? (
                      <video
                        src={videoUrl}
                        controls
                        className="w-full h-full object-contain"
                        preload="metadata"
                        onClick={(e) => e.stopPropagation()}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <div className="text-center">
                          {isGenerating ? (
                            <Loader2
                              className="h-7 w-7 mx-auto animate-spin"
                              style={{ color: 'var(--col-video)' }}
                              aria-hidden="true"
                            />
                          ) : scene.image_status !== 'completed' ? (
                            <Film className="h-7 w-7 mx-auto text-muted-foreground/30" aria-hidden="true" />
                          ) : (
                            <div
                              className="h-10 w-10 mx-auto rounded-full flex items-center justify-center"
                              style={{ backgroundColor: 'color-mix(in oklch, var(--col-video) 20%, transparent)' }}
                            >
                              <Play className="h-4 w-4 ml-0.5" style={{ color: 'var(--col-video)' }} aria-hidden="true" />
                            </div>
                          )}
                          <p className="text-xs text-muted-foreground mt-1.5">
                            {scene.video_status === 'pending'
                              ? scene.image_status !== 'completed'
                                ? 'Buat gambar dulu'
                                : 'Belum Dibuat'
                              : scene.video_status === 'running'
                              ? 'Memproses...'
                              : scene.video_status === 'failed'
                              ? 'Gagal'
                              : 'Tidak ada video'}
                          </p>
                        </div>
                      </div>
                    )}
                  </AspectRatio>
                </div>

                {/* Error message */}
                {scene.error_message && scene.video_status === 'failed' && (
                  <div className="flex items-start gap-2 rounded-md border border-destructive/30 bg-destructive/10 p-2.5 text-xs text-destructive">
                    <AlertCircle className="h-3.5 w-3.5 shrink-0 mt-0.5" aria-hidden="true" />
                    <span className="break-words">{scene.error_message}</span>
                  </div>
                )}

                {/* Prompt */}
                {showPrompts && (
                  <div className="space-y-1.5">
                    <label className="text-xs text-muted-foreground font-medium uppercase tracking-wide">
                      Prompt Motion
                    </label>
                    <Textarea
                      value={scene.video_prompt || ''}
                      onChange={(e) =>
                        updateScene(scene.scene_id, { video_prompt: e.target.value })
                      }
                      onBlur={async (e) => {
                        if (!currentProject) return;
                        const value = e.target.value;
                        const res = await fetch(`/api/storyboard/${currentProject.id}/scenes/${scene.scene_id}`, {
                          method: 'PATCH',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify({ video_prompt: value }),
                        });
                        const data = await res.json();
                        if (!data.ok) {
                          toast.error(data.error || 'Gagal menyimpan prompt video');
                        } else {
                          toast.success('Prompt video tersimpan');
                        }
                      }}
                      className="min-h-[80px] text-xs resize-y"
                      placeholder="Edit prompt video..."
                      disabled={isGenerating || scene.video_status === 'running'}
                    />
                  </div>
                )}

                {/* Duration */}
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground border-t pt-2">
                  <Film className="h-3 w-3" aria-hidden="true" />
                  <span>Durasi: <span className="font-medium text-foreground tabular-nums">{scene.duration} detik</span></span>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-2">
                  {!videoUrl ? (
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-8 text-xs gap-1.5 flex-1"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleGenerateVideo(scene.scene_id);
                      }}
                      disabled={isGenerating || scene.locked || scene.image_status !== 'completed' || generatingAllVideos}
                    >
                      {isGenerating ? (
                        <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      ) : (
                        <Play className="h-3.5 w-3.5" />
                      )}
                      Generate Video
                    </Button>
                  ) : (
                    <>
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-8 text-xs gap-1.5 flex-1"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleGenerateVideo(scene.scene_id);
                        }}
                        disabled={isGenerating || scene.locked || generatingAllVideos}
                      >
                        {isGenerating ? (
                          <Loader2 className="h-3.5 w-3.5 animate-spin" />
                        ) : (
                          <Play className="h-3.5 w-3.5" />
                        )}
                        Regenerate
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-8 text-xs gap-1.5 flex-1"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDownloadVideo(scene.scene_id, scene.scene_number);
                        }}
                        disabled={!videoUrl}
                      >
                        <Download className="h-3.5 w-3.5" />
                        Download
                      </Button>
                    </>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
