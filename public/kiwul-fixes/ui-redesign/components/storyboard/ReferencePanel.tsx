'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import {
  ImagePlus,
  RefreshCw,
  ChevronsDown,
  ChevronsUp,
  ExternalLink,
  Trash2,
  User,
  Palette,
  MapPin,
  ImageIcon,
  type LucideIcon,
} from 'lucide-react';
import { useStoryboardStore } from '@/lib/store/storyboard-store';

type ReferenceKind = 'character' | 'style' | 'location' | 'other';

type ReferenceItem = {
  id: string;
  kind: ReferenceKind | string;
  file_name: string;
  original_name: string;
  mime_type: string;
  size_bytes: number;
  url: string;
  created_at: string;
};

const kindLabels: Record<ReferenceKind, string> = {
  character: 'Character',
  style: 'Style',
  location: 'Location',
  other: 'Other',
};

const kindIcons: Record<ReferenceKind, LucideIcon> = {
  character: User,
  style: Palette,
  location: MapPin,
  other: ImageIcon,
};

function formatSize(bytes: number) {
  if (!bytes) return '0 B';
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
  return (bytes / 1024 / 1024).toFixed(1) + ' MB';
}

const uploadSlots: { kind: ReferenceKind; label: string }[] = [
  { kind: 'character', label: 'Character' },
  { kind: 'style', label: 'Style' },
  { kind: 'location', label: 'Location' },
];

