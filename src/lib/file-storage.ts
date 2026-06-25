import fs from 'fs/promises'
import fsSync from 'fs'
import path from 'path'

/**
 * File storage for Simple Storyboard Studio.
 *
 * Layout on disk:
 *   <cwd>/outputs/storyboard/<projectId>/images/<sceneId>_<timestamp>.png
 *   <cwd>/outputs/storyboard/<projectId>/videos/<sceneId>.mp4
 */

const ROOT = path.join(process.cwd(), 'outputs', 'storyboard')

export function getProjectDir(projectId: string): string {
  return path.join(ROOT, projectId)
}

export function getImagesDir(projectId: string): string {
  return path.join(getProjectDir(projectId), 'images')
}

export function getVideosDir(projectId: string): string {
  return path.join(getProjectDir(projectId), 'videos')
}

export async function ensureDir(dir: string): Promise<void> {
  await fs.mkdir(dir, { recursive: true })
}

export async function ensureProjectDirs(projectId: string): Promise<void> {
  await Promise.all([ensureDir(getImagesDir(projectId)), ensureDir(getVideosDir(projectId))])
}

/**
 * Save image buffer to disk and return the absolute file path.
 * Filename pattern: <sceneId>_<timestamp>.png
 */
export async function saveImageFile(
  projectId: string,
  sceneId: string,
  buffer: Buffer,
  ext: string = 'png'
): Promise<string> {
  await ensureProjectDirs(projectId)
  const stamp = Date.now()
  const filePath = path.join(getImagesDir(projectId), `${sceneId}_${stamp}.${ext}`)
  await fs.writeFile(filePath, buffer)
  return filePath
}

/**
 * Save video buffer to disk and return the absolute file path.
 * Filename pattern: <sceneId>.mp4 (single file, overwrites on regen).
 */
export async function saveVideoFile(
  projectId: string,
  sceneId: string,
  buffer: Buffer
): Promise<string> {
  await ensureProjectDirs(projectId)
  const filePath = path.join(getVideosDir(projectId), `${sceneId}.mp4`)
  await fs.writeFile(filePath, buffer)
  return filePath
}

/**
 * Remove all image files belonging to a scene (any ext / timestamp).
 */
export async function clearSceneImages(projectId: string, sceneId: string): Promise<void> {
  const dir = getImagesDir(projectId)
  if (!fsSync.existsSync(dir)) return
  const files = await fs.readdir(dir)
  for (const file of files) {
    if (file.startsWith(`${sceneId}_`) || file === `${sceneId}.png`) {
      await fs.unlink(path.join(dir, file)).catch(() => null)
    }
  }
}

/**
 * Remove the video file for a scene.
 */
export async function clearSceneVideo(projectId: string, sceneId: string): Promise<void> {
  const filePath = path.join(getVideosDir(projectId), `${sceneId}.mp4`)
  await fs.unlink(filePath).catch(() => null)
}

/**
 * Recursively remove the entire project directory (images + videos).
 */
export async function removeProjectDir(projectId: string): Promise<void> {
  const dir = getProjectDir(projectId)
  await fs.rm(dir, { recursive: true, force: true }).catch(() => null)
}

export function fileExists(filePath: string): boolean {
  return fsSync.existsSync(filePath)
}
