'use client'

import { Download, FileCode, FileJson, FileText, Package, FolderDown, CheckCircle2, AlertCircle } from 'lucide-react'

const files = [
  { name: 'APPLY-GUIDE.md', desc: 'Panduan lengkap langkah demi langkah (BACA INI DULU)', icon: FileText, href: '/kiwul-fixes/APPLY-GUIDE.md', size: '7.4 KB' },
  { name: 'kiwul-fixes-bundle.zip', desc: 'SEMUA file dalam satu ZIP — download ini lalu extract', icon: Package, href: '/kiwul-fixes/kiwul-fixes-bundle.zip', size: '18.6 KB', highlight: true },
  { name: 'image_qwen_image_edit_2509.json', desc: 'Workflow ComfyUI baru (FP8, tanpa AuraFlow)', icon: FileJson, href: '/kiwul-fixes/image_qwen_image_edit_2509.json', size: '4.3 KB' },
  { name: 'image-route.ts', desc: 'File route.ts LENGKAP (sudah +negative prompt anti-stacking)', icon: FileCode, href: '/kiwul-fixes/image-route.ts', size: '18.6 KB' },
  { name: 'route-ts.diff', desc: 'Diff perubahan route.ts (buat yang mau lihat apa yang berubah)', icon: FileCode, href: '/kiwul-fixes/route-ts.diff', size: '4.0 KB' },
  { name: 'server.py', desc: 'Kode proxy baru port 9500 (FastAPI)', icon: FileCode, href: '/kiwul-fixes/server.py', size: '12.3 KB' },
  { name: 'check-negative-prompt-forward.py', desc: 'Tool test proxy forward negative_prompt atau tidak', icon: FileCode, href: '/kiwul-fixes/check-negative-prompt-forward.py', size: '6.2 KB' },
  { name: 'requirements.txt', desc: 'Dependency Python untuk proxy', icon: FileText, href: '/kiwul-fixes/requirements.txt', size: '64 B' },
  { name: 'run.cmd', desc: 'Script startup proxy di Windows', icon: FileText, href: '/kiwul-fixes/run.cmd', size: '549 B' },
]

const steps = [
  { n: '0', title: 'Stop semua service', desc: 'Tutup Next.js, proxy 9500, ComfyUI 8188. Backup workflow lama.' },
  { n: '1', title: 'Download model FP8', desc: 'qwen_image_edit_2509_fp8_e4m3fn.safetensors → C:\\ComfyUI\\models\\diffusion_models\\' },
  { n: '2', title: 'Ganti workflow JSON', desc: 'Timpa workflows/image_qwen_image_edit_2509.json dengan file baru.' },
  { n: '3', title: 'Update route.ts', desc: 'Ganti file route.ts dengan image-route.ts (rename jadi route.ts).' },
  { n: '4', title: 'Setup proxy baru', desc: 'Buat folder proxy/qwen2509-editplus-proxy/, isi 4 file. Stop proxy lama.' },
  { n: '5', title: 'Start service', desc: 'ComfyUI → proxy baru (run.cmd) → Next.js dev.' },
  { n: '6', title: 'Test', desc: 'Jalankan check-negative-prompt-forward.py. Harus PASS. Lalu test dari UI.' },
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
            Semua file perbaikan workflow ComfyUI + proxy port 9500 sudah siap di sini.
            Download <strong>bundle ZIP</strong> di bawah, lalu ikuti panduan <strong>APPLY-GUIDE.md</strong>.
          </p>
        </div>

        {/* Quick download banner */}
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
            <div style={{ fontSize: '1.15rem', fontWeight: 600 }}>Mulai dari sini</div>
            <div style={{ opacity: 0.9, fontSize: '0.9rem' }}>Download ZIP berisi semua file, extract ke komputer kamu.</div>
          </div>
          <a href="/kiwul-fixes/kiwul-fixes-bundle.zip" download style={{
            background: 'white', color: '#0f766e', padding: '0.7rem 1.4rem',
            borderRadius: '0.5rem', fontWeight: 600, textDecoration: 'none',
            display: 'inline-flex', alignItems: 'center', gap: '0.5rem'
          }}>
            <Download size={18} /> Download ZIP (18.6 KB)
          </a>
        </div>

        {/* Steps overview */}
        <div style={{
          background: 'white', borderRadius: '0.75rem', padding: '1.5rem',
          marginBottom: '2rem', border: '1px solid #e2e8f0'
        }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 600, marginTop: 0, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <CheckCircle2 size={20} color="#0f766e" /> 7 Langkah Penerapan
          </h2>
          <div style={{ display: 'grid', gap: '0.6rem' }}>
            {steps.map((s) => (
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
            <span>Detail lengkap tiap langkah ada di file <strong>APPLY-GUIDE.md</strong>. Download dan buka di editor teks (VS Code / Notepad).</span>
          </div>
        </div>

        {/* File list */}
        <div style={{
          background: 'white', borderRadius: '0.75rem', padding: '1.5rem',
          border: '1px solid #e2e8f0'
        }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 600, marginTop: 0, marginBottom: '1rem' }}>
            Semua File
          </h2>
          <div style={{ display: 'grid', gap: '0.5rem' }}>
            {files.map((f) => {
              const Icon = f.icon
              return (
                <a key={f.name} href={f.href} download={f.name.endsWith('.zip') || f.name.endsWith('.md') ? f.name : undefined}
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
        <div style={{ marginTop: '2rem', padding: '1rem', background: '#fef2f2', borderRadius: '0.5rem', fontSize: '0.85rem', color: '#991b1b', display: 'flex', gap: '0.5rem', alignItems: 'flex-start' }}>
          <AlertCircle size={16} style={{ flexShrink: 0, marginTop: '2px' }} />
          <div>
            <strong>Penting:</strong> File-file ini adalah hasil kerja di sandbox.
            Kamu tidak perlu git clone — cukup download dari halaman ini,
            lalu letakkan di folder repo <code style={{ background: '#fee2e2', padding: '0.1rem 0.3rem', borderRadius: '0.2rem' }}>D:\storyboard-kiwul\</code> sesuai panduan APPLY-GUIDE.md.
          </div>
        </div>

        <div style={{ textAlign: 'center', marginTop: '2rem', fontSize: '0.8rem', color: '#94a3b8' }}>
          Setelah selesai, kasih tahu hasilnya. Kalau ada error, kirim pesan errornya ke chat.
        </div>
      </div>
    </div>
  )
}
