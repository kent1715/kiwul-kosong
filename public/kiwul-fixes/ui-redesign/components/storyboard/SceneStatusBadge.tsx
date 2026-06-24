'use client';

import * as React from 'react';
import { Badge } from '@/components/ui/badge';
import { Clock, Loader2, Check, X, MinusCircle } from 'lucide-react';

interface SceneStatusBadgeProps {
  status: string;
  label?: string;
  className?: string;
}

/**
 * Status -> { color (CSS variable ref), icon }.
 *
 * Mirrors the STATUS_COLORS mapping (status -> color identity, gray/blue/yellow/green/red)
 * but resolves the color via CSS variables (defined in globals.css) instead of raw
 * Tailwind class strings. This lets the palette be themed centrally and keeps the
 * Badge accessible (text-xs minimum, proper icon, color-mix tints for bg/border).
 */
const STATUS_META: Record<
  string,
  { color: string; icon: React.ComponentType<{ className?: string }> }
> = {
  pending: { color: 'var(--status-pending)', icon: Clock },
  queued: { color: 'var(--status-queued)', icon: Clock },
  running: { color: 'var(--status-running)', icon: Loader2 },
  completed: { color: 'var(--status-completed)', icon: Check },
  failed: { color: 'var(--status-failed)', icon: X },
  skipped: { color: 'var(--status-skipped)', icon: MinusCircle },
  cancelled: { color: 'var(--status-cancelled)', icon: MinusCircle },
};

export function SceneStatusBadge({ status, label, className }: SceneStatusBadgeProps) {
  const meta = STATUS_META[status] || STATUS_META.pending;
  const Icon = meta.icon;
  const displayLabel = label || status;
  const isRunning = status === 'running';

  return (
    <Badge
      variant="outline"
      data-status={status}
      className={`h-5 text-xs px-2 font-medium gap-1 ${className ?? ''}`}
      style={{
        // Drive badge colors from a single CSS variable, using color-mix for
        // soft tints that look good on both light and dark backgrounds.
        backgroundColor: `color-mix(in oklch, ${meta.color} 14%, transparent)`,
        color: meta.color,
        borderColor: `color-mix(in oklch, ${meta.color} 35%, transparent)`,
      }}
    >
      <Icon className={`h-3 w-3 ${isRunning ? 'animate-spin' : ''}`} aria-hidden="true" />
      {displayLabel}
    </Badge>
  );
}
