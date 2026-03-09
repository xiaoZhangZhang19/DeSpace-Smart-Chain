import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Database, Menu, X, Copy, Check, ChevronRight, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
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

const Table = ({ headers, rows }: { headers: string[]; rows: string[][] }) => (
  <div className="my-5 overflow-x-auto">
    <table className="w-full text-xs border-collapse">
      <thead>
        <tr className="border-b border-white/10">
          {headers.map((h, i) => <th key={i} className="text-left px-3 py-2 text-brand-primary font-bold uppercase tracking-widest">{h}</th>)}
        </tr>
      </thead>
      <tbody>
        {rows.map((row, i) => (
          <tr key={i} className="border-b border-white/5 hover:bg-white/3">
            {row.map((cell, j) => <td key={j} className="px-3 py-2 text-slate-400">{cell}</td>)}
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

const CollapsibleSection = ({ id, title, defaultOpen = true, children }: { id: string; title: string; defaultOpen?: boolean; children: React.ReactNode }) => {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div>
      <button
        id={id}
        onClick={() => setOpen(o => !o)}
        className="scroll-mt-20 w-full flex items-center justify-between text-xl font-black text-white tracking-tight mt-12 mb-4 pb-2 border-b border-white/10 hover:text-brand-primary transition-colors group"
      >
        <span>{title}</span>
        <ChevronDown size={18} className={`transition-transform duration-200 text-brand-primary ${open ? 'rotate-0' : '-rotate-90'}`} />
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

export default function BlockchainDevConfig() {
  const navigate = useNavigate();
  const [activeId, setActiveId] = useState('node-config');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => { entries.forEach(e => { if (e.isIntersecting) setActiveId(e.target.id); }); },
      { rootMargin: '-20% 0px -70% 0px' }
    );
    ['node-config', 'config-ini', 'config-group', 'config-mutable', 'node-management', 'cert-list', 'storage-enc', 'permission-control']
      .forEach(id => { const el = document.getElementById(id); if (el) observer.observe(el); });
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
          <span className="text-xs font-black uppercase tracking-widest text-white">配置管理</span>
        </div>
        <button className="md:hidden ml-auto text-white" onClick={() => setSidebarOpen(!sidebarOpen)}>
          {sidebarOpen ? <X size={18} /> : <Menu size={18} />}
        </button>
      </header>

      <div className="pt-14 flex">
        <DocsSidebar activePage="config" activeId={activeId} scrollTo={scrollTo} sidebarOpen={sidebarOpen} />

        <main className="flex-1 min-w-0 px-6 md:px-12 lg:px-16 py-10 max-w-4xl">

          <div id="node-config" className="scroll-mt-20 mb-2">
            <div className="flex flex-wrap items-center gap-2 text-brand-primary text-xs font-bold uppercase tracking-widest mb-3">
              <span>配置管理</span><span className="text-white/20">·</span>
              <span>节点配置</span><span className="text-white/20">·</span>
              <span>运维手册</span>
            </div>
            <h1 className="text-3xl font-black text-white tracking-tight mb-6">配置管理</h1>
          </div>
          <Note type="tip">执行下文操作前，请先完成区块链网络搭建，可参考建链工具文档。</Note>
          <P>配置管理包含以下模块：节点和账本配置（节点配置）、节点的加入/退出网络、群组变更等（组员配置）、CA黑白名单配置、存储加密、账户权限控制。</P>

          {/* ── 节点配置 ── */}
          <CollapsibleSection id="node-config-section" title="节点配置" defaultOpen={true}>
            <span id="config-ini" className="scroll-mt-20 block" />
            <H3>主配置文件 config.ini</H3>
            <P>节点config.ini主要配置RPC、P2P、账本、证书、黑名单和日志，各配置项详细说明如下：</P>

            <H4>配置RPC</H4>
            <UL>
              <LI>channel_listen_ip：Channel监听IP，默认0.0.0.0</LI>
              <LI>jsonrpc_listen_ip：RPC监听IP，默认127.0.0.1</LI>
              <LI>channel_listen_port：Channel端口</LI>
              <LI>jsonrpc_listen_port：JSON-RPC端口。支持IPv4和IPv6（v2.6.0+）</LI>
            </UL>
            <Note type="warning">出于安全考虑，建议将jsonrpc_listen_ip配置为127.0.0.1，同时通过Nginx等代理工具将外部请求转发到本地节点。</Note>
            <CodeBlock language="ini" code={`[rpc]
    channel_listen_ip=0.0.0.0
    jsonrpc_listen_ip=127.0.0.1
    channel_listen_port=20200
    jsonrpc_listen_port=8545`} />

            <H4>配置P2P</H4>
            <UL>
              <LI>listen_ip：P2P监听IP，默认0.0.0.0</LI>
              <LI>listen_port：P2P监听端口</LI>
              <LI>node.*：需连接的节点IP:Port列表</LI>
              <LI>enable_compress：网络压缩开关</LI>
            </UL>
            <Note type="note">云主机部署时，P2P的listen_ip需设置为0.0.0.0，而非公网IP。</Note>
            <CodeBlock language="ini" code={`[p2p]
    listen_ip=0.0.0.0
    listen_port=30300
    node.0=127.0.0.1:30300
    node.1=127.0.0.1:30301
    node.2=127.0.0.1:30302
    node.3=127.0.0.1:30303`} />

            <H4>配置证书信息</H4>
            <UL>
              <LI>data_path：证书所在目录</LI>
              <LI>key：节点私钥路径</LI>
              <LI>cert：证书路径</LI>
              <LI>ca_cert：CA证书路径</LI>
              <LI>check_cert_issuer：是否限制SDK仅连接本机构节点，默认true</LI>
            </UL>
            <CodeBlock language="ini" code={`[network_security]
    data_path=conf/
    key=node.key
    cert=node.crt
    ca_cert=ca.crt`} />

            <H4>配置黑名单列表</H4>
            <P>配置黑名单列表，拒绝与指定节点建立连接。</P>
            <CodeBlock language="ini" code={`[certificate_blacklist]
    ; crl.0 should be nodeid, nodeid's length is 128
    ;crl.0=`} />

            <H4>配置日志信息</H4>
            <UL>
              <LI>enable：启用/禁用日志，默认true</LI>
              <LI>log_path：日志路径</LI>
              <LI>level：日志级别：trace/debug/info/warning/error</LI>
              <LI>max_log_file_size：单文件大小限制，MB，默认200</LI>
              <LI>flush：日志自动刷新</LI>
            </UL>
            <Note type="note">v2.11.0新增：log.format、log.enable_rotate_by_hour、log.log_name_pattern等日志按小时滚动配置。</Note>
            <CodeBlock language="ini" code={`[log]
    enable=true
    log_path=./log
    level=info
    max_log_file_size=200
    flush=true`} />

            <H4>配置链属性</H4>
            <UL>
              <LI>id：链ID，默认1</LI>
              <LI>sm_crypto：是否使用国密模式，默认false</LI>
              <LI>sm_crypto_channel：是否与SDK使用国密SSL，默认false</LI>
            </UL>

            <H4>可选配置：落盘加密</H4>
            <Note type="tip">开启落盘加密前，需要先完成Key Manager的部署，详见存储加密章节。</Note>
            <CodeBlock language="ini" code={`[storage_security]
    enable=true
    key_manager_ip=127.0.0.1
    key_manager_port=8150
    cipher_data_key=ed157f4588b86d61a2e1745efe71e6ea`} />

            <H4>可选配置：流量控制</H4>
            <UL>
              <LI>limit_req：SDK请求速率限制，默认关闭</LI>
              <LI>outgoing_bandwidth_limit：出带宽限制，Mbit/s，默认关闭</LI>
            </UL>

            <span id="config-group" className="scroll-mt-20 block" />
            <H3>群组系统配置 (group.*.genesis)</H3>
            <P>群组系统配置位于节点目录的conf/group.{'{群组ID}'}.genesis文件，主要包括群组ID、共识配置、状态模式配置、Gas配置和EVM配置。系统配置在链启动后不可修改，需确保群组内所有节点配置一致。</P>

            <H4>共识配置</H4>
            <UL>
              <LI>consensus_type：共识算法：pbft/raft/rpbft，默认pbft</LI>
              <LI>max_trans_num：一个区块可打包的最大交易数，默认1000</LI>
              <LI>consensus_timeout：PBFT超时时间，秒，默认3</LI>
              <LI>node.idx：共识节点Node ID列表</LI>
            </UL>
            <Note type="warning">系统配置在链启动后不可修改，建议使用build_chain.sh工具自动生成初始配置。</Note>
            <CodeBlock language="ini" code={`[consensus]
    consensus_type=pbft
    max_trans_num=1000
    consensus_timeout=3
    node.0=xxx...（节点0的NodeID）
    node.1=xxx...（节点1的NodeID）`} />

            <H4>状态模式配置</H4>
            <CodeBlock language="ini" code={`[state]
    type=storage`} />

            <H4>Gas配置 & EVM配置</H4>
            <CodeBlock language="ini" code={`[tx]
    gas_limit=300000000

[evm]
    enable_free_storage=false`} />

            <span id="config-mutable" className="scroll-mt-20 block" />
            <H3>账本可变配置 (group.*.ini)</H3>
            <P>账本可变配置位于nodes/conf/group.{'{群组ID}'}.ini，支持运行时动态调整。</P>

            <H4>配置storage</H4>
            <UL>
              <LI>type：存储类型：RocksDB/MySQL/Scalable，推荐MySQL直连</LI>
              <LI>max_capacity：内存缓存大小</LI>
              <LI>max_forward_block：内存区块大小</LI>
              <LI>binary_log：是否打开二进制日志</LI>
              <LI>db_ip/port/username/passwd/name：MySQL连接信息</LI>
            </UL>

            <H4>交易池配置</H4>
            <UL>
              <LI>limit：交易池最大交易数，默认150000</LI>
              <LI>memory_limit：交易池内存大小限制，MB，默认512</LI>
              <LI>notify_worker_num：异步推送线程数，默认2</LI>
              <LI>txs_expiration_time：交易过期时间，秒，默认600</LI>
            </UL>

            <H4>PBFT共识配置</H4>
            <UL>
              <LI>ttl：消息最大转发次数</LI>
              <LI>min_block_generation_time：最短打包时间，ms，默认500</LI>
              <LI>enable_dynamic_block_size：是否开启交易数动态调整，默认true</LI>
            </UL>

            <H4>同步配置</H4>
            <UL>
              <LI>sync_block_by_tree：区块树状广播优化，v2.2.0+默认true</LI>
              <LI>gossip_interval_ms：Gossip同步周期，ms，默认1000</LI>
              <LI>send_txs_by_tree：交易树状广播，v2.2.0+默认true</LI>
            </UL>

            <H4>动态系统参数</H4>
            <P>通过控制台命令 setSystemConfigByKey / getSystemConfigByKey 修改以下参数：</P>
            <Table
              headers={['参数', '默认值', '说明']}
              rows={[
                ['tx_count_limit', '1000', '一个区块可打包的最大交易数'],
                ['tx_gas_limit', '300000000', '交易最大gas限制'],
                ['rpbft_epoch_sealer_num', '链共识节点总数', 'rPBFT共识周期选取节点数'],
                ['rpbft_epoch_block_num', '1000', 'rPBFT共识周期出块数'],
                ['consensus_timeout', '3', 'PBFT区块执行超时时间（秒）'],
              ]}
            />
          </CollapsibleSection>

          {/* ── 组员节点管理 ── */}
          <CollapsibleSection id="node-management" title="组员节点管理" defaultOpen={true}>
            <P>本章介绍区块链节点的加入和退出操作，包括节点加入/退出网络和节点加入/退出群组。</P>

            <H3>节点类型</H3>
            <P>FISCO BCOS区块链节点分为以下三种类型：</P>
            <UL>
              <LI>共识节点：参与共识，拥有群组完整数据</LI>
              <LI>观察者节点：不参与共识但实时同步链上数据</LI>
              <LI>游离节点：已启动但未加入任何群组的临时节点状态</LI>
            </UL>

            <H3>操作命令</H3>
            <P>控制台提供以下六个主要节点管理命令：</P>
            <Table
              headers={['命令', '功能']}
              rows={[
                ['addSealer <nodeID>', '将节点转换为共识节点'],
                ['addObserver <nodeID>', '将节点转换为观察者节点'],
                ['removeNode <nodeID>', '将节点转换为游离节点'],
                ['getSealerList', '查询当前共识节点列表'],
                ['getObserverList', '查询当前观察者节点列表'],
                ['getNodeIDList', '查询当前连接的节点列表'],
              ]}
            />
            <Note type="note">操作前请确认节点ID存在（可通过 cat conf/node.nodeid 获取），且区块链共识运行正常。</Note>

            <H3>A节点加入网络</H3>
            <P>生成新节点证书，配置P2P端口，并在现有节点的config.ini中添加新节点IP:Port。</P>
            <CodeBlock language="bash" code={`# 在现有节点的config.ini中添加新节点
[p2p]
    node.N=新节点IP:Port

# 重启节点使P2P配置生效
bash stop.sh && bash start.sh`} />

            <H3>A节点加入群组</H3>
            <P>在控制台中使用addSealer或addObserver命令将节点加入群组：</P>
            <CodeBlock language="bash" code={`# 连接控制台
cd ~/fisco/console && bash start.sh

# 获取节点NodeID
[group:1]> getNodeIDList

# 添加为共识节点
[group:1]> addSealer {nodeID}

# 或添加为观察者节点
[group:1]> addObserver {nodeID}`} />

            <H3>A节点退出群组</H3>
            <CodeBlock language="bash" code={`# 将节点转为游离节点
[group:1]> removeNode {nodeID}`} />

            <H3>A节点退出网络</H3>
            <P>节点退出网络前需先退出所有群组。从其他节点的config.ini中移除该节点的IP:Port配置，并重启相关节点。</P>
            <Note type="warning">操作顺序必须为：先退出群组，再退出网络。直接退出网络可能导致群组共识异常。</Note>
          </CollapsibleSection>

          {/* ── CA黑白名单配置 ── */}
          <CollapsibleSection id="cert-list" title="CA黑白名单配置" defaultOpen={true}>
            <P>通过配置CA黑白名单，可以控制节点的连接权限，实现节点间连接的精细化管理。</P>

            <H3>黑名单</H3>
            <P>通过配置黑名单，可以拒绝与指定节点建立连接。在节点conf/config.ini中配置：</P>
            <CodeBlock language="ini" code={`[certificate_blacklist]
    ; crl.0 should be nodeid, nodeid's length is 128
    ;crl.0=`} />
            <P>配置生效需重启节点：</P>
            <CodeBlock language="bash" code={`$ bash stop.sh && bash start.sh`} />
            <P>查看节点连接状态：</P>
            <CodeBlock language="bash" code={`$ curl -X POST --data '{"jsonrpc":"2.0","method":"getPeers","params":[1],"id":1}' http://127.0.0.1:8545 |jq`} />

            <H3>白名单</H3>
            <P>通过配置白名单，节点只与白名单内的节点建立连接，拒绝白名单之外的节点。不配置表示白名单关闭。</P>
            <CodeBlock language="ini" code={`[certificate_whitelist]
    ; cal.0 should be nodeid, nodeid's length is 128
    cal.0=7718df20f0f7e27fdab97b3d69deebb6e289b07eb7799c7ba92fe2f43d2efb4c1250dd1f11fa5b5ce687c8283d65030aae8680093275640861bc274b1b2874cb
    cal.1=f306eb1066ceb9d46e3b77d2833a1bde2a9899cfc4d0433d64b01d03e79927aa60a40507c5739591b8122ee609cf5636e71b02ce5009f3b8361930ecc3a9abb0`} />
            <P>白名单支持动态刷新，无需重启节点：</P>
            <CodeBlock language="bash" code={`# 若节点未启动
$ bash start.sh
# 若节点已启动，动态刷新白名单
$ cd scripts && bash reload_whitelist.sh`} />

            <H3>使用场景：公共CA</H3>
            <P>当多条链共用同一个CA证书（如CFCA颁发的证书）时，无关链的节点可能互相连接。此时需启用白名单功能，防止跨链节点连接。</P>

            <H4>搭链步骤</H4>
            <UL>
              <LI>使用工具搭建区块链网络</LI>
              <LI>查询所有节点NodeID</LI>
              <LI>将所有NodeID配置入每个节点的白名单</LI>
              <LI>启动节点或执行reload_whitelist.sh刷新配置</LI>
            </UL>

            <H4>扩容步骤</H4>
            <UL>
              <LI>使用工具扩容新节点</LI>
              <LI>查询扩容节点NodeID</LI>
              <LI>将此NodeID追加到所有现有节点白名单配置</LI>
              <LI>将其他节点白名单配置拷贝到新节点</LI>
              <LI>执行reload_whitelist.sh刷新已启动节点白名单</LI>
              <LI>启动扩容节点</LI>
              <LI>通过addSealer或addObserver将新节点加入群组</LI>
            </UL>

            <H3>黑白名单操作举例</H3>

            <H4>准备</H4>
            <P>搭建4节点区块链网络并记录各节点NodeID：</P>
            <CodeBlock language="bash" code={`bash build_chain.sh -l 127.0.0.1:4

# 查看节点NodeID
$ cat node*/conf/node.nodeid
219b319ba7b2b3a1ecfa7130ea314410a52c537e6e7dda9da46dec492102aa5a43bad81679b6af0cd5b9feb7cfdc0b395cfb50016f56806a2afc7ee81bbb09bf
7718df20f0f7e27fdab97b3d69deebb6e289b07eb7799c7ba92fe2f43d2efb4c1250dd1f11fa5b5ce687c8283d65030aae8680093275640861bc274b1b2874cb
f306eb1066ceb9d46e3b77d2833a1bde2a9899cfc4d0433d64b01d03e79927aa60a40507c5739591b8122ee609cf5636e71b02ce5009f3b8361930ecc3a9abb0
38158ef34eb2d58ce1d31c8f3ef9f1fa829d0eb8ed1657f4b2a3ebd3265d44b243c69ffee0519c143dd67e91572ea8cb4e409144a1865f3e980c22d33d443296`} />
            <P>节点标识：node0: 219b319b…，node1: 7718df20…，node2: f306eb10…，node3: 38158ef3…</P>

            <H4>场景1：配置黑名单（node0拒绝node1的连接）</H4>
            <CodeBlock language="ini" code={`[certificate_blacklist]
    crl.0=7718df20f0f7e27fdab97b3d69deebb6e289b07eb7799c7ba92fe2f43d2efb4c1250dd1f11fa5b5ce687c8283d65030aae8680093275640861bc274b1b2874cb

[certificate_whitelist]
    ; cal.0=`} />
            <P>重启node0后，node0仅连接node2和node3，不与node1建立连接。</P>

            <H4>场景2：配置白名单（node0仅与node1、node2连接）</H4>
            <CodeBlock language="ini" code={`[certificate_blacklist]
    ;crl.0=

[certificate_whitelist]
    cal.0=7718df20f0f7e27fdab97b3d69deebb6e289b07eb7799c7ba92fe2f43d2efb4c1250dd1f11fa5b5ce687c8283d65030aae8680093275640861bc274b1b2874cb
    cal.1=f306eb1066ceb9d46e3b77d2833a1bde2a9899cfc4d0433d64b01d03e79927aa60a40507c5739591b8122ee609cf5636e71b02ce5009f3b8361930ecc3a9abb0`} />
            <P>重启后，node0仅连接node1和node2，不与node3建立连接。</P>

            <H4>场景3：黑白名单混合配置（黑名单优先级高）</H4>
            <CodeBlock language="ini" code={`[certificate_blacklist]
    crl.0=7718df20f0f7e27fdab97b3d69deebb6e289b07eb7799c7ba92fe2f43d2efb4c1250dd1f11fa5b5ce687c8283d65030aae8680093275640861bc274b1b2874cb

[certificate_whitelist]
    cal.0=7718df20f0f7e27fdab97b3d69deebb6e289b07eb7799c7ba92fe2f43d2efb4c1250dd1f11fa5b5ce687c8283d65030aae8680093275640861bc274b1b2874cb
    cal.1=f306eb1066ceb9d46e3b77d2833a1bde2a9899cfc4d0433d64b01d03e79927aa60a40507c5739591b8122ee609cf5636e71b02ce5009f3b8361930ecc3a9abb0`} />
            <P>即使白名单包含node1，由于黑名单优先级更高，node0仍不与node1建立连接，仅连接node2。</P>
          </CollapsibleSection>

          {/* ── 存储加密 ── */}
          <CollapsibleSection id="storage-enc" title="存储加密" defaultOpen={true}>
            <P>联盟链数据仅对联盟成员可见。落盘加密保障了联盟链运维数据在硬盘上的安全性。一旦硬盘脱离联盟链内网环境，数据将无法被解密。落盘加密对节点存储在硬盘上的内容进行加密，加密内容包括：合约数据以及节点私钥文件。</P>
            <Note type="warning">国密版节点需使用对应的国密版Key Manager。节点必须在首次运行前完成落盘加密配置，一旦节点开始运行则无法切换加密状态。</Note>

            <H3>第一步. 部署Key Manager</H3>
            <P>每个机构部署一个Key Manager。具体部署步骤请参考Key Manager GitHub README或Key Manager Gitee README。</P>

            <H3>第二步. 生成节点</H3>
            <CodeBlock language="bash" code={`curl -#LO https://github.com/FISCO-BCOS/FISCO-BCOS/releases/download/v2.11.0/build_chain.sh && chmod u+x build_chain.sh
bash build_chain.sh -l 127.0.0.1:4 -p 30300,20200,8545`} />
            <Note type="warning">节点生成后不能直接启动，需完成dataKey配置后再启动。</Note>

            <H3>第三步. 启动Key Manager</H3>
            <CodeBlock language="bash" code={`./key-manager 8150 123xyz`} />
            <P>成功启动后输出：</P>
            <CodeBlock language="bash" code={`[1546501342949][TRACE][Load]key-manager started,port=8150`} />

            <H3>第四步. 配置dataKey</H3>
            <Note type="note">配置dataKey的节点必须是新生成、从未启动过的节点。</Note>
            <CodeBlock language="bash" code={`cd key-manager/scripts
bash gen_data_secure_key.sh 127.0.0.1 8150 123456`} />
            <P>脚本输出加密配置，示例如下：</P>
            <CodeBlock language="bash" code={`CiherDataKey generated: ed157f4588b86d61a2e1745efe71e6ea
Append these into config.ini to enable disk encryption:
[storage_security]
enable=true
key_manager_ip=127.0.0.1
key_manager_port=8150
cipher_data_key=ed157f4588b86d61a2e1745efe71e6ea`} />
            <P>将以上落盘加密配置写入节点的config.ini文件：</P>
            <CodeBlock language="bash" code={`vim nodes/127.0.0.1/node0/config.ini`} />

            <H3>第五步. 加密节点私钥</H3>
            <Note type="tip">若使用内置HSM密钥，可跳过此步骤。</Note>
            <CodeBlock language="bash" code={`cd key-manager/scripts
bash encrypt_node_key.sh 127.0.0.1 8150 ../../nodes/127.0.0.1/node0/conf/node.key ed157f4588b86d61a2e1745efe71e6ea`} />
            <P>加密成功输出：</P>
            <CodeBlock language="bash" code={`[INFO] File backup to "nodes/127.0.0.1/node0/conf/node.key.bak.1546502474"
[INFO] "nodes/127.0.0.1/node0/conf/node.key" encrypted!`} />
            <Note type="warning">需要加密的文件：非国密版为 conf/node.key；国密版为 conf/gmnode.key 和 conf/origin_cert/node.key。未加密将导致节点无法启动。</Note>

            <H3>第六步. 节点运行</H3>
            <CodeBlock language="bash" code={`cd nodes/127.0.0.1/node0/
./start.sh`} />

            <H3>第七步. 正确性判断</H3>
            <P>验证方式1：节点正常运行，持续输出共识打包信息：</P>
            <CodeBlock language="bash" code={`tail -f nodes/127.0.0.1/node0/log/* | grep +++`} />
            <P>验证方式2：Key Manager每次节点启动时打印一条日志：</P>
            <CodeBlock language="bash" code={`[1546504272699][TRACE][Dec]Respond
{
   "dataKey" : "313233343536",
   "error" : 0,
   "info" : "success"
}`} />
          </CollapsibleSection>

          {/* ── 账户权限控制 ── */}
          <CollapsibleSection id="permission-control" title="账户权限控制" defaultOpen={true}>

            <h2 className="text-xl font-black text-white tracking-tight mt-10 mb-4 pb-2 border-b border-white/10">基于角色的权限控制</h2>

            <P>本节描述角色权限控制的操作，2.5.0版本开始提供基于角色的权限控制模型，原来的链管理员相当于当前的治理委员会委员角色，拥有链治理相关的操作权限。用户不需要关注底层系统表对应的权限，只需关注角色的权限即可。</P>

            <H3>权限与角色</H3>
            <UL>
              <LI>链治理委员会委员（简称委员）</LI>
              <LI>权限使用白名单机制，默认不检查，当存在至少一个角色的账号时，角色对应的权限检查生效</LI>
              <LI>委员可以冻结解冻任意合约，同时合约的部署账号也可以冻结解冻合约</LI>
              <LI>委员可以冻结解冻账号，被冻结的账号无法发送交易</LI>
            </UL>

            <H3>权限操作表</H3>
            <Table
              headers={['权限操作', '修改方式']}
              rows={[
                ['增删委员', '委员投票'],
                ['修改委员权重', '委员投票'],
                ['修改生效投票阈值（投票委员权重和大于该值）', '委员投票'],
                ['增删节点（观察/共识）', '委员账号'],
                ['修改链配置项', '委员账号'],
                ['冻结解冻合约', '委员账号'],
                ['冻结解冻账号', '委员账号'],
                ['添加撤销运维', '委员账号'],
                ['用户表的写权限', '委员账号'],
                ['部署合约', '运维账号'],
                ['创建表', '运维账号'],
                ['合约版本管理', '运维账号'],
                ['冻结解冻本账号部署的合约', '运维账号'],
                ['调用合约写接口', '有管理合约生命周期权限的账号'],
              ]}
            />

            <H3>环境配置</H3>
            <P>配置并启动FISCO BCOS 2.0区块链节点和控制台，请参考安装文档。</P>

            <H3>权限控制示例账户</H3>
            <P>控制台提供账户生成脚本get_account.sh，生成的账户文件在accounts目录下，控制台可以指定账户启动。在控制台根目录下通过get_account.sh脚本生成三个PEM格式的账户文件如下：</P>
            <CodeBlock language="bash" code={`# 账户1
0x61d88abf7ce4a7f8479cff9cc1422bef2dac9b9a.pem
# 账户2
0x85961172229aec21694d742a5bd577bedffcfec3.pem
# 账户3
0x0b6f526d797425540ea70becd7adac7d50f4a7c0.pem`} />
            <P>打开三个连接Linux的终端，分别以三个账户登录控制台：</P>
            <CodeBlock language="bash" code={`# 指定账户1登录
./start.sh 1 -pem accounts/0x61d88abf7ce4a7f8479cff9cc1422bef2dac9b9a.pem
# 指定账户2登录
./start.sh 1 -pem accounts/0x85961172229aec21694d742a5bd577bedffcfec3.pem
# 指定账户3登录
./start.sh 1 -pem accounts/0x0b6f526d797425540ea70becd7adac7d50f4a7c0.pem`} />

            <H3>委员新增、撤销与查询</H3>

            <H4>添加账户1为委员</H4>
            <CodeBlock language="bash" code={`[group:1]> grantCommitteeMember 0x61d88abf7ce4a7f8479cff9cc1422bef2dac9b9a
{
    "code":0,
    "msg":"success"
}
[group:1]> listCommitteeMembers
---------------------------------------------------------------------------------------------
|                   address                   |                 enable_num                  |
| 0x61d88abf7ce4a7f8479cff9cc1422bef2dac9b9a  |                      1                      |
---------------------------------------------------------------------------------------------`} />

            <H4>使用账户1添加账户2为委员</H4>
            <P>增加委员需要链治理委员会投票，有效票大于阈值才可生效。此处由于只有账号1是委员，所以账号1投票即可生效。</P>
            <CodeBlock language="bash" code={`[group:1]> grantCommitteeMember 0x85961172229aec21694d742a5bd577bedffcfec3
{
    "code":0,
    "msg":"success"
}
[group:1]> listCommitteeMembers
---------------------------------------------------------------------------------------------
|                   address                   |                 enable_num                  |
| 0x61d88abf7ce4a7f8479cff9cc1422bef2dac9b9a  |                      1                      |
| 0x85961172229aec21694d742a5bd577bedffcfec3  |                      2                      |
---------------------------------------------------------------------------------------------`} />

            <H4>验证账号3无权限执行委员操作</H4>
            <CodeBlock language="bash" code={`[group:1]> setSystemConfigByKey tx_count_limit 100
{
    "code":-50000,
    "msg":"permission denied"
}`} />

            <H4>撤销账号2的委员权限</H4>
            <P>此时系统中有两个委员，默认投票生效阈值50%，需要两个委员都投票撤销才满足条件（有效票/总票数=2/2=1{'>'}{'>'}0.5）。</P>
            <P>账号1投票撤销账号2的委员权限：</P>
            <CodeBlock language="bash" code={`[group:1]> revokeCommitteeMember 0x85961172229aec21694d742a5bd577bedffcfec3
{
    "code":0,
    "msg":"success"
}
[group:1]> listCommitteeMembers
---------------------------------------------------------------------------------------------
|                   address                   |                 enable_num                  |
| 0x61d88abf7ce4a7f8479cff9cc1422bef2dac9b9a  |                      1                      |
| 0x85961172229aec21694d742a5bd577bedffcfec3  |                      2                      |
---------------------------------------------------------------------------------------------`} />
            <P>账号2投票撤销账号2的委员权限：</P>
            <CodeBlock language="bash" code={`[group:1]> revokeCommitteeMember 0x85961172229aec21694d742a5bd577bedffcfec3
{
    "code":0,
    "msg":"success"
}
[group:1]> listCommitteeMembers
---------------------------------------------------------------------------------------------
|                   address                   |                 enable_num                  |
| 0x61d88abf7ce4a7f8479cff9cc1422bef2dac9b9a  |                      1                      |
---------------------------------------------------------------------------------------------`} />

            <H3>委员权重修改</H3>
            <P>先添加账户1、账户3为委员，然后更新委员1的票数为2。使用账号1控制台添加账号3为委员：</P>
            <CodeBlock language="bash" code={`[group:1]> grantCommitteeMember 0x0b6f526d797425540ea70becd7adac7d50f4a7c0
{
    "code":0,
    "msg":"success"
}
[group:1]> listCommitteeMembers
---------------------------------------------------------------------------------------------
|                   address                   |                 enable_num                  |
| 0x61d88abf7ce4a7f8479cff9cc1422bef2dac9b9a  |                      1                      |
| 0x0b6f526d797425540ea70becd7adac7d50f4a7c0  |                      9                      |
---------------------------------------------------------------------------------------------`} />
            <P>使用账号1控制台投票更新账号1的票数为2：</P>
            <CodeBlock language="bash" code={`[group:1]> updateCommitteeMemberWeight 0x61d88abf7ce4a7f8479cff9cc1422bef2dac9b9a 2
{
    "code":0,
    "msg":"success"
}
[group:1]> queryCommitteeMemberWeight 0x61d88abf7ce4a7f8479cff9cc1422bef2dac9b9a
Account: 0x61d88abf7ce4a7f8479cff9cc1422bef2dac9b9a Weight: 1`} />
            <P>使用账号3控制台投票更新账号1的票数为2：</P>
            <CodeBlock language="bash" code={`[group:1]> updateCommitteeMemberWeight 0x61d88abf7ce4a7f8479cff9cc1422bef2dac9b9a 2
{
    "code":0,
    "msg":"success"
}
[group:1]> queryCommitteeMemberWeight 0x61d88abf7ce4a7f8479cff9cc1422bef2dac9b9a
Account: 0x61d88abf7ce4a7f8479cff9cc1422bef2dac9b9a Weight: 2`} />

            <H3>委员投票生效阈值修改</H3>
            <P>账户1和账户3为委员，账号1有2票，账号3有1票，使用账号1添加账号2为委员（2/3{'>'}{'>'}0.5直接生效），然后更新生效阈值为75%。</P>
            <P>账户1添加账户2为委员：</P>
            <CodeBlock language="bash" code={`[group:1]> grantCommitteeMember 0x85961172229aec21694d742a5bd577bedffcfec3
{
    "code":0,
    "msg":"success"
}
[group:1]> listCommitteeMembers
---------------------------------------------------------------------------------------------
|                   address                   |                 enable_num                  |
| 0x61d88abf7ce4a7f8479cff9cc1422bef2dac9b9a  |                      1                      |
| 0x0b6f526d797425540ea70becd7adac7d50f4a7c0  |                      9                      |
| 0x85961172229aec21694d742a5bd577bedffcfec3  |                     12                      |
---------------------------------------------------------------------------------------------`} />
            <P>使用账户1控制台投票更新生效阈值为75%：</P>
            <CodeBlock language="bash" code={`[group:1]> updateThreshold 75
{
    "code":0,
    "msg":"success"
}
[group:1]> queryThreshold
Effective threshold : 50%`} />
            <P>使用账户2控制台投票更新生效阈值为75%：</P>
            <CodeBlock language="bash" code={`[group:1]> updateThreshold 75
{
    "code":0,
    "msg":"success"
}
[group:1]> queryThreshold
Effective threshold : 75%`} />

            <H3>运维新增、撤销与查询</H3>
            <P>委员可以添加运维，运维角色的权限包括部署合约、创建表、冻结解冻所部署的合约、使用CNS服务。基于职责权限分离的设计，委员角色不能兼有运维的权限，生成一个新的账号4 (0x283f5b859e34f7fd2cf136c07579dcc72423b1b2.pem)。</P>

            <H4>添加账号4为运维角色</H4>
            <CodeBlock language="bash" code={`[group:1]> grantOperator 0x283f5b859e34f7fd2cf136c07579dcc72423b1b2
{
    "code":0,
    "msg":"success"
}
[group:1]> listOperators
---------------------------------------------------------------------------------------------
|                   address                   |                 enable_num                  |
| 0x283f5b859e34f7fd2cf136c07579dcc72423b1b2  |                     15                      |
---------------------------------------------------------------------------------------------`} />

            <H4>使用运维账号部署HelloWorld</H4>
            <CodeBlock language="bash" code={`[group:1]> deploy HelloWorld
contract address: 0xac1e28ad93e0b7f9108fa1167a8a06585f663726`} />

            <H4>使用账号1部署HelloWorld失败（委员不兼运维权限）</H4>
            <CodeBlock language="bash" code={`[group:1]> deploy HelloWorld
permission denied`} />

            <H4>撤销账号4的运维权限</H4>
            <CodeBlock language="bash" code={`[group:1]> revokeOperator 0x283f5b859e34f7fd2cf136c07579dcc72423b1b2
{
    "code":0,
    "msg":"success"
}
[group:1]> listOperators
Empty set.`} />

            <h2 className="text-xl font-black text-white tracking-tight mt-12 mb-4 pb-2 border-b border-white/10">基于表的权限控制</h2>

            <Note type="warning">由于系统默认无权限设置记录，任何账户均可使用权限设置功能。推荐使用grantPermissionManager（V2.5.0之前）或grantCommitteeMember（V2.5.0之后）指令设置链管理员账户，防止权限滥用。</Note>

            <H3>权限控制命令</H3>
            <Table
              headers={['命令名称', '命令参数', '功能']}
              rows={[
                ['grantPermissionManager', 'address', '授权账户的链管理员权限(V2.5.0之前)'],
                ['revokePermissionManager', 'address', '撤销账户的链管理员权限(V2.5.0之前)'],
                ['listPermissionManager', '', '查询拥有链管理员权限的账户列表'],
                ['grantDeployAndCreateManager', 'address', '授权账户的部署合约和创建用户表权限'],
                ['revokeDeployAndCreateManager', 'address', '撤销账户的部署合约和创建用户表权限'],
                ['listDeployAndCreateManager', '', '查询拥有部署合约和创建用户表权限的账户列表'],
                ['grantNodeManager', 'address', '授权账户的节点管理权限'],
                ['revokeNodeManager', 'address', '撤销账户的节点管理权限'],
                ['listNodeManager', '', '查询拥有节点管理的账户列表'],
                ['grantCNSManager', 'address', '授权账户的使用CNS权限'],
                ['revokeCNSManager', 'address', '撤销账户的使用CNS权限'],
                ['listCNSManager', '', '查询拥有使用CNS的账户列表'],
                ['grantSysConfigManager', 'address', '授权账户的修改系统参数权限'],
                ['revokeSysConfigManager', 'address', '撤销账户的修改系统参数权限'],
                ['listSysConfigManager', '', '查询拥有修改系统参数的账户列表'],
                ['grantUserTableManager', 'table_name address', '授权账户对用户表的写权限'],
                ['revokeUserTableManager', 'table_name address', '撤销账户对用户表的写权限'],
                ['listUserTableManager', 'table_name', '查询拥有对用户表写权限的账号列表'],
              ]}
            />

            <H3>权限控制示例账户</H3>
            <P>生成三个PKCS12格式的账户文件：</P>
            <CodeBlock language="bash" code={`# 账户1
0x2c7f31d22974d5b1b2d6d5c359e81e91ee656252.p12
# 账户2
0x7fc8335fec9da5f84e60236029bb4a64a469a021.p12
# 账户3
0xd86572ad4c92d4598852e2f34720a865dd4fc3dd.p12`} />
            <P>分别以三个账户登录控制台：</P>
            <CodeBlock language="bash" code={`$ ./start.sh 1 -p12 accounts/0x2c7f31d22974d5b1b2d6d5c359e81e91ee656252.p12
$ ./start.sh 1 -p12 accounts/0x7fc8335fec9da5f84e60236029bb4a64a469a021.p12
$ ./start.sh 1 -p12 accounts/0xd86572ad4c92d4598852e2f34720a865dd4fc3dd.p12`} />

            <H3>授权账户为链管理员</H3>
            <CodeBlock language="bash" code={`[group:1]> grantPermissionManager 0x2c7f31d22974d5b1b2d6d5c359e81e91ee656252
{
    "code":0,
    "msg":"success"
}
[group:1]> listPermissionManager
---------------------------------------------------------------------------------------------
|                   address                   |                 enable_num                  |
| 0x2c7f31d22974d5b1b2d6d5c359e81e91ee656252  |                      1                      |
---------------------------------------------------------------------------------------------`} />

            <H3>授权部署合约和创建用户表</H3>
            <P>通过账户1授权账户2可以部署合约和创建用户表：</P>
            <CodeBlock language="bash" code={`[group:1]> grantDeployAndCreateManager 0x7fc8335fec9da5f84e60236029bb4a64a469a021
{
    "code":0,
    "msg":"success"
}
[group:1]> listDeployAndCreateManager
---------------------------------------------------------------------------------------------
|                   address                   |                 enable_num                  |
| 0x7fc8335fec9da5f84e60236029bb4a64a469a021  |                      2                      |
---------------------------------------------------------------------------------------------`} />
            <P>登录账户2的控制台，部署TableTest合约并创建用户表t_test：</P>
            <CodeBlock language="bash" code={`[group:1]> deploy TableTest.sol
contract address:0xfe649f510e0ca41f716e7935caee74db993e9de8

[group:1]> call TableTest.sol 0xfe649f510e0ca41f716e7935caee74db993e9de8 create
transaction hash:0x67ef80cf04d24c488d5f25cc3dc7681035defc82d07ad983fbac820d7db31b5b`} />
            <P>账户3部署合约失败：</P>
            <CodeBlock language="bash" code={`[group:1]> deploy TableTest.sol
{
    "code":-50000,
    "msg":"permission denied"
}`} />

            <H3>授权利用CNS部署合约</H3>
            <Note type="note">deployByCNS命令同时需要部署合约和使用CNS的权限，callByCNS和queryCNS命令不受权限控制。</Note>
            <CodeBlock language="bash" code={`[group:1]> grantCNSManager 0x7fc8335fec9da5f84e60236029bb4a64a469a021
{
    "code":0,
    "msg":"success"
}

# 账户2利用CNS部署合约
[group:1]> deployByCNS TableTest.sol 1.0
contract address:0x24f902ff362a01335db94b693edc769ba6226ff7

[group:1]> queryCNS TableTest.sol
---------------------------------------------------------------------------------------------
|                   version                   |                   address                   |
|                     1.0                     | 0x24f902ff362a01335db94b693edc769ba6226ff7  |
---------------------------------------------------------------------------------------------

# 账户3无权限
[group:1]> deployByCNS TableTest.sol 2.0
{
    "code":-50000,
    "msg":"permission denied"
}`} />

            <H3>授权管理节点</H3>
            <CodeBlock language="bash" code={`[group:1]> grantNodeManager 0x7fc8335fec9da5f84e60236029bb4a64a469a021
{
    "code":0,
    "msg":"success"
}

# 账户2将节点设置为观察者节点
[group:1]> addObserver 01cd46feef2bb385bf03d1743c1d1a52753129cf092392acb9e941d1a4e0f499fdf6559dfcd4dbf2b3ca418caa09d953620c2aa3c5bbe93ad5f6b378c678489e
{
    "code":0,
    "msg":"success"
}

# 账户3无权限管理节点
[group:1]> addSealer 01cd46feef2bb385bf03d1743c1d1a52753129cf092392acb9e941d1a4e0f499fdf6559dfcd4dbf2b3ca418caa09d953620c2aa3c5bbe93ad5f6b378c678489e
{
    "code":-50000,
    "msg":"permission denied"
}`} />

            <H3>授权修改系统参数</H3>
            <CodeBlock language="bash" code={`[group:1]> grantSysConfigManager 0x7fc8335fec9da5f84e60236029bb4a64a469a021
{
    "code":0,
    "msg":"success"
}

# 账户2修改参数成功
[group:1]> setSystemConfigByKey tx_count_limit 2000
{
    "code":0,
    "msg":"success"
}

# 账户3修改失败
[group:1]> setSystemConfigByKey tx_count_limit 3000
{
    "code":-50000,
    "msg":"permission denied"
}`} />

            <H3>授权账户写用户表</H3>
            <CodeBlock language="bash" code={`# 通过账户1授权账户3写用户表t_test
[group:1]> grantUserTableManager t_test 0xd86572ad4c92d4598852e2f34720a865dd4fc3dd
{
    "code":0,
    "msg":"success"
}
[group:1]> listUserTableManager t_test
---------------------------------------------------------------------------------------------
|                   address                   |                 enable_num                  |
| 0xd86572ad4c92d4598852e2f34720a865dd4fc3dd  |                      6                      |
---------------------------------------------------------------------------------------------

# 账户3插入记录成功
[group:1]> call TableTest.sol 0xfe649f510e0ca41f716e7935caee74db993e9de8 insert "fruit" 1 "apple"
transaction hash:0xc4d261026851c3338f1a64ecd4712e5fc2a028c108363181725f07448b986f7e

# 账户2更新失败（无权限）
[group:1]> call TableTest.sol 0xfe649f510e0ca41f716e7935caee74db993e9de8 update "fruit" 1 "orange"
{
    "code":-50000,
    "msg":"permission denied"
}

# 撤销账户3的写权限
[group:1]> revokeUserTableManager t_test 0xd86572ad4c92d4598852e2f34720a865dd4fc3dd
{
    "code":0,
    "msg":"success"
}
[group:1]> listUserTableManager t_test
Empty set.`} />
            <Note type="note">撤销后没有账户拥有对该表的写权限，因此对该表的写权限恢复初始状态，即所有账户均拥有写权限。</Note>

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
