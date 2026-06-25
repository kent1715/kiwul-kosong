'use client'

import {
  Circle,
  Loader2,
  CheckCircle2,
  XCircle,
  Lock,
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

type Status = 'pending' | 'running' | 'completed' | 'failed' | string

const STATUS_META: Record<
  Status,
  { label: string; icon: typeof Circle; color: string }
> = {
  pending: {
    label: 'Pending',
    icon: Circle,
    color: 'var(--status-pending)',
  },
  running: {
    label: 'Running',
    icon: Loader2,
    color: 'var(--status-running)',
  },
  queued: {
    label: 'Queued',
    icon: Loader2,
    color: 'var(--status-running)',
  },
  completed: {
    label: 'Completed',
    icon: CheckCircle2,
    color: 'var(--status-completed)',
  },
  failed: {
    label: 'Failed',
    icon: XCircle,
    color: 'var(--status-failed)',
  },
}

export function SceneStatusBadge({
  status,
  locked,
  className,
  compact = false,
}: {
  status: Status
  locked?: boolean
  className?: string
  compact?: boolean
}) {
  if (locked) {
    return (
      <Badge
        variant="outline"
        className={cn('h-5 px-1.5 text-xs font-medium gap-0.5', className)}
        style={{
          color: 'var(--muted-foreground)',
          borderColor: 'var(--border)',
        }}
      >
        <Lock className="h-2.5 w-2.5" aria-hidden="true" />
        {!compact && 'Locked'}
      </Badge>
    )
  }

  const meta = STATUS_META[status] || STATUS_META.pending
  const Icon = meta.icon
  const spin = status === 'running' || status === 'queued'

  return (
    <Badge
      variant="outline"
      className={cn('h-5 px-1.5 text-xs font-medium gap-0.5', className)}
      style={{
        color: meta.color,
        borderColor: `color-mix(in oklch, ${meta.color} 40%, transparent)`,
        backgroundColor: `color-mix(in oklch, ${meta.color} 10%, transparent)`,
      }}
    >
      <Icon
        className={cn('h-2.5 w-2.5', spin && 'animate-spin')}
        aria-hidden="true"
      />
      {!compact && meta.label}
    </Badge>
  )
}
