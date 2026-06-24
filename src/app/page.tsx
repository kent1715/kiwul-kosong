'use client'

import { Download, FileCode, FileJson, FileText, Package, FolderDown, CheckCircle2, AlertCircle, Palette, Layers, Sparkles } from 'lucide-react'

const fixFiles = [
  { name: 'APPLY-GUIDE.md', desc: 'Panduan lengkap langkah demi langkah (BACA INI DULU)', icon: FileText, href: '/kiwul-fixes/APPLY-GUIDE.md', size: '7.4 KB' },
  { name: 'kiwul-fixes-bundle.zip', desc: 'SEMUA file fix (workflow + proxy + route) dalam satu ZIP', icon: Package, href: '/kiwul-fixes/kiwul-fixes-bundle.zip', size: '74 KB', highlight: true },
  { name: 'generate-prompts.cjs', desc: 'Script auto-generate prompt V1 untuk 60 scene (Pocong Salah Alamat COD)', icon: FileCode, href: '/kiwul-fixes/generate-prompts.cjs', size: '36 KB' },
  { name: 'generate-prompts-v2.cjs', desc: 'Script V2 — pose lebih natural + camera angle per scene (RECOMMENDED)', icon: FileCode, href: '/kiwul-fixes/generate-prompts-v2.cjs', size: '48 KB', highlight: true },
  { name: 'TEMPLATE-PROMPTS.md', desc: 'Dokumentasi 7 template prompt + tips konsistensi visual', icon: FileText, href: '/kiwul-fixes/TEMPLATE-PROMPTS.md', size: '8 KB' },
  { name: 'image_qwen_image_edit_2509.json', desc: 'Workflow ComfyUI baru (FP8, tanpa AuraFlow)', icon: FileJson, href: '/kiwul-fixes/image_qwen_image_edit_2509.json', size: '4.3 KB' },
  { name: 'image-route.ts', desc: 'File route.ts LENGKAP (sudah +negative prompt anti-stacking)', icon: FileCode, href: '/kiwul-fixes/image-route.ts', size: '18.6 KB' },
  { name: 'video-route.ts', desc: 'File video route.ts (patch frame count untuk durasi 5 detik)', icon: FileCode, href: '/kiwul-fixes/video-route.ts', size: '12 KB' },
  { name: 'background-route.ts', desc: 'File background route.ts (cache-bust fix, simpan URL bukan data URL)', icon: FileCode, href: '/kiwul-fixes/background-route.ts', size: '8 KB' },
  { name: 'server.py', desc: 'Kode proxy baru port 9500 (FastAPI)', icon: FileCode, href: '/kiwul-fixes/server.py', size: '12.3 KB' },
  { name: 'check-negative-prompt-forward.py', desc: 'Tool test proxy forward negative_prompt', icon: FileCode, href: '/kiwul-fixes/check-negative-prompt-forward.py', size: '6.2 KB' },
  { name: 'requirements.txt', desc: 'Dependency Python untuk proxy', icon: FileText, href: '/kiwul-fixes/requirements.txt', size: '64 B' },
  { name: 'run.cmd', desc: 'Script startup proxy di Windows', icon: FileText, href: '/kiwul-fixes/run.cmd', size: '549 B' },
]

