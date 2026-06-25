import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

/**
 * POST /api/storyboard/load
 * Body: { json: { project, scenes } }
 * Creates a new project + scenes, returns project_id.
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const json = body?.json

    if (!json || typeof json !== 'object') {
      return NextResponse.json(
        { ok: false, error: 'Missing "json" object in body' },
        { status: 400 }
      )
    }

    const projectJson = json.project
    const scenesJson = Array.isArray(json.scenes) ? json.scenes : []

    if (!projectJson || typeof projectJson !== 'object') {
      return NextResponse.json(
        { ok: false, error: 'Missing "project" object' },
        { status: 400 }
      )
    }

    const title = String(projectJson.title || 'Untitled').trim()
    if (!title) {
      return NextResponse.json(
        { ok: false, error: 'project.title is required' },
        { status: 400 }
      )
    }

    const project = await db.storyboardProject.create({
      data: {
        title,
        language: String(projectJson.language || 'id'),
        aspect_ratio: String(projectJson.aspect_ratio || '16:9'),
        resolution: String(projectJson.resolution || '1920x1080'),
        duration_seconds: Number(projectJson.duration_seconds || 180),
        style: String(
          projectJson.style || 'cinematic semi-realistic 2D illustration'
        ),
        status: 'loaded',
      },
    })

    const scenesData = scenesJson.map((s: any, i: number) => ({
      project_id: project.id,
      scene_id: String(s.scene_id || `scene_${String(i + 1).padStart(3, '0')}`),
      scene_number: Number(s.scene_number ?? i + 1),
      duration: Number(s.duration ?? 5),
      vo: s.vo ? String(s.vo) : null,
      image_prompt: s.image_prompt ? String(s.image_prompt) : null,
      video_prompt: s.video_prompt ? String(s.video_prompt) : null,
      negative_prompt: s.negative_prompt ? String(s.negative_prompt) : null,
      image_status: 'pending',
      video_status: 'pending',
      locked: false,
    }))

    if (scenesData.length > 0) {
      await db.storyboardScene.createMany({ data: scenesData })
    }

    const count = await db.storyboardScene.count({
      where: { project_id: project.id },
    })

    return NextResponse.json({
      ok: true,
      project_id: project.id,
      scene_count: count,
    })
  } catch (error) {
    console.error('Load storyboard error:', error)
    return NextResponse.json(
      {
        ok: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}
