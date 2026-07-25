'use client';

import React from 'react';
import { AuditResponse } from '@/types/audit';
import { ScoreRing } from './ScoreRing';
import { 
  Globe, Clock, HardDrive, ShieldCheck, 
  CheckCircle2, XCircle, FileText, Search, Zap, Eye, RotateCw
} from 'lucide-react';

interface AuditCardProps {
  data: AuditResponse;
}

export const AuditCard: React.FC<AuditCardProps> = ({ data }) => {
  const { audit, cached, request_id, url } = data;
  const [selectedFormat, setSelectedFormat] = React.useState<string>('ALL');

  const checks = [
    { label: 'HTTPS Security', status: audit.https, icon: ShieldCheck },
    { label: 'Robots.txt', status: audit.has_robots_txt, icon: FileText },
    { label: 'XML Sitemap', status: audit.has_sitemap, icon: Search },
    { label: 'Viewport Meta Tag', status: audit.has_viewport_meta, icon: Eye },
    { label: 'Canonical URL', status: !!audit.canonical_url, icon: Globe },
  ];

  const allImages = audit.images?.detected_urls || [];
  const allMedia = audit.detected_files?.media_files || [];

  // Dynamically compute available extensions present in detected assets
  const availableFormats = React.useMemo(() => {
    const formatsSet = new Set<string>();
    [...allImages, ...allMedia].forEach(fileUrl => {
      const ext = fileUrl.split('.').pop()?.split('?')[0]?.toUpperCase();
      if (ext && ext.length <= 5) {
        formatsSet.add(ext);
      }
    });
    return ['ALL', ...Array.from(formatsSet)];
  }, [allImages, allMedia]);

  // Instant Format Filtering Logic
  const filteredImages = allImages.filter(img => {
    if (selectedFormat === 'ALL') return true;
    const ext = img.split('.').pop()?.split('?')[0]?.toLowerCase();
    return ext === selectedFormat.toLowerCase();
  });

  const filteredMedia = allMedia.filter(media => {
    if (selectedFormat === 'ALL') return true;
    const ext = media.split('.').pop()?.split('?')[0]?.toLowerCase();
    return ext === selectedFormat.toLowerCase();
  });

  return (
    <div className="w-full space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header Bar */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-6 border-b-2 border-[#2f5b45]/30">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Globe className="w-5 h-5 text-[#2f5b45]" />
            <h2 className="text-2xl font-black tracking-tight text-[#1a2520] font-mono break-all">{url}</h2>
          </div>
          <p className="text-xs text-[#2f5b45] font-mono font-bold">REQ_ID: {request_id}</p>
        </div>

        <div className="flex items-center gap-3 font-mono">
          {cached && (
            <span className="flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-extrabold bg-[#2f5b45]/15 text-[#2f5b45] border border-[#2f5b45]/30">
              <RotateCw className="w-3.5 h-3.5 animate-spin" style={{ animationDuration: '6s' }} />
              Cached
            </span>
          )}
          <span className={`px-4 py-1.5 rounded-full text-xs font-black tracking-wider uppercase ${
            audit.status_code >= 200 && audit.status_code < 300
              ? 'bg-[#2f5b45] text-white shadow-sm'
              : 'bg-rose-700 text-white shadow-sm'
          }`}>
            HTTP {audit.status_code} {audit.status_code === 200 ? 'OK' : 'RESPONSE'}
          </span>
        </div>
      </div>

      {/* Score Overview Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 py-2">
        <ScoreRing score={audit.score.overall} label="Overall Score" />
        <ScoreRing score={audit.score.seo} label="SEO Quality" />
        <ScoreRing score={audit.score.performance} label="Performance" />
        <ScoreRing score={audit.score.accessibility} label="Accessibility" />
      </div>

      {/* Main Telemetry & Technical Checklist (Figma Modern Split Layout) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 font-mono pt-4 border-t-2 border-[#2f5b45]/20">
        {/* Specs Column */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-[#2f5b45]/30">
            <Zap className="w-4 h-4 text-amber-600" />
            <h3 className="text-xs font-black uppercase tracking-widest text-[#2f5b45]">
              § CORE PERFORMANCE SPECS
            </h3>
          </div>

          <div className="grid grid-cols-2 gap-6 py-2">
            <div className="space-y-1">
              <div className="flex items-center gap-1.5 text-xs text-[#2f5b45] font-bold">
                <Clock className="w-4 h-4" /> Load Time
              </div>
              <p className="text-3xl font-black text-[#1a2520]">{audit.load_time_ms} <span className="text-sm font-bold text-[#2f5b45]">ms</span></p>
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-1.5 text-xs text-[#2f5b45] font-bold">
                <HardDrive className="w-4 h-4" /> Page Size
              </div>
              <p className="text-3xl font-black text-[#1a2520]">{(audit.page_size_bytes / 1024).toFixed(1)} <span className="text-sm font-bold text-[#2f5b45]">KB</span></p>
            </div>
          </div>

          <div className="pt-2">
            <span className="text-[10px] font-black text-[#2f5b45] uppercase tracking-wider block mb-1 font-mono">PAGE TITLE TAG</span>
            <p className="text-xs font-bold text-[#1a2520] bg-white/60 p-3 rounded-xl border border-[#2f5b45]/30 shadow-sm leading-relaxed">{audit.title || 'No title tag detected'}</p>
          </div>
        </div>

        {/* Technical Checklist Column */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-[#2f5b45]/30">
            <FileText className="w-4 h-4 text-[#2f5b45]" />
            <h3 className="text-xs font-black uppercase tracking-widest text-[#2f5b45]">
              § STANDARDS & SEO CHECKLIST
            </h3>
          </div>

          <div className="space-y-2">
            {checks.map((item, idx) => (
              <div key={idx} className="flex items-center justify-between py-2 border-b border-[#2f5b45]/15 last:border-0">
                <div className="flex items-center gap-3">
                  <item.icon className="w-4 h-4 text-[#2f5b45]" />
                  <span className="text-xs font-bold text-[#1a2520]">{item.label}</span>
                </div>
                {item.status ? (
                  <span className="flex items-center gap-1 text-[11px] font-black text-emerald-700 uppercase">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" /> PASSED
                  </span>
                ) : (
                  <span className="flex items-center gap-1 text-[11px] font-black text-rose-700 uppercase">
                    <XCircle className="w-4 h-4 text-rose-600" /> MISSING
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Dedicated OpenGraph (OG) Protocol Inspection Section */}
      <div className="pt-6 border-t-2 border-[#2f5b45]/20 font-mono space-y-4">
        <div className="flex items-center gap-2 pb-2 border-b border-[#2f5b45]/30">
          <Globe className="w-4 h-4 text-[#2f5b45]" />
          <h3 className="text-xs font-black uppercase tracking-widest text-[#2f5b45]">
            § OPEN GRAPH (OG) META TAGS INSPECTOR
          </h3>
        </div>

        <div className="bg-white/60 p-4 sm:p-5 rounded-2xl border-2 border-[#2f5b45]/30 shadow-md space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <span className="text-[10px] font-black text-[#2f5b45] uppercase tracking-wider block">`og:title`</span>
              <p className="text-xs font-bold text-[#1a2520] bg-white/80 p-2.5 rounded-lg border border-[#2f5b45]/20 truncate" title={audit.open_graph.title || 'Not set'}>
                {audit.open_graph.title || 'Not specified'}
              </p>
            </div>

            <div className="space-y-1">
              <span className="text-[10px] font-black text-[#2f5b45] uppercase tracking-wider block">`og:site_name`</span>
              <p className="text-xs font-bold text-[#1a2520] bg-white/80 p-2.5 rounded-lg border border-[#2f5b45]/20 truncate">
                {audit.open_graph.site_name || 'Not specified'}
              </p>
            </div>
          </div>

          <div className="space-y-1">
            <span className="text-[10px] font-black text-[#2f5b45] uppercase tracking-wider block">`og:description`</span>
            <p className="text-xs font-semibold text-[#1a2520] bg-white/80 p-3 rounded-lg border border-[#2f5b45]/20 leading-relaxed">
              {audit.open_graph.description || 'No OpenGraph description meta tag found.'}
            </p>
          </div>

          {audit.open_graph.image && (
            <div className="space-y-1 pt-1">
              <span className="text-[10px] font-black text-[#2f5b45] uppercase tracking-wider block">`og:image` Preview</span>
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 bg-white/80 p-3 rounded-xl border border-[#2f5b45]/20">
                <img
                  src={audit.open_graph.image}
                  alt="OG Image Preview"
                  className="w-24 h-16 object-cover rounded-lg border border-zinc-300 shrink-0"
                  onError={(e) => { (e.target as HTMLElement).style.display = 'none'; }}
                />
                <a
                  href={audit.open_graph.image}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-[#2f5b45] hover:underline font-bold break-all"
                >
                  {audit.open_graph.image}
                </a>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Detected Media Assets Gallery Section */}
      {!!(allImages.length || allMedia.length || audit.detected_files?.scripts?.length) && (
        <div className="space-y-6 pt-6 border-t-2 border-[#2f5b45]/20">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Search className="w-4 h-4 text-[#2f5b45]" />
              <h3 className="text-xs font-black uppercase tracking-widest text-[#2f5b45] font-mono">
                § DETECTED MEDIA ASSETS & RECON
              </h3>
            </div>

            {/* Format Filter Pills */}
            <div className="flex flex-wrap items-center gap-1.5 font-mono text-[11px] font-extrabold">
              {availableFormats.map((fmt) => (
                <button
                  key={fmt}
                  type="button"
                  onClick={() => setSelectedFormat(fmt)}
                  className={`px-3 py-1 rounded-full transition-all cursor-pointer border-2 ${
                    selectedFormat === fmt
                      ? 'bg-[#2f5b45] text-white border-[#2f5b45] shadow-md'
                      : 'bg-white/60 text-[#1a2520] border-[#2f5b45]/30 hover:border-[#2f5b45]'
                  }`}
                >
                  {fmt}
                </button>
              ))}
            </div>
          </div>

          {/* 1. Detected Image Files Gallery (Horizontal Scrollable Carousel) */}
          {filteredImages.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center justify-between font-mono">
                <span className="text-xs text-[#2f5b45] uppercase tracking-wider font-extrabold">
                  🖼️ DETECTED IMAGES ({filteredImages.length} MATCHES)
                </span>
                <span className="text-[10px] text-[#1a2520]/70 font-bold">Horizontal Scroll →</span>
              </div>
              
              {/* Horizontal Scroll Carousel with Snap & Smooth Touch Pan */}
              <div className="flex items-stretch gap-4 overflow-x-auto pb-4 pt-1 snap-x snap-mandatory scroll-smooth touch-pan-x">
                {filteredImages.map((imgUrl, i) => (
                  <div key={i} className="min-w-[240px] max-w-[260px] bg-white/80 border-2 border-[#2f5b45]/30 rounded-2xl p-3 flex flex-col gap-2 hover:border-[#2f5b45] hover:-translate-y-1 hover:shadow-lg transition-all duration-300 shrink-0 snap-start shadow-sm group cursor-pointer">
                    <div className="w-full h-36 rounded-xl bg-zinc-900 border border-zinc-700 overflow-hidden shrink-0 flex items-center justify-center relative">
                      <img
                        src={imgUrl}
                        alt="Detected Media"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        onError={(e) => {
                          (e.target as HTMLElement).style.display = 'none';
                        }}
                      />
                      <span className="absolute top-2 right-2 text-[10px] font-mono px-2 py-0.5 rounded-full bg-zinc-950/90 text-amber-300 border border-zinc-700 uppercase font-black">
                        {imgUrl.split('.').pop()?.split('?')[0] || 'IMG'}
                      </span>
                    </div>
                    <div className="space-y-1">
                      <a
                        href={imgUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs font-mono text-[#2f5b45] hover:underline block truncate font-bold"
                        title={imgUrl}
                      >
                        {imgUrl}
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 2. Detected Audio & Video Media Files */}
          {filteredMedia.length > 0 && (
            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between font-mono">
                <span className="text-xs text-amber-800 uppercase tracking-wider font-extrabold">
                  🎵 AUDIO & VIDEO MEDIA ({filteredMedia.length} MATCHES)
                </span>
                <span className="text-[10px] text-[#1a2520]/70 font-bold">Horizontal Scroll →</span>
              </div>

              <div className="flex items-stretch gap-4 overflow-x-auto pb-4 pt-1 snap-x snap-mandatory scroll-smooth touch-pan-x">
                {filteredMedia.map((mediaUrl, i) => (
                  <div key={i} className="min-w-[240px] max-w-[260px] bg-white/80 border-2 border-[#2f5b45]/30 rounded-2xl p-3 flex flex-col gap-2 hover:border-[#2f5b45] hover:-translate-y-1 hover:shadow-lg transition-all duration-300 shrink-0 snap-start shadow-sm">
                    <div className="w-full h-24 rounded-xl bg-amber-500/20 border border-amber-600/40 flex items-center justify-center shrink-0">
                      <span className="text-3xl">🎧</span>
                    </div>
                    <div className="space-y-1">
                      <a
                        href={mediaUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs font-mono text-[#2f5b45] hover:underline block truncate font-bold"
                        title={mediaUrl}
                      >
                        {mediaUrl}
                      </a>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#2f5b45] text-white uppercase font-black inline-block">
                        {mediaUrl.split('.').pop()?.split('?')[0] || 'MEDIA'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 3. Detected Scripts & Bundles */}
          {audit.detected_files?.scripts && audit.detected_files.scripts.length > 0 && selectedFormat === 'ALL' && (
            <div className="space-y-2 pt-2 font-mono">
              <span className="text-xs text-[#2f5b45] uppercase tracking-wider font-extrabold">
                ⚡ DETECTED JAVASCRIPT BUNDLES
              </span>
              <div className="bg-white/50 p-4 rounded-xl border border-[#2f5b45]/30 space-y-1.5 max-h-36 overflow-y-auto text-xs text-[#1a2520] font-bold">
                {audit.detected_files.scripts.map((scriptUrl, i) => (
                  <div key={i} className="truncate p-1 hover:bg-[#dfd8cb] rounded transition-colors" title={scriptUrl}>
                    📜 {scriptUrl}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
