import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import {
  ArrowLeft,
  Copy,
  Check,
  Download,
  FileCode,
  Cpu,
  Shield,
  Zap,
  ChevronRight,
  Database,
  Tag,
  RefreshCw,
  Lock,
} from 'lucide-react';

// ─────────────────────────────────────────────
//  合约源码（FISCO BCOS 2.x · Solidity ^0.4.25）
// ─────────────────────────────────────────────
const DSC_TOKEN_SOURCE = `pragma solidity ^0.4.25;

/**
 * @title  DSCToken
 * @notice ERC-20 标准代币合约
 *         适配 FISCO BCOS 2.x（Solidity ^0.4.25）
 * @dev    支持增发 / 销毁 / 暂停，部署者自动成为 owner
 */
contract DSCToken {

    // ── 基础信息 ────────────────────────────
    string  public name     = "DSC Token";
    string  public symbol   = "DSC";
    uint8   public decimals = 18;
    uint256 public totalSupply;

    address public owner;
    bool    public paused;

    mapping(address => uint256)                     private _balances;
    mapping(address => mapping(address => uint256)) private _allowances;

    // ── 事件 ────────────────────────────────
    event Transfer(address indexed from,  address indexed to,      uint256 value);
    event Approval(address indexed owner, address indexed spender, uint256 value);
    event Mint    (address indexed to,    uint256 value);
    event Burn    (address indexed from,  uint256 value);
    event Paused  (address account);
    event Unpaused(address account);
    event OwnershipTransferred(
        address indexed previousOwner,
        address indexed newOwner
    );

    // ── 修饰符 ──────────────────────────────
    modifier onlyOwner() {
        require(msg.sender == owner, "DSCToken: caller is not the owner");
        _;
    }

    modifier whenNotPaused() {
        require(!paused, "DSCToken: token transfer while paused");
        _;
    }

    // ── 构造函数 ────────────────────────────
    constructor(uint256 initialSupply) public {
        owner = msg.sender;
        _mint(msg.sender, initialSupply * 10 ** uint256(decimals));
    }

    // ── ERC-20 标准接口 ──────────────────────
    function balanceOf(address account)
        public view returns (uint256)
    {
        return _balances[account];
    }

    function transfer(address to, uint256 amount)
        public whenNotPaused returns (bool)
    {
        _transfer(msg.sender, to, amount);
        return true;
    }

    function allowance(address tokenOwner, address spender)
        public view returns (uint256)
    {
        return _allowances[tokenOwner][spender];
    }

    function approve(address spender, uint256 amount)
        public returns (bool)
    {
        require(spender != address(0), "DSCToken: approve to zero address");
        _allowances[msg.sender][spender] = amount;
        emit Approval(msg.sender, spender, amount);
        return true;
    }

    function transferFrom(address from, address to, uint256 amount)
        public whenNotPaused returns (bool)
    {
        require(
            _allowances[from][msg.sender] >= amount,
            "DSCToken: transfer amount exceeds allowance"
        );
        _allowances[from][msg.sender] -= amount;
        _transfer(from, to, amount);
        return true;
    }

    // ── 扩展功能 ────────────────────────────
    function mint(address to, uint256 amount)
        public onlyOwner returns (bool)
    {
        _mint(to, amount);
        return true;
    }

    function burn(uint256 amount) public returns (bool) {
        require(
            _balances[msg.sender] >= amount,
            "DSCToken: burn amount exceeds balance"
        );
        _balances[msg.sender] -= amount;
        totalSupply           -= amount;
        emit Burn(msg.sender, amount);
        emit Transfer(msg.sender, address(0), amount);
        return true;
    }

    function pause() public onlyOwner {
        paused = true;
        emit Paused(msg.sender);
    }

    function unpause() public onlyOwner {
        paused = false;
        emit Unpaused(msg.sender);
    }

    function transferOwnership(address newOwner) public onlyOwner {
        require(newOwner != address(0), "DSCToken: new owner is zero address");
        emit OwnershipTransferred(owner, newOwner);
        owner = newOwner;
    }

    // ── 内部函数 ────────────────────────────
    function _transfer(address from, address to, uint256 amount) internal {
        require(from != address(0), "DSCToken: transfer from zero address");
        require(to   != address(0), "DSCToken: transfer to zero address");
        require(
            _balances[from] >= amount,
            "DSCToken: transfer amount exceeds balance"
        );
        _balances[from] -= amount;
        _balances[to]   += amount;
        emit Transfer(from, to, amount);
    }

    function _mint(address to, uint256 amount) internal {
        require(to != address(0), "DSCToken: mint to zero address");
        totalSupply    += amount;
        _balances[to]  += amount;
        emit Mint(to, amount);
        emit Transfer(address(0), to, amount);
    }
}`;

