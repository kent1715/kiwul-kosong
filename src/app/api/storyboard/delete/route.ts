import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { removeProjectDir } from '@/lib/file-storage'

/**
 * POST /api/storyboard/delete
 * Body: { projectId: string }
 * Deletes the project, all its scenes (cascade), and on-disk media.
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}))
    const projectId = body?.projectId

    if (!projectId || typeof projectId !== 'string') {
      return NextResponse.json(
        { ok: false, error: 'Missing "projectId" in body' },
        { status: 400 }
      )
    }

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

    // Cascade delete scenes (relation onDelete: Cascade handles DB),
    // but Prisma's SQLite cascade sometimes needs explicit deleteMany.
    await db.storyboardScene.deleteMany({ where: { project_id: projectId } })
    await db.storyboardProject.delete({ where: { id: projectId } })

    // Remove on-disk images/videos
    await removeProjectDir(projectId)

    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error('Delete storyboard error:', error)
    return NextResponse.json(
      {
        ok: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}
