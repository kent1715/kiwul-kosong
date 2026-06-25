import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

/**
 * PATCH /api/storyboard/[projectId]/scenes/[sceneId]
 * Body: Partial<SceneData> — auto-save on blur.
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ projectId: string; sceneId: string }> }
) {
  try {
    const { projectId, sceneId } = await params
    const body = await request.json()

    const scene = await db.storyboardScene.findFirst({
      where: { project_id: projectId, scene_id: sceneId },
      select: { id: true, locked: true },
    })

    if (!scene) {
      return NextResponse.json(
        { ok: false, error: 'Scene not found' },
        { status: 404 }
      )
    }

    if (scene.locked) {
      return NextResponse.json(
        { ok: false, error: 'Scene is locked' },
        { status: 403 }
      )
    }

    const updated = await db.storyboardScene.update({
      where: { id: scene.id },
      data: {
        ...(typeof body.vo === 'string' ? { vo: body.vo } : {}),
        ...(typeof body.image_prompt === 'string' ? { image_prompt: body.image_prompt } : {}),
        ...(typeof body.video_prompt === 'string' ? { video_prompt: body.video_prompt } : {}),
        ...(typeof body.negative_prompt === 'string' ? { negative_prompt: body.negative_prompt } : {}),
        ...(typeof body.duration === 'number' ? { duration: body.duration } : {}),
        ...(typeof body.locked === 'boolean' ? { locked: body.locked } : {}),
        ...(typeof body.image_status === 'string' ? { image_status: body.image_status } : {}),
        ...(typeof body.video_status === 'string' ? { video_status: body.video_status } : {}),
        ...(typeof body.image_path === 'string' ? { image_path: body.image_path } : {}),
        ...(typeof body.video_path === 'string' ? { video_path: body.video_path } : {}),
        ...(typeof body.error_message === 'string' ? { error_message: body.error_message } : {}),
        ...(body.error_message === null ? { error_message: null } : {}),
      },
    })

    return NextResponse.json({ ok: true, scene: serializeScene(updated) })
  } catch (error) {
    console.error('Patch scene error:', error)
    return NextResponse.json(
      {
        ok: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}

function serializeScene(s: any) {
  return {
    id: s.id,
    project_id: s.project_id,
    scene_id: s.scene_id,
    scene_number: s.scene_number,
    duration: s.duration,
    vo: s.vo,
    image_prompt: s.image_prompt,
    video_prompt: s.video_prompt,
    negative_prompt: s.negative_prompt,
    image_path: s.image_path,
    video_path: s.video_path,
    image_status: s.image_status,
    video_status: s.video_status,
    locked: s.locked,
    error_message: s.error_message,
    created_at: s.created_at.toISOString(),
    updated_at: s.updated_at.toISOString(),
  }
}
