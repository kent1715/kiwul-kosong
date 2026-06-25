import { NextRequest, NextResponse } from 'next/server'
import path from 'path'
import { db } from '@/lib/db'
import { saveImageFile, ensureProjectDirs, clearSceneImages } from '@/lib/file-storage'

export const dynamic = 'force-dynamic'

/**
 * POST /api/storyboard/[projectId]/scenes/[sceneId]/image
 * Content-Type: multipart/form-data
 * Body: file=<image binary>
 *
 * Saves uploaded image to disk and updates scene.image_path.
 * Image is UPLOADED by the user (not generated).
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ projectId: string; sceneId: string }> }
) {
  try {
    const { projectId, sceneId } = await params

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

    // Parse multipart form
    const formData = await request.formData()
    const file = formData.get('file')

    if (!file || !(file instanceof File)) {
      return NextResponse.json(
        { ok: false, error: 'Missing "file" in form data' },
        { status: 400 }
      )
    }

    // Validate type
    const allowedTypes = [
      'image/png',
      'image/jpeg',
      'image/jpg',
      'image/webp',
      'image/gif',
    ]
    const ext = (file.name.split('.').pop() || 'png').toLowerCase()
    const safeExt = ['png', 'jpg', 'jpeg', 'webp', 'gif'].includes(ext)
      ? ext
      : 'png'

    if (file.type && !allowedTypes.includes(file.type)) {
      return NextResponse.json(
        {
          ok: false,
          error: `Unsupported file type: ${file.type}. Allowed: ${allowedTypes.join(', ')}`,
        },
        { status: 400 }
      )
    }

    // Read buffer
    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    if (buffer.length === 0) {
      return NextResponse.json(
        { ok: false, error: 'Uploaded file is empty' },
        { status: 400 }
      )
    }

    // Clear previous images for this scene (avoid stacking on disk)
    await clearSceneImages(projectId, sceneId)

    // Save to disk
    await ensureProjectDirs(projectId)
    const filePath = await saveImageFile(projectId, sceneId, buffer, safeExt)
    const savedFileName = path.basename(filePath)

    // API path for frontend
    const apiPath = `/api/storyboard/${projectId}/scenes/${sceneId}/download/image?file=${encodeURIComponent(savedFileName)}&v=${Date.now()}`

    // Update DB
    await db.storyboardScene.update({
      where: { id: scene.id },
      data: {
        image_status: 'completed',
        image_path: apiPath,
        error_message: null,
        // Reset video since image changed
        video_status: 'pending',
        video_path: null,
      },
    })

    return NextResponse.json({
      ok: true,
      image_path: apiPath,
      file_name: savedFileName,
      size_bytes: buffer.length,
    })
  } catch (error) {
    console.error('Upload image error:', error)
    return NextResponse.json(
      {
        ok: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}
