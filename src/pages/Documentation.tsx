import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ChevronRight,
  Database,
  ArrowLeft,
  Menu,
  X,
  Copy,
  Check,
  BookOpen,
  Layers,
  Package,
  Play,
  Settings,
  AlertCircle,
  CheckCircle,
  Zap,
  Shield,
  GitBranch,
  FileCode,
} from 'lucide-react';

const CodeBlock = ({ code, language = 'bash' }: { code: string; language?: string }) => {
  const [copied, setCopied] = useState(false);
  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <div className="relative group my-4 rounded-sm overflow-hidden border border-white/10">
      <div className="flex items-center justify-between px-4 py-2 bg-white/5 border-b border-white/10">
        <span className="text-[10px] font-mono text-brand-primary/70 uppercase tracking-widest">{language}</span>
        <button onClick={handleCopy} className="flex items-center gap-1.5 text-[10px] text-slate-500 hover:text-white transition-colors">
          {copied ? <Check size={12} className="text-brand-accent" /> : <Copy size={12} />}
          {copied ? 'COPIED' : 'COPY'}
        </button>
      </div>
      <pre className="p-4 overflow-x-auto text-sm font-mono text-slate-300 bg-[#010d1a] leading-relaxed"><code>{code}</code></pre>
    </div>
  );
};

const Callout = ({ type = 'info', children }: { type?: 'info' | 'warning' | 'success'; children: React.ReactNode }) => {
  const styles = {
    info:    { border: 'border-brand-primary/40', bg: 'bg-brand-primary/5',  icon: <AlertCircle  size={16} className="text-brand-primary mt-0.5 shrink-0" /> },
    warning: { border: 'border-yellow-500/40',    bg: 'bg-yellow-500/5',     icon: <AlertCircle  size={16} className="text-yellow-400 mt-0.5 shrink-0" /> },
    success: { border: 'border-brand-accent/40',  bg: 'bg-brand-accent/5',   icon: <CheckCircle  size={16} className="text-brand-accent mt-0.5 shrink-0" /> },
  };
  const s = styles[type];
  return (
    <div className={`flex gap-3 p-4 rounded-sm border ${s.border} ${s.bg} my-4`}>
      {s.icon}
      <div className="text-sm text-slate-300 leading-relaxed">{children}</div>
    </div>
  );
};

const H2 = ({ id, children }: { id: string; children: React.ReactNode }) => (
  <h2 id={id} className="text-2xl font-black text-white tracking-tight mt-12 mb-4 scroll-mt-24 flex items-center gap-3">
    <span className="w-1 h-6 bg-brand-primary rounded-full inline-block" />
    {children}
  </h2>
);

const H3 = ({ children }: { children: React.ReactNode }) => (
  <h3 className="text-base font-bold text-white/90 mt-8 mb-3 uppercase tracking-widest text-xs border-b border-white/5 pb-2">{children}</h3>
);

const navSections = [
  { label: '入门指南',  icon: <BookOpen size={14} />, items: [{ id: 'overview', label: '项目概述' }, { id: 'requirements', label: '环境要求' }, { id: 'quickstart', label: '快速开始' }] },
  { label: '合约开发',  icon: <FileCode  size={14} />, items: [{ id: 'contract-design', label: '存储与接口设计' }, { id: 'contract-code', label: '编写智能合约' }, { id: 'contract-compile', label: '编译与部署' }] },
  { label: 'SDK 集成',  icon: <Package  size={14} />, items: [{ id: 'sdk-install', label: '安装 DSC SDK' }, { id: 'sdk-config', label: '节点配置' }, { id: 'sdk-connect', label: '建立连接' }] },
  { label: '应用开发',  icon: <Layers   size={14} />, items: [{ id: 'app-init', label: '初始化项目' }, { id: 'app-deploy', label: '部署合约' }, { id: 'app-invoke', label: '调用合约方法' }, { id: 'app-event', label: '监听事件' }] },
  { label: '运行与测试', icon: <Play    size={14} />, items: [{ id: 'run-build', label: '构建与运行' }, { id: 'run-test', label: '功能测试' }, { id: 'run-debug', label: '调试技巧' }] },
  { label: '高级配置',  icon: <Settings size={14} />, items: [{ id: 'advanced-consensus', label: 'PBFT 共识配置' }, { id: 'advanced-permission', label: '权限管理' }, { id: 'advanced-privacy', label: '隐私计算接入' }] },
];

