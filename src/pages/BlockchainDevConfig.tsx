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
const IC = ({ children }: { children: React.ReactNode }) => (
  <code className="text-brand-primary bg-brand-primary/10 px-1 py-0.5 rounded text-xs font-mono">{children}</code>
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
    ['node-config', 'config-ini', 'config-group', 'config-mutable', 'node-management', 'cert-list', 'storage-enc', 'permission-control', 'sdk-allowlist']
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
          <P>配置管理包含以下模块：节点和账本配置、组员配置、CA黑白名单配置、存储加密、账户权限控制和SDK白名单配置。</P>

          {/* ── 节点配置 ── */}
          <CollapsibleSection id="node-config-section" title="节点配置" defaultOpen={true}>
            <P>FISCO BCOS支持多账本，每条链包括多个独立账本，账本间数据相互隔离，群组间交易处理相互隔离。每个节点包括：</P>
            <UL>
              <LI>config.ini：主配置文件，配置RPC、P2P、SSL证书、账本配置文件路径、兼容性等信息</LI>
              <LI>group.group_id.genesis：群组配置文件，群组内所有节点一致，节点启动后不可手动更改。主要包括群组共识算法、存储类型、最大gas限制等</LI>
              <LI>group.group_id.ini：群组可变配置文件，包括交易池大小等，配置后重启节点生效</LI>
            </UL>

            <span id="config-ini" className="scroll-mt-20 block" />
            <H3>主配置文件config.ini</H3>

            <Note type="warning">云主机公网IP均为虚拟IP，若listen_ip/jsonrpc_listen_ip/channel_listen_ip填写外网IP会绑定失败，须填写0.0.0.0；RPC/P2P/Channel监听端口必须位于1024-65535范围内，且不能与机器上其他应用监听端口冲突；为便于开发和体验，listen_ip/channel_listen_ip参考配置是0.0.0.0，出于安全考虑，请根据实际业务网络情况修改为安全的监听地址。</Note>

            <H4>配置RPC</H4>
            <P>配置项：</P>
            <UL>
              <LI>channel_listen_ip：Channel监听IP，为方便节点和SDK跨机器部署，默认设置为0.0.0.0</LI>
              <LI>jsonrpc_listen_ip：RPC监听IP，安全考虑，默认设置为127.0.0.1，若有外网访问需求，请监听节点外网IP或0.0.0.0</LI>
              <LI>channel_listen_port：Channel端口，对应到Java SDK配置中的channel_listen_port</LI>
              <LI>jsonrpc_listen_port：JSON-RPC端口</LI>
            </UL>
            <P>IPv4配置示例：</P>
            <CodeBlock language="ini" code={`[rpc]
    channel_listen_ip=0.0.0.0
    jsonrpc_listen_ip=127.0.0.1
    channel_listen_port=30301
    jsonrpc_listen_port=30302`} />
            <P>IPv6配置示例（v2.6.0+支持）：</P>
            <CodeBlock language="ini" code={`[rpc]
    channel_listen_ip=::1
    jsonrpc_listen_ip=::1
    channel_listen_port=30301
    jsonrpc_listen_port=30302`} />
            <Note type="note">v2.3.0版本将listen_ip拆分成jsonrpc_listen_ip和channel_listen_ip，但仍保留对listen_ip的解析。v2.6.0版本开始，RPC支持ipv4和ipv6。</Note>

            <H4>配置P2P</H4>
            <P>配置项：</P>
            <UL>
              <LI>listen_ip：P2P监听IP，默认设置为0.0.0.0</LI>
              <LI>listen_port：节点P2P监听端口</LI>
              <LI>node.*：节点需连接的所有节点IP:Port或DomainName:Port，支持域名</LI>
              <LI>enable_compress：开启网络压缩的配置选项，true表明开启，false表明关闭</LI>
            </UL>
            <Note type="note">v2.6.0版本开始，P2P支持ipv4和ipv6。</Note>
            <P>IPv4配置示例：</P>
            <CodeBlock language="ini" code={`[p2p]
    listen_ip=0.0.0.0
    listen_port=30300

    node.0=127.0.0.1:30300
    node.1=127.0.0.1:30304
    node.2=127.0.0.1:30308
    node.3=127.0.0.1:30312`} />
            <P>IPv6配置示例：</P>
            <CodeBlock language="ini" code={`[p2p]
    listen_ip=::1
    listen_port=30300
    node.0=[::1]:30300
    node.1=[::1]:30304
    node.2=[::1]:30308
    node.3=[::1]:30312`} />

            <H4>配置账本文件路径</H4>
            <P>[group]配置本节点所属的所有群组配置路径：</P>
            <UL>
              <LI>group_data_path：群组数据存储路径</LI>
              <LI>group_config_path：群组配置文件路径，节点根据此路径下的所有.genesis后缀文件启动群组</LI>
            </UL>
            <CodeBlock language="ini" code={`[group]
    ; 所有群组数据放置于节点的data子目录
    group_data_path=data/
    ; 程序自动加载该路径下的所有.genesis文件
    group_config_path=conf/`} />

            <H4>配置证书信息</H4>
            <P>基于安全考虑，FISCO BCOS节点间采用SSL加密通信，[network_security]配置SSL连接的证书信息：</P>
            <UL>
              <LI>data_path：证书和私钥文件所在目录</LI>
              <LI>key：节点私钥相对于data_path的路径</LI>
              <LI>cert：证书node.crt相对于data_path的路径</LI>
              <LI>ca_cert：ca证书文件路径</LI>
              <LI>ca_path：ca证书文件夹，多ca时需要</LI>
              <LI>check_cert_issuer：设置SDK是否只能连本机构节点，默认为开启（check_cert_issuer=true）</LI>
            </UL>
            <CodeBlock language="ini" code={`[network_security]
    data_path=conf/
    key=node.key
    cert=node.crt
    ca_cert=ca.crt
    ;ca_path=`} />

            <H4>配置黑名单列表</H4>
            <P>基于防作恶考虑，FISCO BCOS允许节点将不受信任的节点加入到黑名单列表，并拒绝与这些黑名单节点建立连接，通过[certificate_blacklist]配置：</P>
            <UL>
              <LI>crl.idx：黑名单节点的Node ID，节点Node ID可通过node.nodeid文件获取；idx是黑名单节点的索引</LI>
            </UL>
            <CodeBlock language="ini" code={`; 证书黑名单
[certificate_blacklist]
    crl.0=4d9752efbb1de1253d1d463a934d34230398e787b3112805728525ed5b9d2ba29e4ad92c6fcde5156ede8baa5aca372a209f94dc8f283c8a4fa63e3787c338a4`} />

            <H4>配置日志信息</H4>
            <UL>
              <LI>enable：启用/禁用日志，默认true；性能测试可将该选项设置为false</LI>
              <LI>log_path：日志文件路径</LI>
              <LI>level：日志级别，包括trace、debug、info、warning、error五种，设置某级别后输出大于等于该级别的日志（error {'>'} warning {'>'} info {'>'} debug {'>'} trace）</LI>
              <LI>max_log_file_size：每个日志文件最大容量，单位MB，默认200MB</LI>
              <LI>flush：boostlog默认开启日志自动刷新，若需提升系统性能，建议设置为false</LI>
            </UL>
            <CodeBlock language="ini" code={`[log]
    ; 是否启用日志，默认为true
    enable=true
    log_path=./log
    level=info
    ; 每个日志文件最大容量，默认为200MB
    max_log_file_size=200
    flush=true`} />
            <Note type="note">v2.11.0新增配置项：log.format（日志格式）、log.enable_rotate_by_hour（按小时滚动）、log.log_name_pattern（日志文件名模式）、log.rotate_name_pattern（滚动后文件名）、log.archive_path（归档目录）、log.compress_archive_file（是否压缩归档）、log.max_archive_files（归档最大文件数，0不限制）、log.max_archive_size（归档最大空间，单位MB，0不限制）、log.min_free_space（最小剩余空间）。</Note>

            <H4>统计日志配置</H4>
            <P>FISCO BCOS在config.ini中提供了enable_statistic选项开启/关闭网络流量和Gas统计功能，默认关闭。</P>
            <CodeBlock language="ini" code={`[log]
    ; enable/disable the statistics function
    enable_statistic=false
    ; network statistics interval, unit is second, default is 60s
    stat_flush_interval=60`} />

            <H4>配置链属性</H4>
            <UL>
              <LI>id：链ID，默认为1</LI>
              <LI>sm_crypto：2.5.0版本以后，true表示国密模式，false表示非国密模式，默认false</LI>
              <LI>sm_crypto_channel：2.5.0版本以后，配置是否使用国密SSL与SDK连接，默认false</LI>
            </UL>

            <H4>配置节点兼容性</H4>
            <UL>
              <LI>supported_version：当前节点运行的版本，build_chain.sh生成时自动配置为最高版本，旧节点升级时直接替换二进制，千万不可修改supported_version</LI>
            </UL>
            <CodeBlock language="ini" code={`[compatibility]
    supported_version=2.2.0`} />

            <H4>可选配置：落盘加密</H4>
            <P>config.ini中的storage_security用于配置落盘加密：</P>
            <UL>
              <LI>enable：是否开启落盘加密，默认不开启</LI>
              <LI>key_manager_ip：Key Manager服务的部署IP</LI>
              <LI>key_manager_port：Key Manager服务的监听端口</LI>
              <LI>cipher_data_key：节点数据加密密钥的密文，产生方式参考存储加密章节</LI>
            </UL>
            <CodeBlock language="ini" code={`[storage_security]
enable=true
key_manager_ip=127.0.0.1
key_manager_port=8150
cipher_data_key=ed157f4588b86d61a2e1745efe71e6ea`} />

            <H4>可选配置：流量控制</H4>
            <P>FISCO BCOS v2.5.0引入了流量控制功能，配置项位于config.ini的[flow_control]，默认关闭。</P>
            <UL>
              <LI>limit_req：SDK请求速率限制，默认关闭（注释状态），去掉注释符号;开启</LI>
              <LI>outgoing_bandwidth_limit：节点出带宽限制，单位Mbit/s，默认关闭</LI>
            </UL>
            <CodeBlock language="ini" code={`[flow_control]
    ; restrict QPS of the node
    limit_req=2000
    ; Mb, can be a decimal
    ; when the outgoing bandwidth exceeds the limit, the block synchronization operation will not proceed
    outgoing_bandwidth_limit=5`} />

            <span id="config-group" className="scroll-mt-20 block" />
            <H3>群组系统配置说明</H3>

            <P>每个群组都有单独的配置文件，按照启动后是否可更改，分为群组系统配置和群组可变配置。群组系统配置一般位于节点的conf目录下.genesis后缀配置文件中，如group1的系统配置一般命名为group.1.genesis。</P>

            <Note type="warning">配置系统配置时需注意：必须保证群组内所有节点的该配置一致；系统配置已作为创世块写入系统表，链初始化后不可更改；链初始化后即使更改了genesis配置，新的配置也不会生效；建议使用build_chain工具生成该配置。</Note>

            <H4>群组配置</H4>
            <CodeBlock language="ini" code={`[group]
id=2`} />

            <H4>共识配置</H4>
            <UL>
              <LI>consensus_type：共识算法类型，支持pbft、raft和rpbft，默认pbft</LI>
              <LI>max_trans_num：一个区块可打包的最大交易数，默认1000，链初始化后可通过控制台动态调整</LI>
              <LI>consensus_timeout：PBFT共识过程中每个区块执行的超时时间，默认3s，可通过控制台动态调整</LI>
              <LI>node.idx：共识节点列表，配置了参与共识节点的Node ID</LI>
            </UL>
            <P>rPBFT特定配置（v2.3.0+）：</P>
            <UL>
              <LI>epoch_sealer_num：一个共识周期内选择参与共识的节点数目，默认是所有共识节点总数</LI>
              <LI>epoch_block_num：一个共识周期出块数目，默认1000</LI>
            </UL>
            <P>PBFT共识配置示例：</P>
            <CodeBlock language="ini" code={`[consensus]
    consensus_type=pbft
    max_trans_num=1000
    consensus_timeout=3
    epoch_sealer_num=4
    epoch_block_num=1000
    node.0=123d24a998b54b31f7602972b83d899b5176add03369395e53a5f60c303acb719ec0718ef1ed51feb7e9cf4836f266553df44a1cae5651bc6ddf50e01789233a
    node.1=70ee8e4bf85eccda9529a8daf5689410ff771ec72fc4322c431d67689efbd6fbd474cb7dc7435f63fa592b98f22b13b2ad3fb416d136878369eb413494db8776
    node.2=7a056eb611a43bae685efd86d4841bc65aefafbf20d8c8f6028031d67af27c36c5767c9c79cff201769ed80ff220b96953da63f92ae83554962dc2922aa0ef50
    node.3=fd6e0bfe509078e273c0b3e23639374f0552b512c2bea1b2d3743012b7fed8a9dec7b47c57090fa6dcc5341922c32b89611eb9d967dba5f5d07be74a5aed2b4a`} />

            <H4>状态模式配置</H4>
            <P>推荐使用storage state。</P>
            <CodeBlock language="ini" code={`[state]
    type=storage`} />

            <H4>gas配置</H4>
            <P>通过genesis的[tx].gas_limit配置交易最大gas限制，默认300000000，链初始化后可通过控制台动态调整。</P>
            <CodeBlock language="ini" code={`[tx]
    gas_limit=300000000`} />

            <H4>EVM配置</H4>
            <P>FISCO BCOS v2.4.0引入Free Storage Gas衡量模式，通过evm.enable_free_storage配置项控制。</P>
            <CodeBlock language="ini" code={`[evm]
    enable_free_storage=false`} />
            <Note type="note">evm.enable_free_storage v2.4.0开始支持；链初始化时写入创世块，之后手动修改不会生效；默认设置为false。</Note>

            <span id="config-mutable" className="scroll-mt-20 block" />
            <H3>账本可变配置说明</H3>

            <P>账本可变配置位于节点conf目录下.ini后缀的文件中，如group1可变配置一般命名为group.1.ini，可变配置主要包括交易池大小、PBFT共识消息转发TTL、PBFT共识打包时间设置等。</P>

            <H4>配置storage</H4>
            <P>存储目前支持RocksDB、MySQL和Scalable，推荐使用Mysql直连模式（type=MySQL）。</P>
            <UL>
              <LI>type：存储DB类型，支持RocksDB、MySQL和Scalable，不区分大小写</LI>
              <LI>max_capacity：允许节点用于内存缓存的空间大小</LI>
              <LI>max_forward_block：允许节点用于内存区块的大小，超出时节点停止共识等待区块写入数据库</LI>
              <LI>binary_log：设置为true时打开binary_log，此时关闭RocksDB的WAL</LI>
              <LI>cached_storage：控制是否使用缓存，默认true</LI>
              <LI>scroll_threshold_multiple：当type为Scalable时，区块数据库切换阈值，按scroll_threshold_multiple*1000，默认2</LI>
              <LI>db_ip/db_port/db_username/db_passwd/db_name：MySQL连接信息（type为MySQL时必须配置）</LI>
            </UL>
            <CodeBlock language="ini" code={`[storage]
    ; storage db type, RocksDB / MySQL / Scalable, RocksDB is recommended
    type=RocksDB
    max_capacity=256
    max_forward_block=10
    ; only for MySQL
    db_ip=127.0.0.1
    db_port=3306
    db_username=
    db_passwd=
    db_name=`} />

            <H4>交易池配置</H4>
            <UL>
              <LI>[tx_pool].limit：交易池内可以容纳的最大交易数目，默认150000，超过后客户端发到节点的交易会被拒绝</LI>
              <LI>[tx_pool].memory_limit：交易池内交易占用的内存大小限制，默认512MB，超过后交易会被拒绝</LI>
              <LI>[tx_pool].notify_worker_num：异步推送线程数目，默认2，建议不超过8</LI>
              <LI>[tx_pool].txs_expiration_time：交易过期时间，默认10分钟（600秒），要求不小于共识超时时间</LI>
            </UL>
            <CodeBlock language="ini" code={`[tx_pool]
    limit=150000
    ; transaction pool memory size limit, MB
    memory_limit=512
    ; number of threads responsible for transaction notification,
    ; default is 2, not recommended for more than 8
    notify_worker_num=2
    ; transaction expiration time, in seconds, default is 10 minute
    txs_expiration_time=600`} />

            <H4>PBFT共识配置</H4>
            <UL>
              <LI>ttl：消息最大转发次数，消息最大转发次数为ttl-1，仅对PBFT有效</LI>
              <LI>min_block_generation_time：最短打包时间，默认500ms，不可超过出空块时间1000ms</LI>
              <LI>enable_dynamic_block_size：是否开启交易数动态调整，默认true</LI>
              <LI>enable_ttl_optimization：PBFT消息转发优化策略开关，supported_version{'>'}=v2.2.0时默认true</LI>
              <LI>enable_prepare_with_txsHash：Prepare包仅包含交易哈希，supported_version{'>'}=v2.2.0时默认true</LI>
            </UL>
            <Note type="note">因协议和算法一致性要求，建议保证所有节点PBFT共识配置一致。</Note>
            <CodeBlock language="ini" code={`[consensus]
    ; the ttl for broadcasting pbft message
    ttl=2
    ; min block generation time(ms), the max block generation time is 1000 ms
    min_block_generation_time=500
    enable_dynamic_block_size=true
    enable_ttl_optimization=true
    enable_prepare_with_txsHash=true`} />

            <H4>rPBFT共识配置</H4>
            <UL>
              <LI>broadcast_prepare_by_tree：Prepare包树状广播策略，默认true</LI>
              <LI>prepare_status_broadcast_percent：Prepare状态包随机广播的节点占比，取值25-100，默认33</LI>
              <LI>max_request_prepare_waitTime：等待父节点发送Prepare包的最长时延，默认100ms</LI>
              <LI>max_request_missedTxs_waitTime：等待同步Prepare包状态的最长时延，默认100ms</LI>
            </UL>
            <CodeBlock language="ini" code={`; 默认开启Prepare包树状广播策略
broadcast_prepare_by_tree=true
; 每个节点随机选取33%共识节点同步prepare包状态
prepare_status_broadcast_percent=33
; 缺失prepare包的节点超过100ms没等到父节点转发的prepare包，会向其他节点请求
max_request_prepare_waitTime=100
; 节点等待父节点或其他非leader节点同步prepare包最长时延为100ms
max_request_missedTxs_waitTime=100`} />

            <H4>同步配置</H4>
            <UL>
              <LI>[sync].sync_block_by_tree：区块树状广播优化，supported_version{'>'}=v2.2.0时默认true</LI>
              <LI>gossip_interval_ms：gossip协议同步区块状态周期，默认1000ms（仅在开启树状广播时生效）</LI>
              <LI>gossip_peers_number：每次同步区块状态时随机选取的邻居节点数目，默认3</LI>
              <LI>[sync].send_txs_by_tree：交易树状广播，supported_version{'>'}=v2.2.0时默认true</LI>
              <LI>txs_max_gossip_peers_num：交易状态最多转发节点数目，默认5</LI>
            </UL>
            <Note type="note">因协议一致性要求，须保证所有节点sync_block_by_tree和send_txs_by_tree配置一致。</Note>
            <CodeBlock language="ini" code={`[sync]
    ; 默认开启区块树状同步策略
    sync_block_by_tree=true
    gossip_interval_ms=1000
    gossip_peers_number=3
    ; 默认开启交易树状广播策略
    send_txs_by_tree=true
    txs_max_gossip_peers_num=5`} />

            <H4>并行交易配置</H4>
            <Note type="note">v2.3.0起去除了enable_parallel配置项，storageState模式自动开启并行，mptState模式关闭并行。</Note>
            <CodeBlock language="ini" code={`[tx_execute]
    enable_parallel=true`} />

            <H4>可选配置：群组流量控制</H4>
            <P>FISCO BCOS v2.5.0引入群组级别流量控制，配置位于group.{'{group_id}'}.ini的[flow_control]，默认关闭。</P>
            <CodeBlock language="ini" code={`[flow_control]
    ; restrict QPS of the group
    limit_req=1000
    ; Mb, can be a decimal
    outgoing_bandwidth_limit=2`} />

            <H4>动态系统参数</H4>
            <P>通过控制台命令 setSystemConfigByKey / getSystemConfigByKey 修改以下参数：</P>
            <Table
              headers={['系统参数', '默认值', '含义']}
              rows={[
                ['tx_count_limit', '1000', '一个区块中可打包的最大交易数目'],
                ['tx_gas_limit', '300000000', '一个交易最大gas限制'],
                ['rpbft_epoch_sealer_num', '链共识节点总数', 'rPBFT共识周期选取参与共识的节点数目'],
                ['rpbft_epoch_block_num', '1000', 'rPBFT共识周期内出块数目'],
                ['consensus_timeout', '3', 'PBFT共识过程中区块执行的超时时间（秒），supported_version>=v2.6.0时生效'],
              ]}
            />
            <P>注意：不建议随意修改tx_count_limit和tx_gas_limit。rpbft_epoch_sealer_num和rpbft_epoch_block_num仅对rPBFT共识算法生效，不建议rpbft_epoch_block_num配置值太小。</P>
            <CodeBlock language="bash" code={`# 设置一个区块可打包最大交易数为500
[group:1]> setSystemConfigByKey tx_count_limit 500
# 查询tx_count_limit
[group:1]> getSystemConfigByKey tx_count_limit
[500]

# 设置交易gas限制为400000000
[group:1]> setSystemConfigByKey tx_gas_limit 400000000
[group:1]> getSystemConfigByKey tx_gas_limit
[400000000]

# rPBFT共识算法下，设置共识周期选取节点数目为4
[group:1]> setSystemConfigByKey rpbft_epoch_sealer_num 4
Note: rpbft_epoch_sealer_num only takes effect when rPBFT is used
{
    "code":0,
    "msg":"success"
}
[group:1]> getSystemConfigByKey rpbft_epoch_sealer_num
Note: rpbft_epoch_sealer_num only takes effect when rPBFT is used
4

# rPBFT共识算法下，设置共识周期出块数目为10000
[group:1]> setSystemConfigByKey rpbft_epoch_block_num 10000
Note: rpbft_epoch_block_num only takes effect when rPBFT is used
{
    "code":0,
    "msg":"success"
}
[group:1]> getSystemConfigByKey rpbft_epoch_block_num
Note: rpbft_epoch_block_num only takes effect when rPBFT is used
10000

# 获取/设置区块执行超时时间
[group:1]> getSystemConfigByKey consensus_timeout
3
[group:1]> setSystemConfigByKey consensus_timeout 5
{
    "code":0,
    "msg":"success"
}`} />
          </CollapsibleSection>

          {/* ── 组员配置 ── */}
          <CollapsibleSection id="node-management" title="组员配置" defaultOpen={true}>
            <P>FISCO BCOS引入了三种节点类型，可通过控制台相互转换：</P>
            <UL>
              <LI>共识节点（组员）：参与共识的节点，拥有群组的所有数据（搭链时默认都生成共识节点）</LI>
              <LI>观察者节点（组员）：不参与共识，但能实时同步链上数据的节点</LI>
              <LI>游离节点（非组员）：已启动，待等待加入群组的节点，不能获取链上的数据</LI>
            </UL>

            <H3>操作命令</H3>
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

            <H3>操作案例</H3>
            <P>扩容操作分两个阶段：将节点加入网络、将节点加入群组。退网操作分两个阶段：将节点退出群组、将节点退出网络。</P>
            <P>操作方式：</P>
            <UL>
              <LI>修改节点配置：节点修改自身配置后重启生效，涉及操作项目包括网络的加入/退出、CA黑名单的列入/移除</LI>
              <LI>交易共识上链：节点发送上链交易修改需群组共识的配置项，涉及操作项目包括节点类型的修改</LI>
              <LI>RPC查询：使用curl命令查询链上信息，涉及操作项目包括群组节点的查询</LI>
            </UL>
            <P>Group3节点信息：节点1（node0，127.0.0.1:30400，nodeID前缀b231b309）、节点2（node1，127.0.0.1:30401，前缀aab37e73）、节点3（node2，127.0.0.1:30402，前缀d6b01a96）。</P>

            <H3>A节点加入网络</H3>
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

            <H3>A节点退出网络</H3>
            <P>场景描述：节点3已在网络中，与节点1和节点2通信，现在退出网络。</P>
            <P>操作步骤：</P>
            <P>1. 对于节点3，将自身的P2P节点连接列表内容清空，重启节点3：</P>
            <CodeBlock language="bash" code={`$ ./stop.sh
$ ./start.sh
nohup: appending output to 'nohup.out'`} />
            <P>2. 对于节点1和2，将节点3从自身的P2P节点连接列表中移除（如有），重启节点1和2。</P>
            <P>3. 确认节点3与节点1（和2）的原有连接已经断开，退出网络操作完成。</P>
            <Note type="warning">节点3需先退出群组再退出网络，退出顺序由用户保证，系统不再作校验。若启用了白名单，需将退出节点从所有节点的config.ini的白名单配置中删除，并正确地将新的白名单配置刷入节点中。</Note>

            <H3>A节点加入群组</H3>
            <P>场景描述：群组Group3原有节点1和节点2，两节点轮流出块，现在将节点3加入群组。</P>
            <P>操作步骤：</P>
            <UL>
              <LI>节点3加入网络</LI>
              <LI>使用控制台addSealer根据节点3的nodeID设置节点3为共识节点</LI>
              <LI>使用控制台getSealerList查询group3的共识节点中是否包含节点3的nodeID，如存在则操作完成</LI>
            </UL>
            <Note type="note">节点3的NodeID可使用 cat nodes/127.0.0.1/node2/conf/node.nodeid 获取。节点3需先完成网络准入后，再执行加入群组的操作，系统将校验操作顺序。节点3的群组固定配置文件需与节点1和2的一致。</Note>

            <H3>A节点退出群组</H3>
            <P>场景描述：群组Group3原有节点1、节点2和节点3，三节点轮流出块，现在将节点3退出群组。</P>
            <P>操作步骤：</P>
            <UL>
              <LI>使用控制台removeNode根据节点3的NodeID设置节点3为游离节点</LI>
              <LI>使用控制台getSealerList查询group3的共识节点中是否包含节点3的nodeID，如已消失则操作完成</LI>
            </UL>
          </CollapsibleSection>

          {/* ── 配置CA黑白名单 ── */}
          <CollapsibleSection id="cert-list" title="配置CA黑白名单" defaultOpen={true}>
            <P>本文档描述CA黑、白名单的实践操作。通过配置CA黑白名单，可以控制节点的连接权限，实现节点间连接的精细化管理。</P>

            <H3>黑名单</H3>
            <P>通过配置黑名单，能够拒绝与指定的节点连接。</P>
            <P>配置方法，编辑config.ini：</P>
            <CodeBlock language="ini" code={`[certificate_blacklist]
    ; crl.0 should be nodeid, nodeid's length is 128
    ;crl.0=`} />
            <P>重启节点生效：</P>
            <CodeBlock language="bash" code={`$ bash stop.sh && bash start.sh`} />
            <P>查看节点连接：</P>
            <CodeBlock language="bash" code={`$ curl -X POST --data '{"jsonrpc":"2.0","method":"getPeers","params":[1],"id":1}' http://127.0.0.1:8545 |jq`} />

            <H3>白名单</H3>
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

            <H3>使用场景：公共CA</H3>
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

            <H3>黑白名单操作举例</H3>

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
          </CollapsibleSection>

          {/* ── 存储加密 ── */}
          <CollapsibleSection id="storage-enc" title="存储加密" defaultOpen={true}>
            <P>联盟链的数据，只对联盟内部成员可见。落盘加密，保证了运行联盟链的数据，在硬盘上的安全性。一旦硬盘脱离联盟链内网环境，数据将无法被解密。落盘加密对节点存储在硬盘上的内容进行加密，加密内容包括：合约数据以及节点私钥文件。</P>
            <Note type="warning">若节点是SM2版本，Key Manager也必须是SM2版本。节点必须在首次运行前完成落盘加密配置，一旦节点开始运行则无法切换加密状态。</Note>

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

            <H3>第五步. 加密节点私钥</H3>
            <Note type="tip">若使用内置HSM密钥，可跳过此步骤。</Note>
            <CodeBlock language="bash" code={`cd key-manager/scripts
bash encrypt_node_key.sh 127.0.0.1 8150 ../../nodes/127.0.0.1/node0/conf/node.key ed157f4588b86d61a2e1745efe71e6ea`} />
            <P>加密成功输出：</P>
            <CodeBlock language="bash" code={`[INFO] File backup to "nodes/127.0.0.1/node0/conf/node.key.bak.1546502474"
[INFO] "nodes/127.0.0.1/node0/conf/node.key" encrypted!`} />
            <Note type="warning">需要加密的文件：非SM2版本为conf/node.key；SM2版本为conf/gmnode.key和conf/origin_cert/node.key。未加密将导致节点无法启动。</Note>

            <H3>第六步. 节点运行</H3>
            <CodeBlock language="bash" code={`cd nodes/127.0.0.1/node0/
./start.sh`} />

            <H3>第七步. 正确性判断</H3>
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

            <H3>权限操作表格</H3>
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

            <H3>操作内容</H3>
            <UL>
              <LI>授权账户为链管理员：使用grantPermissionManager命令</LI>
              <LI>授权部署合约和创建用户表：使用grantDeployAndCreateManager命令</LI>
              <LI>授权利用CNS部署合约：使用grantCNSManager命令</LI>
              <LI>授权管理节点：使用grantNodeManager命令</LI>
              <LI>授权修改系统参数：使用grantSysConfigManager命令</LI>
              <LI>授权账户写用户表：使用grantUserTableManager命令</LI>
            </UL>

            <H3>环境配置</H3>
            <P>配置并启动FISCO BCOS 2.0区块链节点和控制台，请参考安装文档。</P>

            <H3>权限控制工具</H3>
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
            <Table
              headers={['命令', '说明']}
              rows={[
                ['deployByCNS', '利用CNS部署合约，需要部署合约和CNS权限'],
                ['callByCNS', '利用CNS调用合约，不受权限控制'],
                ['queryCNS', '查询CNS信息，不受权限控制'],
              ]}
            />
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
            <Table
              headers={['命令', '说明']}
              rows={[
                ['addSealer', '将节点设置为共识节点，需要节点管理权限'],
                ['addObserver', '将节点设置为观察者节点，需要节点管理权限'],
                ['removeNode', '将节点设置为游离节点，需要节点管理权限'],
              ]}
            />
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
            <Table
              headers={['命令', '说明']}
              rows={[
                ['setSystemConfigByKey', '修改系统参数，需要系统参数管理权限'],
                ['getSystemConfigByKey', '查询系统参数，不受权限控制'],
              ]}
            />
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

          {/* ── 设置SDK白名单 ── */}
          <CollapsibleSection id="sdk-allowlist" title="设置SDK白名单" defaultOpen={true}>
            <P>为了实现sdk到群组的访问控制，FISCO BCOS v2.6.0引入了群组级的SDK白名单访问控制机制，配置位于group.{'{group_id}'}.ini的[sdk_allowlist]，默认关闭。</P>
            <Note type="warning">FISCO BCOS v2.6.0默认关闭SDK到群组的白名单访问控制功能，即默认情况下sdk与所有群组均可通信。若要开启sdk与群组间基于白名单的访问控制功能，需要将;public_key.0等配置项前面的分号去掉。</Note>

            <H3>配置方法</H3>
            <P>在group.{'{group_id}'}.ini的[sdk_allowlist]中配置允许与该群组进行通信的SDK公钥列表：</P>
            <UL>
              <LI>public_key.0、public_key.1、…、public_key.i：配置允许与该群组进行通信的SDK公钥列表</LI>
            </UL>
            <CodeBlock language="ini" code={`[sdk_allowlist]
; When sdk_allowlist is empty, all SDKs can connect to this node
; when sdk_allowlist is not empty, only the SDK in the allowlist can connect to this node
; public_key.0 should be nodeid, nodeid's length is 128
public_key.0=b8acb51b9fe84f88d670646be36f31c52e67544ce56faf3dc8ea4cf1b0ebff0864c6b218fdcd9cf9891ebd414a995847911bd26a770f429300085f3`} />

            <H3>使用说明</H3>
            <UL>
              <LI>当[sdk_allowlist]为空时，所有SDK均可连接到该节点的该群组</LI>
              <LI>当[sdk_allowlist]不为空时，只有白名单中的SDK才可连接到该节点的该群组</LI>
              <LI>需要将SDK的公钥（NodeID格式，长度128字符）配置到白名单中</LI>
              <LI>此配置支持热加载，修改配置后无需重启节点即可生效</LI>
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
