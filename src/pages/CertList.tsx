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
const H4 = ({ children }: { children: React.ReactNode }) => (
  <h4 className="text-sm font-bold text-brand-primary mt-6 mb-2 uppercase tracking-widest">{children}</h4>
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

export default function CertList() {
  const navigate = useNavigate();
  const [activeId, setActiveId] = useState('cl-blacklist');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => { entries.forEach(e => { if (e.isIntersecting) setActiveId(e.target.id); }); },
      { rootMargin: '-20% 0px -70% 0px' }
    );
    ['cl-blacklist', 'cl-whitelist', 'cl-public-ca', 'cl-examples'].forEach(id => { const el = document.getElementById(id); if (el) observer.observe(el); });
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
          <span className="text-xs font-black uppercase tracking-widest text-white">配置CA黑白名单</span>
        </div>
        <button className="md:hidden ml-auto text-white" onClick={() => setSidebarOpen(!sidebarOpen)}>
          {sidebarOpen ? <X size={18} /> : <Menu size={18} />}
        </button>
      </header>

      <div className="pt-14 flex">
        <DocsSidebar activePage="cert-list" activeId={activeId} scrollTo={scrollTo} sidebarOpen={sidebarOpen} />

        <main className="flex-1 min-w-0 px-6 md:px-12 lg:px-16 py-10 max-w-4xl">
          {/* breadcrumb */}
          <div className="flex flex-wrap items-center gap-2 text-brand-primary text-xs font-bold uppercase tracking-widest mb-3">
            <span>配置管理</span><span className="text-white/20">·</span>
            <span>配置CA黑白名单</span>
          </div>
          <h1 className="text-3xl font-black text-white tracking-tight mb-6">配置CA黑白名单</h1>

          <P>本文档描述CA黑、白名单的实践操作。通过配置CA黑白名单，可以控制节点的连接权限，实现节点间连接的精细化管理。</P>

          <H3 id="cl-blacklist">黑名单</H3>
          <P>通过配置黑名单，能够拒绝与指定的节点连接。</P>
          <P>配置方法，编辑config.ini：</P>
          <CodeBlock language="ini" code={`[certificate_blacklist]
    ; crl.0 should be nodeid, nodeid's length is 128
    ;crl.0=`} />
          <P>重启节点生效：</P>
          <CodeBlock language="bash" code={`$ bash stop.sh && bash start.sh`} />
          <P>查看节点连接：</P>
          <CodeBlock language="bash" code={`$ curl -X POST --data '{"jsonrpc":"2.0","method":"getPeers","params":[1],"id":1}' http://127.0.0.1:8545 |jq`} />

          <H3 id="cl-whitelist">白名单</H3>
          <P>通过配置白名单，能够只与指定的节点连接，拒绝与白名单之外的节点连接。不配置表示白名单关闭，可与任意节点建立连接。</P>
          <P>配置方法，编辑config.ini：</P>
          <CodeBlock language="ini" code={`[certificate_whitelist]
    ; cal.0 should be nodeid, nodeid's length is 128
    cal.0=7718df20f0f7e27fdab97b3d69deebb6e289b07eb7799c7ba92fe2f43d2efb4c1250dd1f11fa5b5ce687c8283d65030aae8680093275640861bc274b1b2874cb
    cal.1=f306eb1066ceb9d46e3b77d2833a1bde2a9899cfc4d0433d64b01d03e79927aa60a40507c5739591b8122ee609cf5636e71b02ce5009f3b8361930ecc3a9abb0`} />
          <P>若节点未启动，则直接启动节点；若节点已启动，可直接用脚本reload_whitelist.sh刷新白名单配置（暂不支持动态刷新黑名单）：</P>
          <CodeBlock language="bash" code={`# 若节点未启动
$ bash start.sh
# 若节点已启动
$ cd scripts
$ bash reload_whitelist.sh`} />

          <H3 id="cl-public-ca">使用场景：公共CA</H3>
          <P>所有用CFCA颁发证书搭的链，链的CA都是CFCA，此CA是共用的。必须启用白名单功能。使用公共CA搭的链，会存在两条链共用同一个CA的情况，造成无关的两条链的节点能彼此建立连接。此时需要配置白名单，拒绝与无关的链的节点建立连接。</P>

          <H4>搭链操作步骤</H4>
          <UL>
            <LI>用工具搭链</LI>
            <LI>查询所有节点的NodeID</LI>
            <LI>将所有NodeID配置入每个节点的白名单中</LI>
            <LI>启动节点或用脚本reload_whitelist.sh刷新节点白名单配置</LI>
          </UL>

          <H4>扩容操作步骤</H4>
          <UL>
            <LI>用工具扩容一个节点</LI>
            <LI>查询此扩容节点的NodeID</LI>
            <LI>将此NodeID追加到所有节点的白名单配置中</LI>
            <LI>将其他节点的白名单配置拷贝到新扩容的节点上</LI>
            <LI>用脚本reload_whitelist.sh刷新已启动的所有节点的白名单配置</LI>
            <LI>启动扩容节点</LI>
            <LI>将扩容节点加成组员（addSealer或addObserver）</LI>
          </UL>

          <H3 id="cl-examples">黑白名单操作举例</H3>

          <H4>准备</H4>
          <P>搭一个四个节点的链：</P>
          <CodeBlock language="bash" code={`bash build_chain.sh -l 127.0.0.1:4`} />
          <P>查看四个节点的NodeID：</P>
          <CodeBlock language="bash" code={`$ cat node*/conf/node.nodeid
219b319ba7b2b3a1ecfa7130ea314410a52c537e6e7dda9da46dec492102aa5a43bad81679b6af0cd5b9feb7cfdc0b395cfb50016f56806a2afc7ee81bbb09bf
7718df20f0f7e27fdab97b3d69deebb6e289b07eb7799c7ba92fe2f43d2efb4c1250dd1f11fa5b5ce687c8283d65030aae8680093275640861bc274b1b2874cb
f306eb1066ceb9d46e3b77d2833a1bde2a9899cfc4d0433d64b01d03e79927aa60a40507c5739591b8122ee609cf5636e71b02ce5009f3b8361930ecc3a9abb0
38158ef34eb2d58ce1d31c8f3ef9f1fa829d0eb8ed1657f4b2a3ebd3265d44b243c69ffee0519c143dd67e91572ea8cb4e409144a1865f3e980c22d33d443296`} />
          <P>四个节点的NodeID：node0(219b319b…)，node1(7718df20…)，node2(f306eb10…)，node3(38158ef3…)。</P>
          <P>启动所有节点：</P>
          <CodeBlock language="bash" code={`$ cd node/127.0.0.1/
$ bash start_all.sh`} />
          <P>查看连接，以node0为例（8545是node0的rpc端口），可看到node0连接了除自身之外的其它三个节点：</P>
          <CodeBlock language="bash" code={`$ curl -X POST --data '{"jsonrpc":"2.0","method":"getPeers","params":[1],"id":1}' http://127.0.0.1:8545 |jq
{
  "id": 1,
  "jsonrpc": "2.0",
  "result": [
    {
      "Agency": "agency",
      "IPAndPort": "127.0.0.1:62774",
      "Node": "node3",
      "NodeID": "38158ef34eb2d58ce1d31c8f3ef9f1fa829d0eb8ed1657f4b2a3ebd3265d44b243c69ffee0519c143dd67e91572ea8cb4e409144a1865f3e980c22d33d443296",
      "Topic": []
    },
    {
      "Agency": "agency",
      "IPAndPort": "127.0.0.1:62766",
      "Node": "node1",
      "NodeID": "7718df20f0f7e27fdab97b3d69deebb6e289b07eb7799c7ba92fe2f43d2efb4c1250dd1f11fa5b5ce687c8283d65030aae8680093275640861bc274b1b2874cb",
      "Topic": []
    },
    {
      "Agency": "agency",
      "IPAndPort": "127.0.0.1:30302",
      "Node": "node2",
      "NodeID": "f306eb1066ceb9d46e3b77d2833a1bde2a9899cfc4d0433d64b01d03e79927aa60a40507c5739591b8122ee609cf5636e71b02ce5009f3b8361930ecc3a9abb0",
      "Topic": []
    }
  ]
}`} />

          <H4>配置黑名单：node0拒绝node1的连接</H4>
          <P>将node1的NodeID写入node0的配置中（vim node0/config.ini），白名单为空（默认关闭）：</P>
          <CodeBlock language="ini" code={`[certificate_blacklist]
    ; crl.0 should be nodeid, nodeid's length is 128
    crl.0=7718df20f0f7e27fdab97b3d69deebb6e289b07eb7799c7ba92fe2f43d2efb4c1250dd1f11fa5b5ce687c8283d65030aae8680093275640861bc274b1b2874cb

[certificate_whitelist]
    ; cal.0 should be nodeid, nodeid's length is 128
    ; cal.0=`} />
          <P>重启node0节点生效：</P>
          <CodeBlock language="bash" code={`$ cd node0
$ bash stop.sh && bash start.sh`} />
          <P>查看节点连接，可看到只与两个节点建立的连接，未与node1建立连接：</P>
          <CodeBlock language="bash" code={`$ curl -X POST --data '{"jsonrpc":"2.0","method":"getPeers","params":[1],"id":1}' http://127.0.0.1:8545 |jq
{
  "id": 1,
  "jsonrpc": "2.0",
  "result": [
    {
      "Agency": "agency",
      "IPAndPort": "127.0.0.1:30303",
      "Node": "node3",
      "NodeID": "38158ef34eb2d58ce1d31c8f3ef9f1fa829d0eb8ed1657f4b2a3ebd3265d44b243c69ffee0519c143dd67e91572ea8cb4e409144a1865f3e980c22d33d443296",
      "Topic": []
    },
    {
      "Agency": "agency",
      "IPAndPort": "127.0.0.1:30302",
      "Node": "node2",
      "NodeID": "f306eb1066ceb9d46e3b77d2833a1bde2a9899cfc4d0433d64b01d03e79927aa60a40507c5739591b8122ee609cf5636e71b02ce5009f3b8361930ecc3a9abb0",
      "Topic": []
    }
  ]
}`} />

          <H4>配置白名单：node0拒绝与node1、node2之外的节点连接</H4>
          <P>将node1和node2的NodeID写入node0的配置中，黑名单置空，白名单配置node1、node2：</P>
          <CodeBlock language="ini" code={`[certificate_blacklist]
    ; crl.0 should be nodeid, nodeid's length is 128
    ;crl.0=

[certificate_whitelist]
    ; cal.0 should be nodeid, nodeid's length is 128
    cal.0=7718df20f0f7e27fdab97b3d69deebb6e289b07eb7799c7ba92fe2f43d2efb4c1250dd1f11fa5b5ce687c8283d65030aae8680093275640861bc274b1b2874cb
    cal.1=f306eb1066ceb9d46e3b77d2833a1bde2a9899cfc4d0433d64b01d03e79927aa60a40507c5739591b8122ee609cf5636e71b02ce5009f3b8361930ecc3a9abb0`} />
          <CodeBlock language="bash" code={`$ bash stop.sh && bash start.sh`} />
          <P>查看节点连接，可看到只与两个节点建立的连接，未与node3建立连接：</P>
          <CodeBlock language="bash" code={`$ curl -X POST --data '{"jsonrpc":"2.0","method":"getPeers","params":[1],"id":1}' http://127.0.0.1:8545 |jq
{
  "id": 1,
  "jsonrpc": "2.0",
  "result": [
    {
      "Agency": "agency",
      "IPAndPort": "127.0.0.1:30302",
      "Node": "node2",
      "NodeID": "f306eb1066ceb9d46e3b77d2833a1bde2a9899cfc4d0433d64b01d03e79927aa60a40507c5739591b8122ee609cf5636e71b02ce5009f3b8361930ecc3a9abb0",
      "Topic": []
    },
    {
      "Agency": "agency",
      "IPAndPort": "127.0.0.1:30301",
      "Node": "node1",
      "NodeID": "7718df20f0f7e27fdab97b3d69deebb6e289b07eb7799c7ba92fe2f43d2efb4c1250dd1f11fa5b5ce687c8283d65030aae8680093275640861bc274b1b2874cb",
      "Topic": []
    }
  ]
}`} />

          <H4>黑名单与白名单混合配置</H4>
          <P>黑名单优先级高于白名单。白名单配置的基础上拒绝与node1建立连接：</P>
          <CodeBlock language="ini" code={`[certificate_blacklist]
    ; crl.0 should be nodeid, nodeid's length is 128
    crl.0=7718df20f0f7e27fdab97b3d69deebb6e289b07eb7799c7ba92fe2f43d2efb4c1250dd1f11fa5b5ce687c8283d65030aae8680093275640861bc274b1b2874cb

[certificate_whitelist]
    ; cal.0 should be nodeid, nodeid's length is 128
    cal.0=7718df20f0f7e27fdab97b3d69deebb6e289b07eb7799c7ba92fe2f43d2efb4c1250dd1f11fa5b5ce687c8283d65030aae8680093275640861bc274b1b2874cb
    cal.1=f306eb1066ceb9d46e3b77d2833a1bde2a9899cfc4d0433d64b01d03e79927aa60a40507c5739591b8122ee609cf5636e71b02ce5009f3b8361930ecc3a9abb0`} />
          <CodeBlock language="bash" code={`$ bash stop.sh && bash start.sh`} />
          <P>查看节点连接，虽然白名单上配置了node1，但由于node1在黑名单中也有配置，node0也不能与node1建立连接，仅连接node2：</P>
          <CodeBlock language="bash" code={`$ curl -X POST --data '{"jsonrpc":"2.0","method":"getPeers","params":[1],"id":1}' http://127.0.0.1:8545 |jq
{
  "id": 1,
  "jsonrpc": "2.0",
  "result": [
    {
      "Agency": "agency",
      "IPAndPort": "127.0.0.1:30302",
      "Node": "node2",
      "NodeID": "f306eb1066ceb9d46e3b77d2833a1bde2a9899cfc4d0433d64b01d03e79927aa60a40507c5739591b8122ee609cf5636e71b02ce5009f3b8361930ecc3a9abb0",
      "Topic": []
    }
  ]
}`} />

          <div className="mt-16 pt-8 border-t border-white/5 text-slate-600 text-xs space-y-2">
            <p>© Copyright DeSpace 2019. 本技术文档适用于DeSpace 2.x版本。</p>
            <p>Built with Sphinx using a theme provided by Read the Docs.</p>
          </div>
        </main>
      </div>
    </div>
  );
}