const DSC_NFT_SOURCE = `pragma solidity ^0.4.25;

/**
 * @title  DSCNFT
 * @notice ERC-721 非同质化代币合约
 *         适配 FISCO BCOS 2.x（Solidity ^0.4.25）
 * @dev    支持增发 / 销毁 / 全量授权，内置 tokenURI 与持仓查询
 */
contract DSCNFT {

    // ── 基础信息 ────────────────────────────
    string  public name   = "DSC NFT";
    string  public symbol = "DSCNFT";

    uint256 private _totalMinted;
    uint256 private _totalSupply;

    address public owner;

    mapping(uint256 => address)                     private _owners;
    mapping(address => uint256)                     private _balances;
    mapping(uint256 => address)                     private _tokenApprovals;
    mapping(address => mapping(address => bool))    private _operatorApprovals;
    mapping(uint256 => string)                      private _tokenURIs;
    mapping(address => uint256[])                   private _ownedTokens;
    mapping(uint256 => uint256)                     private _ownedTokensIndex;

    // ── 事件 ────────────────────────────────
    event Transfer(
        address indexed from,
        address indexed to,
        uint256 indexed tokenId
    );
    event Approval(
        address indexed owner,
        address indexed approved,
        uint256 indexed tokenId
    );
    event ApprovalForAll(
        address indexed owner,
        address indexed operator,
        bool    approved
    );
    event Mint(address indexed to,   uint256 indexed tokenId, string tokenURI);
    event Burn(address indexed from, uint256 indexed tokenId);
    event OwnershipTransferred(
        address indexed previousOwner,
        address indexed newOwner
    );

    // ── 修饰符 ──────────────────────────────
    modifier onlyOwner() {
        require(msg.sender == owner, "DSCNFT: caller is not the owner");
        _;
    }

    modifier tokenExists(uint256 tokenId) {
        require(_owners[tokenId] != address(0), "DSCNFT: token does not exist");
        _;
    }

    // ── 构造函数 ────────────────────────────
    constructor() public {
        owner = msg.sender;
    }

    // ── ERC-721 标准接口 ──────────────────────
    function balanceOf(address account)
        public view returns (uint256)
    {
        require(account != address(0), "DSCNFT: balance query for zero address");
        return _balances[account];
    }

    function ownerOf(uint256 tokenId)
        public view tokenExists(tokenId) returns (address)
    {
        return _owners[tokenId];
    }

    function tokenURI(uint256 tokenId)
        public view tokenExists(tokenId) returns (string)
    {
        return _tokenURIs[tokenId];
    }

    function approve(address to, uint256 tokenId)
        public tokenExists(tokenId)
    {
        address tokenOwner = _owners[tokenId];
        require(to != tokenOwner, "DSCNFT: approval to current owner");
        require(
            msg.sender == tokenOwner ||
            _operatorApprovals[tokenOwner][msg.sender],
            "DSCNFT: caller is not owner nor approved for all"
        );
        _tokenApprovals[tokenId] = to;
        emit Approval(tokenOwner, to, tokenId);
    }

    function getApproved(uint256 tokenId)
        public view tokenExists(tokenId) returns (address)
    {
        return _tokenApprovals[tokenId];
    }

    function setApprovalForAll(address operator, bool approved) public {
        require(operator != msg.sender, "DSCNFT: approve to caller");
        _operatorApprovals[msg.sender][operator] = approved;
        emit ApprovalForAll(msg.sender, operator, approved);
    }

    function isApprovedForAll(address tokenOwner, address operator)
        public view returns (bool)
    {
        return _operatorApprovals[tokenOwner][operator];
    }

    function transferFrom(address from, address to, uint256 tokenId) public {
        require(
            _isApprovedOrOwner(msg.sender, tokenId),
            "DSCNFT: caller is not owner nor approved"
        );
        _transfer(from, to, tokenId);
    }

    function safeTransferFrom(address from, address to, uint256 tokenId)
        public
    {
        transferFrom(from, to, tokenId);
    }

    function safeTransferFrom(
        address from,
        address to,
        uint256 tokenId,
        bytes   /*data*/
    ) public {
        transferFrom(from, to, tokenId);
    }

    // ── 扩展功能 ────────────────────────────
    function mint(address to, string uri)
        public onlyOwner returns (uint256)
    {
        require(to != address(0), "DSCNFT: mint to zero address");
        _totalMinted += 1;
        _totalSupply += 1;
        uint256 newId = _totalMinted;

        _owners[newId]          = to;
        _balances[to]          += 1;
        _tokenURIs[newId]       = uri;
        _ownedTokensIndex[newId] = _ownedTokens[to].length;
        _ownedTokens[to].push(newId);

        emit Mint(to, newId, uri);
        emit Transfer(address(0), to, newId);
        return newId;
    }

    function burn(uint256 tokenId) public {
        require(
            _isApprovedOrOwner(msg.sender, tokenId),
            "DSCNFT: caller is not owner nor approved"
        );
        address tokenOwner = _owners[tokenId];

        _tokenApprovals[tokenId] = address(0);
        _balances[tokenOwner]   -= 1;
        _totalSupply            -= 1;
        delete _owners[tokenId];
        delete _tokenURIs[tokenId];

        uint256 tokenIndex     = _ownedTokensIndex[tokenId];
        uint256 lastIndex      = _ownedTokens[tokenOwner].length - 1;
        uint256 lastId         = _ownedTokens[tokenOwner][lastIndex];
        _ownedTokens[tokenOwner][tokenIndex] = lastId;
        _ownedTokensIndex[lastId]            = tokenIndex;
        _ownedTokens[tokenOwner].length -= 1;
        delete _ownedTokensIndex[tokenId];

        emit Burn(tokenOwner, tokenId);
        emit Transfer(tokenOwner, address(0), tokenId);
    }

    function totalSupply() public view returns (uint256) { return _totalSupply; }

    function tokensOfOwner(address account)
        public view returns (uint256[])
    {
        return _ownedTokens[account];
    }

    function transferOwnership(address newOwner) public onlyOwner {
        require(newOwner != address(0), "DSCNFT: new owner is zero address");
        emit OwnershipTransferred(owner, newOwner);
        owner = newOwner;
    }

    // ── 内部函数 ────────────────────────────
    function _isApprovedOrOwner(address spender, uint256 tokenId)
        internal view returns (bool)
    {
        require(_owners[tokenId] != address(0), "DSCNFT: nonexistent token");
        address tokenOwner = _owners[tokenId];
        return (
            spender == tokenOwner ||
            _tokenApprovals[tokenId] == spender ||
            _operatorApprovals[tokenOwner][spender]
        );
    }

    function _transfer(address from, address to, uint256 tokenId) internal {
        require(_owners[tokenId] == from, "DSCNFT: transfer from incorrect owner");
        require(to != address(0),         "DSCNFT: transfer to zero address");

        _tokenApprovals[tokenId] = address(0);
        _balances[from] -= 1;
        _balances[to]   += 1;
        _owners[tokenId] = to;

        uint256 idx      = _ownedTokensIndex[tokenId];
        uint256 lastIdx  = _ownedTokens[from].length - 1;
        uint256 lastId   = _ownedTokens[from][lastIdx];
        _ownedTokens[from][idx]   = lastId;
        _ownedTokensIndex[lastId] = idx;
        _ownedTokens[from].length -= 1;
        delete _ownedTokensIndex[tokenId];

        _ownedTokensIndex[tokenId] = _ownedTokens[to].length;
        _ownedTokens[to].push(tokenId);

        emit Transfer(from, to, tokenId);
    }
}`;

