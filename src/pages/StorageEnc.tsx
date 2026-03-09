import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Database, Menu, X, Copy, Check, ChevronRight, ChevronDown } from 'lucide-react';
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

const CollapsibleSection = ({ id, title, defaultOpen = true, children }: { id: string; title: string; defaultOpen?: boolean; children: React.ReactNode }) => {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div>
      <button
        id={id}
        onClick={() => setOpen(o => !o)}
        className="scroll-mt-20 w-full flex items-center justify-between text-lg font-black text-white tracking-tight mt-10 mb-4 pb-2 border-b border-white/10 hover:text-brand-primary transition-colors"
      >
        <span>{title}</span>
        <ChevronDown size={16} className={`transition-transform duration-200 text-brand-primary ${open ? 'rotate-0' : '-rotate-90'}`} />
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key="content"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            style={{ overflow: 'hidden' }}
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default function StorageEnc() {
  const navigate = useNavigate();
  const [activeId, setActiveId] = useState('se-step1');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => { entries.forEach(e => { if (e.isIntersecting) setActiveId(e.target.id); }); },
      { rootMargin: '-20% 0px -70% 0px' }
    );
    ['se-step1', 'se-step2', 'se-step3', 'se-step4', 'se-step5', 'se-step6', 'se-step7'].forEach(id => { const el = document.getElementById(id); if (el) observer.observe(el); });
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
          <span className="text-xs font-black uppercase tracking-widest text-white">存储加密</span>
        </div>
        <button className="md:hidden ml-auto text-white" onClick={() => setSidebarOpen(!sidebarOpen)}>
          {sidebarOpen ? <X size={18} /> : <Menu size={18} />}
        </button>
      </header>

      <div className="pt-14 flex">
        <DocsSidebar activePage="storage-enc" activeId={activeId} scrollTo={scrollTo} sidebarOpen={sidebarOpen} />

        <main className="flex-1 min-w-0 px-6 md:px-12 lg:px-16 py-10 max-w-4xl">
          {/* breadcrumb */}
          <div className="flex flex-wrap items-center gap-2 text-brand-primary text-xs font-bold uppercase tracking-widest mb-3">
            <span>配置管理</span><span className="text-white/20">·</span>
            <span>存储加密</span>
          </div>
          <h1 className="text-3xl font-black text-white tracking-tight mb-6">存储加密</h1>

          <P>联盟链的数据，只对联盟内部成员可见。落盘加密，保证了运行联盟链的数据，在硬盘上的安全性。一旦硬盘脱离联盟链内网环境，数据将无法被解密。落盘加密对节点存储在硬盘上的内容进行加密，加密内容包括：合约数据以及节点私钥文件。</P>
          <Note type="warning">若节点是SM2版本，Key Manager也必须是SM2版本。节点必须在首次运行前完成落盘加密配置，一旦节点开始运行则无法切换加密状态。</Note>

          <CollapsibleSection id="se-step1" title="第一步. 部署Key Manager">
            <P>每个机构部署一个Key Manager。具体部署步骤请参考Key Manager GitHub README或Key Manager Gitee README。</P>
          </CollapsibleSection>

          <CollapsibleSection id="se-step2" title="第二步. 生成节点">
            <CodeBlock language="bash" code={`curl -#LO https://github.com/FISCO-BCOS/FISCO-BCOS/releases/download/v2.11.0/build_chain.sh && chmod u+x build_chain.sh

bash build_chain.sh -l 127.0.0.1:4 -p 30300,20200,8545`} />
            <Note type="warning">节点生成后不能直接启动，需完成dataKey配置后再启动。</Note>
          </CollapsibleSection>

          <CollapsibleSection id="se-step3" title="第三步. 启动Key Manager">
            <CodeBlock language="bash" code={`./key-manager 8150 123xyz`} />
            <P>成功启动后输出：</P>
            <CodeBlock language="bash" code={`[1546501342949][TRACE][Load]key-manager started,port=8150`} />
          </CollapsibleSection>

          <CollapsibleSection id="se-step4" title="第四步. 配置dataKey">
            <Note type="note">配置dataKey的节点必须是新生成、从未启动过的节点。</Note>
            <CodeBlock language="bash" code={`cd key-manager/scripts
bash gen_data_secure_key.sh 127.0.0.1 8150 123456`} />
            <P>脚本自动打印落盘加密所需的ini配置，示例输出如下：</P>
            <CodeBlock language="bash" code={`CiherDataKey generated: ed157f4588b86d61a2e1745efe71e6ea
Append these into config.ini to enable disk encryption:
[storage_security]
enable=true
key_manager_ip=127.0.0.1
key_manager_port=8150
cipher_data_key=ed157f4588b86d61a2e1745efe71e6ea`} />
            <P>将以上落盘加密配置写入节点的config.ini文件：</P>
            <CodeBlock language="bash" code={`vim nodes/127.0.0.1/node0/config.ini`} />
            <P>修改[storage_security]节：</P>
            <CodeBlock language="ini" code={`[storage_security]
enable=true
key_manager_ip=127.0.0.1
key_manager_port=8150
cipher_data_key=ed157f4588b86d61a2e1745efe71e6ea`} />
          </CollapsibleSection>

          <CollapsibleSection id="se-step5" title="第五步. 加密节点私钥">
            <Note type="tip">若使用内置HSM密钥，可跳过此步骤。</Note>
            <CodeBlock language="bash" code={`cd key-manager/scripts
bash encrypt_node_key.sh 127.0.0.1 8150 ../../nodes/127.0.0.1/node0/conf/node.key ed157f4588b86d61a2e1745efe71e6ea`} />
            <P>加密成功输出：</P>
            <CodeBlock language="bash" code={`[INFO] File backup to "nodes/127.0.0.1/node0/conf/node.key.bak.1546502474"
[INFO] "nodes/127.0.0.1/node0/conf/node.key" encrypted!`} />
            <Note type="warning">需要加密的文件：非SM2版本为conf/node.key；SM2版本为conf/gmnode.key和conf/origin_cert/node.key。未加密将导致节点无法启动。</Note>
          </CollapsibleSection>

          <CollapsibleSection id="se-step6" title="第六步. 节点运行">
            <CodeBlock language="bash" code={`cd nodes/127.0.0.1/node0/
./start.sh`} />
          </CollapsibleSection>

          <CollapsibleSection id="se-step7" title="第七步. 正确性判断">
            <P>验证方式1：节点正常运行，共识功能正常，持续输出共识打包信息：</P>
            <CodeBlock language="bash" code={`tail -f nodes/127.0.0.1/node0/log/* | grep +++`} />
            <P>验证方式2：Key Manager在每次节点启动时打印一条日志，示例如下：</P>
            <CodeBlock language="bash" code={`[1546504272699][TRACE][Dec]Respond
{
   "dataKey" : "313233343536",
   "error" : 0,
   "info" : "success"
}`} />
          </CollapsibleSection>

          <div className="mt-16 pt-8 border-t border-white/5 text-slate-600 text-xs space-y-2">
            <p>© Copyright DeSpace 2019. 本技术文档适用于DeSpace 2.x版本。</p>
            <p>Built with Sphinx using a theme provided by Read the Docs.</p>
          </div>
        </main>
      </div>
    </div>
  );
}