const uiFiles = [
  { name: 'README-UI-REDESIGN.md', desc: 'Panduan UI redesign (BACA INI DULU)', icon: FileText, href: '/kiwul-fixes/ui-redesign/README-UI-REDESIGN.md', size: '3.5 KB' },
  { name: 'apply-ui-redesign.ps1', desc: 'Script PowerShell auto-apply (backup + copy + delete orphans)', icon: FileCode, href: '/kiwul-fixes/ui-redesign/apply-ui-redesign.ps1', size: '4.5 KB', highlight: true },
  { name: 'globals.css', desc: 'Design tokens terpusat (warna kolom CSS variables)', icon: FileCode, href: '/kiwul-fixes/ui-redesign/app/globals.css', size: '5 KB' },
  { name: 'StoryboardStudio.tsx', desc: 'Main layout (header bersih, empty state polished, footer sticky)', icon: FileCode, href: '/kiwul-fixes/ui-redesign/components/storyboard/StoryboardStudio.tsx', size: '14 KB' },
  { name: 'TopToolbar.tsx', desc: 'Toolbar (grouped buttons + tooltips + separators)', icon: FileCode, href: '/kiwul-fixes/ui-redesign/components/storyboard/TopToolbar.tsx', size: '12 KB' },
  { name: 'StorylineColumn.tsx', desc: 'Column 1 — timeline scene cards (violet)', icon: FileCode, href: '/kiwul-fixes/ui-redesign/components/storyboard/StorylineColumn.tsx', size: '8 KB' },
  { name: 'BackgroundColumn.tsx', desc: 'Column 2 — background cards (emerald)', icon: FileCode, href: '/kiwul-fixes/ui-redesign/components/storyboard/BackgroundColumn.tsx', size: '13 KB' },
  { name: 'GambarColumn.tsx', desc: 'Column 3 — action image cards (amber)', icon: FileCode, href: '/kiwul-fixes/ui-redesign/components/storyboard/GambarColumn.tsx', size: '14 KB' },
  { name: 'VideoColumn.tsx', desc: 'Column 4 — video cards (blue)', icon: FileCode, href: '/kiwul-fixes/ui-redesign/components/storyboard/VideoColumn.tsx', size: '15 KB' },
  { name: 'JobProgress.tsx', desc: 'Progress display (custom bar + status icons)', icon: FileCode, href: '/kiwul-fixes/ui-redesign/components/storyboard/JobProgress.tsx', size: '7 KB' },
  { name: 'ReferencePanel.tsx', desc: 'Reference upload (3-slot grid + thumbnails)', icon: FileCode, href: '/kiwul-fixes/ui-redesign/components/storyboard/ReferencePanel.tsx', size: '13 KB' },
  { name: 'SceneStatusBadge.tsx', desc: 'Status badge (icon-based, text-xs)', icon: FileCode, href: '/kiwul-fixes/ui-redesign/components/storyboard/SceneStatusBadge.tsx', size: '2 KB' },
  { name: 'SceneCharacterSelector.tsx', desc: 'Character picker (2-slot card grid)', icon: FileCode, href: '/kiwul-fixes/ui-redesign/components/storyboard/SceneCharacterSelector.tsx', size: '10 KB' },
  { name: 'LoadJsonDialog.tsx', desc: 'Load JSON dialog (cleaner form)', icon: FileCode, href: '/kiwul-fixes/ui-redesign/components/storyboard/LoadJsonDialog.tsx', size: '9 KB' },
  { name: 'ProviderSettingsDialog.tsx', desc: 'Provider settings (tabbed layout)', icon: FileCode, href: '/kiwul-fixes/ui-redesign/components/storyboard/ProviderSettingsDialog.tsx', size: '19 KB' },
  { name: 'ProjectListDialog.tsx', desc: 'Project list (cleaner cards + search)', icon: FileCode, href: '/kiwul-fixes/ui-redesign/components/storyboard/ProjectListDialog.tsx', size: '13 KB' },
]

const fixSteps = [
  { n: '0', title: 'Stop semua service', desc: 'Tutup Next.js, proxy 9500, ComfyUI 8188. Backup workflow lama.' },
  { n: '1', title: 'Download model FP8', desc: 'qwen_image_edit_2509_fp8_e4m3fn.safetensors → C:\\ComfyUI\\models\\diffusion_models\\' },
  { n: '2', title: 'Ganti workflow JSON', desc: 'Timpa workflows/image_qwen_image_edit_2509.json dengan file baru.' },
  { n: '3', title: 'Update route.ts', desc: 'Ganti file route.ts dengan image-route.ts (rename jadi route.ts).' },
  { n: '4', title: 'Setup proxy baru', desc: 'Buat folder proxy/qwen2509-editplus-proxy/, isi 4 file. Stop proxy lama.' },
  { n: '5', title: 'Start service', desc: 'ComfyUI → proxy baru (run.cmd) → Next.js dev.' },
  { n: '6', title: 'Test', desc: 'Jalankan check-negative-prompt-forward.py. Harus PASS. Lalu test dari UI.' },
]

