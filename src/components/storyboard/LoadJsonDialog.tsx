'use client'

import { useCallback, useRef, useState } from 'react'
import {
  Upload,
  FileJson,
  CheckCircle,
  AlertTriangle,
  XCircle,
  FileUp,
} from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useStoryboardStore, type ProjectData, type SceneData } from '@/lib/store/storyboard-store'
import { type ValidationResult, validateStoryboardJSON, parseStoryboardJSON } from '@/lib/validate-storyboard'
import { toast } from 'sonner'

export function LoadJsonDialog() {
  const { loadJsonDialogOpen, setLoadJsonDialogOpen, loadProject } = useStoryboardStore()
  const [jsonText, setJsonText] = useState('')
  const [validation, setValidation] = useState<ValidationResult | null>(null)
  const [loading, setLoading] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleValidate = useCallback(() => {
    if (!jsonText.trim()) {
      setValidation({ valid: false, errors: ['JSON text is empty'], warnings: [] })
      return
    }
    const parseResult = parseStoryboardJSON(jsonText)
    if (parseResult.errors.length > 0) {
      setValidation({ valid: false, errors: parseResult.errors, warnings: [] })
      return
    }
    const result = validateStoryboardJSON(parseResult.data)
    setValidation(result)
  }, [jsonText])

  const handleLoad = useCallback(async () => {
    if (!validation?.valid) return
    setLoading(true)
    try {
      const parsed = JSON.parse(jsonText)

      const res = await fetch('/api/storyboard/load', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ json: parsed }),
      })
      const data = await res.json()

      if (data.ok) {
        // Fetch full project details
        const projectRes = await fetch(`/api/storyboard/${data.project_id}`)
        const projectData = await projectRes.json()

        if (projectData.ok && projectData.project) {
          const project: ProjectData = projectData.project as ProjectData
          const scenes: SceneData[] = projectData.scenes || []
          loadProject(project, scenes)
        } else {
          // Fallback minimal project object
          const project: ProjectData = {
            id: data.project_id,
            title: parsed.project?.title || 'Untitled',
            language: parsed.project?.language || 'id',
            aspect_ratio: parsed.project?.aspect_ratio || '16:9',
            resolution: parsed.project?.resolution || '1920x1080',
            duration_seconds: parsed.project?.duration_seconds || 180,
            style: parsed.project?.style || 'cinematic semi-realistic 2D illustration',
            status: 'loaded',
            json_path: null,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          }
          loadProject(project, [])
        }

        setLoadJsonDialogOpen(false)
        setJsonText('')
        setValidation(null)
        toast.success(`Project loaded: ${data.scene_count} scenes`)
      } else {
        toast.error(data.error || 'Failed to load project')
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to load project')
    } finally {
      setLoading(false)
    }
  }, [validation, jsonText, loadProject, setLoadJsonDialogOpen])

  const handleFileUpload = useCallback((file: File) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      const text = e.target?.result as string
      setJsonText(text)
      setValidation(null)
    }
    reader.readAsText(file)
  }, [])

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      setIsDragging(false)
      const file = e.dataTransfer.files[0]
      if (file && (file.type === 'application/json' || file.name.endsWith('.json'))) {
        handleFileUpload(file)
      }
    },
    [handleFileUpload]
  )

  return (
    <Dialog open={loadJsonDialogOpen} onOpenChange={setLoadJsonDialogOpen}>
      <DialogContent className="sm:max-w-2xl max-h-[85vh] flex flex-col overflow-hidden">
        <DialogHeader className="shrink-0">
          <DialogTitle className="flex items-center gap-2">
            <FileJson className="h-5 w-5 text-primary" />
            Load Storyboard JSON
          </DialogTitle>
          <DialogDescription>
            Upload a JSON file or paste your storyboard data. The file must contain a
            &quot;project&quot; object and a &quot;scenes&quot; array.
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="paste" className="flex-1 flex flex-col min-h-0 overflow-hidden space-y-3">
          <TabsList className="shrink-0 self-start">
            <TabsTrigger value="paste" className="text-xs">Paste JSON</TabsTrigger>
            <TabsTrigger value="upload" className="text-xs">Upload File</TabsTrigger>
          </TabsList>

          <TabsContent value="paste" className="flex-1 min-h-0 overflow-hidden mt-0">
            <Textarea
              value={jsonText}
              onChange={(e) => {
                setJsonText(e.target.value)
                setValidation(null)
              }}
              className="h-full min-h-[200px] font-mono text-xs resize-none !field-sizing-fixed"
              placeholder='{"project": {...}, "scenes": [...]}'
              style={{ fieldSizing: 'fixed' } as React.CSSProperties}
            />
          </TabsContent>

          <TabsContent value="upload" className="mt-0">
            <div
              className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors cursor-pointer ${
                isDragging
                  ? 'border-primary bg-primary/5'
                  : 'border-muted-foreground/25 hover:border-muted-foreground/50 hover:bg-muted/30'
              }`}
              onDrop={handleDrop}
              onDragOver={(e) => {
                e.preventDefault()
                setIsDragging(true)
              }}
              onDragLeave={() => setIsDragging(false)}
              onClick={() => fileInputRef.current?.click()}
            >
              <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full border bg-muted/40">
                <FileUp className="h-6 w-6 text-muted-foreground" aria-hidden="true" />
              </div>
              <p className="text-sm font-medium">Drop your JSON file here</p>
              <p className="text-xs text-muted-foreground mt-1">or click to browse</p>
              <input
                ref={fileInputRef}
                type="file"
                accept=".json,application/json"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0]
                  if (file) handleFileUpload(file)
                }}
              />
            </div>
            {jsonText && (
              <div className="mt-3 flex items-center gap-2 rounded-md border bg-muted/30 px-3 py-2 text-xs">
                <Upload className="h-3.5 w-3.5 text-muted-foreground shrink-0" aria-hidden="true" />
                <span className="truncate text-muted-foreground">
                  Loaded <span className="font-medium text-foreground">{jsonText.length.toLocaleString()}</span> chars
                </span>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="ml-auto h-6 px-2 text-xs"
                  onClick={() => {
                    setJsonText('')
                    setValidation(null)
                  }}
                >
                  Clear
                </Button>
              </div>
            )}
          </TabsContent>
        </Tabs>

        {/* Validation Results */}
        {validation && (
          <div className="space-y-1.5 max-h-40 overflow-y-auto shrink-0 custom-scrollbar">
            {validation.valid && (
              <div className="flex items-center gap-2 p-2.5 rounded-md border border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400">
                <CheckCircle className="h-4 w-4 shrink-0" aria-hidden="true" />
                <span className="text-xs font-medium">JSON is valid! Ready to load.</span>
              </div>
            )}
            {validation.errors.length > 0 && (
              <div className="space-y-1">
                {validation.errors.map((err, i) => (
                  <div
                    key={i}
                    className="flex items-start gap-2 p-2 rounded-md border border-destructive/30 bg-destructive/10 text-destructive"
                  >
                    <XCircle className="h-3.5 w-3.5 shrink-0 mt-0.5" aria-hidden="true" />
                    <span className="text-xs break-words">{err}</span>
                  </div>
                ))}
              </div>
            )}
            {validation.warnings.length > 0 && (
              <div className="space-y-1">
                {validation.warnings.map((warn, i) => (
                  <div
                    key={i}
                    className="flex items-start gap-2 p-2 rounded-md border border-amber-500/30 bg-amber-500/10 text-amber-700 dark:text-amber-400"
                  >
                    <AlertTriangle className="h-3.5 w-3.5 shrink-0 mt-0.5" aria-hidden="true" />
                    <span className="text-xs break-words">{warn}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        <DialogFooter className="shrink-0">
          <Button
            variant="outline"
            className="h-9 text-xs"
            onClick={() => setLoadJsonDialogOpen(false)}
          >
            Cancel
          </Button>
          <Button
            variant="secondary"
            className="h-9 text-xs gap-1.5"
            onClick={handleValidate}
            disabled={!jsonText.trim()}
          >
            <CheckCircle className="h-3.5 w-3.5" />
            Validate
          </Button>
          <Button
            className="h-9 text-xs gap-1.5"
            onClick={handleLoad}
            disabled={!validation?.valid || loading}
            style={{ backgroundColor: 'var(--col-vo)', color: 'white' }}
          >
            {loading ? 'Loading...' : 'Load Project'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
