import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Database, Menu, X, Copy, Check, ChevronRight } from 'lucide-react';
import DocsSidebar from './DocsSidebar';

const CodeBlock = ({ code, language = 'bash' }: { code: string; language?: string }) => {
  const [copied, setCopied] = useState(false);
  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <div className="relative my-5 rounded-sm overflow-hidden border border-white/10">
      <div className="flex items-center justify-between px-4 py-2 bg-white/5 border-b border-white/10">
        <span className="text-[10px] font-mono text-brand-primary/70 uppercase tracking-widest">{language}</span>
        <button onClick={handleCopy} className="flex items-center gap-1.5 text-[10px] text-slate-500 hover:text-white transition-colors">
          {copied ? <Check size={12} className="text-brand-accent" /> : <Copy size={12} />}
          {copied ? 'COPIED' : 'COPY'}
        </button>
      </div>
      <pre className="p-4 overflow-x-auto text-sm font-mono text-slate-300 bg-[#010d1a] leading-relaxed whitespace-pre"><code>{code}</code></pre>
    </div>
  );
};

const Note = ({ type = 'note', children }: { type?: 'note' | 'warning' | 'tip'; children: React.ReactNode }) => {
  const map: Record<string, { label: string; cls: string }> = {
    note:    { label: '注解',  cls: 'border-blue-500/40 bg-blue-500/5 text-blue-300' },
    warning: { label: '注意',  cls: 'border-yellow-500/40 bg-yellow-500/5 text-yellow-300' },
    tip:     { label: '重要',  cls: 'border-red-500/40 bg-red-500/5 text-red-300' },
  };
  const s = map[type];
  return (
    <div className={`my-5 rounded-sm border p-4 ${s.cls}`}>
      <div className="font-bold text-xs uppercase tracking-widest mb-2">{s.label}</div>
      <div className="text-sm leading-relaxed text-slate-300">{children}</div>
    </div>
  );
};

const H3 = ({ id, children }: { id?: string; children: React.ReactNode }) => (
  <h3 id={id} className="text-base font-bold text-white mt-8 mb-3 scroll-mt-20">{children}</h3>
);
const P = ({ children }: { children: React.ReactNode }) => (
  <p className="text-slate-400 text-sm leading-7 my-3">{children}</p>
);
const UL = ({ children }: { children: React.ReactNode }) => (
  <ul className="my-3 space-y-1.5 text-slate-400 text-sm">{children}</ul>
);
const LI = ({ children }: { children: React.ReactNode }) => (
  <li className="flex items-start gap-2"><ChevronRight size={12} className="text-brand-primary mt-1 shrink-0" /><span>{children}</span></li>
);

export default function SDKAllowlist() {
  const navigate = useNavigate();
  const [activeId, setActiveId] = useState('sa-config');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => { entries.forEach(e => { if (e.isIntersecting) setActiveId(e.target.id); }); },
      { rootMargin: '-20% 0px -70% 0px' }
    );
    ['sa-config', 'sa-usage'].forEach(id => { const el = document.getElementById(id); if (el) observer.observe(el); });
    return () => observer.disconnect();
  }, []);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    setSidebarOpen(false);
  };

  return (
    <div className="min-h-screen bg-[#020c18] text-white font-sans">
      <header className="fixed top-0 left-0 right-0 z-50 bg-[#020c18]/90 backdrop-blur-md border-b border-white/5 h-14 flex items-center px-6 gap-4">
        <button onClick={() => navigate('/')} className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors text-xs font-bold uppercase tracking-widest">
          <ArrowLeft size={14} /> 返回官网
        </button>
        <span className="text-white/10">|</span>
        <div className="flex items-center gap-2">
          <Database size={14} className="text-brand-primary" />
          <span className="text-xs font-black uppercase tracking-widest text-white">设置SDK白名单</span>
        </div>
        <button className="md:hidden ml-auto text-white" onClick={() => setSidebarOpen(!sidebarOpen)}>
          {sidebarOpen ? <X size={18} /> : <Menu size={18} />}
        </button>
      </header>

      <div className="pt-14 flex">
        <DocsSidebar activePage="sdk-allowlist" activeId={activeId} scrollTo={scrollTo} sidebarOpen={sidebarOpen} />

        <main className="flex-1 min-w-0 px-6 md:px-12 lg:px-16 py-10 max-w-4xl">
          {/* breadcrumb */}
          <div className="flex flex-wrap items-center gap-2 text-brand-primary text-xs font-bold uppercase tracking-widest mb-3">
            <span>配置管理</span><span className="text-white/20">·</span>
            <span>设置SDK白名单</span>
          </div>
          <h1 className="text-3xl font-black text-white tracking-tight mb-6">设置SDK白名单</h1>

          <P>为了实现sdk到群组的访问控制，FISCO BCOS v2.6.0引入了群组级的SDK白名单访问控制机制，配置位于group.{'{group_id}'}.ini的[sdk_allowlist]，默认关闭。</P>
          <Note type="warning">FISCO BCOS v2.6.0默认关闭SDK到群组的白名单访问控制功能，即默认情况下sdk与所有群组均可通信。若要开启sdk与群组间基于白名单的访问控制功能，需要将;public_key.0等配置项前面的分号去掉。</Note>

          <H3 id="sa-config">配置方法</H3>
          <P>在group.{'{group_id}'}.ini的[sdk_allowlist]中配置允许与该群组进行通信的SDK公钥列表：</P>
          <UL>
            <LI>public_key.0、public_key.1、…、public_key.i：配置允许与该群组进行通信的SDK公钥列表</LI>
          </UL>
          <CodeBlock language="ini" code={`[sdk_allowlist]
; When sdk_allowlist is empty, all SDKs can connect to this node
; when sdk_allowlist is not empty, only the SDK in the allowlist can connect to this node
; public_key.0 should be nodeid, nodeid's length is 128
public_key.0=b8acb51b9fe84f88d670646be36f31c52e67544ce56faf3dc8ea4cf1b0ebff0864c6b218fdcd9cf9891ebd414a995847911bd26a770f429300085f3`} />

          <H3 id="sa-usage">使用说明</H3>
          <UL>
            <LI>当[sdk_allowlist]为空时，所有SDK均可连接到该节点的该群组</LI>
            <LI>当[sdk_allowlist]不为空时，只有白名单中的SDK才可连接到该节点的该群组</LI>
            <LI>需要将SDK的公钥（NodeID格式，长度128字符）配置到白名单中</LI>
            <LI>此配置支持热加载，修改配置后无需重启节点即可生效</LI>
          </UL>

          <div className="mt-16 pt-8 border-t border-white/5 text-slate-600 text-xs space-y-2">
            <p>© Copyright DeSpace 2019. 本技术文档适用于DeSpace 2.x版本。</p>
            <p>Built with Sphinx using a theme provided by Read the Docs.</p>
          </div>
        </main>
      </div>
    </div>
  );
}