// ─────────────────────────────────────────────
//  简单 Solidity 语法高亮
// ─────────────────────────────────────────────
const KEYWORDS = [
  'pragma','solidity','contract','function','event','modifier','mapping',
  'constructor','returns','return','public','private','internal','external',
  'view','pure','payable','memory','storage','calldata','indexed',
  'require','emit','delete','new','this','address','uint256','uint8','bool',
  'string','bytes','true','false','if','else','for','while','break','continue',
  'import','is','using','struct','enum','interface','library','override',
  'virtual','abstract','immutable','constant','uint',
];

function highlight(code: string): React.ReactNode[] {
  const lines = code.split('\n');
  return lines.map((line, li) => {
    // Tokenise each line
    const tokens: React.ReactNode[] = [];
    let remaining = line;
    let key = 0;

    while (remaining.length > 0) {
      // Single-line comment
      if (remaining.startsWith('//')) {
        tokens.push(
          <span key={key++} className="text-slate-500 italic">{remaining}</span>
        );
        remaining = '';
        continue;
      }
      // String literal
      const strMatch = remaining.match(/^("(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*')/);
      if (strMatch) {
        tokens.push(
          <span key={key++} className="text-amber-400">{strMatch[0]}</span>
        );
        remaining = remaining.slice(strMatch[0].length);
        continue;
      }
      // Number
      const numMatch = remaining.match(/^(\d+)/);
      if (numMatch) {
        tokens.push(
          <span key={key++} className="text-purple-400">{numMatch[0]}</span>
        );
        remaining = remaining.slice(numMatch[0].length);
        continue;
      }
      // Keyword or identifier
      const wordMatch = remaining.match(/^([a-zA-Z_$][a-zA-Z0-9_$]*)/);
      if (wordMatch) {
        const word = wordMatch[0];
        if (KEYWORDS.includes(word)) {
          tokens.push(
            <span key={key++} className="text-brand-primary font-semibold">{word}</span>
          );
        } else if (/^[A-Z]/.test(word)) {
          // Type / contract name
          tokens.push(
            <span key={key++} className="text-brand-accent">{word}</span>
          );
        } else {
          tokens.push(<span key={key++} className="text-slate-200">{word}</span>);
        }
        remaining = remaining.slice(word.length);
        continue;
      }
      // Operator / punctuation / whitespace
      tokens.push(<span key={key++} className="text-slate-400">{remaining[0]}</span>);
      remaining = remaining.slice(1);
    }

    return (
      <div key={li} className="flex group/line min-w-0">
        <span className="select-none w-12 shrink-0 text-right pr-4 text-slate-700 text-xs leading-6 group-hover/line:text-slate-500 transition-colors">
          {li + 1}
        </span>
        <span className="leading-6 whitespace-pre font-mono text-sm min-w-0">{tokens}</span>
      </div>
    );
  });
}

// ─────────────────────────────────────────────
//  Tab 配置
// ─────────────────────────────────────────────
const CONTRACTS = [
  {
    id: 'erc20',
    label: 'ERC-20',
    name: 'DSCToken.sol',
    tag: 'v1.2',
    tagColor: 'text-brand-primary border-brand-primary/30',
    description: '基于 FISCO BCOS 2.x 的标准同质化代币合约，内置增发、销毁与暂停机制。',
    source: DSC_TOKEN_SOURCE,
    icon: Tag,
    features: [
      { icon: Zap,      label: 'ERC-20 标准',  desc: '完整实现 transfer / approve / transferFrom' },
      { icon: Shield,   label: '权限控制',      desc: 'onlyOwner 修饰符保护敏感操作' },
      { icon: RefreshCw,label: '增发 / 销毁',  desc: 'mint 增发、burn 销毁，灵活管理总量' },
      { icon: Lock,     label: '暂停机制',      desc: 'pause / unpause 紧急冻结转账' },
    ],
    compat: 'FISCO BCOS 2.x · Solidity ^0.4.25',
  },
  {
    id: 'erc721',
    label: 'ERC-721',
    name: 'DSCNFT.sol',
    tag: 'v1.2',
    tagColor: 'text-brand-accent border-brand-accent/30',
    description: '基于 FISCO BCOS 2.x 的标准非同质化代币合约，支持 tokenURI、持仓查询与全量授权。',
    source: DSC_NFT_SOURCE,
    icon: Cpu,
    features: [
      { icon: Zap,      label: 'ERC-721 标准',  desc: '完整实现 transferFrom / approve / setApprovalForAll' },
      { icon: Database, label: 'tokenURI',       desc: '每枚 NFT 绑定元数据 URI，支持链上存证' },
      { icon: Shield,   label: '持仓查询',       desc: 'tokensOfOwner 一键返回地址所有 tokenId' },
      { icon: RefreshCw,label: '增发 / 销毁',   desc: 'mint 铸造新 NFT，burn 永久销毁' },
    ],
    compat: 'FISCO BCOS 2.x · Solidity ^0.4.25',
  },
];

// ─────────────────────────────────────────────
//  主页面
// ─────────────────────────────────────────────
export default function ContractTemplates() {
  const navigate = useNavigate();
  const [activeId, setActiveId]   = useState<'erc20' | 'erc721'>('erc20');
  const [copied, setCopied]       = useState(false);

  const contract = CONTRACTS.find(c => c.id === activeId)!;

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(contract.source).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }, [contract.source]);

  const handleDownload = useCallback(() => {
    const blob = new Blob([contract.source], { type: 'text/plain' });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement('a');
    a.href     = url;
    a.download = contract.name;
    a.click();
    URL.revokeObjectURL(url);
  }, [contract.source, contract.name]);

  const lines = highlight(contract.source);

  return (
    <div className="min-h-screen bg-brand-secondary text-white font-sans overflow-x-hidden">

      {/* 背景网格 */}
      <div className="fixed inset-0 grid-background opacity-40 pointer-events-none" />
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-10%,rgba(0,255,156,0.07),transparent)] pointer-events-none" />

      {/* ── 顶部导航 ── */}
      <nav className="sticky top-0 z-50 bg-brand-secondary/80 backdrop-blur-md border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center gap-6">
          {/* 返回按钮 */}
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 text-slate-400 hover:text-brand-primary transition-colors group"
          >
            <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
            <span className="hud-label text-[10px]">返回首页</span>
          </button>

          <div className="w-px h-4 bg-white/10" />

          {/* 面包屑 */}
          <div className="flex items-center gap-2 hud-label text-[10px]">
            <Database size={12} className="text-brand-primary" />
            <span className="text-slate-600">DSC</span>
            <ChevronRight size={10} className="text-slate-700" />
            <span className="text-slate-400">INFRASTRUCTURE</span>
            <ChevronRight size={10} className="text-slate-700" />
            <span className="text-brand-primary">CONTRACT TEMPLATES</span>
          </div>

          <div className="ml-auto">
            <span className="hud-label text-[10px] border border-white/10 px-3 py-1 rounded-sm text-brand-primary">
              FISCO BCOS 2.X
            </span>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 py-16 relative z-10">

        {/* ── 页头 ── */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-14"
        >
          <span className="hud-label text-brand-primary mb-4 block">INFRASTRUCTURE / TEMPLATES</span>
          <h1 className="text-5xl md:text-6xl font-black tracking-tighter mb-5 leading-none">
            标准合约模板
          </h1>
          <p className="text-slate-400 font-light text-lg max-w-2xl leading-relaxed">
            内置 <span className="text-brand-primary font-medium">ERC-20（DSCToken）</span> 与{' '}
            <span className="text-brand-accent font-medium">ERC-721（DSCNFT）</span> 模板，
            完整适配 FISCO BCOS 2.x 联盟链环境，开箱即用。
          </p>
        </motion.div>

        {/* ── Tab 切换 ── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="flex items-center gap-3 mb-10"
        >
          {CONTRACTS.map(c => {
            const active = c.id === activeId;
            return (
              <button
                key={c.id}
                onClick={() => setActiveId(c.id as 'erc20' | 'erc721')}
                className={`relative flex items-center gap-3 px-6 py-3 rounded-sm border font-mono text-sm font-medium transition-all duration-300 ${
                  active
                    ? 'bg-brand-primary/10 border-brand-primary/40 text-brand-primary'
                    : 'bg-white/[0.02] border-white/10 text-slate-500 hover:border-white/20 hover:text-slate-300'
                }`}
              >
                <FileCode size={14} />
                <span>{c.name}</span>
                <span className={`text-[9px] font-mono border px-1.5 py-0.5 rounded-sm ${
                  active ? c.tagColor : 'text-slate-600 border-white/10'
                }`}>
                  {c.label}
                </span>
                {active && (
                  <motion.span
                    layoutId="tab-indicator"
                    className="absolute inset-x-0 -bottom-px h-px bg-brand-primary"
                  />
                )}
              </button>
            );
          })}
        </motion.div>

        {/* ── 内容区 ── */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeId}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.3 }}
            className="grid lg:grid-cols-[1fr_320px] gap-8 items-start"
          >
            {/* ── 代码面板 ── */}
            <div className="glass-card cyber-border overflow-hidden rounded-2xl">
              {/* 代码顶栏 */}
              <div className="flex items-center justify-between px-5 py-3.5 border-b border-white/5 bg-white/[0.02]">
                <div className="flex items-center gap-3">
                  <div className="flex gap-1.5">
                    <span className="w-3 h-3 rounded-full bg-red-500/60" />
                    <span className="w-3 h-3 rounded-full bg-yellow-500/60" />
                    <span className="w-3 h-3 rounded-full bg-green-500/60" />
                  </div>
                  <span className="font-mono text-xs text-slate-500 ml-2">{contract.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  {/* 复制 */}
                  <button
                    onClick={handleCopy}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-sm border border-white/10 bg-white/[0.03] hover:border-brand-primary/40 hover:bg-brand-primary/5 text-slate-400 hover:text-brand-primary transition-all text-xs font-mono"
                  >
                    {copied
                      ? <><Check size={12} className="text-brand-primary" /> 已复制</>
                      : <><Copy size={12} /> 复制代码</>
                    }
                  </button>
                  {/* 下载 */}
                  <button
                    onClick={handleDownload}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-sm border border-white/10 bg-white/[0.03] hover:border-brand-accent/40 hover:bg-brand-accent/5 text-slate-400 hover:text-brand-accent transition-all text-xs font-mono"
                  >
                    <Download size={12} /> 下载 .sol
                  </button>
                </div>
              </div>

              {/* 代码滚动区 */}
              <div className="overflow-auto max-h-[72vh] bg-[#080c10] py-4 pr-4">
                <div className="min-w-0">
                  {lines}
                </div>
              </div>

              {/* 底部状态栏 */}
              <div className="flex items-center gap-4 px-5 py-2.5 border-t border-white/5 bg-white/[0.01]">
                <span className="hud-label text-[9px] text-slate-600">SOLIDITY</span>
                <span className="w-px h-3 bg-white/10" />
                <span className="hud-label text-[9px] text-slate-600">UTF-8</span>
                <span className="w-px h-3 bg-white/10" />
                <span className="hud-label text-[9px] text-slate-600">
                  {contract.source.split('\n').length} LINES
                </span>
                <div className="ml-auto">
                  <span className="hud-label text-[9px] text-brand-primary/70">{contract.compat}</span>
                </div>
              </div>
            </div>

            {/* ── 右侧信息面板 ── */}
            <div className="flex flex-col gap-6">

              {/* 合约描述卡 */}
              <motion.div
                className="glass-card cyber-border p-6 rounded-2xl"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.15 }}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 rounded-sm bg-brand-primary/10 border border-brand-primary/20 flex items-center justify-center">
                    <contract.icon className="w-6 h-6 text-brand-primary" />
                  </div>
                  <span className={`text-[9px] font-mono border px-2 py-1 rounded-sm ${contract.tagColor}`}>
                    {contract.tag}
                  </span>
                </div>
                <h3 className="font-black text-lg tracking-tight mb-2">{contract.name}</h3>
                <p className="text-sm text-slate-500 leading-relaxed font-light">
                  {contract.description}
                </p>
                <div className="mt-4 pt-4 border-t border-white/5">
                  <span className="hud-label text-[9px] text-slate-600">{contract.compat}</span>
                </div>
              </motion.div>

              {/* 功能特性列表 */}
              <motion.div
                className="glass-card p-6 rounded-2xl space-y-4"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.22 }}
              >
                <span className="hud-label text-[10px] text-brand-primary block mb-2">FEATURES</span>
                {contract.features.map((f, i) => (
                  <div key={i} className="flex gap-4 items-start group">
                    <div className="w-8 h-8 shrink-0 rounded-sm bg-brand-primary/5 border border-brand-primary/15 flex items-center justify-center group-hover:border-brand-primary/40 group-hover:bg-brand-primary/10 transition-all">
                      <f.icon size={14} className="text-brand-primary" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-white mb-0.5">{f.label}</p>
                      <p className="text-xs text-slate-500 font-light leading-relaxed">{f.desc}</p>
                    </div>
                  </div>
                ))}
              </motion.div>

              {/* 使用提示 */}
              <motion.div
                className="border border-brand-accent/20 bg-brand-accent/5 rounded-2xl p-5"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
              >
                <span className="hud-label text-[9px] text-brand-accent block mb-3">QUICK START</span>
                <p className="text-xs text-slate-400 leading-relaxed font-light">
                  通过 <span className="text-brand-accent font-mono">BaaS 管理平台</span> 一键部署，
                  或使用 <span className="text-brand-accent font-mono">DSC SDK</span> 在本地编译后
                  通过 WeBASE 前置服务发送交易。
                </p>
              </motion.div>
            </div>
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}
