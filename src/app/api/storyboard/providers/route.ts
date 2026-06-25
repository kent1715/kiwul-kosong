import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

/**
 * GET  /api/storyboard/providers         — list all providers
 * POST /api/storyboard/providers         — create a provider
 *
 * Body for POST:
 *  { type, name, provider?, base_url, endpoint?, model, api_key?, timeout_seconds?, is_default?, is_active? }
 */
export async function GET() {
  try {
    const providers = await db.storyboardProvider.findMany({
      orderBy: [{ type: 'asc' }, { created_at: 'asc' }],
    })

    return NextResponse.json({ ok: true, providers })
  } catch (error) {
    console.error('List providers error:', error)
    return NextResponse.json(
      {
        ok: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const type = String(body.type || 'video')
    const name = String(body.name || '').trim()
    const baseUrl = String(body.base_url || '').trim()
    const model = String(body.model || '').trim()

    if (!name || !baseUrl || !model) {
      return NextResponse.json(
        { ok: false, error: 'name, base_url, and model are required' },
        { status: 400 }
      )
    }

    // If is_default, unset other defaults of same type
    if (body.is_default) {
      await db.storyboardProvider.updateMany({
        where: { type, is_default: true },
        data: { is_default: false },
      })
    }

    const provider = await db.storyboardProvider.create({
      data: {
        type,
        name,
        provider: String(body.provider || 'openai_video_compatible'),
        base_url: baseUrl,
        endpoint: String(body.endpoint || '/v1/videos/generations'),
        model,
        api_key: body.api_key ? String(body.api_key) : null,
        timeout_seconds: Number(body.timeout_seconds || 1800),
        is_default: Boolean(body.is_default),
        is_active: body.is_active === undefined ? true : Boolean(body.is_active),
      },
    })

    return NextResponse.json({ ok: true, provider })
  } catch (error) {
    console.error('Create provider error:', error)
    return NextResponse.json(
      {
        ok: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}
