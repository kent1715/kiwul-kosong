import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

/**
 * GET /api/storyboard/[projectId]
 * Returns the project + all scenes sorted by scene_number.
 */
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ projectId: string }> }
) {
  try {
    const { projectId } = await params

    const project = await db.storyboardProject.findUnique({
      where: { id: projectId },
    })

    if (!project) {
      return NextResponse.json(
        { ok: false, error: 'Project not found' },
        { status: 404 }
      )
    }

    const scenes = await db.storyboardScene.findMany({
      where: { project_id: projectId },
      orderBy: { scene_number: 'asc' },
    })

    return NextResponse.json({
      ok: true,
      project: {
        id: project.id,
        title: project.title,
        language: project.language,
        aspect_ratio: project.aspect_ratio,
        resolution: project.resolution,
        duration_seconds: project.duration_seconds,
        style: project.style,
        status: project.status,
        json_path: project.json_path,
        created_at: project.created_at.toISOString(),
        updated_at: project.updated_at.toISOString(),
      },
      scenes: scenes.map((s) => ({
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
      })),
    })
  } catch (error) {
    console.error('Get project error:', error)
    return NextResponse.json(
      {
        ok: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}
