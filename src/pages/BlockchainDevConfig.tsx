import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Database, Menu, X, Copy, Check, ChevronRight } from 'lucide-react';
import DocsSidebar, { configNavItems } from './DocsSidebar';

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

const H2 = ({ id, children }: { id: string; children: React.ReactNode }) => (
  <h2 id={id} className="text-xl font-black text-white tracking-tight mt-12 mb-4 scroll-mt-20 pb-2 border-b border-white/10">{children}</h2>
);
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
const IC = ({ children }: { children: React.ReactNode }) => (
  <code className="font-mono text-brand-accent text-[13px] bg-white/5 px-1.5 py-0.5 rounded">{children}</code>
);

export default function BlockchainDevConfig() {
  const navigate = useNavigate();
  const [activeId, setActiveId] = useState('node-config');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveId(entry.target.id);
        });
      },
      { rootMargin: '-20% 0px -70% 0px' }
    );
    configNavItems.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
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
              <span>运维</span><span className="text-white/20">·</span>
              <span>配置管理</span><span className="text-white/20">·</span>
              <span>节点管理</span>
            </div>
            <h1 className="text-3xl font-black text-white tracking-tight mb-6">配置管理</h1>
          </div>

          <P>DeSpace 节点的配置体系采用三层结构设计，将不同生命周期和作用域的配置项分别管理，使运维人员能够灵活地在不重新建链的前提下调整网络行为。理解这三层配置的职责边界，是高效运维 DeSpace 网络的基础。</P>

          <H2 id="node-config">节点配置</H2>
          <P>DeSpace 节点的配置分为三个层次，各自覆盖不同的关注维度：</P>
          <UL>
            <LI><strong className="text-white">节点主配置（config.ini）</strong>：控制节点级别的网络通信、RPC 服务、日志级别、证书路径等全局参数。该配置对节点下所有群组生效，修改后需重启节点。</LI>
            <LI><strong className="text-white">群组系统配置（group.X.genesis）</strong>：创世区块级别的不可变配置，记录共识算法类型、存储引擎、Gas 上限等在首次建链时确定的参数。一旦群组启动，这些参数不可更改。</LI>
            <LI><strong className="text-white">账本可变配置（group.X.ini）</strong>：群组级别的运行时可变配置，涵盖交易池大小、共识超时、数据同步策略等可在运行期间动态调整的参数，部分参数修改后无需重启即可生效。</LI>
          </UL>
          <Note type="note">配置文件路径约定：主配置位于节点根目录 <IC>config.ini</IC>；群组配置位于 <IC>conf/</IC> 目录下，文件名中的 <IC>X</IC> 为群组编号（如 group.1.genesis）。</Note>

          <H3 id="config-ini">主配置 config.ini</H3>
          <P><IC>config.ini</IC> 是节点最核心的配置文件，主要包含以下几大配置域：</P>

          <H4>RPC 配置</H4>
          <UL>
            <LI><IC>jsonrpc_listen_ip</IC>：JSON-RPC 监听 IP，建议生产环境仅监听内网地址，不对外网开放。</LI>
            <LI><IC>jsonrpc_listen_port</IC>：JSON-RPC 监听端口，默认 8545，SDK 和控制台通过此端口与节点交互。</LI>
            <LI><IC>channel_listen_ip</IC>：Channel 服务监听 IP，Java SDK 通过 Channel 协议连接节点。</LI>
            <LI><IC>channel_listen_port</IC>：Channel 服务端口，默认 20200。</LI>
          </UL>

          <H4>P2P 网络配置</H4>
          <UL>
            <LI><IC>listen_ip</IC>：P2P 网络监听 IP，节点间通信使用。</LI>
            <LI><IC>listen_port</IC>：P2P 监听端口，默认 30300。</LI>
            <LI><IC>node.X</IC>：已知对等节点的 IP:Port 列表，节点启动后会主动连接这些地址并发现网络中其他节点。</LI>
          </UL>

          <H4>证书与安全</H4>
          <UL>
            <LI><IC>sm_crypto_channel</IC>：是否启用国密 TLS，<IC>true</IC> 表示 SDK 连接使用国密 SSL。</LI>
            <LI><IC>ca_cert</IC>：CA 根证书路径，用于验证对端节点证书合法性。</LI>
            <LI><IC>node_key</IC>：节点私钥路径，生产环境建议配合存储加密功能保护私钥文件。</LI>
          </UL>

          <H4>日志配置</H4>
          <UL>
            <LI><IC>log_level</IC>：日志级别，可选 trace / debug / info / warning / error，生产环境推荐 info。</LI>
            <LI><IC>log_path</IC>：日志文件输出目录。</LI>
            <LI><IC>max_log_file_size</IC>：单个日志文件的最大大小（MB），超出后自动滚动。</LI>
          </UL>

          <CodeBlock language="ini" code={`[rpc]
    ; RPC监听地址，仅内网访问建议使用127.0.0.1
    jsonrpc_listen_ip=0.0.0.0
    jsonrpc_listen_port=8545
    channel_listen_ip=0.0.0.0
    channel_listen_port=20200
    ; 是否使用国密SSL（仅对channel连接生效）
    sm_crypto_channel=false

[p2p]
    listen_ip=0.0.0.0
    listen_port=30300
    ; 已知节点列表，格式: node.编号=IP:Port
    node.0=127.0.0.1:30301
    node.1=127.0.0.1:30302
    node.2=127.0.0.1:30303

[certificate]
    ; 证书目录，存放ca.crt/node.crt/node.key
    ca_cert=conf/ca.crt
    node_cert=conf/node.crt
    node_key=conf/node.key

[storage]
    ; 存储引擎: rocksdb / mysql
    type=rocksdb
    max_capacity=256

[log]
    ; 日志级别: trace/debug/info/warning/error
    log_level=info
    log_path=./log
    max_log_file_size=200
    ; 是否开启统计日志
    enable_statistic=false`} />

          <H3 id="config-group">群组系统配置</H3>
          <P><IC>group.X.genesis</IC> 是创世区块的配置文件，在群组首次启动时生效并永久固化到创世区块中，后续无法修改。该文件确保了联盟内所有节点对群组基础规则的一致认知。</P>

          <H4>共识配置（不可变）</H4>
          <UL>
            <LI><IC>consensus_type</IC>：共识算法类型，可选 <IC>pbft</IC>（推荐）、<IC>raft</IC>、<IC>rpbft</IC>。一旦确定无法更改，选择前需充分评估业务需求。</LI>
            <LI><IC>max_trans_num</IC>：单个区块中允许打包的最大交易数量，影响区块大小和吞吐量的平衡。</LI>
            <LI><IC>node.X</IC>：创世区块中的初始共识节点公钥列表，这些节点构成网络的初始共识委员会。</LI>
          </UL>

          <H4>存储与 EVM 配置（不可变）</H4>
          <UL>
            <LI><IC>storage_type</IC>：账本存储引擎，<IC>rocksdb</IC> 性能更高，<IC>mysql</IC> 运维更友好，需在建链前根据场景选择。</LI>
            <LI><IC>tx_gas_limit</IC>：单笔交易的最大 Gas 上限，防止复杂合约占用过多计算资源。默认值 300000000，可根据合约复杂度适当调整。</LI>
          </UL>

          <CodeBlock language="ini" code={`[consensus]
    ; 共识算法: pbft / raft / rpbft，建链后不可修改
    consensus_type=pbft
    ; 单区块最大交易数
    max_trans_num=1000
    ; 初始共识节点公钥列表（与证书中的公钥对应）
    node.0=1cf34...pubkey1...
    node.1=7ab82...pubkey2...
    node.2=e53d1...pubkey3...
    node.3=90f47...pubkey4...

[storage]
    ; 存储引擎: rocksdb / mysql，建链后不可修改
    type=rocksdb

[tx]
    ; 单笔交易Gas上限
    gas_limit=300000000`} />

          <Note type="tip">群组系统配置文件 group.X.genesis 在各节点中必须完全一致，否则节点将无法加入同一群组。建议使用 build_chain.sh 自动生成，避免手动配置引入差异。</Note>

          <H3 id="config-mutable">账本可变配置</H3>
          <P><IC>group.X.ini</IC> 中的参数可在网络运行期间动态调整，部分参数无需重启节点即可热生效。合理配置这些参数对于优化网络性能和稳定性至关重要。</P>

          <H4>共识运行参数</H4>
          <UL>
            <LI><IC>consensus_timeout</IC>：共识超时时间（毫秒），Leader 节点在该时间内未完成出块则触发视图切换。值越小网络响应越快，但在高负载下可能频繁触发视图切换，建议根据网络延迟调整，默认 3000ms。</LI>
            <LI><IC>min_seal_time</IC>：最短出块间隔（毫秒），即使交易池有待打包交易，节点也至少等待此时间再出块，用于积累更多交易提升 TPS。</LI>
          </UL>

          <H4>交易池配置</H4>
          <UL>
            <LI><IC>tx_pool_size</IC>：内存中交易池的最大容量（交易数），超出后新交易将被拒绝。高并发场景下需适当增大，但需注意内存消耗。</LI>
            <LI><IC>tx_pool_limit</IC>：交易池限流配置，防止单个客户端提交过多未确认交易。</LI>
          </UL>

          <H4>同步配置</H4>
          <UL>
            <LI><IC>sync_block_num</IC>：每次同步的区块数量上限，新节点加入时通过此参数控制追块速度。</LI>
            <LI><IC>enable_ttl_pruning</IC>：是否启用历史数据 TTL 裁剪，开启后可定期清理过期的历史状态，节约存储空间。</LI>
          </UL>

          <CodeBlock language="ini" code={`[consensus]
    ; 共识超时时间(ms)，默认3000，根据网络延迟调整
    consensus_timeout=3000
    ; 最短出块间隔(ms)，0表示有交易立即出块
    min_seal_time=500

[tx_pool]
    ; 交易池最大容量（交易数量）
    tx_pool_size=150000
    ; 单个连接最大pending交易数
    tx_pool_limit=15000

[sync]
    ; 每次同步最大区块数
    sync_block_num=50
    ; 是否开启idle同步（无新交易时同步）
    idle_wait_ms=200

[storage]
    ; 是否开启历史状态裁剪（节约存储空间）
    enable_ttl_pruning=false
    ; 数据保留的最大区块数（仅enable_ttl_pruning=true时生效）
    ttl=100000`} />
          <Note type="note">修改 group.X.ini 中的参数后，向节点进程发送 SIGUSR2 信号（<IC>kill -USR2 &lt;pid&gt;</IC>）即可热加载部分配置，无需重启节点。具体哪些参数支持热加载请参考各版本发布说明。</Note>

          {/* ── 组员节点管理 ── */}
          <H2 id="node-management">组员节点管理</H2>
          <P>DeSpace 支持在不中断网络的情况下动态管理群组内的节点成员，包括新增共识节点、新增观察者节点、移除节点等操作。节点角色的变更通过向预编译合约发送交易实现，操作记录上链，全网可见。</P>

          <H4>节点角色说明</H4>
          <UL>
            <LI><strong className="text-white">共识节点（Sealer）</strong>：参与 PBFT/Raft 共识投票，具有提议和确认区块的权利。共识节点数量直接影响网络的容错能力（PBFT 要求不少于 3f+1 个节点，其中 f 为最大容错节点数）和出块速度。</LI>
            <LI><strong className="text-white">观察者节点（Observer）</strong>：同步群组内所有区块和交易数据，但不参与共识投票。适合用于数据查询服务、业务系统只读接入，不影响共识性能。</LI>
            <LI><strong className="text-white">游离节点（Free Node）</strong>：节点已在 P2P 网络中连接，但尚未加入任何群组，处于待分配状态。游离节点不同步任何群组数据。</LI>
          </UL>

          <H4>节点管理命令</H4>
          <P>通过控制台（console）执行以下命令管理群组节点成员：</P>
          <CodeBlock language="bash" code={`# 将节点加入为共识节点（Sealer）
> addSealer <nodeId>
# 示例
> addSealer 1cf34b2a...node_public_key...

# 将节点加入为观察者节点（Observer）
> addObserver <nodeId>
> addObserver 7ab824c9...node_public_key...

# 将节点从群组中移除（变为游离节点）
> removeNode <nodeId>
> removeNode 1cf34b2a...node_public_key...

# 查询当前共识节点列表
> getSealerList

# 查询当前观察者节点列表
> getObserverList

# 查询网络中所有已连接节点（包含游离节点）
> getNodeIDList`} />

          <H4>新节点加入网络的操作步骤</H4>
          <UL>
            <LI><strong className="text-white">第一步：生成节点证书与配置</strong> — 使用 <IC>build_chain.sh -o add</IC> 或手动生成节点配置目录，确保新节点持有由联盟 CA 签发的合法证书。</LI>
            <LI><strong className="text-white">第二步：启动新节点</strong> — 在新节点机器上执行 <IC>start.sh</IC> 启动节点进程，节点将通过 P2P 网络发现并连接已有节点，此时状态为游离节点。</LI>
            <LI><strong className="text-white">第三步：确认 P2P 连接</strong> — 在控制台执行 <IC>getNodeIDList</IC>，确认新节点的 NodeID 出现在列表中，说明 P2P 连接已建立。</LI>
            <LI><strong className="text-white">第四步：添加为观察者节点</strong> — 执行 <IC>addObserver &lt;nodeId&gt;</IC>，将新节点加入群组作为观察者，节点开始同步历史区块数据。</LI>
            <LI><strong className="text-white">第五步：等待区块同步完成</strong> — 通过 <IC>getSyncStatus</IC> 查看新节点的区块高度，等待其同步至最新高度。</LI>
            <LI><strong className="text-white">第六步（可选）：提升为共识节点</strong> — 同步完成后，若需要参与共识，执行 <IC>addSealer &lt;nodeId&gt;</IC> 将其升级为共识节点。</LI>
          </UL>
          <Note type="warning">将节点提升为共识节点会增加共识通信量，请在确认节点稳定运行、网络带宽充裕后再执行此操作，避免因新节点性能不足影响整体共识效率。</Note>

          {/* ── CA黑白名单 ── */}
          <H2 id="cert-list">CA 黑白名单配置</H2>
          <P>DeSpace 提供基于节点证书的黑白名单机制，允许运维人员在不更换证书体系的前提下，对特定节点的网络接入进行精细控制。黑白名单在 TLS 握手阶段生效，被拒绝的节点无法建立 P2P 或 Channel 连接。</P>

          <H4>黑名单（Certificate Blacklist）</H4>
          <P>黑名单用于拒绝特定节点的连接请求，即使该节点持有合法的 CA 证书。适用场景：某节点发生安全事件（私钥泄露、被恶意控制）需要立即隔离，但尚未完成证书吊销流程时，可先通过黑名单紧急阻断其连接。</P>

          <H4>白名单（Certificate Whitelist）</H4>
          <P>白名单用于实现"最小权限"接入策略：仅允许白名单中列出的节点连接，其他所有节点（即使证书合法）均被拒绝。适用于对接入节点有严格管控要求的高安全场景。</P>

          <H4>优先级规则</H4>
          <UL>
            <LI>黑名单优先级高于白名单：若某节点同时出现在黑名单和白名单中，以黑名单为准，该节点被拒绝连接。</LI>
            <LI>若仅配置白名单（黑名单为空），则只有白名单节点可连接。</LI>
            <LI>若两者均未配置，则所有持有合法 CA 证书的节点均可连接（默认行为）。</LI>
          </UL>

          <CodeBlock language="ini" code={`; 在 config.ini 中配置黑白名单
[certificate_blacklist]
    ; 拒绝连接的节点证书序列号（Certificate Serial Number），可配置多个
    ; 格式: crl.编号=证书序列号
    crl.0=4B:3D:99:E5:00:12:9A:F2:AB:CD:12:34:56:78:90:AB
    crl.1=1A:2B:3C:4D:5E:6F:AA:BB:CC:DD:EE:FF:00:11:22:33

[certificate_whitelist]
    ; 仅允许连接的节点证书序列号，配置后其他节点均被拒绝
    ; 若不需要白名单则注释此段
    ; cal.0=FF:EE:DD:CC:BB:AA:99:88:77:66:55:44:33:22:11:00`} />

          <P>修改黑白名单配置后，向节点进程发送 <IC>SIGUSR1</IC> 信号即可热加载，无需重启节点：</P>
          <CodeBlock language="bash" code={`# 获取节点进程PID
cat nodes/127.0.0.1/node0/node.pid

# 发送热加载信号（替换 <pid> 为实际进程号）
kill -USR1 <pid>

# 确认热加载成功（查看日志中的reload信息）
tail -f nodes/127.0.0.1/node0/log/log_*.log | grep -i "reload"`} />
          <Note type="note">黑白名单配置基于证书序列号（Serial Number）而非节点 NodeID，需通过 <IC>openssl x509 -in node.crt -noout -serial</IC> 命令获取证书序列号。</Note>

          {/* ── 存储加密 ── */}
          <H2 id="storage-enc">存储加密</H2>
          <P>存储加密功能用于保护节点本地存储的敏感数据（账本数据、节点私钥），防止因物理介质被盗、云环境磁盘快照泄露等原因导致数据暴露。DeSpace 通过独立的 Key Manager 服务集中管理加密密钥，节点运行时从 Key Manager 获取解密密钥，Key Manager 宕机时节点无法启动（强制保护）。</P>

          <H4>第一步：部署 Key Manager 服务</H4>
          <CodeBlock language="bash" code={`# 下载Key Manager
cd ~/fisco
curl -#LO https://github.com/FISCO-BCOS/key-manager/releases/download/v2.9.0/key-manager.tar.gz
tar -xzf key-manager.tar.gz && cd key-manager

# 初始化Key Manager（生成主密钥）
./key-manager --init --output ./data
# 输出: masterKey已生成并存储于 ./data/masterKey.key

# 查看Key Manager监听端口（默认 8150）
cat conf/key-manager.ini | grep listen_port`} />

          <H4>第二步：生成启用加密的节点</H4>
          <CodeBlock language="bash" code={`# 使用 build_chain.sh 生成节点时指定加密参数
bash build_chain.sh -l "127.0.0.1:4" -p 30300,20200,8545 -e ./fisco-bcos -K 127.0.0.1:8150
# -K 参数指定Key Manager的地址和端口`} />

          <H4>第三步：启动 Key Manager</H4>
          <CodeBlock language="bash" code={`cd ~/fisco/key-manager
# 前台启动（测试用）
./key-manager
# 后台启动
nohup ./key-manager >> key-manager.log 2>&1 &
echo $! > key-manager.pid

# 验证Key Manager正常运行
curl http://127.0.0.1:8150/encrypt -X POST -d '{"dataKey":"test","data":"hello"}'`} />

          <H4>第四步：配置节点 dataKey</H4>
          <P>每个节点需要独立的 <IC>dataKey</IC> 用于加密其本地存储数据。dataKey 由 Key Manager 托管，节点启动时通过安全通道获取。</P>
          <CodeBlock language="bash" code={`# 为节点0注册dataKey（通过Key Manager API）
curl http://127.0.0.1:8150/newDataKey \
  -X POST \
  -H 'Content-Type: application/json' \
  -d '{"nodeId": "node0", "groupId": "1"}'
# 返回: {"dataKey":"aes_key_hex...","encryptedDataKey":"cipher..."}

# 将返回的 encryptedDataKey 写入节点配置
echo "encryptedDataKey=cipher..." >> nodes/127.0.0.1/node0/conf/node.key.conf`} />

          <H4>第五步：加密节点私钥</H4>
          <CodeBlock language="bash" code={`# 使用Key Manager工具加密节点私钥
./key-manager --encrypt-node-key \
  --key-manager 127.0.0.1:8150 \
  --node-key nodes/127.0.0.1/node0/conf/node.key \
  --output nodes/127.0.0.1/node0/conf/node.key.enc

# 在节点config.ini中指定使用加密私钥
# [certificate]
#   node_key=conf/node.key.enc
#   enable_key_manager=true
#   key_manager_url=127.0.0.1:8150`} />

          <H4>第六步：启动节点</H4>
          <CodeBlock language="bash" code={`# 确保Key Manager已启动后，再启动节点
cd nodes/127.0.0.1/node0 && bash start.sh

# 节点启动时会向Key Manager请求密钥，日志中应看到：
# [INFO][KeyManager] Successfully fetched dataKey from key-manager
# [INFO][Storage] Storage encryption enabled`} />

          <H4>第七步：验证加密正确性</H4>
          <CodeBlock language="bash" code={`# 方法1: 通过控制台验证节点正常运行并可以查询
./console/start.sh
> getBlockNumber
# 返回正常区块高度则说明加密存储运行正常

# 方法2: 直接检查RocksDB数据文件（加密后内容应为乱码）
xxd nodes/127.0.0.1/node0/data/group1/block/ | head -5
# 若输出为加密数据（非可读文本），说明存储加密生效

# 方法3: 停止Key Manager后尝试重启节点（应失败）
kill $(cat key-manager.pid)
cd nodes/127.0.0.1/node0 && bash start.sh
# 预期: 节点启动失败，日志提示无法连接Key Manager`} />
          <Note type="tip">存储加密一旦启用，Key Manager 服务的高可用性将直接影响节点的启动能力。生产环境务必为 Key Manager 配置主备架构，防止单点故障导致所有节点无法重启。</Note>

          {/* ── 账户权限控制 ── */}
          <H2 id="permission-control">账户权限控制</H2>
          <P>DeSpace 基于角色的权限控制（RBAC）模型，将链的管理权限划分为两个层级：委员（Committee Member）和运维（Operator），并通过链上治理合约（<IC>PermissionPrecompiled</IC>）执行权限变更，所有操作可审计、可追溯。</P>

          <H4>角色权限说明</H4>
          <UL>
            <LI><strong className="text-white">委员（Committee Member）</strong>：拥有最高治理权限，可以授权/撤销运维账户、修改委员会成员列表（需多签投票）、修改阈值等。委员账户通常由联盟内各机构的权威账户担任。</LI>
            <LI><strong className="text-white">运维（Operator）</strong>：由委员授权，拥有部署合约、冻结/解冻合约、管理节点成员等日常运维操作权限，但无权变更委员会组成。</LI>
            <LI><strong className="text-white">普通账户</strong>：无特殊权限，只能调用已部署的合约（需要合约自身的业务权限逻辑允许），不能部署新合约（在启用权限管理后）。</LI>
          </UL>

          <H4>委员会管理命令</H4>
          <CodeBlock language="bash" code={`# 授予账户委员权限（需要现有委员发起，多签投票通过）
> grantCommitteeMember 0xABCD...账户地址...
# 发起投票后，其他委员需执行 voteCommitteeMember 进行投票
> voteCommitteeMember 0xABCD...账户地址... true

# 撤销委员权限
> revokeCommitteeMember 0xABCD...账户地址...

# 查询委员列表
> listCommitteeMembers

# 修改委员会投票通过阈值（默认50%）
> updateThreshold 66  ; 设置为66%多数通过`} />

          <H4>运维账户管理命令</H4>
          <CodeBlock language="bash" code={`# 授予账户运维权限（委员执行）
> grantOperator 0x1234...运维账户...

# 撤销运维权限
> revokeOperator 0x1234...运维账户...

# 查询运维账户列表
> listOperators`} />

          <H4>合约权限管理命令</H4>
          <CodeBlock language="bash" code={`# 冻结合约（合约所有者或运维执行）
> freezeContract 0x5678...合约地址...

# 解冻合约
> unfreezeContract 0x5678...合约地址...

# 查询合约状态（available/frozen/abandoned）
> getContractStatus 0x5678...合约地址...

# 授予账户部署合约权限（在启用部署权限控制后）
> grantDeployAndCreateManager 0xAAAA...账户地址...

# 撤销部署合约权限
> revokeDeployAndCreateManager 0xAAAA...账户地址...`} />

          <H4>权限控制操作表</H4>
          <UL>
            <LI><strong className="text-white">部署合约</strong>：默认所有账户可部署；启用 <IC>grantDeployAndCreateManager</IC> 后仅授权账户可部署。</LI>
            <LI><strong className="text-white">调用合约</strong>：任意账户均可调用已部署的合约，细粒度权限由合约内部逻辑控制。</LI>
            <LI><strong className="text-white">冻结合约</strong>：合约创建者账户或运维账户可冻结，委员账户可解冻任意合约。</LI>
            <LI><strong className="text-white">节点管理</strong>：运维账户可执行 <IC>addSealer</IC>/<IC>addObserver</IC>/<IC>removeNode</IC>。</LI>
            <LI><strong className="text-white">系统配置修改</strong>：运维账户可修改 <IC>tx_count_limit</IC>、<IC>tx_gas_limit</IC> 等系统参数（通过 <IC>setSystemConfigByKey</IC>）。</LI>
          </UL>
          <Note type="note">权限控制功能在 DeSpace 2.5.0+ 版本中正式启用。对于现有业务系统的升级，建议先在测试环境充分验证权限模型设计，再在生产环境启用，以避免因权限配置不当导致业务中断。</Note>

          <div className="mt-16 pt-8 border-t border-white/5 text-slate-600 text-xs space-y-2">
            <p>© Copyright DeSpace 2019. 本技术文档适用于DeSpace 2.x版本。</p>
            <p>Built with Sphinx using a theme provided by Read the Docs.</p>
            <button onClick={() => navigate('/docs')} className="flex items-center gap-1.5 hover:text-brand-primary transition-colors mt-4">
              <ArrowLeft size={12} /> 返回开发第一个区块链应用
            </button>
          </div>
        </main>
      </div>
    </div>
  );
}