export default function Documentation() {
  const navigate = useNavigate();
  const [activeId, setActiveId] = useState('overview');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => { entries.forEach((e) => { if (e.isIntersecting) setActiveId(e.target.id); }); },
      { rootMargin: '-20% 0px -70% 0px' }
    );
    document.querySelectorAll('[id]').forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    setSidebarOpen(false);
  };

  return (
    <div className="min-h-screen bg-[#020c18] text-white font-sans selection:bg-brand-primary selection:text-brand-secondary">
      {/* Top bar */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-[#020c18]/90 backdrop-blur-md border-b border-white/5 h-14 flex items-center px-6 gap-4">
        <button onClick={() => navigate('/')} className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors text-xs font-bold uppercase tracking-widest">
          <ArrowLeft size={14} /> 返回官网
        </button>
        <span className="text-white/10">|</span>
        <div className="flex items-center gap-2">
          <Database size={14} className="text-brand-primary" />
          <span className="text-xs font-black uppercase tracking-widest text-white">DSC 开发者文档</span>
        </div>
        <div className="ml-auto flex items-center gap-2">
          <span className="hidden sm:inline text-[10px] text-brand-accent font-mono">v2.1.0</span>
          <button className="md:hidden text-white" onClick={() => setSidebarOpen(!sidebarOpen)}>
            {sidebarOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </header>

      <div className="pt-14 flex">
        {/* Sidebar */}
        <aside className={`fixed md:sticky top-14 z-40 h-[calc(100vh-3.5rem)] w-64 bg-[#020c18] md:bg-transparent border-r border-white/5 overflow-y-auto transition-transform duration-300 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}>
          <nav className="p-4 space-y-6">
            {navSections.map((section) => (
              <div key={section.label}>
                <div className="flex items-center gap-2 text-brand-primary/60 text-[10px] font-bold uppercase tracking-[0.2em] mb-2">
                  {section.icon}{section.label}
                </div>
                <ul className="space-y-0.5">
                  {section.items.map((item) => (
                    <li key={item.id}>
                      <button onClick={() => scrollTo(item.id)} className={`w-full text-left px-3 py-1.5 rounded-sm text-xs transition-all ${activeId === item.id ? 'bg-brand-primary/10 text-brand-primary font-bold border-l-2 border-brand-primary' : 'text-slate-500 hover:text-white hover:bg-white/5'}`}>
                        {item.label}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>
        </aside>

        {/* Main */}
        <main className="flex-1 min-w-0 px-6 md:px-12 lg:px-16 py-10 max-w-4xl mx-auto">

          {/* 项目概述 */}
          <H2 id="overview">项目概述</H2>
          <p className="text-slate-400 leading-relaxed mb-4">本文档基于 <strong className="text-white">DeSpace Smart Chain（DSC）</strong> 讲解如何从零构建完整区块链应用。以<strong className="text-white">资产管理</strong>为实战场景，涵盖：</p>
          <ul className="space-y-2 text-slate-400 text-sm mb-6">
            {['链上资产注册', '账户间资产转移', '余额查询与审计', '事件监听与实时推送'].map((t) => (
              <li key={t} className="flex items-center gap-2"><ChevronRight size={12} className="text-brand-primary shrink-0" />{t}</li>
            ))}
          </ul>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 my-6">
            {[{ icon: <Zap size={16} />, title: 'TPS 20,000+', desc: '高性能 PBFT 共识' }, { icon: <Shield size={16} />, title: '国密算法', desc: 'SM2/SM3/SM4 内置支持' }, { icon: <GitBranch size={16} />, title: '多链并行', desc: '群组隔离，按需扩展' }].map((c) => (
              <div key={c.title} className="border border-white/10 rounded-sm p-4 bg-white/2 hover:border-brand-primary/40 transition-colors">
                <div className="text-brand-primary mb-2">{c.icon}</div>
                <div className="text-white font-bold text-sm">{c.title}</div>
                <div className="text-slate-500 text-xs mt-1">{c.desc}</div>
              </div>
            ))}
          </div>

          {/* 环境要求 */}
          <H2 id="requirements">环境要求</H2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse my-4">
              <thead>
                <tr className="border-b border-white/10 text-left">
                  {['依赖项', '版本要求', '说明'].map((h) => <th key={h} className="py-2 pr-8 text-[10px] uppercase tracking-widest text-slate-500 font-bold">{h}</th>)}
                </tr>
              </thead>
              <tbody className="text-slate-400">
                {[['Node.js', '>= 18.0.0', '推荐使用 LTS 版本'], ['npm / yarn', '>= 8.0 / 1.22', '包管理器'], ['DSC 节点', '>= 2.1.0', '本地或远程节点'], ['Solidity', '^0.8.0', '智能合约编译器'], ['Git', '任意版本', '代码版本管理']].map(([dep, ver, note]) => (
                  <tr key={dep} className="border-b border-white/5 hover:bg-white/2">
                    <td className="py-2.5 pr-8 font-mono text-white">{dep}</td>
                    <td className="py-2.5 pr-8 text-brand-accent font-mono">{ver}</td>
                    <td className="py-2.5 text-slate-500">{note}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* 快速开始 */}
          <H2 id="quickstart">快速开始</H2>
          <p className="text-slate-400 text-sm mb-3">克隆官方脚手架，三步运行第一个 DSC 应用：</p>
          <CodeBlock language="bash" code={`# 克隆脚手架
git clone https://github.com/despace-chain/dsc-starter-kit.git
cd dsc-starter-kit

# 安装依赖
npm install

# 启动本地开发节点（内置单节点 DSC 测试链）
npm run node`} />
          <Callout type="success">本地节点启动后默认监听 <code className="font-mono text-brand-primary">http://127.0.0.1:8545</code>，链 ID 为 <code className="font-mono text-brand-primary">3388</code>。</Callout>

          {/* 合约设计 */}
          <H2 id="contract-design">存储与接口设计</H2>
          <p className="text-slate-400 text-sm mb-4">以资产管理合约为例，链上维护资产表 <code className="font-mono text-brand-primary">t_asset</code>，包含以下字段：</p>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse my-4">
              <thead>
                <tr className="border-b border-white/10 text-left">
                  {['字段', '类型', '说明'].map((h) => <th key={h} className="py-2 pr-8 text-[10px] uppercase tracking-widest text-slate-500 font-bold">{h}</th>)}
                </tr>
              </thead>
              <tbody className="text-slate-400">
                {[['account', 'address', '账户地址（主键）'], ['asset_value', 'uint256', '资产余额'], ['created_at', 'uint256', '注册时间戳']].map(([f, t, d]) => (
                  <tr key={f} className="border-b border-white/5 hover:bg-white/2">
                    <td className="py-2.5 pr-8 font-mono text-brand-primary">{f}</td>
                    <td className="py-2.5 pr-8 font-mono text-slate-300">{t}</td>
                    <td className="py-2.5 text-slate-500">{d}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <H3>核心接口</H3>
          <ul className="space-y-3 text-sm text-slate-400">
            {[['register(address, uint256)', '注册新账户并设置初始余额'], ['transfer(address, address, uint256)', '账户间资产转移'], ['select(address)', '查询指定账户余额']].map(([name, desc]) => (
              <li key={name} className="flex gap-3 items-start">
                <code className="font-mono text-brand-accent text-xs shrink-0 mt-0.5">{name}</code>
                <span>— {desc}</span>
              </li>
            ))}
          </ul>

          {/* 编写合约 */}
          <H2 id="contract-code">编写智能合约</H2>
          <p className="text-slate-400 text-sm mb-3">在 <code className="font-mono text-brand-primary">contracts/</code> 目录创建 <code className="font-mono text-brand-primary">Asset.sol</code>：</p>
          <CodeBlock language="solidity" code={`// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

/**
 * @title Asset
 * @notice DSC 链上资产管理合约
 */
contract Asset {
    struct AssetRecord {
        uint256 value;
        uint256 createdAt;
        bool exists;
    }

    mapping(address => AssetRecord) private _assets;

    event AssetRegistered(address indexed account, uint256 value, uint256 timestamp);
    event AssetTransferred(address indexed from, address indexed to, uint256 amount, uint256 timestamp);

    error AccountAlreadyExists(address account);
    error AccountNotFound(address account);
    error InsufficientBalance(uint256 have, uint256 want);
    error InvalidAmount();

    /// @notice 注册账户并设置初始余额
    function register(address account, uint256 initValue) external {
        if (_assets[account].exists) revert AccountAlreadyExists(account);
        _assets[account] = AssetRecord(initValue, block.timestamp, true);
        emit AssetRegistered(account, initValue, block.timestamp);
    }

    /// @notice 转移资产
    function transfer(address from, address to, uint256 amount) external {
        if (amount == 0) revert InvalidAmount();
        if (!_assets[from].exists) revert AccountNotFound(from);
        if (!_assets[to].exists)   revert AccountNotFound(to);
        if (_assets[from].value < amount)
            revert InsufficientBalance(_assets[from].value, amount);

        _assets[from].value -= amount;
        _assets[to].value   += amount;
        emit AssetTransferred(from, to, amount, block.timestamp);
    }

    /// @notice 查询账户余额
    function select(address account)
        external view
        returns (uint256 value, bool exists)
    {
        AssetRecord storage r = _assets[account];
        return (r.value, r.exists);
    }
}`} />

          {/* 编译与部署 */}
          <H2 id="contract-compile">编译与部署</H2>
          <H3>编译合约</H3>
          <CodeBlock language="bash" code={`# 编译（输出 ABI + Bytecode）
npm run compile

# 产物目录
artifacts/
  contracts/
    Asset.sol/
      Asset.json       # ABI + bytecode
      Asset.dbg.json   # 调试信息`} />
          <H3>部署到本地测试网</H3>
          <CodeBlock language="javascript" code={`// scripts/deploy.js
const { ethers } = require('hardhat');

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log('部署账户:', deployer.address);

  const Asset = await ethers.getContractFactory('Asset');
  const asset = await Asset.deploy();
  await asset.waitForDeployment();

  console.log('Asset 合约地址:', await asset.getAddress());
}

main().catch((err) => { console.error(err); process.exit(1); });`} />
          <CodeBlock language="bash" code={`npx hardhat run scripts/deploy.js --network dsc_local

# 部署账户: 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266
# Asset 合约地址: 0x5FbDB2315678afecb367f032d93F642f64180aa3`} />

          {/* SDK 安装 */}
          <H2 id="sdk-install">安装 DSC SDK</H2>
          <CodeBlock language="bash" code={`npm install @despace-chain/sdk ethers@6`} />
          <Callout type="info">DSC SDK 基于 ethers.js v6 封装，提供国密算法、群组多链、隐私合约等扩展能力。</Callout>
          <H3>SDK 主要模块</H3>
          <ul className="space-y-2 text-slate-400 text-sm mb-4">
            {[['DscProvider', '节点连接与 RPC 封装'], ['DscWallet', '密钥管理，支持 SM2 / secp256k1'], ['DscContract', '合约 ABI 交互封装'], ['GroupManager', '群组（多链）管理'], ['PrivacyContract', '隐私合约调用接口']].map(([mod, desc]) => (
              <li key={mod} className="flex gap-3">
                <code className="font-mono text-brand-primary text-xs shrink-0">{mod}</code>
                <span>— {desc}</span>
              </li>
            ))}
          </ul>

          {/* 节点配置 */}
          <H2 id="sdk-config">节点配置</H2>
          <p className="text-slate-400 text-sm mb-3">在项目根目录创建 <code className="font-mono text-brand-primary">dsc.config.js</code>：</p>
          <CodeBlock language="javascript" code={`// dsc.config.js
module.exports = {
  networks: {
    dsc_local: {
      url: 'http://127.0.0.1:8545',
      chainId: 3388,
      groupId: 1,
    },
    dsc_testnet: {
      url: 'https://testnet-rpc.despace.io',
      chainId: 3389,
      groupId: 1,
      accounts: [process.env.PRIVATE_KEY],
    },
    dsc_mainnet: {
      url: 'https://mainnet-rpc.despace.io',
      chainId: 3390,
      groupId: 1,
      accounts: [process.env.PRIVATE_KEY],
    },
  },
  tls: {
    ca:   './conf/ca.crt',
    cert: './conf/sdk.crt',
    key:  './conf/sdk.key',
  },
  solidity: {
    version: '0.8.20',
    settings: { optimizer: { enabled: true, runs: 200 } },
  },
};`} />
          <Callout type="warning">生产节点连接时，请将 TLS 证书存放于 <code className="font-mono">conf/</code> 目录，私钥通过环境变量 <code className="font-mono">PRIVATE_KEY</code> 注入，切勿硬编码。</Callout>

          {/* 建立连接 */}
          <H2 id="sdk-connect">建立连接</H2>
          <CodeBlock language="javascript" code={`import { DscProvider, DscWallet } from '@despace-chain/sdk';

const provider = new DscProvider('http://127.0.0.1:8545', {
  chainId: 3388,
  groupId: 1,
});

const wallet = DscWallet.fromMnemonic(process.env.MNEMONIC).connect(provider);

const blockNumber = await provider.getBlockNumber();
const balance     = await provider.getBalance(wallet.address);
console.log('当前区块:', blockNumber);
console.log('账户余额:', balance.toString());`} />

          {/* 初始化项目 */}
          <H2 id="app-init">初始化项目</H2>
          <CodeBlock language="bash" code={`dsc-asset-app/
├── contracts/
│   └── Asset.sol          # 智能合约
├── scripts/
│   ├── deploy.js          # 部署脚本
│   └── interact.js        # 交互脚本
├── src/
│   ├── assetClient.js     # 核心业务逻辑
│   └── index.js           # 入口
├── conf/
│   ├── ca.crt             # CA 证书
│   ├── sdk.crt            # SDK 证书
│   └── sdk.key            # SDK 私钥
├── contract.properties    # 已部署合约地址
├── dsc.config.js
└── package.json`} />

          {/* 部署合约 */}
          <H2 id="app-deploy">部署合约</H2>
          <CodeBlock language="javascript" code={`// src/assetClient.js
import { DscProvider, DscWallet, DscContract } from '@despace-chain/sdk';
import { readFileSync, writeFileSync } from 'fs';
import AssetArtifact from '../artifacts/contracts/Asset.sol/Asset.json';

export class AssetClient {
  constructor(rpcUrl, privateKey) {
    this.provider = new DscProvider(rpcUrl, { chainId: 3388, groupId: 1 });
    this.wallet   = new DscWallet(privateKey, this.provider);
    this.contract = null;
  }

  async deploy() {
    const factory  = new DscContract.Factory(
      AssetArtifact.abi, AssetArtifact.bytecode, this.wallet
    );
    const contract = await factory.deploy();
    await contract.waitForDeployment();

    const address = await contract.getAddress();
    writeFileSync('contract.properties', \`address=\${address}\n\`);
    console.log('合约已部署:', address);
    this.contract = contract;
    return address;
  }

  async load() {
    const props   = readFileSync('contract.properties', 'utf-8');
    const address = props.match(/address=(.+)/)?.[1]?.trim();
    if (!address) throw new Error('未找到合约地址');
    this.contract = new DscContract(address, AssetArtifact.abi, this.wallet);
    console.log('已加载合约:', address);
  }
}`} />

          {/* 调用合约 */}
          <H2 id="app-invoke">调用合约方法</H2>
          <H3>注册账户</H3>
          <CodeBlock language="javascript" code={`async register(account, initValue) {
  const tx      = await this.contract.register(account, initValue);
  const receipt = await tx.wait();
  if (receipt.status !== 1) throw new Error('注册失败');
  console.log(\`账户 \${account} 注册成功，初始余额: \${initValue}\`);
  return receipt;
}`} />
          <H3>资产转移</H3>
          <CodeBlock language="javascript" code={`async transfer(from, to, amount) {
  const [balance] = await this.contract.select(from);
  if (balance < amount)
    throw new Error(\`余额不足: 当前 \${balance}，需要 \${amount}\`);

  const tx      = await this.contract.transfer(from, to, amount);
  const receipt = await tx.wait();
  console.log(\`转移成功: \${from} → \${to}, 数量: \${amount}\`);
  console.log('交易哈希:', receipt.hash);
  return receipt;
}`} />
          <H3>查询余额</H3>
          <CodeBlock language="javascript" code={`async query(account) {
  const [value, exists] = await this.contract.select(account);
  if (!exists) { console.log(\`账户 \${account} 不存在\`); return null; }
  console.log(\`账户 \${account} 余额: \${value.toString()}\`);
  return value;
}`} />

          {/* 监听事件 */}
          <H2 id="app-event">监听链上事件</H2>
          <CodeBlock language="javascript" code={`// 实时监听
this.contract.on('AssetTransferred', (from, to, amount, timestamp, event) => {
  console.log('新转账 |', from, '->', to, '| 金额:', amount.toString());
  console.log('区块:', event.log.blockNumber);
});

// 查询历史事件
async getTransferHistory() {
  const filter = this.contract.filters.AssetTransferred();
  const events = await this.contract.queryFilter(filter, 'earliest', 'latest');
  return events.map(e => ({
    from:      e.args.from,
    to:        e.args.to,
    amount:    e.args.amount.toString(),
    timestamp: new Date(Number(e.args.timestamp) * 1000).toISOString(),
    txHash:    e.transactionHash,
  }));
}`} />

          {/* 构建运行 */}
          <H2 id="run-build">构建与运行</H2>
          <CodeBlock language="bash" code={`# 构建
npm run build

# 部署合约
node dist/index.js deploy

# 注册账户
node dist/index.js register 0xABCD...1234 1000000

# 查询余额
node dist/index.js query 0xABCD...1234

# 转移资产
node dist/index.js transfer 0xABCD...1234 0xDEAD...5678 500000`} />

          {/* 功能测试 */}
          <H2 id="run-test">功能测试</H2>
          <CodeBlock language="javascript" code={`// test/asset.test.js
const { expect } = require('chai');
const { ethers } = require('hardhat');

describe('Asset 合约测试', () => {
  let asset, alice, bob;

  beforeEach(async () => {
    [, alice, bob] = await ethers.getSigners();
    const Asset = await ethers.getContractFactory('Asset');
    asset = await Asset.deploy();
  });

  it('应成功注册账户', async () => {
    await asset.register(alice.address, 1000);
    const [value, exists] = await asset.select(alice.address);
    expect(exists).to.be.true;
    expect(value).to.equal(1000n);
  });

  it('应成功转移资产', async () => {
    await asset.register(alice.address, 1000);
    await asset.register(bob.address, 0);
    await asset.transfer(alice.address, bob.address, 400);
    const [aliceBal] = await asset.select(alice.address);
    const [bobBal]   = await asset.select(bob.address);
    expect(aliceBal).to.equal(600n);
    expect(bobBal).to.equal(400n);
  });

  it('余额不足时应回滚', async () => {
    await asset.register(alice.address, 100);
    await asset.register(bob.address, 0);
    await expect(
      asset.transfer(alice.address, bob.address, 9999)
    ).to.be.revertedWithCustomError(asset, 'InsufficientBalance');
  });
});`} />
          <CodeBlock language="bash" code={`npx hardhat test

#   Asset 合约测试
#     ✔ 应成功注册账户 (45ms)
#     ✔ 应成功转移资产 (38ms)
#     ✔ 余额不足时应回滚 (22ms)
#
#   3 passing (1s)`} />

          {/* 调试技巧 */}
          <H2 id="run-debug">调试技巧</H2>
          <CodeBlock language="javascript" code={`const provider = new DscProvider(rpcUrl, {
  chainId: 3388,
  debug: true,           // 打印所有 RPC 请求
  pollingInterval: 500,  // 事件轮询间隔（ms）
});

// 解码交易回滚原因
try {
  await contract.transfer(from, to, amount);
} catch (err) {
  if (err.data) {
    const decoded = contract.interface.parseError(err.data);
    console.error('合约错误:', decoded?.name, decoded?.args);
  }
}`} />

          {/* PBFT */}
          <H2 id="advanced-consensus">PBFT 共识配置</H2>
          <CodeBlock language="javascript" code={`import { GroupManager } from '@despace-chain/sdk';

const gm = new GroupManager(provider);

// 查看共识节点列表
const sealers = await gm.getSealerList();

// 添加共识节点（需管理员权限）
await gm.addSealer('0xNodePublicKey...');

// 降级为观察者节点
await gm.addObserver('0xNodePublicKey...');`} />

          {/* 权限管理 */}
          <H2 id="advanced-permission">权限管理</H2>
          <CodeBlock language="javascript" code={`import { PermissionManager } from '@despace-chain/sdk';

const pm = new PermissionManager(provider, adminWallet);

// 授予合约部署权限
await pm.grantDeployAuth(targetAddress);

// 授予合约写入权限
await pm.grantContractWriteAuth(targetAddress, contractAddress);

// 查询权限列表
const perms = await pm.getPermissions(targetAddress);`} />

          {/* 隐私计算 */}
          <H2 id="advanced-privacy">隐私计算接入</H2>
          <Callout type="info">DSC 内置 WeDPR 隐私计算引擎，支持零知识证明（ZKP）和同态加密，适用于金融、医疗等敏感场景。</Callout>
          <CodeBlock language="javascript" code={`import { PrivacyContract } from '@despace-chain/sdk';

const pc = new PrivacyContract(abi, bytecode, wallet, {
  privacyMode: 'zkp',  // 'zkp' | 'homomorphic' | 'mpc'
});

const deployed = await pc.deploy();

// 隐私转账（金额对外不可见）
await deployed.privateTransfer(recipientAddress, encryptedAmount, proof);

// 验证零知识证明
const valid = await deployed.verifyProof(proof, publicInputs);
console.log('证明有效:', valid);`} />

          {/* Footer */}
          <div className="mt-16 pt-8 border-t border-white/5 flex items-center justify-between text-slate-600 text-xs">
            <span>DeSpace Smart Chain 开发者文档 · v2.1.0</span>
            <button onClick={() => navigate('/')} className="flex items-center gap-1.5 hover:text-brand-primary transition-colors">
              <ArrowLeft size={12} /> 返回官网
            </button>
          </div>
        </main>

        {/* Right TOC */}
        <aside className="hidden xl:block w-52 shrink-0 sticky top-14 h-[calc(100vh-3.5rem)] overflow-y-auto p-6">
          <p className="text-[10px] uppercase tracking-widest text-slate-600 font-bold mb-4">本页目录</p>
          <ul className="space-y-1">
            {navSections.flatMap((s) => s.items).map((item) => (
              <li key={item.id}>
                <button onClick={() => scrollTo(item.id)} className={`w-full text-left text-[11px] py-1 transition-colors ${activeId === item.id ? 'text-brand-primary font-bold' : 'text-slate-600 hover:text-slate-400'}`}>
                  {item.label}
                </button>
              </li>
            ))}
          </ul>
        </aside>
      </div>
    </div>
  );
}
