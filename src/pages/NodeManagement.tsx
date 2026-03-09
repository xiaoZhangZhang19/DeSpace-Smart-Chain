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
const UL = ({ children }: { children: React.ReactNode }) => (
  <ul className="my-3 space-y-1.5 text-slate-400 text-sm">{children}</ul>
);
const LI = ({ children }: { children: React.ReactNode }) => (
  <li className="flex items-start gap-2"><ChevronRight size={12} className="text-brand-primary mt-1 shrink-0" /><span>{children}</span></li>
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

export default function NodeManagement() {
  const navigate = useNavigate();
  const [activeId, setActiveId] = useState('nm-ops');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => { entries.forEach(e => { if (e.isIntersecting) setActiveId(e.target.id); }); },
      { rootMargin: '-20% 0px -70% 0px' }
    );
    ['nm-ops', 'nm-cases', 'nm-join-net', 'nm-leave-net', 'nm-join-group', 'nm-leave-group'].forEach(id => { const el = document.getElementById(id); if (el) observer.observe(el); });
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
          <span className="text-xs font-black uppercase tracking-widest text-white">组员配置</span>
        </div>
        <button className="md:hidden ml-auto text-white" onClick={() => setSidebarOpen(!sidebarOpen)}>
          {sidebarOpen ? <X size={18} /> : <Menu size={18} />}
        </button>
      </header>

      <div className="pt-14 flex">
        <DocsSidebar activePage="node-management" activeId={activeId} scrollTo={scrollTo} sidebarOpen={sidebarOpen} />

        <main className="flex-1 min-w-0 px-6 md:px-12 lg:px-16 py-10 max-w-4xl">
          {/* breadcrumb */}
          <div className="flex flex-wrap items-center gap-2 text-brand-primary text-xs font-bold uppercase tracking-widest mb-3">
            <span>配置管理</span><span className="text-white/20">·</span>
            <span>组员配置</span>
          </div>
          <h1 className="text-3xl font-black text-white tracking-tight mb-6">组员配置</h1>

          <P>FISCO BCOS引入了三种节点类型，可通过控制台相互转换：</P>
          <UL>
            <LI>共识节点（组员）：参与共识的节点，拥有群组的所有数据（搭链时默认都生成共识节点）</LI>
            <LI>观察者节点（组员）：不参与共识，但能实时同步链上数据的节点</LI>
            <LI>游离节点（非组员）：已启动，待等待加入群组的节点，不能获取链上的数据</LI>
          </UL>

          <CollapsibleSection id="nm-ops" title="操作命令">
            <UL>
              <LI>addSealer：根据节点NodeID设置对应节点为共识节点</LI>
              <LI>addObserver：根据节点NodeID设置对应节点为观察节点</LI>
              <LI>removeNode：根据节点NodeID设置对应节点为游离节点</LI>
              <LI>getSealerList：查看群组中共识节点列表</LI>
              <LI>getObserverList：查看群组中观察节点列表</LI>
              <LI>getNodeIDList：查看节点已连接的所有其他节点的NodeID</LI>
            </UL>
            <Note type="note">操作前提：操作节点Node ID存在（可在节点目录下执行 cat conf/node.nodeid 获取）；节点加入的区块链所有节点共识正常（正常共识的节点会输出+++日志）。</Note>
            <P>命令示例：</P>
            <CodeBlock language="bash" code={`# 获取节点Node ID（设节点目录为~/nodes/192.168.0.1/node0/）
$ cat ~/fisco/nodes/192.168.0.1/node0/conf/node.nodeid
7a056eb611a43bae685efd86d4841bc65aefafbf20d8c8f6028031d67af27c36c5767c9c79cff201769ed80ff220b96953da63f92ae83554962dc2922aa0ef50

# 连接控制台(设控制台位于~/fisco/console目录)
$ cd ~/fisco/console && bash start.sh

# 将指定节点转换为共识节点
[group:1]> addSealer 7a056eb611a43bae685efd86d4841bc65aefafbf20d8c8f6028031d67af27c36c5767c9c79cff201769ed80ff220b96953da63f92ae83554962dc2922aa0ef50

# 查询共识节点列表
[group:1]> getSealerList
[
    7a056eb611a43bae685efd86d4841bc65aefafbf20d8c8f6028031d67af27c36c5767c9c79cff201769ed80ff220b96953da63f92ae83554962dc2922aa0ef50
]

# 将指定节点转换为观察者节点
[group:1]> addObserver 7a056eb611a43bae685efd86d4841bc65aefafbf20d8c8f6028031d67af27c36c5767c9c79cff201769ed80ff220b96953da63f92ae83554962dc2922aa0ef50

# 查询观察者节点列表
[group:1]> getObserverList
[
    7a056eb611a43bae685efd86d4841bc65aefafbf20d8c8f6028031d67af27c36c5767c9c79cff201769ed80ff220b96953da63f92ae83554962dc2922aa0ef50
]

# 将指定节点转换为游离节点
[group:1]> removeNode 7a056eb611a43bae685efd86d4841bc65aefafbf20d8c8f6028031d67af27c36c5767c9c79cff201769ed80ff220b96953da63f92ae83554962dc2922aa0ef50

[group:1]> getSealerList
[]
[group:1]> getObserverList
[]`} />
          </CollapsibleSection>

          <CollapsibleSection id="nm-cases" title="操作案例">
            <P>扩容操作分两个阶段：将节点加入网络、将节点加入群组。退网操作分两个阶段：将节点退出群组、将节点退出网络。</P>
            <P>操作方式：</P>
            <UL>
              <LI>修改节点配置：节点修改自身配置后重启生效，涉及操作项目包括网络的加入/退出、CA黑名单的列入/移除</LI>
              <LI>交易共识上链：节点发送上链交易修改需群组共识的配置项，涉及操作项目包括节点类型的修改</LI>
              <LI>RPC查询：使用curl命令查询链上信息，涉及操作项目包括群组节点的查询</LI>
            </UL>
            <P>Group3节点信息：节点1（node0，127.0.0.1:30400，nodeID前缀b231b309）、节点2（node1，127.0.0.1:30401，前缀aab37e73）、节点3（node2，127.0.0.1:30402，前缀d6b01a96）。</P>
          </CollapsibleSection>

          <CollapsibleSection id="nm-join-net" title="A节点加入网络">
            <P>场景描述：节点3原先不在网络中，现在加入网络。</P>
            <P>操作步骤：</P>
            <P>1. 进入nodes同级目录，拉取并执行gen_node_cert.sh生成节点目录：</P>
            <CodeBlock language="bash" code={`# 获取脚本
$ curl -#LO https://raw.githubusercontent.com/FISCO-BCOS/FISCO-BCOS/master-2.0/tools/gen_node_cert.sh && chmod u+x gen_node_cert.sh

# 执行，-c为生成节点所提供的ca路径，-o为将生成的节点目录名
$ ./gen_node_cert.sh -c nodes/cert/agency -o node2`} />
            <Note type="note">如因网络问题导致长时间无法下载，请尝试：curl -#LO https://gitee.com/FISCO-BCOS/FISCO-BCOS/raw/master-2.0/tools/gen_node_cert.sh</Note>
            <P>2. 拷贝node2到nodes/127.0.0.1/下，与其他节点目录（node0、node1）同级：</P>
            <CodeBlock language="bash" code={`$ cp -r ./node2/ nodes/127.0.0.1/`} />
            <P>3. 进入nodes/127.0.0.1/，拷贝node0/config.ini、node0/start.sh和node0/stop.sh到node2目录：</P>
            <CodeBlock language="bash" code={`$ cd nodes/127.0.0.1/
$ cp node0/config.ini node0/start.sh node0/stop.sh node2/`} />
            <P>4. 修改node2/config.ini，对于[rpc]模块修改channel_listen_port和jsonrpc_listen_port；对于[p2p]模块修改listen_port并增加自身节点信息：</P>
            <CodeBlock language="ini" code={`[rpc]
    listen_ip=127.0.0.1
    channel_listen_port=20302
    jsonrpc_listen_port=8647
[p2p]
    listen_ip=0.0.0.0
    listen_port=30402
    node.0=127.0.0.1:30400
    node.1=127.0.0.1:30401
    node.2=127.0.0.1:30402`} />
            <P>5. 节点3拷贝节点1的group.3.genesis和group.3.ini到node2/conf目录下：</P>
            <CodeBlock language="bash" code={`$ cp node1/conf/group.3.genesis node2/conf/
$ cp node1/conf/group.3.ini node2/conf/`} />
            <P>6. 执行node2/start.sh启动节点3：</P>
            <CodeBlock language="bash" code={`$ ./node2/start.sh`} />
            <P>7. 确认节点3与节点1和节点2的连接已经建立：</P>
            <CodeBlock language="bash" code={`$ tail -f node2/log/log*  | grep P2P
debug|2019-02-21 10:30:18.694258| [P2P][Service] heartBeat ignore connected,endpoint=127.0.0.1:30400,nodeID=b231b309...
debug|2019-02-21 10:30:18.694277| [P2P][Service] heartBeat ignore connected,endpoint=127.0.0.1:30401,nodeID=aab37e73...
info|2019-02-21 10:30:18.694294| [P2P][Service] heartBeat connected count,size=2`} />
            <Note type="note">若启用了白名单，需确保所有节点的config.ini中的白名单都已配置了所有的节点，并正确地将白名单配置刷新入节点中。</Note>
          </CollapsibleSection>

          <CollapsibleSection id="nm-leave-net" title="A节点退出网络">
            <P>场景描述：节点3已在网络中，与节点1和节点2通信，现在退出网络。</P>
            <P>操作步骤：</P>
            <P>1. 对于节点3，将自身的P2P节点连接列表内容清空，重启节点3：</P>
            <CodeBlock language="bash" code={`$ ./stop.sh
$ ./start.sh
nohup: appending output to 'nohup.out'`} />
            <P>2. 对于节点1和2，将节点3从自身的P2P节点连接列表中移除（如有），重启节点1和2。</P>
            <P>3. 确认节点3与节点1（和2）的原有连接已经断开，退出网络操作完成。</P>
            <Note type="warning">节点3需先退出群组再退出网络，退出顺序由用户保证，系统不再作校验。若启用了白名单，需将退出节点从所有节点的config.ini的白名单配置中删除，并正确地将新的白名单配置刷入节点中。</Note>
          </CollapsibleSection>

          <CollapsibleSection id="nm-join-group" title="A节点加入群组">
            <P>场景描述：群组Group3原有节点1和节点2，两节点轮流出块，现在将节点3加入群组。</P>
            <P>操作步骤：</P>
            <UL>
              <LI>节点3加入网络</LI>
              <LI>使用控制台addSealer根据节点3的nodeID设置节点3为共识节点</LI>
              <LI>使用控制台getSealerList查询group3的共识节点中是否包含节点3的nodeID，如存在则操作完成</LI>
            </UL>
            <Note type="note">节点3的NodeID可使用 cat nodes/127.0.0.1/node2/conf/node.nodeid 获取。节点3需先完成网络准入后，再执行加入群组的操作，系统将校验操作顺序。节点3的群组固定配置文件需与节点1和2的一致。</Note>
          </CollapsibleSection>

          <CollapsibleSection id="nm-leave-group" title="A节点退出群组">
            <P>场景描述：群组Group3原有节点1、节点2和节点3，三节点轮流出块，现在将节点3退出群组。</P>
            <P>操作步骤：</P>
            <UL>
              <LI>使用控制台removeNode根据节点3的NodeID设置节点3为游离节点</LI>
              <LI>使用控制台getSealerList查询group3的共识节点中是否包含节点3的nodeID，如已消失则操作完成</LI>
            </UL>
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
