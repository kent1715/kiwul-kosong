'use client';

import { useCallback, useState } from 'react';
import {
  ImageIcon,
  Loader2,
  RefreshCw,
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
import { useStoryboardStore, SceneData } from '@/lib/store/storyboard-store';
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

export function BackgroundColumn() {
  const { scenes, selectedSceneId, selectScene, updateScene, currentProject } = useStoryboardStore();
  const [generatingSceneId, setGeneratingSceneId] = useState<string | null>(null);
  const [generatingAll, setGeneratingAll] = useState(false);
  const [showPrompts, setShowPrompts] = useState(false);

  const aspectRatio = currentProject?.aspect_ratio === '16:9' ? 16 / 9 : 9 / 16;

  const handleFieldChange = useCallback(
    (sceneId: string, field: keyof SceneData, value: string | number | boolean) => {
      updateScene(sceneId, { [field]: value });
    },
    [updateScene]
  );

  const handleGenerateBackground = useCallback(
    async (scene: SceneData) => {
      if (!currentProject?.id) {
        toast.error('Project belum dipilih');
        return;
      }

      setGeneratingSceneId(scene.scene_id);

      updateScene(scene.scene_id, {
        background_status: 'running',
        background_error_message: null,
        error_message: null,
      });

      try {
        const res = await fetch(
          `/api/storyboard/${currentProject.id}/scenes/${scene.scene_id}/background`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: '{}',
          }
        );

        const data = await res.json();

        if (!res.ok || !data.ok) {
          throw new Error(data.error || data.message || 'Background generation failed');
        }

        updateScene(scene.scene_id, {
          background_status: 'completed',
          background_path: data.background_path,
          background_error_message: null,
          image_status: 'pending',
          image_path: null,
          error_message: null,
        });

        toast.success(`Background ${scene.scene_id} selesai`);
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Unknown background error';

        updateScene(scene.scene_id, {
          background_status: 'failed',
          background_error_message: message,
          error_message: message,
        });

        toast.error(message);
      } finally {
        setGeneratingSceneId(null);
      }
    },
    [currentProject, updateScene]
  );


  const handleGenerateAllBackgrounds = useCallback(async () => {
    if (!currentProject?.id) {
      toast.error('Project belum dipilih');
      return;
    }

    if (!scenes.length) {
      toast.error('Tidak ada scene');
      return;
    }

    setGeneratingAll(true);

    let successCount = 0;
    let failedCount = 0;

    try {
      for (const scene of scenes) {
        setGeneratingSceneId(scene.scene_id);

        updateScene(scene.scene_id, {
          background_status: 'running',
          background_error_message: null,
          error_message: null,
        });

        try {
          const res = await fetch(
            `/api/storyboard/${currentProject.id}/scenes/${scene.scene_id}/background`,
            {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: '{}',
            }
          );

          const data = await res.json();

          if (!res.ok || !data.ok) {
            throw new Error(data.error || data.message || 'Background generation failed');
          }

          updateScene(scene.scene_id, {
            background_status: 'completed',
            background_path: data.background_path,
            background_error_message: null,
            image_status: 'pending',
            image_path: null,
            error_message: null,
          });

          successCount++;
        } catch (err) {
          const message = err instanceof Error ? err.message : 'Unknown background error';

          updateScene(scene.scene_id, {
            background_status: 'failed',
            background_error_message: message,
            error_message: message,
          });

          failedCount++;
          console.error('[generate all backgrounds failed]', {
            sceneId: scene.scene_id,
            message,
          });
        }
      }

      if (failedCount > 0) {
        toast.error(`Background selesai: ${successCount} sukses, ${failedCount} gagal`);
      } else {
        toast.success(`Semua background selesai: ${successCount} scene`);
      }
    } finally {
      setGeneratingSceneId(null);
      setGeneratingAll(false);
    }
  }, [currentProject, scenes, updateScene]);

  return (
    <div className="flex flex-col h-full">
      {/* Sticky column header */}
      <div className="sticky top-0 z-10 bg-background/95 backdrop-blur border-b px-4 py-3 space-y-2.5">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span
              className="h-2 w-2 rounded-full shrink-0"
              style={{ backgroundColor: 'var(--col-background)' }}
              aria-hidden="true"
            />
            <span className="text-xs font-semibold uppercase tracking-wide text-foreground/80">
              Backgrounds
            </span>
            <Badge variant="secondary" className="h-5 text-xs px-1.5 tabular-nums font-medium">
              {scenes.filter(s => s.background_status === 'completed').length}/{scenes.length}
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
          style={{ backgroundColor: 'var(--col-background)', color: 'white' }}
          disabled={generatingAll || Boolean(generatingSceneId)}
          onClick={handleGenerateAllBackgrounds}
        >
          {generatingAll ? (
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
          ) : (
            <RefreshCw className="h-3.5 w-3.5" />
          )}
          Generate All Backgrounds
        </Button>
      </div>

      {/* Scene cards */}
      <div className="p-4 space-y-3 flex-1">
        {scenes.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
            <div
              className="mb-3 flex h-12 w-12 items-center justify-center rounded-full border"
              style={{ backgroundColor: 'color-mix(in oklch, var(--col-background) 8%, transparent)' }}
            >
              <ImageIcon className="h-5 w-5" style={{ color: 'var(--col-background)' }} aria-hidden="true" />
            </div>
            <p className="text-sm font-medium text-muted-foreground">Belum ada scene</p>
          </div>
        ) : (
          scenes.map((scene) => {
            const isSelected = scene.scene_id === selectedSceneId;
            const isGenerating = generatingSceneId === scene.scene_id || scene.background_status === 'running';
            const showPromptFields = isSelected || showPrompts;

            return (
              <div
                key={scene.scene_id}
                className={`rounded-xl border p-4 space-y-3 transition-all cursor-pointer ${
                  isSelected
                    ? 'border-col-background shadow-sm'
                    : 'border-border bg-card hover:border-col-background/40'
                }`}
                style={
                  isSelected
                    ? { backgroundColor: 'color-mix(in oklch, var(--col-background) 5%, var(--card))' }
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
                    status={scene.background_status || 'pending'}
                    label={`BG: ${getStatusLabel(scene.background_status || 'pending')}`}
                  />
                </div>

                {/* Preview */}
                <div className="rounded-lg overflow-hidden border bg-muted/30">
                  <AspectRatio ratio={aspectRatio} className="bg-black/5 dark:bg-white/5">
                    {scene.background_path ? (
                      <img
                        src={scene.background_path}
                        alt={`${scene.scene_id} background`}
                        className="w-full h-full object-contain"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <div className="text-center">
                          {isGenerating ? (
                            <Loader2
                              className="h-7 w-7 mx-auto animate-spin"
                              style={{ color: 'var(--col-background)' }}
                              aria-hidden="true"
                            />
                          ) : (
                            <ImageIcon className="h-7 w-7 mx-auto text-muted-foreground/30" aria-hidden="true" />
                          )}
                          <p className="text-xs text-muted-foreground mt-1.5">
                            {isGenerating ? 'Memproses...' : 'Belum ada background'}
                          </p>
                        </div>
                      </div>
                    )}
                  </AspectRatio>
                </div>

                {/* Error message */}
                {scene.background_error_message && (
                  <div className="flex items-start gap-2 rounded-md border border-destructive/30 bg-destructive/10 p-2.5 text-xs text-destructive">
                    <AlertCircle className="h-3.5 w-3.5 shrink-0 mt-0.5" aria-hidden="true" />
                    <span className="break-words">{scene.background_error_message}</span>
                  </div>
                )}

                {/* Prompt fields (selected or showPrompts) */}
                {showPromptFields && (
                  <div className="space-y-3 pt-1">
                    <div className="space-y-1.5">
                      <label className="text-xs text-muted-foreground font-medium uppercase tracking-wide">
                        Background Prompt
                      </label>
                      <Textarea
                        value={scene.background_prompt || ''}
                        onChange={(e) => handleFieldChange(scene.scene_id, 'background_prompt', e.target.value)}
                        className="min-h-[80px] text-xs resize-y"
                        placeholder="Environment only, empty 2D background..."
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs text-muted-foreground font-medium uppercase tracking-wide">
                        Background Negative
                      </label>
                      <Textarea
                        value={scene.background_negative_prompt || ''}
                        onChange={(e) => handleFieldChange(scene.scene_id, 'background_negative_prompt', e.target.value)}
                        className="min-h-[60px] text-xs resize-y"
                        placeholder="people, face, silhouette, blurry person..."
                      />
                    </div>
                  </div>
                )}

                {/* Action */}
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full h-8 text-xs gap-1.5"
                      disabled={isGenerating || generatingAll}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleGenerateBackground(scene);
                      }}
                    >
                      {isGenerating ? (
                        <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      ) : (
                        <RefreshCw className="h-3.5 w-3.5" />
                      )}
                      {scene.background_path ? 'Regenerate Background' : 'Generate Background'}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="bottom">
                    {scene.background_path ? 'Regenerate background image' : 'Generate background image'}
                  </TooltipContent>
                </Tooltip>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
