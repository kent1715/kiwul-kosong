// Lightweight client-side storyboard JSON validation.
// Mirrors the API behaviour but runs entirely in the browser.

export interface ParsedStoryboard {
  errors: string[]
  data: any | null
}

export interface ValidationResult {
  valid: boolean
  errors: string[]
  warnings: string[]
}

export function parseStoryboardJSON(text: string): ParsedStoryboard {
  let parsed: any = null
  try {
    parsed = JSON.parse(text)
  } catch (err) {
    return {
      errors: [`Invalid JSON syntax: ${err instanceof Error ? err.message : 'parse error'}`],
      data: null,
    }
  }

  const errors: string[] = []

  if (typeof parsed !== 'object' || parsed === null) {
    errors.push('JSON root must be an object with "project" and "scenes" keys')
    return { errors, data: null }
  }

  if (!parsed.project || typeof parsed.project !== 'object') {
    errors.push('Missing "project" object at root')
  }

  if (!Array.isArray(parsed.scenes)) {
    errors.push('Missing "scenes" array at root')
  }

  return { errors, data: parsed }
}

export function validateStoryboardJSON(data: any): ValidationResult {
  const errors: string[] = []
  const warnings: string[] = []

  const project = data?.project
  if (!project || typeof project !== 'object') {
    errors.push('project: required object')
  } else {
    if (!project.title || typeof project.title !== 'string') {
      errors.push('project.title: required string')
    }
  }

  const scenes = data?.scenes
  if (!Array.isArray(scenes)) {
    errors.push('scenes: required array')
  } else {
    if (scenes.length === 0) {
      warnings.push('scenes array is empty — no scenes will be created')
    }
    const seenIds = new Set<string>()
    scenes.forEach((scene, i) => {
      const ctx = `scenes[${i}]`
      if (!scene || typeof scene !== 'object') {
        errors.push(`${ctx}: must be an object`)
        return
      }
      const sid = scene.scene_id
      if (!sid || typeof sid !== 'string') {
        errors.push(`${ctx}.scene_id: required string`)
      } else if (seenIds.has(sid)) {
        warnings.push(`${ctx}.scene_id: duplicate "${sid}"`)
      } else {
        seenIds.add(sid)
      }
      if (typeof scene.scene_number !== 'number') {
        warnings.push(`${ctx}.scene_number: missing or not a number — will default to index+1`)
      }
      if (typeof scene.duration !== 'number') {
        warnings.push(`${ctx}.duration: missing or not a number — will default to 5`)
      }
      if (typeof scene.vo !== 'string') {
        warnings.push(`${ctx}.vo: missing or not a string`)
      }
    })
  }

  return { valid: errors.length === 0, errors, warnings }
}
