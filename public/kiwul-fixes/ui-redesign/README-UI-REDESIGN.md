# UI Redesign — Kiwul Storyboard Studio

Redesign UI profesional untuk storyboard-kiwul. Semua fungsionalitas dipertahankan, hanya tampilan yang berubah.

## Yang Berubah

### Design System
- **Centralized color tokens** — warna kolom (violet/emerald/amber/blue) sebagai CSS variables di `globals.css`
- **Typography lebih lega** — minimum `text-xs` (12px), hapus semua `text-[10px]`/`text-[9px]`
- **Button lebih besar** — minimum `h-8`, dialog footer `h-9`
- **Card padding lebih lega** — `p-4` (sebelumnya `p-3`)

### Layout
- **Header bersih** — single bar `h-14` dengan logo badge + project title + actions
- **Column headers** — `h-10` dengan colored dot + scene count badge
- **Mobile tabs** — `h-10` dengan underline warna kolom
- **Footer sticky** — `h-8` dengan info project + theme toggle
- **Empty state polished** — landing page dengan gradient + large CTAs

### Components
- **SceneStatusBadge** — icon-based (Clock/Loader2/Check/X), `text-xs`
- **JobProgress** — custom progress bar `h-2` + status icons
- **ReferencePanel** — 3-slot upload grid dengan thumbnails
- **TopToolbar** — grouped buttons dengan tooltips + Separators
- **4 Columns** — sticky headers dengan column-color Generate All buttons
- **SceneCharacterSelector** — 2-slot card grid dengan avatar fallback
- **3 Dialogs** — cleaner forms, proper spacing, tabbed provider settings

### Cleanup
- **Hapus 4 orphan components** (813 lines dead code):
  - `SceneSidebar.tsx` (146 lines)
  - `SceneDetailPanel.tsx` (372 lines)
  - `PreviewPanel.tsx` (295 lines)
  - `StatusBadge.tsx` (36 lines)

## Cara Apply

### Opsi A — Script PowerShell (RECOMMENDED)

1. Download `apply-ui-redesign.ps1` dari folder ini
2. Jalankan di PowerShell:
   ```powershell
   Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass
   .\apply-ui-redesign.ps1
   ```

Script akan:
- Backup file lama ke `backup-ui-old/`
- Copy 14 file baru ke lokasi yang benar
- Hapus 4 orphan files
- Verifikasi semua file ter-copy

### Opsi B — Manual

1. Download folder `ui-redesign/` (atau ZIP bundle)
2. Copy isi `app/` ke `D:\storyboard-kiwul\src\app\`
3. Copy isi `components/storyboard/` ke `D:\storyboard-kiwul\src\components\storyboard\`
4. Hapus 4 orphan files:
   ```powershell
   Remove-Item "D:\storyboard-kiwul\src\components\storyboard\SceneSidebar.tsx"
   Remove-Item "D:\storyboard-kiwul\src\components\storyboard\SceneDetailPanel.tsx"
   Remove-Item "D:\storyboard-kiwul\src\components\storyboard\PreviewPanel.tsx"
   Remove-Item "D:\storyboard-kiwul\src\components\storyboard\StatusBadge.tsx"
   ```
5. Restart Next.js: `bun run dev`

## File yang Ditimpa (14 file)

### App
- `src/app/globals.css` — design tokens
- `src/app/page.tsx` — tidak berubah (hanya untuk konsistensi)

### Components (13 file)
- `StoryboardStudio.tsx` — main layout
- `TopToolbar.tsx` — toolbar
- `JobProgress.tsx` — progress display
- `ReferencePanel.tsx` — reference upload
- `SceneStatusBadge.tsx` — status badge
- `StorylineColumn.tsx` — column 1
- `BackgroundColumn.tsx` — column 2
- `GambarColumn.tsx` — column 3
- `VideoColumn.tsx` — column 4
- `SceneCharacterSelector.tsx` — character picker
- `LoadJsonDialog.tsx` — load JSON dialog
- `ProviderSettingsDialog.tsx` — provider settings
- `ProjectListDialog.tsx` — project list

## Yang TIDAK Berubah

- **Zustand store** (`src/lib/store/storyboard-store.ts`) — tidak disentuh
- **API routes** — semua endpoint tetap sama
- **Prisma schema** — tidak berubah
- **Workflow ComfyUI** — tidak berubah
- **Proxy** — tidak berubah
- **Semua fetch logic** — URLs, methods, bodies identical
- **Semua event handlers** — onChange, onBlur, onClick logic preserved

## Setelah Apply

1. Restart Next.js (`bun run dev`)
2. Buka UI storyboard di browser
3. Test: Load JSON, Generate Image, Generate Video, Save, Export
4. Semua fungsionalitas harus berjalan seperti sebelumnya

## Rollback (kalau perlu)

```powershell
# Restore dari backup
cd D:\storyboard-kiwul
Copy-Item -Path "backup-ui-old\*" -Destination "src\" -Recurse -Force
bun run dev
```
