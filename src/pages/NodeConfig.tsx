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

export default function NodeConfig() {
  const navigate = useNavigate();
  const [activeId, setActiveId] = useState('config-ini');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => { entries.forEach(e => { if (e.isIntersecting) setActiveId(e.target.id); }); },
      { rootMargin: '-20% 0px -70% 0px' }
    );
    ['config-ini', 'config-group', 'config-mutable'].forEach(id => { const el = document.getElementById(id); if (el) observer.observe(el); });
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
          <span className="text-xs font-black uppercase tracking-widest text-white">节点配置</span>
        </div>
        <button className="md:hidden ml-auto text-white" onClick={() => setSidebarOpen(!sidebarOpen)}>
          {sidebarOpen ? <X size={18} /> : <Menu size={18} />}
        </button>
      </header>

      <div className="pt-14 flex">
        <DocsSidebar activePage="node-config" activeId={activeId} scrollTo={scrollTo} sidebarOpen={sidebarOpen} />

        <main className="flex-1 min-w-0 px-6 md:px-12 lg:px-16 py-10 max-w-4xl">
          {/* breadcrumb */}
          <div className="flex flex-wrap items-center gap-2 text-brand-primary text-xs font-bold uppercase tracking-widest mb-3">
            <span>配置管理</span><span className="text-white/20">·</span>
            <span>节点配置</span>
          </div>
          <h1 className="text-3xl font-black text-white tracking-tight mb-6">节点配置</h1>

          <P>FISCO BCOS支持多账本，每条链包括多个独立账本，账本间数据相互隔离，群组间交易处理相互隔离。每个节点包括：</P>
          <UL>
            <LI>config.ini：主配置文件，配置RPC、P2P、SSL证书、账本配置文件路径、兼容性等信息</LI>
            <LI>group.group_id.genesis：群组配置文件，群组内所有节点一致，节点启动后不可手动更改。主要包括群组共识算法、存储类型、最大gas限制等</LI>
            <LI>group.group_id.ini：群组可变配置文件，包括交易池大小等，配置后重启节点生效</LI>
          </UL>

          <CollapsibleSection id="config-ini" title="主配置文件config.ini">
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
          </CollapsibleSection>

          <CollapsibleSection id="config-group" title="群组系统配置说明">
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
          </CollapsibleSection>

          <CollapsibleSection id="config-mutable" title="账本可变配置说明">
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

          <div className="mt-16 pt-8 border-t border-white/5 text-slate-600 text-xs space-y-2">
            <p>© Copyright DeSpace 2019. 本技术文档适用于DeSpace 2.x版本。</p>
            <p>Built with Sphinx using a theme provided by Read the Docs.</p>
          </div>
        </main>
      </div>
    </div>
  );
}
