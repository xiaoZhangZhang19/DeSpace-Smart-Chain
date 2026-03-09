import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Database, Menu, X, Copy, Check, ChevronRight } from 'lucide-react';
import DocsSidebar, { keyConceptsNavItems } from './DocsSidebar';

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

export default function KeyConcepts() {
  const navigate = useNavigate();
  const [activeId, setActiveId] = useState('blockchain');
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
    keyConceptsNavItems.forEach(({ id }) => {
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
          <span className="text-xs font-black uppercase tracking-widest text-white">关键概念</span>
        </div>
        <button className="md:hidden ml-auto text-white" onClick={() => setSidebarOpen(!sidebarOpen)}>
          {sidebarOpen ? <X size={18} /> : <Menu size={18} />}
        </button>
      </header>

      <div className="pt-14 flex">
        <DocsSidebar activePage="key-concepts" activeId={activeId} scrollTo={scrollTo} sidebarOpen={sidebarOpen} />

        <main className="flex-1 min-w-0 px-6 md:px-12 lg:px-16 py-10 max-w-4xl">

          <div id="blockchain" className="scroll-mt-20 mb-2">
            <div className="flex flex-wrap items-center gap-2 text-brand-primary text-xs font-bold uppercase tracking-widest mb-3">
              <span>概念</span><span className="text-white/20">·</span>
              <span>区块链</span><span className="text-white/20">·</span>
              <span>联盟链</span>
            </div>
            <h1 className="text-3xl font-black text-white tracking-tight mb-6">关键概念</h1>
          </div>

          <P>DeSpace 是面向企业级应用场景设计的联盟区块链平台。理解区块链的核心概念，有助于开发者更好地设计链上业务逻辑、合理配置网络参数并高效进行运维管理。本文将系统性介绍区块链基础知识以及联盟链的关键特性分析。</P>
          <Note type="note">本文档中所涉及的技术概念基于 DeSpace 2.x 版本，部分实现细节在 3.x 版本中有所调整，请以实际部署版本的文档为准。</Note>

          <H2 id="blockchain">区块链是什么</H2>
          <P>区块链是一种由多方共同维护、使用密码学保证传输和访问安全、能够实现数据一致存储、防止篡改、防止抵赖的记账技术，也称为分布式账本技术（Distributed Ledger Technology）。</P>
          <P>与传统中心化数据库不同，区块链网络中不存在单一的权威节点，所有参与节点共同维护一份账本副本，并通过共识算法保证各节点之间数据的一致性。数据一旦写入区块链，便具有不可篡改的特性，从而为多方业务协同提供了可信的技术基础。</P>

          <H3 id="blockchain-ledger">1. 账本</H3>
          <P>区块链的账本由一系列有序的区块（Block）组成，每个区块包含若干交易记录，并通过密码学哈希链接到上一个区块，形成不可篡改的链式结构。</P>

          <H4>核心数据结构</H4>
          <UL>
            <LI><strong className="text-white">区块（Block）</strong>：账本的基本存储单元，包含区块头（Block Header）和区块体（Block Body）。区块头记录区块高度、时间戳、父区块哈希、交易根哈希、状态根哈希等元数据；区块体存储该区块中打包的所有交易列表。</LI>
            <LI><strong className="text-white">交易（Transaction）</strong>：对账本状态的一次原子性操作，由发起方使用私钥签名，包含调用目标合约地址、输入参数、gas 上限等字段。每笔交易执行后均会生成对应的交易回执（Receipt），记录执行结果、日志事件及 gas 消耗。</LI>
            <LI><strong className="text-white">账户（Account）</strong>：区块链上的基本操作主体，分为外部账户（EOA）和合约账户两类。外部账户由用户的密钥对控制，合约账户则由智能合约代码控制，拥有独立的存储空间。</LI>
            <LI><strong className="text-white">世界状态（World State）</strong>：所有账户当前状态的全局快照，采用 Merkle Patricia Tree 结构存储。每个区块打包并执行完交易后，世界状态随之更新，新的状态根哈希会被写入区块头，确保状态的完整性和可验证性。</LI>
          </UL>

          <Note type="note">DeSpace 支持 MySQL 和 RocksDB 两种底层存储引擎，可根据业务规模和性能需求灵活选择。MySQL 更易于运维与数据查询，RocksDB 则提供更高的写入吞吐能力。</Note>

          <H4>账本数据示例</H4>
          <CodeBlock language="json" code={`{
  "blockNumber": 12345,
  "parentHash": "0x3f8a2b...",
  "stateRoot": "0xd9a71c...",
  "transactionsRoot": "0x4e2f83...",
  "timestamp": 1710000000,
  "transactions": [
    {
      "hash": "0xabc123...",
      "from": "0x1234...abcd",
      "to": "0x5678...ef01",
      "input": "0xa9059cbb...",
      "gasUsed": 21000
    }
  ]
}`} />

          <H3 id="blockchain-consensus">2. 共识机制</H3>
          <P>共识机制是区块链网络中各节点就账本状态达成一致的核心算法。在没有中心化权威机构的情况下，共识算法保证了分布式节点之间能够对交易顺序和执行结果产生相同的认知。</P>

          <H4>节点类型</H4>
          <UL>
            <LI><strong className="text-white">共识节点（Sealer）</strong>：参与区块的生成与共识投票，拥有打包交易并提议新区块的权利。共识节点需要由联盟治理委员会授权加入，数量直接影响共识效率与容错能力。</LI>
            <LI><strong className="text-white">观察者节点（Observer）</strong>：同步账本数据但不参与共识投票，适合用于数据查询、业务监控等只读场景。观察者节点不影响共识性能，可以按需扩展。</LI>
            <LI><strong className="text-white">游离节点（Free Node）</strong>：已接入网络但尚未被分配到任何群组的节点，处于待配置状态。</LI>
          </UL>

          <CodeBlock language="bash" code={`# 查询当前共识节点列表
> getSealerList
[
    "0x5d70a24b...node1_pubkey...",
    "0x8f3c19d7...node2_pubkey...",
    "0x2a61e8f0...node3_pubkey..."
]

# 查询观察者节点列表
> getObserverList
[
    "0x9b4c72a1...node4_pubkey..."
]`} />

          <H4>共识算法</H4>
          <UL>
            <LI><strong className="text-white">PBFT（Practical Byzantine Fault Tolerance）</strong>：实用拜占庭容错算法，能够在最多 1/3 的节点出现恶意行为时仍保证系统正确性。PBFT 具有即时最终性（Instant Finality），交易一旦上链即不可回滚，适合对一致性要求极高的金融场景。缺点是随节点数量增加，通信复杂度呈 O(n²) 增长。</LI>
            <LI><strong className="text-white">Raft</strong>：基于领导者选举的崩溃容错（CFT）算法，性能优于 PBFT，但不具备拜占庭容错能力。适合节点之间高度互信、对性能有更高要求的场景。</LI>
            <LI><strong className="text-white">rPBFT（Rotating PBFT）</strong>：DeSpace 针对大规模节点场景设计的改进 PBFT 算法，通过动态选举部分节点形成共识委员会，将共识通信复杂度控制在 O(c²)（c 为委员会规模），在保持拜占庭容错能力的同时显著提升了可扩展性。</LI>
          </UL>
          <Note type="tip">生产环境推荐使用 PBFT 或 rPBFT，以确保在节点出现故障或被攻击时系统仍能正常运行。Raft 仅适用于节点完全可信的测试或私有部署场景。</Note>

          <H3 id="blockchain-contract">3. 智能合约</H3>
          <P>智能合约（Smart Contract）是运行在区块链上的自执行程序，合约代码及执行结果均存储在链上，任何参与方都无法单方面篡改。DeSpace 兼容以太坊 EVM，支持使用 Solidity 语言编写智能合约。</P>

          <H4>智能合约生命周期</H4>
          <UL>
            <LI><strong className="text-white">编写（Develop）</strong>：使用 Solidity 语言编写合约源码，定义合约状态变量、函数接口和业务逻辑。</LI>
            <LI><strong className="text-white">编译（Compile）</strong>：使用 solc 编译器将 Solidity 源码编译为 EVM 字节码（Bytecode）和 ABI（Application Binary Interface）接口描述文件。</LI>
            <LI><strong className="text-white">部署（Deploy）</strong>：通过发送一笔特殊的部署交易将字节码上链，区块链网络分配唯一的合约地址，合约随之永久存储在链上。</LI>
            <LI><strong className="text-white">调用（Invoke）</strong>：通过合约地址和 ABI 构造调用交易，触发合约中对应函数的执行。写操作需要发送交易，读操作（<IC>call</IC>）可直接查询不消耗 gas。</LI>
            <LI><strong className="text-white">冻结/解冻（Freeze/Unfreeze）</strong>：DeSpace 提供合约生命周期管理接口，授权用户可冻结合约以阻止调用，或在修复漏洞后解冻恢复服务。</LI>
          </UL>

          <H4>虚拟机与图灵完备性</H4>
          <P>DeSpace 采用以太坊虚拟机（EVM）执行智能合约字节码。EVM 是一个基于栈的图灵完备虚拟机，理论上可以表达任意复杂的计算逻辑。为防止无限循环耗尽系统资源，每笔交易设置了 Gas 上限（<IC>gas_limit</IC>），合约执行过程中每条指令消耗对应数量的 Gas，超出上限则交易回滚。</P>
          <Note type="note">DeSpace 同时支持国密算法（SM2/SM3/SM4），可通过节点配置项 <IC>sm_crypto</IC> 启用国密模式，满足国内合规要求。</Note>

          {/* ── 联盟链概念分析 ── */}
          <H2 id="consortium">联盟链概念分析</H2>
          <P>联盟链（Consortium Blockchain）是一种由多个机构共同参与、对特定群体开放的区块链形态，介于完全开放的公链与完全封闭的私链之间。DeSpace 作为联盟链平台，在设计上针对企业级场景进行了深度优化，在性能、安全性和治理三个维度均有鲜明特色。</P>
          <P>相较于公链（如以太坊主网），联盟链的参与节点均经过身份认证，网络规模可控，因此能够采用更高效的共识算法，实现更高的交易吞吐量和更低的确认延迟，同时在数据隐私保护和监管合规方面具有天然优势。</P>

          <H3 id="consortium-perf">1. 性能</H3>
          <P>性能是企业级区块链平台的核心指标之一。DeSpace 在设计之初便将高性能作为核心目标，通过多项技术手段实现了业界领先的交易处理能力。</P>

          <H4>性能指标</H4>
          <UL>
            <LI><strong className="text-white">TPS（Transactions Per Second）</strong>：每秒处理的交易数量，是衡量区块链吞吐能力的核心指标。DeSpace 在标准测试环境下单群组 TPS 可达数万级别，远超比特币（约 7 TPS）和以太坊（约 15 TPS）。</LI>
            <LI><strong className="text-white">交易延迟（Latency）</strong>：从交易提交到最终确认所需的时间。DeSpace 采用 PBFT 共识，具备即时最终性，正常情况下交易确认延迟在秒级以内。</LI>
            <LI><strong className="text-white">区块时间（Block Interval）</strong>：相邻两个区块产生的时间间隔，可通过配置项 <IC>consensus_timeout</IC> 和 <IC>min_seal_time</IC> 调节，以平衡吞吐量与延迟。</LI>
          </UL>

          <H4>性能优化技术</H4>
          <UL>
            <LI><strong className="text-white">并行交易执行</strong>：DeSpace 支持基于 DAG（有向无环图）的并行交易执行框架，对无数据依赖的交易进行并行处理，充分利用多核 CPU 资源，在高并发场景下可显著提升 TPS。</LI>
            <LI><strong className="text-white">分布式存储</strong>：支持将状态数据分布存储在多个节点，避免单节点存储成为性能瓶颈，同时提升数据可靠性。</LI>
            <LI><strong className="text-white">预编译合约（Precompiled Contract）</strong>：将高频使用的操作（如哈希计算、群组管理等）实现为 Native 代码，以预编译合约形式提供，执行效率远高于 EVM 字节码解释执行。</LI>
            <LI><strong className="text-white">群组架构（Group Architecture）</strong>：支持在同一物理网络上运行多个逻辑隔离的群组，各群组独立运行共识和存储，实现横向扩展。一个节点可同时加入多个群组，充分复用网络和计算资源。</LI>
          </UL>
          <Note type="note">并行交易执行需要在合约开发阶段预先声明交易的冲突变量，开发者需参考 DeSpace 并行合约开发文档进行适配。</Note>

          <H3 id="consortium-security">2. 安全性</H3>
          <P>企业级区块链平台必须提供全面的安全保障，覆盖网络接入、数据传输、存储以及权限控制等各个层面。DeSpace 构建了多层次的安全防护体系。</P>

          <H4>准入机制</H4>
          <UL>
            <LI><strong className="text-white">CA 证书体系</strong>：所有节点和 SDK 客户端均需持有由联盟 CA 签发的数字证书方可接入网络，未经授权的节点无法建立连接。支持国密 SM2 证书和标准 ECDSA 证书两套体系。</LI>
            <LI><strong className="text-white">SSL/TLS 加密传输</strong>：节点间所有通信均采用双向 TLS 加密，防止中间人攻击和数据窃听。国密模式下使用 GMSSL 协议。</LI>
            <LI><strong className="text-white">黑白名单</strong>：支持配置节点 CA 黑名单（拒绝特定节点）和白名单（仅允许特定节点），为网络准入提供细粒度控制。</LI>
          </UL>

          <H4>权限控制</H4>
          <UL>
            <LI><strong className="text-white">账户权限模型</strong>：基于角色（委员/运维）的链级权限管理，控制账户对系统合约（部署、冻结）的操作权限，防止越权行为。</LI>
            <LI><strong className="text-white">合约访问控制</strong>：智能合约内可通过代码实现业务级的访问控制逻辑，结合链级权限形成双层防护。</LI>
          </UL>

          <H4>隐私保护</H4>
          <UL>
            <LI><strong className="text-white">群组数据隔离</strong>：不同群组的账本数据完全隔离，非群组成员节点无法访问群组内的交易和状态数据，实现了业务数据的物理隔离。</LI>
            <LI><strong className="text-white">存储加密</strong>：支持对节点本地存储的数据进行加密保护，防止物理介质泄露导致的数据暴露，加密密钥由独立的 Key Manager 服务管理。</LI>
            <LI><strong className="text-white">隐私合约</strong>：支持可选的 WeDPR 隐私保护组件，提供零知识证明等高级隐私计算能力，在不暴露原始数据的前提下完成业务逻辑验证。</LI>
          </UL>

          <H3 id="consortium-governance">3. 治理与监管</H3>
          <P>联盟链的核心价值在于多方协同治理，DeSpace 提供了完整的链上治理框架，支持联盟成员共同决策、动态管理网络成员，并为监管机构提供必要的审计接口。</P>

          <H4>联盟链治理</H4>
          <UL>
            <LI><strong className="text-white">委员会治理模型</strong>：链的最高治理权由委员会（Committee）持有，支持多签投票机制，关键操作（如新增委员、授权运维）需经过委员会多数成员同意方可执行，防止单点权力滥用。</LI>
            <LI><strong className="text-white">动态节点管理</strong>：联盟成员可通过控制台或 SDK 动态添加/移除共识节点和观察者节点，无需重启网络即可调整网络拓扑，支持联盟的动态扩张与收缩。</LI>
            <LI><strong className="text-white">合约生命周期管理</strong>：授权运维人员可冻结存在漏洞的合约、升级合约逻辑，在不中断整体业务的前提下完成合约的迭代演进。</LI>
          </UL>

          <H4>快速部署</H4>
          <UL>
            <LI><strong className="text-white">一键建链工具</strong>：DeSpace 提供 <IC>build_chain.sh</IC> 脚本，支持在单机或多机环境下快速生成节点配置、证书和启动脚本，将区块链网络搭建时间压缩到分钟级别。</LI>
            <LI><strong className="text-white">Docker 支持</strong>：提供官方 Docker 镜像，简化在容器化环境（Kubernetes、Docker Compose）中的部署与扩容流程。</LI>
          </UL>

          <H4>数据治理</H4>
          <UL>
            <LI><strong className="text-white">数据归档</strong>：支持对历史区块数据进行归档，将冷数据迁移到低成本存储，保持节点本地数据库的精简高效。</LI>
            <LI><strong className="text-white">数据导出</strong>：提供 WeBASE-Collect-Bee 等数据导出组件，可将链上结构化数据实时同步到关系型数据库，方便业务系统进行复杂查询和报表分析。</LI>
          </UL>

          <H4>运维监控</H4>
          <UL>
            <LI><strong className="text-white">可视化管理平台（WeBASE）</strong>：提供节点状态监控、交易浏览、合约管理、私钥管理等功能的一站式运维控制台，大幅降低区块链运维门槛。</LI>
            <LI><strong className="text-white">指标采集</strong>：节点内置 Prometheus 格式的指标采集接口，可与现有监控体系（Grafana/Prometheus）无缝集成，实现 TPS、区块高度、网络连接等核心指标的实时告警。</LI>
          </UL>

          <H4>监管审计</H4>
          <P>联盟链的所有交易均记录在不可篡改的账本中，并附有发起方的数字签名，天然满足可追溯、不可抵赖的审计要求。DeSpace 还支持向监管节点同步全量数据，监管机构可在不干预业务运营的情况下实时查阅链上数据，实现穿透式监管。</P>
          <Note type="tip">监管节点通常以观察者节点形式接入，建议为监管机构配置专用的 SDK 访问账户，并通过权限控制限制其操作范围，确保只读访问。</Note>

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
