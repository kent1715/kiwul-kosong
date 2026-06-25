import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

/**
 * POST /api/storyboard/[projectId]/save
 * Body: {
 *   project?: Partial<{ title, aspect_ratio, resolution, style, status }>,
 *   scenes: Array<{ scene_id, vo?, image_prompt?, video_prompt?, negative_prompt?, locked?, duration?, image_status?, video_status? }>
 * }
 * Bulk-updates project meta and all provided scenes.
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ projectId: string }> }
) {
  try {
    const { projectId } = await params
    const body = await request.json()

    const project = await db.storyboardProject.findUnique({
      where: { id: projectId },
      select: { id: true },
    })

    if (!project) {
      return NextResponse.json(
        { ok: false, error: 'Project not found' },
        { status: 404 }
      )
    }

    // Update project meta if provided
    if (body.project && typeof body.project === 'object') {
      const p = body.project
      await db.storyboardProject.update({
        where: { id: projectId },
        data: {
          ...(typeof p.title === 'string' ? { title: p.title } : {}),
          ...(typeof p.aspect_ratio === 'string' ? { aspect_ratio: p.aspect_ratio } : {}),
          ...(typeof p.resolution === 'string' ? { resolution: p.resolution } : {}),
          ...(typeof p.style === 'string' ? { style: p.style } : {}),
          ...(typeof p.status === 'string' ? { status: p.status } : {}),
        },
      })
    }

    // Bulk-update scenes
    const scenes = Array.isArray(body.scenes) ? body.scenes : []
    let updatedScenes = 0

    for (const s of scenes) {
      if (!s || typeof s.scene_id !== 'string') continue

      await db.storyboardScene.updateMany({
        where: { project_id: projectId, scene_id: s.scene_id },
        data: {
          ...(typeof s.vo === 'string' ? { vo: s.vo } : {}),
          ...(typeof s.image_prompt === 'string' ? { image_prompt: s.image_prompt } : {}),
          ...(typeof s.video_prompt === 'string' ? { video_prompt: s.video_prompt } : {}),
          ...(typeof s.negative_prompt === 'string' ? { negative_prompt: s.negative_prompt } : {}),
          ...(typeof s.locked === 'boolean' ? { locked: s.locked } : {}),
          ...(typeof s.duration === 'number' ? { duration: s.duration } : {}),
          ...(typeof s.image_status === 'string' ? { image_status: s.image_status } : {}),
          ...(typeof s.video_status === 'string' ? { video_status: s.video_status } : {}),
        },
      })
      updatedScenes++
    }

    return NextResponse.json({ ok: true, updated_scenes: updatedScenes })
  } catch (error) {
    console.error('Save project error:', error)
    return NextResponse.json(
      {
        ok: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}