export function ReferencePanel() {
  const { currentProject } = useStoryboardStore();
  const [references, setReferences] = useState<ReferenceItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploadingKind, setUploadingKind] = useState<ReferenceKind | null>(null);
  const [expanded, setExpanded] = useState(false);

  const characterInputRef = useRef<HTMLInputElement | null>(null);
  const styleInputRef = useRef<HTMLInputElement | null>(null);
  const locationInputRef = useRef<HTMLInputElement | null>(null);
  const inputRefs: Record<ReferenceKind, React.RefObject<HTMLInputElement | null>> = {
    character: characterInputRef,
    style: styleInputRef,
    location: locationInputRef,
    other: { current: null },
  };

  const fetchReferences = useCallback(async () => {
    if (!currentProject?.id) {
      setReferences([]);
      return;
    }

    try {
      setLoading(true);
      const res = await fetch(`/api/storyboard/${currentProject.id}/references`, {
        cache: 'no-store',
      });
      const data = await res.json();

      if (data.ok) {
        setReferences(Array.isArray(data.references) ? data.references : []);
      } else {
        console.error('[references list]', data);
      }
    } catch (error) {
      console.error('[references list]', error);
    } finally {
      setLoading(false);
    }
  }, [currentProject?.id]);

  useEffect(() => {
    fetchReferences();
  }, [fetchReferences]);

  const uploadReference = async (kind: ReferenceKind, file?: File | null) => {
    if (!currentProject?.id || !file) return;

    try {
      setUploadingKind(kind);

      const form = new FormData();
      form.append('kind', kind);
      form.append('file', file);

      const res = await fetch(`/api/storyboard/${currentProject.id}/references`, {
        method: 'POST',
        body: form,
      });

      const data = await res.json();

      if (!data.ok) {
        alert(data.error || 'Upload reference gagal');
        console.error('[reference upload]', data);
        return;
      }

      setReferences(Array.isArray(data.references) ? data.references : []);
    } catch (error) {
      console.error('[reference upload]', error);
      alert('Upload reference gagal');
    } finally {
      setUploadingKind(null);

      if (characterInputRef.current) characterInputRef.current.value = '';
      if (styleInputRef.current) styleInputRef.current.value = '';
      if (locationInputRef.current) locationInputRef.current.value = '';
    }
  };

  const deleteReference = async (item: ReferenceItem) => {
    if (!currentProject?.id) return;

    const ok = confirm(`Hapus reference "${item.original_name}"?`);
    if (!ok) return;

    try {
      const res = await fetch(
        `/api/storyboard/${currentProject.id}/references?file=${encodeURIComponent(item.file_name)}`,
        { method: 'DELETE' }
      );

      const data = await res.json();

      if (!data.ok) {
        alert(data.error || 'Hapus reference gagal');
        console.error('[reference delete]', data);
        return;
      }

      setReferences(Array.isArray(data.references) ? data.references : []);
    } catch (error) {
      console.error('[reference delete]', error);
      alert('Hapus reference gagal');
    }
  };

  if (!currentProject) {
    return null;
  }

  const characterCount = references.filter((item) => item.kind === 'character').length;
  const styleCount = references.filter((item) => item.kind === 'style').length;
  const locationCount = references.filter((item) => item.kind === 'location').length;

  const countBadges = [
    { label: 'Character', count: characterCount, color: 'var(--col-storyline)' },
    { label: 'Style', count: styleCount, color: 'var(--col-background)' },
    { label: 'Location', count: locationCount, color: 'var(--col-image)' },
  ];

  // Collapsed state — compact header strip with counts and a "Manage" button
  if (!expanded) {
    return (
      <div className="border-b bg-background/80 backdrop-blur px-4 py-2">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 min-w-0">
            <ImageIcon className="h-3.5 w-3.5 text-muted-foreground shrink-0" aria-hidden="true" />
            <span className="text-xs font-semibold leading-none">Image References</span>
            <Separator orientation="vertical" className="h-3.5" />
            <div className="flex items-center gap-2">
              {countBadges.map((b) => (
                <span
                  key={b.label}
                  className="inline-flex items-center gap-1 text-xs text-muted-foreground"
                >
                  <span
                    className="h-1.5 w-1.5 rounded-full"
                    style={{ backgroundColor: b.color }}
                    aria-hidden="true"
                  />
                  <span className="tabular-nums">{b.count}</span>
                  <span className="hidden sm:inline">{b.label}</span>
                </span>
              ))}
            </div>
          </div>

          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="h-8 text-xs gap-1.5"
            disabled={loading}
            onClick={() => setExpanded(true)}
          >
            <ChevronsDown className="h-3.5 w-3.5" />
            Manage
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="border-b bg-background/80 backdrop-blur px-4 py-3">
      {/* Header row */}
      <div className="flex items-center justify-between gap-3 mb-3">
        <div className="flex items-center gap-2 min-w-0">
          <ImageIcon className="h-4 w-4 text-muted-foreground shrink-0" aria-hidden="true" />
          <span className="text-sm font-semibold leading-none">Image References</span>
          <Separator orientation="vertical" className="h-4" />
          <div className="flex items-center gap-3">
            {countBadges.map((b) => (
              <span
                key={b.label}
                className="inline-flex items-center gap-1.5 text-xs text-muted-foreground"
              >
                <span
                  className="h-2 w-2 rounded-full"
                  style={{ backgroundColor: b.color }}
                  aria-hidden="true"
                />
                <span className="tabular-nums font-medium text-foreground">{b.count}</span>
                <span>{b.label}</span>
              </span>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-1">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="h-8 text-xs gap-1.5"
            disabled={loading}
            onClick={fetchReferences}
          >
            <RefreshCw className={`h-3.5 w-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">Refresh</span>
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="h-8 text-xs gap-1.5"
            onClick={() => setExpanded(false)}
          >
            <ChevronsUp className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Hide</span>
          </Button>
        </div>
      </div>

      {/* Upload slots — one per kind, with proper empty state */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mb-3">
        {uploadSlots.map(({ kind, label }) => {
          const KindIcon = kindIcons[kind];
          const isUploading = uploadingKind === kind;
          const inputRef = inputRefs[kind];
          return (
            <div
              key={kind}
              className="flex flex-col gap-1.5 rounded-lg border border-dashed bg-muted/30 p-2.5"
            >
              <input
                ref={inputRef}
                type="file"
                accept="image/png,image/jpeg,image/webp"
                className="hidden"
                onChange={(event) => uploadReference(kind, event.target.files?.[0])}
              />
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-1.5 min-w-0">
                  <KindIcon className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                  <span className="text-xs font-medium truncate">{label}</span>
                </div>
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  className="h-8 text-xs gap-1.5 shrink-0"
                  disabled={uploadingKind !== null}
                  onClick={() => inputRef.current?.click()}
                >
                  {isUploading ? (
                    <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                  ) : (
                    <ImagePlus className="h-3.5 w-3.5" />
                  )}
                  {isUploading ? 'Uploading…' : 'Upload'}
                </Button>
              </div>
              <p className="text-[11px] text-muted-foreground leading-snug">
                {kind === 'character' && 'Upload character reference plates for the scene.'}
                {kind === 'style' && 'Upload style references to guide visual look.'}
                {kind === 'location' && 'Upload location references for background context.'}
              </p>
            </div>
          );
        })}
      </div>

      {/* Reference cards */}
      {references.length > 0 && (
        <div className="flex gap-2 overflow-x-auto pb-1 custom-scrollbar">
          {references.map((item) => {
            const kind = (item.kind || 'other') as ReferenceKind;
            const KindIcon = kindIcons[kind] || kindIcons.other;
            return (
              <div
                key={item.id || item.file_name}
                className="group flex w-[160px] shrink-0 flex-col overflow-hidden rounded-lg border bg-card shadow-sm"
              >
                <div className="relative aspect-video overflow-hidden bg-muted">
                  <img
                    src={item.url}
                    alt={item.original_name}
                    className="h-full w-full object-cover"
                    loading="lazy"
                  />
                  <span className="absolute top-1.5 left-1.5 inline-flex items-center gap-1 rounded-md bg-background/90 px-1.5 py-0.5 text-[10px] font-medium text-foreground backdrop-blur">
                    <KindIcon className="h-2.5 w-2.5" aria-hidden="true" />
                    {kindLabels[kind] || 'Other'}
                  </span>
                </div>
                <div className="flex flex-1 flex-col gap-0.5 p-2">
                  <div
                    className="text-xs font-medium truncate"
                    title={item.original_name}
                  >
                    {item.original_name}
                  </div>
                  <div className="text-[11px] text-muted-foreground tabular-nums">
                    {formatSize(item.size_bytes)}
                  </div>
                  <div className="mt-1 flex gap-1">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="h-7 flex-1 px-2 text-xs gap-1"
                      onClick={() => window.open(item.url, '_blank')}
                    >
                      <ExternalLink className="h-3 w-3" />
                      Open
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="h-7 flex-1 px-2 text-xs gap-1 text-destructive hover:text-destructive hover:bg-destructive/10"
                      onClick={() => deleteReference(item)}
                    >
                      <Trash2 className="h-3 w-3" />
                      Delete
                    </Button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Empty state — friendly message */}
      {references.length === 0 && (
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed bg-muted/20 py-6 text-center">
          <ImageIcon className="h-6 w-6 text-muted-foreground/60 mb-2" aria-hidden="true" />
          <p className="text-xs font-medium text-foreground">No references uploaded yet</p>
          <p className="text-[11px] text-muted-foreground mt-0.5">
            Use the upload slots above to add character, style, or location references.
          </p>
        </div>
      )}
    </div>
  );
}
