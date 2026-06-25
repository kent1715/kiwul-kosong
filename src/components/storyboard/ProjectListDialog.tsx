'use client'

import { useCallback, useEffect, useState } from 'react'
import {
  FolderOpen,
  Trash2,
  Clock,
  Film,
  Loader2,
  Search,
  AlertTriangle,
  LayoutGrid,
  ExternalLink,
  Ratio,
  Timer,
} from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { useStoryboardStore, type ProjectData, type SceneData } from '@/lib/store/storyboard-store'
import { toast } from 'sonner'

interface ProjectListItem {
  id: string
  title: string
  language: string
  aspect_ratio: string
  resolution: string
  duration_seconds: number
  style: string
  status: string
  scene_count: number
  created_at: string
  updated_at: string
}

const STATUS_MAP: Record<
  string,
  { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline' }
> = {
  draft: { label: 'Draft', variant: 'secondary' },
  loaded: { label: 'Loaded', variant: 'default' },
  generating: { label: 'Generating', variant: 'default' },
  exported: { label: 'Exported', variant: 'outline' },
  completed: { label: 'Completed', variant: 'default' },
  failed: { label: 'Failed', variant: 'destructive' },
}

export function ProjectListDialog() {
  const { projectListDialogOpen, setProjectListDialogOpen, loadProject } =
    useStoryboardStore()
  const [projects, setProjects] = useState<ProjectListItem[]>([])
  const [loading, setLoading] = useState(false)
  const [search, setSearch] = useState('')
  const [deleteTarget, setDeleteTarget] = useState<ProjectListItem | null>(null)
  const [deleting, setDeleting] = useState(false)
  const [openingId, setOpeningId] = useState<string | null>(null)

  const fetchProjects = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/storyboard/list')
      const data = await res.json()
      if (data.ok) {
        setProjects(data.projects)
      } else {
        toast.error('Failed to load projects')
      }
    } catch {
      toast.error('Failed to load projects')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    if (projectListDialogOpen) {
      setSearch('')
      setDeleteTarget(null)
      fetchProjects()
    }
  }, [projectListDialogOpen, fetchProjects])

  const handleOpenProject = useCallback(
    async (project: ProjectListItem) => {
      setOpeningId(project.id)
      try {
        const res = await fetch(`/api/storyboard/${project.id}`)
        const data = await res.json()
        if (data.ok && data.project) {
          const proj: ProjectData = data.project as ProjectData
          const scenes: SceneData[] = data.scenes || []
          loadProject(proj, scenes)
          setProjectListDialogOpen(false)
          toast.success(`Project "${project.title}" opened`)
        } else {
          toast.error('Failed to open project')
        }
      } catch {
        toast.error('Failed to open project')
      } finally {
        setOpeningId(null)
      }
    },
    [loadProject, setProjectListDialogOpen]
  )

  const handleDeleteProject = useCallback(async () => {
    if (!deleteTarget) return
    setDeleting(true)
    try {
      const res = await fetch('/api/storyboard/delete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ projectId: deleteTarget.id }),
      })
      const data = await res.json()
      if (data.ok) {
        setProjects((prev) => prev.filter((p) => p.id !== deleteTarget.id))
        toast.success(`Project "${deleteTarget.title}" deleted`)
        const currentProject = useStoryboardStore.getState().currentProject
        if (currentProject?.id === deleteTarget.id) {
          useStoryboardStore.getState().clearProject()
        }
      } else {
        toast.error(data.error || 'Failed to delete project')
      }
    } catch {
      toast.error('Failed to delete project')
    } finally {
      setDeleting(false)
      setDeleteTarget(null)
    }
  }, [deleteTarget])

  const filteredProjects = projects.filter((p) =>
    p.title.toLowerCase().includes(search.toLowerCase())
  )

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    return date.toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return mins > 0 ? `${mins}m ${secs}s` : `${secs}s`
  }

  return (
    <>
      <Dialog open={projectListDialogOpen} onOpenChange={setProjectListDialogOpen}>
        <DialogContent className="sm:max-w-2xl max-h-[85vh] flex flex-col overflow-hidden">
          <DialogHeader className="shrink-0">
            <DialogTitle className="flex items-center gap-2">
              <FolderOpen className="h-5 w-5 text-primary" />
              Projects
            </DialogTitle>
            <DialogDescription>
              Open an existing project or delete ones you no longer need.
            </DialogDescription>
          </DialogHeader>

          <div className="relative shrink-0">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none"
              aria-hidden="true"
            />
            <Input
              placeholder="Search projects..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 h-9 text-sm"
              aria-label="Search projects"
            />
          </div>

          <div className="flex-1 min-h-0 overflow-hidden">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-primary" aria-hidden="true" />
                <span className="mt-3 text-sm text-muted-foreground">Loading projects...</span>
              </div>
            ) : filteredProjects.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full border bg-muted/40">
                  <LayoutGrid className="h-6 w-6 text-muted-foreground/50" aria-hidden="true" />
                </div>
                <p className="text-sm font-medium text-muted-foreground">
                  {projects.length === 0 ? 'No projects yet' : 'No projects found'}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  {projects.length === 0
                    ? 'Load a storyboard JSON to create a new project'
                    : 'Try a different search term'}
                </p>
              </div>
            ) : (
              <ScrollArea className="h-full">
                <div className="space-y-2 pr-1">
                  {filteredProjects.map((project) => {
                    const statusInfo = STATUS_MAP[project.status] || {
                      label: project.status,
                      variant: 'secondary' as const,
                    }
                    const isOpening = openingId === project.id
                    const durationLabel = formatDuration(project.duration_seconds)

                    return (
                      <div
                        key={project.id}
                        className="group relative rounded-xl border border-border bg-card p-4 hover:border-primary/40 hover:bg-accent/30 transition-colors cursor-pointer"
                        onClick={() => handleOpenProject(project)}
                        role="button"
                        tabIndex={0}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault()
                            handleOpenProject(project)
                          }
                        }}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-2">
                              <h3 className="font-semibold text-sm truncate">{project.title}</h3>
                              <Badge
                                variant={statusInfo.variant}
                                className="h-5 text-xs px-1.5 shrink-0 font-medium"
                              >
                                {statusInfo.label}
                              </Badge>
                            </div>

                            <div className="flex items-center gap-3 text-xs text-muted-foreground flex-wrap">
                              <span className="flex items-center gap-1">
                                <Film className="h-3 w-3" aria-hidden="true" />
                                <span className="tabular-nums">{project.scene_count}</span>
                                <span>scene</span>
                              </span>
                              <Separator orientation="vertical" className="h-3" />
                              <span className="flex items-center gap-1">
                                <Ratio className="h-3 w-3" aria-hidden="true" />
                                {project.aspect_ratio}
                              </span>
                              {project.resolution && (
                                <>
                                  <Separator orientation="vertical" className="h-3" />
                                  <span className="font-mono text-xs">{project.resolution}</span>
                                </>
                              )}
                              <Separator orientation="vertical" className="h-3" />
                              <span className="flex items-center gap-1">
                                <Timer className="h-3 w-3" aria-hidden="true" />
                                {durationLabel}
                              </span>
                            </div>

                            <div className="flex items-center gap-1 text-xs text-muted-foreground mt-2">
                              <Clock className="h-3 w-3" aria-hidden="true" />
                              <span>Updated: {formatDate(project.updated_at)}</span>
                            </div>
                          </div>

                          <div className="flex items-center gap-1 shrink-0">
                            {isOpening ? (
                              <Loader2 className="h-4 w-4 animate-spin text-primary" aria-hidden="true" />
                            ) : (
                              <>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-8 text-xs gap-1 text-primary hover:text-primary hover:bg-primary/10"
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    handleOpenProject(project)
                                  }}
                                >
                                  <ExternalLink className="h-3.5 w-3.5" />
                                  <span className="hidden sm:inline">Open</span>
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    setDeleteTarget(project)
                                  }}
                                  aria-label={`Delete project ${project.title}`}
                                >
                                  <Trash2 className="h-3.5 w-3.5" />
                                </Button>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </ScrollArea>
            )}
          </div>

          <div className="shrink-0 border-t pt-3 flex items-center justify-between">
            <span className="text-xs text-muted-foreground">
              {filteredProjects.length} project{filteredProjects.length !== 1 ? 's' : ''}
              {search && projects.length !== filteredProjects.length && (
                <span className="text-muted-foreground/70"> of {projects.length}</span>
              )}
            </span>
            <Button
              variant="outline"
              size="sm"
              className="h-8 text-xs"
              onClick={() => setProjectListDialogOpen(false)}
            >
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <AlertDialog
        open={!!deleteTarget}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-destructive" />
              Delete Project
            </AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete project{' '}
              <strong>&quot;{deleteTarget?.title}&quot;</strong>? All scenes and media
              files will be permanently removed. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteProject}
              disabled={deleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {deleting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Deleting...
                </>
              ) : (
                'Delete'
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
