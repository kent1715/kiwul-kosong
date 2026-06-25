import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

/**
 * GET    /api/storyboard/providers/[providerId]
 * PATCH  /api/storyboard/providers/[providerId]
 * DELETE /api/storyboard/providers/[providerId]
 */
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ providerId: string }> }
) {
  try {
    const { providerId } = await params

    const provider = await db.storyboardProvider.findUnique({
      where: { id: providerId },
    })

    if (!provider) {
      return NextResponse.json(
        { ok: false, error: 'Provider not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ ok: true, provider })
  } catch (error) {
    console.error('Get provider error:', error)
    return NextResponse.json(
      {
        ok: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ providerId: string }> }
) {
  try {
    const { providerId } = await params
    const body = await request.json()

    const existing = await db.storyboardProvider.findUnique({
      where: { id: providerId },
      select: { id: true, type: true },
    })

    if (!existing) {
      return NextResponse.json(
        { ok: false, error: 'Provider not found' },
        { status: 404 }
      )
    }

    // If making default, unset other defaults of same type
    if (body.is_default) {
      await db.storyboardProvider.updateMany({
        where: { type: existing.type, is_default: true, NOT: { id: providerId } },
        data: { is_default: false },
      })
    }

    const updated = await db.storyboardProvider.update({
      where: { id: providerId },
      data: {
        ...(typeof body.name === 'string' ? { name: body.name } : {}),
        ...(typeof body.type === 'string' ? { type: body.type } : {}),
        ...(typeof body.provider === 'string' ? { provider: body.provider } : {}),
        ...(typeof body.base_url === 'string' ? { base_url: body.base_url } : {}),
        ...(typeof body.endpoint === 'string' ? { endpoint: body.endpoint } : {}),
        ...(typeof body.model === 'string' ? { model: body.model } : {}),
        ...(typeof body.api_key === 'string' ? { api_key: body.api_key } : {}),
        ...(typeof body.timeout_seconds === 'number' ? { timeout_seconds: body.timeout_seconds } : {}),
        ...(typeof body.is_default === 'boolean' ? { is_default: body.is_default } : {}),
        ...(typeof body.is_active === 'boolean' ? { is_active: body.is_active } : {}),
      },
    })

    return NextResponse.json({ ok: true, provider: updated })
  } catch (error) {
    console.error('Update provider error:', error)
    return NextResponse.json(
      {
        ok: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ providerId: string }> }
) {
  try {
    const { providerId } = await params

    await db.storyboardProvider.delete({ where: { id: providerId } })

    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error('Delete provider error:', error)
    return NextResponse.json(
      {
        ok: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}
