'use client'

import { Download, Package, FileCode, CheckCircle2, Github, FolderArchive } from 'lucide-react'

export default function Home() {
  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc', color: '#0f172a', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '2rem 1.5rem 4rem' }}>

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
            <FolderArchive size={32} color="#7c3aed" />
            <h1 style={{ fontSize: '1.875rem', fontWeight: 700, margin: 0 }}>
              Simple Storyboard Studio
            </h1>
          </div>
          <p style={{ fontSize: '1.05rem', color: '#475569', maxWidth: '600px', margin: '0 auto', lineHeight: 1.6 }}>
            Aplikasi full-stack storyboard simpel — 3 kolom: VO, Image (upload), Video (generate via WAN 2.2 i2v).
          </p>
        </div>

        {/* Download banner */}
        <div style={{
          background: 'linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%)',
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
            <div style={{ fontSize: '1.15rem', fontWeight: 600 }}>Download Source Code</div>
            <div style={{ opacity: 0.9, fontSize: '0.9rem' }}>ZIP berisi semua source code (6.3 MB, tanpa node_modules)</div>
          </div>
          <a href="/simple-storyboard-studio.zip" download style={{
            background: 'white', color: '#7c3aed', padding: '0.7rem 1.4rem',
            borderRadius: '0.5rem', fontWeight: 600, textDecoration: 'none',
            display: 'inline-flex', alignItems: 'center', gap: '0.5rem'
          }}>
            <Download size={18} /> Download ZIP (6.3 MB)
          </a>
        </div>

        {/* Features */}
        <div style={{
          background: 'white', borderRadius: '0.75rem', padding: '1.5rem',
          marginBottom: '2rem', border: '1px solid #e2e8f0'
        }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 600, marginTop: 0, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <CheckCircle2 size={20} color="#7c3aed" /> Fitur Aplikasi
          </h2>
          <div style={{ display: 'grid', gap: '0.6rem' }}>
            {[
              { title: 'Load JSON Storyboard', desc: 'Paste atau upload JSON berisi project + scenes (vo, image_prompt, video_prompt)' },
              { title: '3 Kolom Layout', desc: 'VO (violet) | Image upload (amber) | Video generate (blue)' },
              { title: 'Image Upload', desc: 'Upload image dari luar per scene — tidak perlu generate, langsung simpan ke disk' },
              { title: 'Video Generate', desc: 'Generate video via proxy port 9200 (WAN 2.2 i2v) — engine sama dengan Kiwul' },
              { title: 'Image Zoom Lightbox', desc: 'Klik image untuk zoom fullscreen, scroll wheel, drag to pan' },
              { title: 'Save & Export', desc: 'Auto-save per scene (PATCH API) + export JSON final' },
              { title: 'Project Management', desc: 'List, open, delete projects + provider settings' },
              { title: 'Responsive + Dark Mode', desc: '3 columns desktop, tabs mobile, theme toggle' },
            ].map((f, i) => (
              <div key={i} style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
                <CheckCircle2 size={16} color="#7c3aed" style={{ flexShrink: 0, marginTop: '2px' }} />
                <div>
                  <div style={{ fontWeight: 600, fontSize: '0.95rem' }}>{f.title}</div>
                  <div style={{ fontSize: '0.85rem', color: '#64748b', lineHeight: 1.4 }}>{f.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Setup Instructions */}
        <div style={{
          background: 'white', borderRadius: '0.75rem', padding: '1.5rem',
          marginBottom: '2rem', border: '1px solid #e2e8f0'
        }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 600, marginTop: 0, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <FileCode size={20} color="#7c3aed" /> Cara Setup
          </h2>
          <div style={{ background: '#0f172a', color: '#e2e8f0', borderRadius: '0.5rem', padding: '1rem', fontFamily: 'monospace', fontSize: '0.85rem', lineHeight: 1.6, overflowX: 'auto' }}>
            <div style={{ color: '#94a3b8' }}># 1. Extract ZIP</div>
            <div>cd D:\simple-storyboard-studio</div>
            <div style={{ color: '#94a3b8', marginTop: '0.5rem' }}># 2. Install dependencies</div>
            <div>bun install</div>
            <div style={{ color: '#94a3b8', marginTop: '0.5rem' }}># 3. Setup database</div>
            <div>bun run db:push</div>
            <div style={{ color: '#94a3b8', marginTop: '0.5rem' }}># 4. Start dev server</div>
            <div>bun run dev</div>
            <div style={{ color: '#94a3b8', marginTop: '0.5rem' }}># 5. Open browser</div>
            <div style={{ color: '#22d3ee' }}>http://localhost:3000</div>
          </div>
        </div>

        {/* Push to GitHub */}
        <div style={{
          background: 'white', borderRadius: '0.75rem', padding: '1.5rem',
          marginBottom: '2rem', border: '1px solid #e2e8f0'
        }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 600, marginTop: 0, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Github size={20} color="#0f172a" /> Push ke GitHub
          </h2>
          <div style={{ background: '#0f172a', color: '#e2e8f0', borderRadius: '0.5rem', padding: '1rem', fontFamily: 'monospace', fontSize: '0.85rem', lineHeight: 1.6, overflowX: 'auto' }}>
            <div style={{ color: '#94a3b8' }}># Di folder project</div>
            <div>cd D:\simple-storyboard-studio</div>
            <div style={{ color: '#94a3b8', marginTop: '0.5rem' }}># Init git + add + commit</div>
            <div>git init</div>
            <div>git add .</div>
            <div>git commit -m "feat: Simple Storyboard Studio"</div>
            <div>git branch -M main</div>
            <div style={{ color: '#94a3b8', marginTop: '0.5rem' }}># Add remote + push</div>
            <div>git remote add origin https://github.com/USERNAME/simple-storyboard-studio.git</div>
            <div>git push -u origin main</div>
          </div>
        </div>

        {/* Video Provider Note */}
        <div style={{
          background: '#fef3c7', borderRadius: '0.5rem', padding: '1rem',
          fontSize: '0.85rem', color: '#92400e', display: 'flex', gap: '0.5rem', alignItems: 'flex-start'
        }}>
          <CheckCircle2 size={16} style={{ flexShrink: 0, marginTop: '2px' }} />
          <div>
            <strong>Catatan Video Generate:</strong> Untuk generate video, pastikan proxy WAN 2.2 (port 9200) jalan di komputer kamu. Pakai proxy yang sama dengan Kiwul (<code style={{ background: '#fde68a', padding: '0.1rem 0.3rem', borderRadius: '0.2rem' }}>D:\local-video-proxy\server.py</code>). Image upload tidak butuh proxy — langsung simpan ke disk.
          </div>
        </div>

        <div style={{ textAlign: 'center', marginTop: '2rem', fontSize: '0.8rem', color: '#94a3b8' }}>
          Tech: Next.js 16 + TypeScript + Prisma (SQLite) + Tailwind v4 + shadcn/ui + Zustand
        </div>
      </div>
    </div>
  )
}
