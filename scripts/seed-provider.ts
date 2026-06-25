// Seed the default WAN Local video provider if not exists
// Run with: bun run scripts/seed-provider.ts
import { db } from '../src/lib/db'

async function main() {
  const existing = await db.storyboardProvider.findFirst({
    where: { type: 'video', name: 'WAN Local' },
  })

  if (existing) {
    console.log('WAN Local provider already exists:', existing.id)
    return
  }

  // Reset any other default video providers
  await db.storyboardProvider.updateMany({
    where: { type: 'video', is_default: true },
    data: { is_default: false },
  })

  const provider = await db.storyboardProvider.create({
    data: {
      type: 'video',
      name: 'WAN Local',
      provider: 'openai_video_compatible',
      base_url: 'http://127.0.0.1:9200',
      endpoint: '/v1/videos/generations',
      model: 'comfy-wan-i2v',
      api_key: 'local',
      timeout_seconds: 1800,
      is_default: true,
      is_active: true,
    },
  })

  console.log('Created WAN Local provider:', provider.id)
}

main()
  .catch((err) => {
    console.error(err)
    process.exit(1)
  })
  .finally(async () => {
    await db.$disconnect()
  })
