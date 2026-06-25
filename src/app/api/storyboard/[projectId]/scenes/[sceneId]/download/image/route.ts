import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs/promises'
import fsSync from 'fs'
import path from 'path'

export const dynamic = 'force-dynamic'

/**
 * GET /api/storyboard/[projectId]/scenes/[sceneId]/download/image?file=<filename>
 * Serves the image file from disk.
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ projectId: string; sceneId: string }> }
) {
  try {
    const { projectId, sceneId } = await params
    const fileName = request.nextUrl.searchParams.get('file') || `${sceneId}.png`

    // Sanitize: no path separators, no leading dots
    const safeName = path.basename(fileName)

    const imagesDir = path.join(
      process.cwd(),
      'outputs',
      'storyboard',
      projectId,
      'images'
    )

    const filePath = path.join(imagesDir, safeName)

    // Prevent path traversal
    if (!filePath.startsWith(imagesDir)) {
      return NextResponse.json(
        { ok: false, error: 'Invalid file path' },
        { status: 400 }
      )
    }

    if (!fsSync.existsSync(filePath)) {
      return NextResponse.json(
        { ok: false, error: 'Image not found' },
        { status: 404 }
      )
    }

    const buffer = await fs.readFile(filePath)
    const ext = path.extname(safeName).toLowerCase()

    const contentTypeMap: Record<string, string> = {
      '.png': 'image/png',
      '.jpg': 'image/jpeg',
      '.jpeg': 'image/jpeg',
      '.webp': 'image/webp',
      '.gif': 'image/gif',
    }

    const contentType = contentTypeMap[ext] || 'image/png'

    return new NextResponse(buffer, {
      status: 200,
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0',
        Pragma: 'no-cache',
        Expires: '0',
        'Content-Length': String(buffer.length),
      },
    })
  } catch (error) {
    console.error('[download image]', error)
    return NextResponse.json(
      {
        ok: false,
        error: error instanceof Error ? error.message : 'Image not found',
      },
      { status: 404 }
    )
  }
}
