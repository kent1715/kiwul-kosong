'use client'

import { create } from 'zustand'

// =====================================================================
// Types
// =====================================================================

export interface ProjectData {
  id: string
  title: string
  language: string
  aspect_ratio: string
  resolution: string
  duration_seconds: number
  style: string
  status: string
  json_path: string | null
  created_at: string
  updated_at: string
}

export interface SceneData {
  id: string
  project_id: string
  scene_id: string
  scene_number: number
  duration: number
  vo: string | null
  image_prompt: string | null
  video_prompt: string | null
  negative_prompt: string | null
  image_path: string | null
  video_path: string | null
  image_status: string // pending | running | completed | failed
  video_status: string // pending | running | completed | failed
  locked: boolean
  error_message: string | null
  created_at: string
  updated_at: string
}

interface StoryboardState {
  currentProject: ProjectData | null
  scenes: SceneData[]
  selectedSceneId: string | null

  loadJsonDialogOpen: boolean
  projectListDialogOpen: boolean
  providerSettingsDialogOpen: boolean

  // Actions
  loadProject: (project: ProjectData, scenes: SceneData[]) => void
  clearProject: () => void
  selectScene: (sceneId: string | null) => void
  updateScene: (sceneId: string, updates: Partial<SceneData>) => void
  replaceScene: (sceneId: string, scene: SceneData) => void
  setLoadJsonDialogOpen: (open: boolean) => void
  setProjectListDialogOpen: (open: boolean) => void
  setProviderSettingsDialogOpen: (open: boolean) => void
  updateProjectMeta: (updates: Partial<ProjectData>) => void
}

// =====================================================================
// Store
// =====================================================================

export const useStoryboardStore = create<StoryboardState>((set) => ({
  currentProject: null,
  scenes: [],
  selectedSceneId: null,

  loadJsonDialogOpen: false,
  projectListDialogOpen: false,
  providerSettingsDialogOpen: false,

  loadProject: (project, scenes) => {
    const sortedScenes = [...scenes].sort((a, b) => a.scene_number - b.scene_number)
    set({
      currentProject: project,
      scenes: sortedScenes,
      selectedSceneId: sortedScenes[0]?.scene_id ?? null,
      loadJsonDialogOpen: false,
      projectListDialogOpen: false,
    })
  },

  clearProject: () =>
    set({
      currentProject: null,
      scenes: [],
      selectedSceneId: null,
    }),

  selectScene: (sceneId) => set({ selectedSceneId: sceneId }),

  updateScene: (sceneId, updates) =>
    set((state) => ({
      scenes: state.scenes.map((s) =>
        s.scene_id === sceneId ? { ...s, ...updates } : s
      ),
    })),

  replaceScene: (sceneId, scene) =>
    set((state) => ({
      scenes: state.scenes.map((s) => (s.scene_id === sceneId ? scene : s)),
    })),

  setLoadJsonDialogOpen: (open) => set({ loadJsonDialogOpen: open }),
  setProjectListDialogOpen: (open) => set({ projectListDialogOpen: open }),
  setProviderSettingsDialogOpen: (open) => set({ providerSettingsDialogOpen: open }),

  updateProjectMeta: (updates) =>
    set((state) => ({
      currentProject: state.currentProject
        ? { ...state.currentProject, ...updates }
        : null,
    })),
}))
