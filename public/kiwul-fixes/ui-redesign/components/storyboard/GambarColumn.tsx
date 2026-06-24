'use client';

import { useCallback, useState } from 'react';
import {
  Download,
  RotateCcw,
  ImageIcon,
  Loader2,
  RefreshCw,
  Users,
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
import { SceneCharacterSelector } from './SceneCharacterSelector';
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

export function GambarColumn() {
  const { scenes, currentProject, updateScene, selectedSceneId, selectScene } = useStoryboardStore();
  const [generating, setGenerating] = useState<string | null>(null);
  const [generatingAllImages, setGeneratingAllImages] = useState(false);
  const [showCharacterRefs, setShowCharacterRefs] = useState(true);

  const aspectRatio = currentProject?.aspect_ratio === '16:9' ? 16 / 9 : 9 / 16;

  const handleGenerateImage = useCallback(
    async (sceneId: string) => {
      if (!currentProject) return;
      setGenerating(sceneId);
      updateScene(sceneId, { image_status: 'running', error_message: null });
      try {
        const res = await fetch(
          `/api/storyboard/${currentProject.id}/scenes/${sceneId}/image`,
          { method: 'POST' }
        );
        const data = await res.json();
        if (data.ok) {
          updateScene(sceneId, {
            image_status: 'completed',
            image_path: data.image_path,
            error_message: null,
          });
          toast.success('Gambar berhasil dibuat');
        } else {
          updateScene(sceneId, {
            image_status: 'failed',
            error_message: data.error || 'Gagal membuat gambar',
          });
          toast.error(data.error || 'Gagal membuat gambar');
        }
      } catch (err) {
        updateScene(sceneId, {
          image_status: 'failed',
          error_message: err instanceof Error ? err.message : 'Unknown error',
        });
        toast.error('Gagal membuat gambar');
      } finally {
        setGenerating(null);
      }
    },
    [currentProject, updateScene]
  );

  const handleGenerateAllImagesColumn = useCallback(async () => {
    if (!currentProject) {
      toast.error('Project belum dipilih');
      return;
    }

    if (!scenes.length) {
      toast.error('Tidak ada scene');
      return;
    }

    setGeneratingAllImages(true);

    let successCount = 0;
    let failedCount = 0;

    try {
      for (const scene of scenes) {
        if (scene.locked) continue;

        setGenerating(scene.scene_id);
        updateScene(scene.scene_id, { image_status: 'running', error_message: null });

        try {
          const res = await fetch(
            `/api/storyboard/${currentProject.id}/scenes/${scene.scene_id}/image`,
            { method: 'POST' }
          );

          const data = await res.json();

          if (data.ok) {
            updateScene(scene.scene_id, {
              image_status: 'completed',
              image_path: data.image_path,
              error_message: null,
            });
            successCount++;
          } else {
            updateScene(scene.scene_id, {
              image_status: 'failed',
              error_message: data.error || 'Gagal membuat gambar',
            });
            failedCount++;
          }
        } catch (err) {
          updateScene(scene.scene_id, {
            image_status: 'failed',
            error_message: err instanceof Error ? err.message : 'Unknown error',
          });
          failedCount++;
        }
      }

      if (failedCount > 0) {
        toast.error(`Generate image selesai: ${successCount} sukses, ${failedCount} gagal`);
      } else {
        toast.success(`Semua image selesai: ${successCount} scene`);
      }
    } finally {
      setGenerating(null);
      setGeneratingAllImages(false);
    }
  }, [currentProject, scenes, updateScene]);

  const handleDownloadImage = useCallback(
    async (sceneId: string, sceneNumber: number) => {
      if (!currentProject) return;
      try {
        const res = await fetch(
          `/api/storyboard/${currentProject.id}/scenes/${sceneId}/download/image`
        );
        if (res.ok) {
          const blob = await res.blob();
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = `scene_${sceneNumber}_image.png`;
          a.click();
          URL.revokeObjectURL(url);
        } else {
          toast.error('Gagal mengunduh gambar');
        }
      } catch {
        toast.error('Gagal mengunduh gambar');
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
              style={{ backgroundColor: 'var(--col-image)' }}
              aria-hidden="true"
            />
            <span className="text-xs font-semibold uppercase tracking-wide text-foreground/80">
              Images
            </span>
            <Badge variant="secondary" className="h-5 text-xs px-1.5 tabular-nums font-medium">
              {scenes.filter(s => s.image_status === 'completed').length}/{scenes.length}
            </Badge>
          </div>
          <label className="flex items-center gap-1.5 cursor-pointer select-none">
            <Switch
              checked={showCharacterRefs}
              onCheckedChange={setShowCharacterRefs}
              className="scale-90"
              aria-label="Toggle character reference visibility"
            />
            <Label className="text-xs text-muted-foreground flex items-center gap-1">
              <Users className="h-3 w-3" />
              Refs
            </Label>
          </label>
        </div>
        <Button
          variant="default"
          size="sm"
          className="w-full h-8 text-xs gap-1.5"
          style={{ backgroundColor: 'var(--col-image)', color: 'white' }}
          disabled={generatingAllImages || Boolean(generating)}
          onClick={handleGenerateAllImagesColumn}
        >
          {generatingAllImages ? (
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
          ) : (
            <RefreshCw className="h-3.5 w-3.5" />
          )}
          Generate All Images
        </Button>
      </div>

      {/* Scene cards */}
      <div className="p-4 space-y-3 flex-1">
        {scenes.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
            <div
              className="mb-3 flex h-12 w-12 items-center justify-center rounded-full border"
              style={{ backgroundColor: 'color-mix(in oklch, var(--col-image) 8%, transparent)' }}
            >
              <ImageIcon className="h-5 w-5" style={{ color: 'var(--col-image)' }} aria-hidden="true" />
            </div>
            <p className="text-sm font-medium text-muted-foreground">Belum ada scene</p>
          </div>
        ) : (
          scenes.map((scene) => {
            const imageUrl = scene.image_path || null;
            const isGenerating = generating === scene.scene_id;
            const isSelected = scene.scene_id === selectedSceneId;

            return (
              <div
                key={scene.scene_id}
                className={`rounded-xl border p-4 space-y-3 transition-all cursor-pointer ${
                  isSelected
                    ? 'border-col-image shadow-sm'
                    : 'border-border bg-card hover:border-col-image/40'
                }`}
                style={
                  isSelected
                    ? { backgroundColor: 'color-mix(in oklch, var(--col-image) 5%, var(--card))' }
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
                    status={scene.image_status || 'pending'}
                    label={`IMG: ${getStatusLabel(scene.image_status || 'pending')}`}
                  />
                </div>

                {/* Preview */}
                <div className="rounded-lg border bg-muted/30 overflow-hidden">
                  <AspectRatio ratio={aspectRatio} className="bg-black/5 dark:bg-white/5">
                    {imageUrl ? (
                      <img
                        src={imageUrl}
                        alt={`Scene ${scene.scene_number}`}
                        className="w-full h-full object-contain"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <div className="text-center">
                          {isGenerating ? (
                            <Loader2
                              className="h-7 w-7 mx-auto animate-spin"
                              style={{ color: 'var(--col-image)' }}
                              aria-hidden="true"
                            />
                          ) : (
                            <ImageIcon className="h-7 w-7 mx-auto text-muted-foreground/30" aria-hidden="true" />
                          )}
                          <p className="text-xs text-muted-foreground mt-1.5">
                            {scene.image_status === 'pending'
                              ? 'Belum Dibuat'
                              : scene.image_status === 'running'
                              ? 'Memproses...'
                              : scene.image_status === 'failed'
                              ? 'Gagal'
                              : 'Tidak ada gambar'}
                          </p>
                        </div>
                      </div>
                    )}
                  </AspectRatio>
                </div>

                {/* Error message */}
                {scene.error_message && scene.image_status === 'failed' && (
                  <div className="flex items-start gap-2 rounded-md border border-destructive/30 bg-destructive/10 p-2.5 text-xs text-destructive">
                    <AlertCircle className="h-3.5 w-3.5 shrink-0 mt-0.5" aria-hidden="true" />
                    <span className="break-words">{scene.error_message}</span>
                  </div>
                )}

                {/* Prompt */}
                <div className="space-y-1.5">
                  <label className="text-xs text-muted-foreground font-medium uppercase tracking-wide">
                    Prompt Gambar
                  </label>
                  <Textarea
                    value={scene.image_prompt || ''}
                    onChange={(e) =>
                      updateScene(scene.scene_id, { image_prompt: e.target.value })
                    }
                    onBlur={async (e) => {
                      if (!currentProject) return;
                      const value = e.target.value;
                      const res = await fetch(`/api/storyboard/${currentProject.id}/scenes/${scene.scene_id}`, {
                        method: 'PATCH',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ image_prompt: value }),
                      });
                      const data = await res.json();
                      if (!data.ok) {
                        toast.error(data.error || 'Gagal menyimpan prompt gambar');
                      } else {
                        toast.success('Prompt gambar tersimpan');
                      }
                    }}
                    className="min-h-[80px] text-xs resize-y"
                    placeholder="Edit prompt gambar..."
                    disabled={isGenerating || scene.image_status === 'running'}
                  />
                </div>

                {/* Scene Character Reference */}
                {currentProject?.id && scene?.scene_id && showCharacterRefs && (
                  <SceneCharacterSelector
                    projectId={currentProject.id}
                    sceneId={scene.scene_id}
                  />
                )}

                {/* Action Buttons */}
                <div className="flex items-center gap-2">
                  {!imageUrl ? (
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-8 text-xs gap-1.5 flex-1"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleGenerateImage(scene.scene_id);
                      }}
                      disabled={isGenerating || scene.locked || generatingAllImages}
                    >
                      {isGenerating ? (
                        <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      ) : (
                        <RotateCcw className="h-3.5 w-3.5" />
                      )}
                      Generate
                    </Button>
                  ) : (
                    <>
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-8 text-xs gap-1.5 flex-1"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleGenerateImage(scene.scene_id);
                        }}
                        disabled={isGenerating || scene.locked || generatingAllImages}
                      >
                        {isGenerating ? (
                          <Loader2 className="h-3.5 w-3.5 animate-spin" />
                        ) : (
                          <RotateCcw className="h-3.5 w-3.5" />
                        )}
                        Regenerate
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-8 text-xs gap-1.5 flex-1"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDownloadImage(scene.scene_id, scene.scene_number);
                        }}
                        disabled={!imageUrl}
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
