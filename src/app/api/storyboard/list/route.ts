import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

/**
 * GET /api/storyboard/list
 * Returns all projects with scene counts, newest first.
 */
export async function GET() {
  try {
    const projects = await db.storyboardProject.findMany({
      orderBy: { updated_at: 'desc' },
      select: {
        id: true,
        title: true,
        language: true,
        aspect_ratio: true,
        resolution: true,
        duration_seconds: true,
        style: true,
        status: true,
        created_at: true,
        updated_at: true,
        _count: { select: { scenes: true } },
      },
    })

    const result = projects.map((p) => ({
      id: p.id,
      title: p.title,
      language: p.language,
      aspect_ratio: p.aspect_ratio,
      resolution: p.resolution,
      duration_seconds: p.duration_seconds,
      style: p.style,
      status: p.status,
      scene_count: p._count.scenes,
      created_at: p.created_at.toISOString(),
      updated_at: p.updated_at.toISOString(),
    }))

    return NextResponse.json({ ok: true, projects: result })
  } catch (error) {
    console.error('List storyboard error:', error)
    return NextResponse.json(
      {
        ok: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}
