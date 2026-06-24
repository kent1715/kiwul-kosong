'use client';

import { useCallback, useEffect, useState } from 'react';
import { Users, UserPlus, RefreshCw, X, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select';
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from '@/components/ui/tooltip';

type CharacterRef = {
  id?: string;
  kind?: string;
  name?: string;
  role?: string;
  file_name?: string;
  original_name?: string;
  url?: string;
};

type Props = {
  projectId: string;
  sceneId: string;
};

function labelForCharacter(item: CharacterRef) {
  return item.name || item.original_name || item.file_name || item.id || 'Character';
}

function getInitial(name: string) {
  const trimmed = name.trim();
  if (!trimmed) return '?';
  return trimmed.charAt(0).toUpperCase();
}

export function SceneCharacterSelector({ projectId, sceneId }: Props) {
  const [characters, setCharacters] = useState<CharacterRef[]>([]);
  const [selected, setSelected] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    if (!projectId || !sceneId) return;

    try {
      setLoading(true);
      const res = await fetch(
        `/api/storyboard/${projectId}/scenes/${sceneId}/character-refs`,
        { cache: 'no-store' }
      );
      const data = await res.json();

      if (data.ok) {
        setCharacters(Array.isArray(data.characters) ? data.characters : []);
        setSelected(Array.isArray(data.character_refs) ? data.character_refs.slice(0, 2) : []);
      } else {
        console.error('[scene character refs load]', data);
      }
    } catch (error) {
      console.error('[scene character refs load]', error);
    } finally {
      setLoading(false);
    }
  }, [projectId, sceneId]);

  useEffect(() => {
    load();
  }, [load]);

  const save = async (nextSelected: string[]) => {
    try {
      setSaving(true);
      const clean = nextSelected.filter(Boolean).slice(0, 2);

      const res = await fetch(
        `/api/storyboard/${projectId}/scenes/${sceneId}/character-refs`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ character_refs: clean }),
        }
      );

      const data = await res.json();

      if (!data.ok) {
        alert(data.error || 'Gagal menyimpan karakter scene');
        console.error('[scene character refs save]', data);
        return;
      }

      setSelected(Array.isArray(data.character_refs) ? data.character_refs.slice(0, 2) : []);
    } catch (error) {
      console.error('[scene character refs save]', error);
      alert('Gagal menyimpan karakter scene');
    } finally {
      setSaving(false);
    }
  };

  const setSlot = (index: number, value: string) => {
    const next = [...selected];
    next[index] = value;

    if (next[0] && next[1] && next[0] === next[1]) {
      if (index === 0) next[1] = '';
      if (index === 1) next[0] = '';
    }

    save(next);
  };

  if (!projectId || !sceneId) return null;

  const slots = [0, 1];

  return (
    <div className="rounded-lg border bg-muted/20 p-3 space-y-2.5">
      {/* Header */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-1.5 min-w-0">
          <Users className="h-3.5 w-3.5 text-muted-foreground shrink-0" aria-hidden="true" />
          <div className="min-w-0">
            <div className="text-xs font-semibold truncate">Character Reference</div>
            <div className="text-xs text-muted-foreground truncate">
              Maksimal 2 karakter per scene
            </div>
          </div>
        </div>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="h-7 w-7 shrink-0"
              disabled={loading || saving}
              onClick={load}
              aria-label="Refresh character list"
            >
              {loading ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <RefreshCw className="h-3.5 w-3.5" />
              )}
            </Button>
          </TooltipTrigger>
          <TooltipContent side="top">Refresh character list</TooltipContent>
        </Tooltip>
      </div>

      {/* Empty state — no character refs uploaded yet */}
      {characters.length === 0 ? (
        <div className="rounded-md border border-dashed border-border bg-background/50 px-3 py-4 text-center">
          <UserPlus className="h-5 w-5 mx-auto text-muted-foreground/40 mb-1.5" aria-hidden="true" />
          <p className="text-xs text-muted-foreground">
            Belum ada character reference
          </p>
          <p className="text-xs text-muted-foreground mt-0.5">
            Upload dulu di panel Image Reference
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-2">
          {slots.map((slotIndex) => {
            const selectedId = selected[slotIndex];
            const character = characters.find((c) => c.id === selectedId);
            const label = character ? labelForCharacter(character) : '';
            const isEmpty = !selectedId;

            return (
              <div
                key={slotIndex}
                className={`rounded-md border p-2 space-y-1.5 transition-colors ${
                  isEmpty
                    ? 'border-dashed border-border bg-background/40'
                    : 'border-border bg-background'
                }`}
              >
                {/* Slot header */}
                <div className="flex items-center justify-between gap-1">
                  <span className="text-xs text-muted-foreground font-medium uppercase tracking-wide">
                    Char {slotIndex + 1}
                  </span>
                  {!isEmpty && (
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="h-5 w-5 shrink-0 text-muted-foreground hover:text-destructive"
                          disabled={saving}
                          onClick={() => setSlot(slotIndex, '')}
                          aria-label={`Remove character ${slotIndex + 1}`}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent side="top">Remove</TooltipContent>
                    </Tooltip>
                  )}
                </div>

                {/* Selected character display */}
                {character ? (
                  <div className="flex items-center gap-1.5 min-w-0">
                    {character.url ? (
                      <img
                        src={character.url}
                        alt={label}
                        className="h-6 w-6 rounded-full object-cover border shrink-0"
                      />
                    ) : (
                      <div
                        className="h-6 w-6 rounded-full flex items-center justify-center text-xs font-semibold shrink-0"
                        style={{
                          backgroundColor: 'color-mix(in oklch, var(--col-image) 15%, transparent)',
                          color: 'var(--col-image)',
                        }}
                        aria-hidden="true"
                      >
                        {getInitial(label)}
                      </div>
                    )}
                    <span className="text-xs font-medium truncate" title={label}>
                      {label}
                    </span>
                  </div>
                ) : (
                  <div className="flex items-center gap-1.5 min-w-0">
                    <div
                      className="h-6 w-6 rounded-full flex items-center justify-center border border-dashed border-muted-foreground/30 shrink-0"
                      aria-hidden="true"
                    />
                    <span className="text-xs text-muted-foreground italic">Belum dipilih</span>
                  </div>
                )}

                {/* Optional role badge */}
                {character?.role && (
                  <Badge
                    variant="outline"
                    className="h-4 text-xs px-1.5 font-medium"
                  >
                    {character.role}
                  </Badge>
                )}

                {/* Picker */}
                <Select
                  value={selectedId || undefined}
                  disabled={saving}
                  onValueChange={(value) => setSlot(slotIndex, value)}
                >
                  <SelectTrigger
                    size="sm"
                    className="h-7 w-full text-xs"
                    aria-label={`Pick character for slot ${slotIndex + 1}`}
                  >
                    <SelectValue placeholder="Pilih karakter..." />
                  </SelectTrigger>
                  <SelectContent>
                    {characters.map((item) => {
                      const itemLabel = labelForCharacter(item);
                      const isUsedInOtherSlot =
                        selected[(slotIndex + 1) % 2] === item.id;
                      return (
                        <SelectItem
                          key={item.id}
                          value={item.id as string}
                          disabled={isUsedInOtherSlot}
                        >
                          {itemLabel}
                          {isUsedInOtherSlot ? ' (used)' : ''}
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
              </div>
            );
          })}
        </div>
      )}

      {saving && (
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <Loader2 className="h-3 w-3 animate-spin" aria-hidden="true" />
          <span>Menyimpan...</span>
        </div>
      )}
    </div>
  );
}