const uiChanges = [
  { icon: Palette, title: 'Design Tokens Terpusat', desc: 'Warna kolom (violet/emerald/amber/blue) sebagai CSS variables di globals.css' },
  { icon: Layers, title: 'Typography Lebih Lega', desc: 'Minimum text-xs (12px), hapus semua text-[10px]/text-[9px]. Button h-8 minimum.' },
  { icon: Sparkles, title: 'Layout Profesional', desc: 'Header h-14 bersih, column headers dengan colored dots, footer sticky, empty state polished' },
  { icon: CheckCircle2, title: 'Cleanup 813 Lines Dead Code', desc: 'Hapus 4 orphan components yang tidak dirender (SceneSidebar, SceneDetailPanel, PreviewPanel, StatusBadge)' },
]

export default function Home() {
  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc', color: '#0f172a', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '2rem 1.5rem 4rem' }}>

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
            <FolderDown size={32} color="#0f766e" />
            <h1 style={{ fontSize: '1.875rem', fontWeight: 700, margin: 0 }}>
              Kiwul Storyboard — File Perbaikan
            </h1>
          </div>
          <p style={{ fontSize: '1.05rem', color: '#475569', maxWidth: '640px', margin: '0 auto', lineHeight: 1.6 }}>
            Workflow ComfyUI + Proxy + UI Redesign profesional. Semua fungsionalitas dipertahankan.
          </p>
        </div>

        {/* === SECTION 1: UI REDESIGN (NEW) === */}
        <div style={{
          background: 'linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%)',
          borderRadius: '0.75rem',
          padding: '1.5rem',
          marginBottom: '2rem',
          color: 'white',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
            <Sparkles size={28} />
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700, margin: 0 }}>UI Redesign Profesional — BARU</h2>
          </div>
          <p style={{ fontSize: '0.9rem', opacity: 0.95, marginBottom: '1.25rem', lineHeight: 1.5 }}>
            Redesign UI lebih profesional dan mudah digunakan. 14 file komponen di-redesign + 4 orphan files dihapus (813 lines dead code).
            Semua fungsionalitas dipertahankan — tidak ada hardcode yang berubah.
          </p>

          {/* UI Changes grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.75rem', marginBottom: '1.25rem' }}>
            {uiChanges.map((c, i) => {
              const Icon = c.icon
              return (
                <div key={i} style={{ background: 'rgba(255,255,255,0.1)', borderRadius: '0.5rem', padding: '0.75rem' }}>
                  <Icon size={18} style={{ marginBottom: '0.4rem' }} />
                  <div style={{ fontWeight: 600, fontSize: '0.85rem', marginBottom: '0.2rem' }}>{c.title}</div>
                  <div style={{ fontSize: '0.75rem', opacity: 0.85, lineHeight: 1.3 }}>{c.desc}</div>
                </div>
              )
            })}
          </div>

          {/* Apply script download */}
          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', alignItems: 'center' }}>
            <a href="/kiwul-fixes/ui-redesign/apply-ui-redesign.ps1" download style={{
              background: 'white', color: '#7c3aed', padding: '0.7rem 1.4rem',
              borderRadius: '0.5rem', fontWeight: 600, textDecoration: 'none',
              display: 'inline-flex', alignItems: 'center', gap: '0.5rem'
            }}>
              <Download size={18} /> Download Apply Script
            </a>
            <a href="/kiwul-fixes/ui-redesign/README-UI-REDESIGN.md" download style={{
              background: 'rgba(255,255,255,0.15)', color: 'white', padding: '0.7rem 1.4rem',
              borderRadius: '0.5rem', fontWeight: 600, textDecoration: 'none',
              display: 'inline-flex', alignItems: 'center', gap: '0.5rem', border: '1px solid rgba(255,255,255,0.3)'
            }}>
              <FileText size={18} /> README
            </a>
          </div>
        </div>

        {/* UI Redesign file list */}
        <div style={{
          background: 'white', borderRadius: '0.75rem', padding: '1.5rem',
          marginBottom: '2rem', border: '1px solid #e2e8f0'
        }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 600, marginTop: 0, marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Palette size={20} color="#7c3aed" /> UI Redesign Files (14 file)
          </h2>
          <p style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: '1rem' }}>
            Cara cepat: download <strong>apply-ui-redesign.ps1</strong> di atas, jalankan di PowerShell. Atau download file individual di bawah.
          </p>
          <div style={{ display: 'grid', gap: '0.4rem' }}>
            {uiFiles.map((f) => {
              const Icon = f.icon
              return (
                <a key={f.name} href={f.href} download
                  style={{
                    display: 'flex', alignItems: 'center', gap: '0.75rem',
                    padding: '0.7rem', borderRadius: '0.5rem',
                    border: f.highlight ? '2px solid #7c3aed' : '1px solid #e2e8f0',
                    background: f.highlight ? '#f5f3ff' : '#fafafa',
                    textDecoration: 'none', color: 'inherit',
                    transition: 'all 0.15s'
                  }}
                  onMouseOver={(e) => e.currentTarget.style.background = f.highlight ? '#ede9fe' : '#f1f5f9'}
                  onMouseOut={(e) => e.currentTarget.style.background = f.highlight ? '#f5f3ff' : '#fafafa'}
                >
                  <Icon size={18} color={f.highlight ? '#7c3aed' : '#64748b'} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: 600, fontSize: '0.85rem', wordBreak: 'break-all' }}>
                      {f.name}
                      {f.highlight && <span style={{ marginLeft: '0.5rem', fontSize: '0.65rem', background: '#7c3aed', color: 'white', padding: '0.1rem 0.4rem', borderRadius: '0.25rem' }}>SCRIPT</span>}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{f.desc}</div>
                  </div>
                  <Download size={14} color="#7c3aed" style={{ flexShrink: 0 }} />
                </a>
              )
            })}
          </div>
        </div>

        {/* === SECTION 2: WORKFLOW + PROXY FIXES === */}
        <div style={{
          background: 'linear-gradient(135deg, #0f766e 0%, #115e59 100%)',
          borderRadius: '0.75rem',
          padding: '1.5rem',
          marginBottom: '2rem',
          color: 'white',
          display: 'flex',
          alignItems: 'center',
          gap: '1rem',
          flexWrap: 'wrap'
        }}>
          <Package size={40} />
          <div style={{ flex: '1 1 300px' }}>
            <div style={{ fontSize: '1.15rem', fontWeight: 600 }}>Workflow + Proxy Fixes</div>
            <div style={{ opacity: 0.9, fontSize: '0.9rem' }}>Qwen FP8 workflow, anti-stacking negative prompt, proxy port 9500, video 5-detik patch</div>
          </div>
          <a href="/kiwul-fixes/kiwul-fixes-bundle.zip" download style={{
            background: 'white', color: '#0f766e', padding: '0.7rem 1.4rem',
            borderRadius: '0.5rem', fontWeight: 600, textDecoration: 'none',
            display: 'inline-flex', alignItems: 'center', gap: '0.5rem'
          }}>
            <Download size={18} /> Download ZIP (74 KB)
          </a>
        </div>

        {/* Fix steps overview */}
        <div style={{
          background: 'white', borderRadius: '0.75rem', padding: '1.5rem',
          marginBottom: '2rem', border: '1px solid #e2e8f0'
        }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 600, marginTop: 0, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <CheckCircle2 size={20} color="#0f766e" /> 7 Langkah Penerapan (Workflow + Proxy)
          </h2>
          <div style={{ display: 'grid', gap: '0.6rem' }}>
            {fixSteps.map((s) => (
              <div key={s.n} style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
                <div style={{
                  minWidth: '2rem', height: '2rem', borderRadius: '50%',
                  background: '#0f766e', color: 'white', display: 'flex',
                  alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '0.9rem'
                }}>{s.n}</div>
                <div>
                  <div style={{ fontWeight: 600, fontSize: '0.95rem' }}>{s.title}</div>
                  <div style={{ fontSize: '0.85rem', color: '#64748b', lineHeight: 1.4 }}>{s.desc}</div>
                </div>
              </div>
            ))}
          </div>
          <div style={{
            marginTop: '1rem', padding: '0.75rem', background: '#fef3c7',
            borderRadius: '0.5rem', fontSize: '0.85rem', color: '#92400e',
            display: 'flex', gap: '0.5rem', alignItems: 'flex-start'
          }}>
            <AlertCircle size={16} style={{ flexShrink: 0, marginTop: '2px' }} />
            <span>Detail lengkap tiap langkah ada di file <strong>APPLY-GUIDE.md</strong>.</span>
          </div>
        </div>

        {/* Fix file list */}
        <div style={{
          background: 'white', borderRadius: '0.75rem', padding: '1.5rem',
          border: '1px solid #e2e8f0'
        }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 600, marginTop: 0, marginBottom: '1rem' }}>
            Workflow + Proxy Files
          </h2>
          <div style={{ display: 'grid', gap: '0.5rem' }}>
            {fixFiles.map((f) => {
              const Icon = f.icon
              return (
                <a key={f.name} href={f.href} download
                  style={{
                    display: 'flex', alignItems: 'center', gap: '0.75rem',
                    padding: '0.85rem', borderRadius: '0.5rem',
                    border: f.highlight ? '2px solid #0f766e' : '1px solid #e2e8f0',
                    background: f.highlight ? '#f0fdfa' : '#fafafa',
                    textDecoration: 'none', color: 'inherit',
                    transition: 'all 0.15s'
                  }}
                  onMouseOver={(e) => e.currentTarget.style.background = f.highlight ? '#ccfbf1' : '#f1f5f9'}
                  onMouseOut={(e) => e.currentTarget.style.background = f.highlight ? '#f0fdfa' : '#fafafa'}
                >
                  <Icon size={20} color={f.highlight ? '#0f766e' : '#64748b'} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: 600, fontSize: '0.9rem', wordBreak: 'break-all' }}>
                      {f.name}
                      {f.highlight && <span style={{ marginLeft: '0.5rem', fontSize: '0.7rem', background: '#0f766e', color: 'white', padding: '0.1rem 0.4rem', borderRadius: '0.25rem' }}>RECOMMENDED</span>}
                    </div>
                    <div style={{ fontSize: '0.8rem', color: '#64748b' }}>{f.desc}</div>
                  </div>
                  <div style={{ textAlign: 'right', flexShrink: 0 }}>
                    <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>{f.size}</div>
                    <Download size={16} color="#0f766e" style={{ display: 'inline-block', marginTop: '0.2rem' }} />
                  </div>
                </a>
              )
            })}
          </div>
        </div>

        {/* Footer note */}
        <div style={{ marginTop: '2rem', padding: '1rem', background: '#eff6ff', borderRadius: '0.5rem', fontSize: '0.85rem', color: '#1e40af', display: 'flex', gap: '0.5rem', alignItems: 'flex-start' }}>
          <CheckCircle2 size={16} style={{ flexShrink: 0, marginTop: '2px' }} />
          <div>
            <strong>Urutan apply:</strong> 1) Workflow + Proxy fixes dulu (bagian hijau) → 2) UI Redesign (bagian ungu).
            Keduanya saling independen — UI redesign tidak mengubah fungsionalitas, hanya tampilan.
          </div>
        </div>

        <div style={{ textAlign: 'center', marginTop: '2rem', fontSize: '0.8rem', color: '#94a3b8' }}>
          Setelah selesai, kasih tahu hasilnya. Kalau ada error, kirim pesan errornya ke chat.
        </div>
      </div>
    </div>
  )
}
