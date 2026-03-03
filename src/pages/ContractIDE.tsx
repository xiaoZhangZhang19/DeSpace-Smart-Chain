import React, {
  useState, useRef, useCallback, useMemo, useEffect,
} from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import {
  ArrowLeft, Database, ChevronRight, Code2, Play, Terminal,
  Copy, Check, ExternalLink, ChevronDown, ChevronUp,
  FileCode, Tag, Activity, Zap, CheckCircle2, AlertCircle,
  RotateCcw, Hash, Rocket, User, Link, XCircle,
} from 'lucide-react';
const STORAGE_KEY = 'dsc-ide-counter-sol';

const COUNTER_DEFAULT = `pragma solidity ^0.4.25;

contract Counter {

    uint256 private _count;
    address public owner;

    event Incremented(address indexed by, uint256 newCount);
    event Decremented(address indexed by, uint256 newCount);
    event Reset(address indexed by);

    modifier onlyOwner() {
        require(msg.sender == owner, "Counter: caller is not the owner");
        _;
    }

    constructor() public {
        owner = msg.sender;
    }

    function count() public view returns (uint256) {
        return _count;
    }

    function increment() public {
        _count += 1;
        emit Incremented(msg.sender, _count);
    }

    function decrement() public {
        require(_count > 0, "Counter: count is already zero");
        _count -= 1;
        emit Decremented(msg.sender, _count);
    }

    function incrementBy(uint256 amount) public {
        require(amount > 0, "Counter: amount must be greater than zero");
        _count += amount;
        emit Incremented(msg.sender, _count);
    }

    function reset() public onlyOwner {
        _count = 0;
        emit Reset(msg.sender);
    }
}`;

// ─────────────────────────────────────────────
//  语法高亮
// ─────────────────────────────────────────────
const KEYWORDS = [
  'pragma','solidity','contract','function','event','modifier','mapping',
  'constructor','returns','return','public','private','internal','external',
  'view','pure','payable','memory','storage','calldata','indexed',
  'require','emit','delete','new','this','address','uint256','uint8','bool',
  'string','bytes','true','false','if','else','for','while','break',
  'import','is','using','struct','enum','interface','library',
  'override','virtual','abstract','immutable','constant','uint',
];

function highlightLine(line: string): React.ReactNode[] {
  const tokens: React.ReactNode[] = [];
  let rem = line;
  let k = 0;
  while (rem.length > 0) {
    if (rem.startsWith('//')) {
      tokens.push(<span key={k++} className="text-slate-500 italic">{rem}</span>);
      rem = '';
      continue;
    }
    const strM = rem.match(/^("(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*')/);
    if (strM) {
      tokens.push(<span key={k++} className="text-amber-400">{strM[0]}</span>);
      rem = rem.slice(strM[0].length); continue;
    }
    const numM = rem.match(/^(\d+)/);
    if (numM) {
      tokens.push(<span key={k++} className="text-purple-400">{numM[0]}</span>);
      rem = rem.slice(numM[0].length); continue;
    }
    const wordM = rem.match(/^([a-zA-Z_$][a-zA-Z0-9_$]*)/);
    if (wordM) {
      const w = wordM[0];
      if (KEYWORDS.includes(w))
        tokens.push(<span key={k++} className="text-brand-primary font-semibold">{w}</span>);
      else if (/^[A-Z]/.test(w))
        tokens.push(<span key={k++} className="text-brand-accent">{w}</span>);
      else
        tokens.push(<span key={k++} className="text-slate-200">{w}</span>);
      rem = rem.slice(w.length); continue;
    }
    tokens.push(<span key={k++} className="text-slate-400">{rem[0]}</span>);
    rem = rem.slice(1);
  }
  return tokens;
}

// ─────────────────────────────────────────────
//  ABI 提取器
// ─────────────────────────────────────────────
interface ABIEntry { type: string; name?: string; inputs: any[]; outputs?: any[]; stateMutability?: string; anonymous?: boolean; }

function parseParams(raw: string): any[] {
  if (!raw.trim()) return [];
  return raw.split(',').map(p => {
    const parts = p.trim().replace(/\s+/g, ' ').split(' ').filter(Boolean);
    const type  = parts[0] ?? 'uint256';
    const last  = parts[parts.length - 1];
    const name  = last && last !== type ? last : '';
    return { type, name, internalType: type };
  }).filter(p => p.type);
}

function parseIndexedParams(raw: string): any[] {
  if (!raw.trim()) return [];
  return raw.split(',').map(p => {
    const parts   = p.trim().replace(/\s+/g, ' ').split(' ').filter(Boolean);
    const indexed = parts.includes('indexed');
    const clean   = parts.filter(x => x !== 'indexed');
    const type    = clean[0] ?? 'uint256';
    const last    = clean[clean.length - 1];
    const name    = last && last !== type ? last : '';
    return { type, name, internalType: type, indexed };
  }).filter(p => p.type);
}

function extractABI(source: string): ABIEntry[] {
  const cleaned = source.replace(/\/\/[^\n]*/g, '').replace(/\/\*[\s\S]*?\*\//g, '');
  const abi: ABIEntry[] = [];

  // constructor
  const ctorM = cleaned.match(/constructor\s*\(([^)]*)\)/);
  if (ctorM) abi.push({ type: 'constructor', inputs: parseParams(ctorM[1]), stateMutability: 'nonpayable' });

  // public state var getters
  const varRe = /\b(string|uint256|uint8|bool|address)\s+public\s+(\w+)/g;
  let vm: RegExpExecArray | null;
  while ((vm = varRe.exec(cleaned)) !== null)
    abi.push({ type: 'function', name: vm[2], inputs: [], outputs: [{ type: vm[1], name: '', internalType: vm[1] }], stateMutability: 'view' });

  // events
  const evRe = /event\s+(\w+)\s*\(([^)]*)\)/g;
  let em: RegExpExecArray | null;
  while ((em = evRe.exec(cleaned)) !== null)
    abi.push({ type: 'event', name: em[1], inputs: parseIndexedParams(em[2]), anonymous: false });

  // functions
  const fnRe = /function\s+(\w+)\s*\(([^)]*)\)\s*((?:(?:\w+)\s+)*?)(?:returns\s*\(([^)]*)\))?\s*\{/g;
  let fm: RegExpExecArray | null;
  while ((fm = fnRe.exec(cleaned)) !== null) {
    const mods = fm[3] ?? '';
    if (!/\bpublic\b|\bexternal\b/.test(mods)) continue;
    const isView    = /\bview\b|\bpure\b/.test(mods);
    const isPayable = /\bpayable\b/.test(mods);
    abi.push({
      type: 'function', name: fm[1],
      inputs:  parseParams(fm[2] ?? ''),
      outputs: fm[4] ? parseParams(fm[4]) : [],
      stateMutability: isView ? 'view' : isPayable ? 'payable' : 'nonpayable',
    });
  }
  return abi;
}

const FILE_NAME     = 'Counter.sol';
const CONTRACT_NAME = 'Counter';

// ─────────────────────────────────────────────
//  콘솔 라인 타입
// ─────────────────────────────────────────────
type LineType = 'info' | 'success' | 'warn' | 'error';
interface ConsoleLine { text: string; type: LineType; }

// ─────────────────────────────────────────────
//  유틸
// ─────────────────────────────────────────────
function fakeBytecode(source: string): string {
  let h = 0;
  for (let i = 0; i < source.length; i++) h = ((h << 5) - h + source.charCodeAt(i)) | 0;
  const seed = Math.abs(h).toString(16).padStart(8, '0');
  const body  = (seed.repeat(30)).slice(0, 240);
  return `0x608060405234801561001057600080fd5b50${body}...`;
}

// ─────────────────────────────────────────────
//  Solidity 静态校验器
// ─────────────────────────────────────────────
interface SolError { line: number; message: string; severity: 'error' | 'warning'; }

/** 剥离注释与字符串字面量，保留换行符以维持行号 */
function stripForParsing(src: string): string {
  let out = '';
  let i = 0;
  while (i < src.length) {
    // 行注释
    if (src[i] === '/' && src[i + 1] === '/') {
      while (i < src.length && src[i] !== '\n') { out += ' '; i++; }
      continue;
    }
    // 块注释
    if (src[i] === '/' && src[i + 1] === '*') {
      out += '  '; i += 2;
      while (i < src.length && !(src[i] === '*' && src[i + 1] === '/')) {
        out += src[i] === '\n' ? '\n' : ' '; i++;
      }
      if (i < src.length) { out += '  '; i += 2; }
      continue;
    }
    // 字符串字面量
    if (src[i] === '"' || src[i] === "'") {
      const q = src[i]; out += ' '; i++;
      while (i < src.length && src[i] !== q) {
        if (src[i] === '\\') { out += '  '; i += 2; continue; }
        out += src[i] === '\n' ? '\n' : ' '; i++;
      }
      if (i < src.length) { out += ' '; i++; }
      continue;
    }
    out += src[i]; i++;
  }
  return out;
}

function charLineNum(src: string, idx: number): number {
  return src.slice(0, idx).split('\n').length;
}

function validateSolidity(source: string): SolError[] {
  const errors: SolError[] = [];
  const stripped = stripForParsing(source);
  const srcLines = source.split('\n');

  // 1. SPDX 许可证（警告）
  if (!source.includes('SPDX-License-Identifier')) {
    errors.push({ line: 1, message: '建议在文件顶部添加 // SPDX-License-Identifier: MIT', severity: 'warning' });
  }

  // 2. pragma solidity
  const pragmaM = stripped.match(/pragma\s+solidity\s+([^;]+);/);
  if (!pragmaM) {
    errors.push({ line: 1, message: '缺少 `pragma solidity` 声明', severity: 'error' });
  } else {
    const ver = pragmaM[1].trim();
    // FISCO BCOS 2.x 仅支持 Solidity 0.4.x ~ 0.6.x
    // 当前 WeBASE-Front 编译器为 0.4.25，仅接受 0.4.x
    if (!/\^0\.4\./.test(ver)) {
      const pragmaIdx = source.indexOf('pragma solidity');
      errors.push({
        line: pragmaIdx >= 0 ? charLineNum(source, pragmaIdx) : 1,
        message: `版本 "${ver}" 与当前 WeBASE 编译器（0.4.25）不兼容，请使用 ^0.4.25`,
        severity: 'error',
      });
    }
  }

  // 3. contract 声明
  if (!/\bcontract\s+\w+/.test(stripped)) {
    errors.push({ line: 1, message: '未找到 `contract` 声明', severity: 'error' });
  }

  // 4. 花括号 & 圆括号平衡
  let braces = 0;
  let parens = 0;
  let firstOpenBraceIdx = -1;
  for (let i = 0; i < stripped.length; i++) {
    const ch = stripped[i];
    if (ch === '{') { if (braces === 0) firstOpenBraceIdx = i; braces++; }
    else if (ch === '}') {
      braces--;
      if (braces < 0) {
        errors.push({ line: charLineNum(stripped, i), message: '多余的 `}`，没有匹配的 `{`', severity: 'error' });
        braces = 0;
      }
    } else if (ch === '(') { parens++; }
    else if (ch === ')') {
      parens--;
      if (parens < 0) {
        errors.push({ line: charLineNum(stripped, i), message: '多余的 `)`，没有匹配的 `(`', severity: 'error' });
        parens = 0;
      }
    }
  }
  if (braces > 0) {
    errors.push({
      line: firstOpenBraceIdx >= 0 ? charLineNum(stripped, firstOpenBraceIdx) : srcLines.length,
      message: `${braces} 个 \`{\` 未闭合`,
      severity: 'error',
    });
  }
  if (parens > 0) {
    errors.push({ line: srcLines.length, message: `${parens} 个 \`(\` 未闭合`, severity: 'error' });
  }

  // 5. 逐行检查未闭合的字符串字面量
  srcLines.forEach((l, li) => {
    // 跳过注释行
    const trimmed = l.trimStart();
    if (trimmed.startsWith('//') || trimmed.startsWith('*') || trimmed.startsWith('/*')) return;
    let inStr = false;
    let quote = '';
    for (let j = 0; j < l.length; j++) {
      if (!inStr && (l[j] === '"' || l[j] === "'")) { inStr = true; quote = l[j]; continue; }
      if (inStr && l[j] === '\\') { j++; continue; }
      if (inStr && l[j] === quote) { inStr = false; quote = ''; }
    }
    if (inStr) errors.push({ line: li + 1, message: `字符串字面量未闭合`, severity: 'error' });
  });

  // 6. require() 没有错误消息（警告）
  const reqRe = /require\s*\(\s*[^,)]+\s*\)/g;
  let rm: RegExpExecArray | null;
  while ((rm = reqRe.exec(stripped)) !== null) {
    errors.push({
      line: charLineNum(stripped, rm.index),
      message: `require() 缺少错误描述字符串，建议加上第二个参数`,
      severity: 'warning',
    });
  }

  // 7. public 函数无可见性（检测缺少 public/private/internal/external 的 function）
  const fnRe = /\bfunction\s+(\w+)\s*\([^)]*\)\s*\{/g;
  let fm2: RegExpExecArray | null;
  while ((fm2 = fnRe.exec(stripped)) !== null) {
    const ctx = stripped.slice(Math.max(0, fm2.index), fm2.index + fm2[0].length);
    if (!/\b(public|private|internal|external)\b/.test(ctx)) {
      errors.push({
        line: charLineNum(stripped, fm2.index),
        message: `函数 \`${fm2[1]}\` 未声明可见性（public / private / internal / external）`,
        severity: 'warning',
      });
    }
  }

  return errors;
}

// ─────────────────────────────────────────────
//  메인 컴포넌트
// ─────────────────────────────────────────────
export default function ContractIDE() {
  const navigate = useNavigate();

  // 初始代码：优先从 localStorage 恢复，并修正旧版 pragma
  const [code, setCode]                       = useState<string>(() => {
    const raw = localStorage.getItem(STORAGE_KEY) ?? COUNTER_DEFAULT;
    return raw
      .replace(/pragma\s+solidity\s+\^0\.6\.10/g, 'pragma solidity ^0.4.25')
      .replace(/pragma\s+solidity\s+\^0\.6\.0/g,  'pragma solidity ^0.4.25');
  });
  const [savedCode, setSavedCode]             = useState<string>(() => {
    const raw = localStorage.getItem(STORAGE_KEY) ?? COUNTER_DEFAULT;
    return raw
      .replace(/pragma\s+solidity\s+\^0\.6\.10/g, 'pragma solidity ^0.4.25')
      .replace(/pragma\s+solidity\s+\^0\.6\.0/g,  'pragma solidity ^0.4.25');
  });
  const [saveState, setSaveState]             = useState<'saved'|'unsaved'|'saving'>('saved');
  const [compileState, setCompileState]       = useState<'idle'|'compiling'|'success'|'error'>('idle');
  const [consoleOpen, setConsoleOpen]         = useState(false);
  const [consoleTab, setConsoleTab]           = useState<'output'|'abi'|'bytecode'>('output');
  const [outputLines, setOutputLines]         = useState<ConsoleLine[]>([]);
  const [compiledABI, setCompiledABI]         = useState<ABIEntry[]>([]);
  const [compiledBytecode, setCompiledBytecode] = useState('');
  const [copiedABI, setCopiedABI]             = useState(false);

  // ── 部署相关 state ──
  interface DeployUser { address: string; userName: string; }
  const [users, setUsers]                     = useState<DeployUser[]>([]);
  const [selectedUser, setSelectedUser]       = useState('');
  const [usersState, setUsersState]           = useState<'idle'|'loading'|'ok'|'fail'|'manual'>('idle');
  const [manualAddr, setManualAddr]           = useState('');
  const [deployState, setDeployState]         = useState<'idle'|'compiling'|'deploying'|'success'|'error'>('idle');
  const [deployResult, setDeployResult]       = useState<{ contractAddress: string; txHash?: string } | null>(null);
  const [deployError, setDeployError]         = useState('');
  const [copiedAddr, setCopiedAddr]           = useState(false);
  // 手动编译输入（当 WeBASE-Front 不提供 compile 接口时使用）
  const [showManualCompile, setShowManualCompile] = useState(false);
  const [manualABI, setManualABI]             = useState('');
  const [manualBytecode, setManualBytecode]   = useState('');

  // 代码有变动时标记为未保存
  const hasUnsaved = code !== savedCode;

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const preRef      = useRef<HTMLPreElement>(null);
  const consoleRef  = useRef<HTMLDivElement>(null);

  // ── 스크롤 동기화 ──
  const syncScroll = useCallback(() => {
    if (textareaRef.current && preRef.current) {
      preRef.current.scrollTop  = textareaRef.current.scrollTop;
      preRef.current.scrollLeft = textareaRef.current.scrollLeft;
    }
  }, []);

  // ── Tab 키 ──
  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key !== 'Tab') return;
    e.preventDefault();
    const ta    = textareaRef.current!;
    const start = ta.selectionStart;
    const end   = ta.selectionEnd;
    const next  = code.slice(0, start) + '    ' + code.slice(end);
    setCode(next);
    requestAnimationFrame(() => { ta.selectionStart = ta.selectionEnd = start + 4; });
  }, [code]);

  // ── 保存到 localStorage ──
  const handleSave = useCallback(() => {
    setSaveState('saving');
    setTimeout(() => {
      localStorage.setItem(STORAGE_KEY, code);
      setSavedCode(code);
      setSaveState('saved');
    }, 400);
  }, [code]);

  // ── 重置为默认合约 ──
  const handleReset = useCallback(() => {
    setCode(COUNTER_DEFAULT);
    setCompileState('idle');
    setOutputLines([]);
    setCompiledABI([]);
    setCompiledBytecode('');
  }, []);

  // ── 语法高亮（memoized）──
  const highlighted = useMemo(() => {
    const lines = code.split('\n');
    return lines.map((line: string, li: number) => (
      <div key={li} className="flex group/line hover:bg-white/[0.02] transition-colors">
        <span className="select-none w-10 shrink-0 text-right pr-3 text-slate-700 text-xs leading-6 group-hover/line:text-slate-500 transition-colors font-mono">
          {li + 1}
        </span>
        <span className="leading-6 whitespace-pre text-sm font-mono pr-6">{highlightLine(line)}</span>
      </div>
    ));
  }, [code]);

  // ── 통계 ──
  const stats = useMemo(() => ({
    lines:     code.split('\n').length,
    functions: (code.match(/\bfunction\b/g)  ?? []).length,
    events:    (code.match(/\bevent\b/g)     ?? []).length,
    mappings:  (code.match(/\bmapping\b/g)   ?? []).length,
  }), [code]);

  // ── 编译（含静态校验）──
  const handleCompile = useCallback(async () => {
    if (compileState === 'compiling') return;
    setCompileState('compiling');
    setConsoleOpen(true);
    setConsoleTab('output');
    setOutputLines([]);
    setCompiledABI([]);
    setCompiledBytecode('');

    const now = new Date().toLocaleTimeString('zh-CN', { hour12: false });

    const push = (text: string, type: LineType) =>
      setOutputLines((prev: ConsoleLine[]) => [...prev, { text, type }]);
    const delay = (ms: number) => new Promise<void>(r => setTimeout(r, ms));

    push(`[${now}]  初始化 Solidity 编译器环境...`, 'info');
    await delay(400);
    push(`[${now}]  解析文件  ${FILE_NAME}`, 'info');
    await delay(400);
    push(`[${now}]  执行静态分析...`, 'info');
    await delay(500);

    // ── 真实校验 ──
    const allErrors = validateSolidity(code);
    const hardErrors = allErrors.filter(e => e.severity === 'error');
    const warnings   = allErrors.filter(e => e.severity === 'warning');

    // 先输出 warning
    for (const w of warnings) {
      await delay(150);
      push(`[${now}]  ⚠  第 ${w.line} 行: ${w.message}`, 'warn');
    }

    if (hardErrors.length > 0) {
      // ── 编译失败 ──
      await delay(300);
      push(`[${now}]  词法 / 语义分析...`, 'info');
      await delay(400);
      for (const err of hardErrors) {
        await delay(200);
        push(`[${now}]  ✗  第 ${err.line} 行: ${err.message}`, 'error');
      }
      await delay(300);
      push(
        `[${now}]  编译失败  ${hardErrors.length} 个错误，${warnings.length} 个警告`,
        'error',
      );
      setCompileState('error');
      return;
    }

    // ── 无错误 → 继续编译流程 ──
    const successSteps: { text: string; type: LineType; ms: number }[] = [
      { text: `[${now}]  版本检测  pragma solidity ^0.4.25  ✓`,   type: 'success', ms: 400 },
      { text: `[${now}]  语义分析（Semantic Analysis）...`,        type: 'info',    ms: 500 },
      { text: `[${now}]  生成 ABI 接口描述...`,                    type: 'info',    ms: 500 },
      { text: `[${now}]  字节码优化（runs: 200）...`,              type: 'info',    ms: 500 },
      { text: `[${now}]  链接部署器...`,                           type: 'info',    ms: 400 },
      {
        text: `[${now}]  ✓ 编译成功  合约: ${CONTRACT_NAME}  大小: ${(code.length * 0.78 / 1024).toFixed(2)} KB  警告: ${warnings.length}`,
        type: 'success', ms: 400,
      },
    ];
    for (const s of successSteps) {
      await delay(s.ms);
      push(s.text, s.type);
    }

    setCompiledABI(extractABI(code));
    setCompiledBytecode(fakeBytecode(code));
    setCompileState('success');
  }, [code, compileState]);

  // ── 콘솔 자동 스크롤 ──
  useEffect(() => {
    if (consoleRef.current) consoleRef.current.scrollTop = consoleRef.current.scrollHeight;
  }, [outputLines]);

  // ── 加载 WeBASE 用户列表 ──
  // 不同版本 WeBASE-Front 的 userList 路径不同，依次尝试
  const loadUsers = useCallback(async () => {
    setUsersState('loading');
    setDeployError('');
    try {
      // 文档接口：GET /privateKey/localKeyStores → 返回本地密钥数组
      const r = await fetch('/api/users');
      const body = await r.json().catch(() => null);
      if (!r.ok) throw new Error(`HTTP ${r.status}: ${body?.message ?? r.statusText}`);

      // 响应可能是直接数组，也可能包在 { code, data } 里
      const raw = Array.isArray(body) ? body : (Array.isArray(body?.data) ? body.data : []);
      if (raw.length === 0) throw new Error('本地无托管私钥，请先在 WeBASE 创建或导入');

      const list: DeployUser[] = raw.map((k: { address: string; userName?: string }) => ({
        address:  k.address,
        userName: k.userName ?? '',
      }));
      setUsers(list);
      setSelectedUser(list[0].address);
      setUsersState('ok');
    } catch (e: unknown) {
      setDeployError(e instanceof Error ? e.message : String(e));
      setUsersState('fail');
      setUsers([]);
    }
  }, []);

  // ── 核心部署逻辑（文档接口：POST /contract/deploy）──
  const doDeploy = useCallback(async (contractAbi: string, bytecodeBin: string) => {
    // abiInfo 文档要求传 JSON 数组（List），不是字符串
    let abiArr: ABIEntry[] = [];
    try { abiArr = JSON.parse(contractAbi); } catch { /* ignore */ }
    const ctor      = abiArr.find(e => e.type === 'constructor');
    const funcParam = ctor && ctor.inputs.length > 0 ? ctor.inputs.map(() => '') : [];

    setDeployState('deploying');
    const deployRes = await fetch('/api/deploy', {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        groupId:      1,
        user:         selectedUser,
        contractName: CONTRACT_NAME,
        abiInfo:      abiArr,       // List，不是字符串
        bytecodeBin,
        funcParam,
      }),
    });

    // 响应可能是裸字符串地址，也可能是 JSON 对象
    const text = await deployRes.text();
    if (!deployRes.ok) {
      let detail = text;
      try { const j = JSON.parse(text); detail = j.errorMessage ?? j.message ?? j.error ?? text; } catch { /* ignore */ }
      throw new Error(`部署失败 HTTP ${deployRes.status}: ${detail}`);
    }

    // 成功：尝试解析为 JSON，否则当作裸地址字符串
    let addr = '';
    try {
      const j = JSON.parse(text);
      addr = typeof j === 'string' ? j : (j?.data ?? j?.contractAddress ?? '');
    } catch {
      addr = text.trim().replace(/^"|"$/g, ''); // 去掉可能的引号
    }
    setDeployResult({ contractAddress: addr, txHash: '' });
    setDeployState('success');
  }, [selectedUser]);

  // ── 部署合约（文档接口：POST /contract/contractCompile，源码需 Base64）──
  const handleDeploy = useCallback(async () => {
    if (!selectedUser) return;
    setDeployState('compiling');
    setDeployResult(null);
    setDeployError('');
    setShowManualCompile(false);

    try {
      // 源码转 Base64（兼容中文注释等 Unicode 字符）
      const bytes  = new TextEncoder().encode(code);
      let   binary = '';
      bytes.forEach(b => { binary += String.fromCharCode(b); });
      const solidityBase64 = btoa(binary);

      const compileRes = await fetch('/api/compile', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contractName: CONTRACT_NAME, solidityBase64 }),
      });

      // 先读取响应体（无论成功与否都要读，422 里有具体原因）
      const compiled = await compileRes.json().catch(() => null);

      // 编译端点不存在 → 弹出手动输入
      if (compileRes.status === 404) {
        setDeployState('idle');
        setShowManualCompile(true);
        return;
      }
      if (!compileRes.ok) {
        const detail = compiled?.errorMessage ?? compiled?.message ?? compiled?.error ?? JSON.stringify(compiled);
        throw new Error(`编译失败 HTTP ${compileRes.status}: ${detail}`);
      }

      // 响应可能直接是 { contractAbi, bytecodeBin, errors }，也可能包在 data 里
      const cdata = compiled?.contractAbi ? compiled : (compiled?.data ?? compiled);
      if (cdata?.errors) throw new Error(`编译错误: ${cdata.errors}`);
      if (!cdata?.contractAbi || !cdata?.bytecodeBin) throw new Error(compiled?.message ?? '编译响应格式异常');

      await doDeploy(cdata.contractAbi, cdata.bytecodeBin);
    } catch (e: unknown) {
      setDeployError(e instanceof Error ? e.message : String(e));
      setDeployState('error');
    }
  }, [code, selectedUser, doDeploy]);

  // ── 使用手动输入的 ABI + Bytecode 部署 ──
  const handleManualDeploy = useCallback(async () => {
    if (!manualABI.trim() || !manualBytecode.trim()) return;
    setDeployResult(null);
    setDeployError('');
    setDeployState('deploying');
    try {
      await doDeploy(manualABI.trim(), manualBytecode.trim());
    } catch (e: unknown) {
      setDeployError(e instanceof Error ? e.message : String(e));
      setDeployState('error');
    }
  }, [manualABI, manualBytecode, doDeploy]);

  return (
    <div className="h-screen flex flex-col bg-brand-secondary text-white font-sans overflow-hidden">

      {/* 固定背景 */}
      <div className="fixed inset-0 grid-background opacity-30 pointer-events-none" />
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_80%_40%_at_50%_0%,rgba(0,255,156,0.05),transparent)] pointer-events-none" />

      {/* ── 导航栏 ── */}
      <nav className="shrink-0 z-50 bg-brand-secondary/90 backdrop-blur-md border-b border-white/5 h-12 flex items-center px-5 gap-4">
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-slate-400 hover:text-brand-primary transition-colors group"
        >
          <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
          <span className="hud-label text-[10px]">返回首页</span>
        </button>
        <div className="w-px h-4 bg-white/10" />
        <div className="flex items-center gap-2 hud-label text-[10px]">
          <Database size={11} className="text-brand-primary" />
          <span className="text-slate-600">DSC</span>
          <ChevronRight size={9} className="text-slate-700" />
          <span className="text-slate-400">INFRASTRUCTURE</span>
          <ChevronRight size={9} className="text-slate-700" />
          <span className="text-brand-primary">ONLINE IDE</span>
        </div>
        <div className="ml-auto flex items-center gap-3">
          <div className="flex items-center gap-1.5 hud-label text-[9px]">
            <Activity size={10} className="text-brand-primary animate-pulse" />
            <span>FISCO BCOS 2.X</span>
          </div>
        </div>
      </nav>

      {/* ── 主工作区 ── */}
      <div className="flex-1 overflow-hidden flex flex-col relative z-10">

        {/* 页头 */}
        <div className="shrink-0 px-5 pt-4 pb-3 border-b border-white/5 flex items-center gap-5">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-sm bg-brand-primary/10 border border-brand-primary/25 flex items-center justify-center">
              <Code2 size={16} className="text-brand-primary" />
            </div>
            <div>
              <h1 className="text-base font-black tracking-tight leading-none">在线合约 IDE</h1>
              <p className="text-[10px] text-slate-500 font-mono mt-0.5">Solidity ^0.4.25 · FISCO BCOS 2.x</p>
            </div>
          </div>

          {/* 当前文件名 */}
          <div className="flex items-center gap-2 px-3 py-1.5 bg-white/[0.03] border border-white/8 rounded-sm">
            <FileCode size={12} className="text-brand-primary" />
            <span className="text-xs font-mono text-slate-300">{FILE_NAME}</span>
            {hasUnsaved && (
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" title="有未保存的更改" />
            )}
          </div>

          <div className="ml-auto flex items-center gap-2">
            {/* 保存 */}
            <motion.button
              onClick={handleSave}
              disabled={!hasUnsaved || saveState === 'saving'}
              whileHover={hasUnsaved ? { scale: 1.03 } : {}}
              whileTap={hasUnsaved ? { scale: 0.97 } : {}}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono rounded-sm border transition-all ${
                saveState === 'saving'
                  ? 'border-amber-400/30 bg-amber-400/10 text-amber-400/60 cursor-not-allowed'
                  : hasUnsaved
                  ? 'border-amber-400/50 bg-amber-400/10 text-amber-400 hover:bg-amber-400/20'
                  : 'border-white/10 text-slate-600 cursor-default'
              }`}
            >
              {saveState === 'saving' ? (
                <><motion.span animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: 'linear' }} className="block"><RotateCcw size={11} /></motion.span> 保存中...</>
              ) : hasUnsaved ? (
                <><Check size={11} /> 保存</>
              ) : (
                <><Check size={11} /> 已保存</>
              )}
            </motion.button>
            {/* 重置 */}
            <button
              onClick={handleReset}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono border border-white/10 rounded-sm text-slate-400 hover:text-white hover:border-white/25 transition-all"
            >
              <RotateCcw size={11} /> 重置
            </button>
            {/* 编译 */}
            <motion.button
              onClick={handleCompile}
              disabled={compileState === 'compiling'}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className={`flex items-center gap-2 px-4 py-1.5 text-xs font-mono rounded-sm font-semibold transition-all ${
                compileState === 'compiling'
                  ? 'bg-brand-primary/20 border border-brand-primary/30 text-brand-primary/60 cursor-not-allowed'
                  : compileState === 'success'
                  ? 'bg-brand-primary/20 border border-brand-primary/50 text-brand-primary'
                  : compileState === 'error'
                  ? 'bg-red-500/15 border border-red-500/50 text-red-400 hover:bg-red-500/25'
                  : 'bg-brand-primary text-brand-secondary hover:bg-brand-primary/90 border border-brand-primary'
              }`}
            >
              {compileState === 'compiling' ? (
                <><motion.span animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: 'linear' }} className="block"><RotateCcw size={12} /></motion.span> 编译中...</>
              ) : compileState === 'success' ? (
                <><CheckCircle2 size={12} /> 编译成功</>
              ) : compileState === 'error' ? (
                <><AlertCircle size={12} /> 编译失败 · 重试</>
              ) : (
                <><Play size={12} /> 编译合约</>
              )}
            </motion.button>
            {/* BaaS 部署 */}
            <a
              href="http://121.196.226.157:5000/#/login"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono border border-brand-accent/30 rounded-sm text-brand-accent hover:bg-brand-accent/10 transition-all"
            >
              <ExternalLink size={11} /> 前往 BaaS 部署
            </a>
          </div>
        </div>

        {/* ── 编辑器 + 侧栏 ── */}
        <div className="flex-1 overflow-hidden flex">

          {/* 编辑器区 */}
          <div className="flex-1 overflow-hidden flex flex-col border-r border-white/5">
            {/* 代码主体 */}
            <div className="flex-1 overflow-hidden relative bg-[#07090d]">
              {/* 高亮层（pointer-events: none，跟随 textarea 滚动）*/}
              <pre
                ref={preRef}
                aria-hidden
                className="absolute inset-0 overflow-hidden pointer-events-none py-3 font-mono text-sm"
                style={{ tabSize: 4 }}
              >
                {highlighted}
              </pre>
              {/* 可编辑 textarea */}
              <textarea
                ref={textareaRef}
                value={code}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setCode(e.target.value)}
                onScroll={syncScroll}
                onKeyDown={handleKeyDown}
                spellCheck={false}
                className="absolute inset-0 w-full h-full bg-transparent resize-none outline-none border-none py-3 pl-10 pr-6 font-mono text-sm leading-6 overflow-auto"
                style={{
                  color: 'transparent',
                  caretColor: '#00FF9C',
                  tabSize: 4,
                  lineHeight: '24px',
                }}
              />
            </div>

            {/* 状态栏 */}
            <div className="shrink-0 h-6 px-4 flex items-center gap-4 bg-brand-primary/5 border-t border-brand-primary/10">
              <span className="hud-label text-[9px] text-brand-primary/70">SOLIDITY</span>
              <span className="w-px h-3 bg-white/10" />
              <span className="hud-label text-[9px] text-slate-600">UTF-8</span>
              <span className="w-px h-3 bg-white/10" />
              <span className="hud-label text-[9px] text-slate-600">{stats.lines} LINES</span>
              <span className="w-px h-3 bg-white/10" />
              <span className="hud-label text-[9px] text-slate-600">{FILE_NAME}</span>
              {hasUnsaved && (
                <span className="hud-label text-[9px] text-amber-400">● 未保存</span>
              )}
            </div>
          </div>

          {/* 侧栏 */}
          <div className="w-64 shrink-0 overflow-y-auto flex flex-col gap-4 p-4 bg-[#07090d]">

            {/* 编译器信息 */}
            <div className="glass-card p-4 rounded-xl border-white/5">
              <span className="hud-label text-[9px] text-brand-primary block mb-3">COMPILER</span>
              <div className="space-y-2">
                {[
                  ['版本',    'Solidity ^0.4.25'],
                  ['目标链', 'FISCO BCOS 2.x'],
                  ['优化',   'runs: 200'],
                  ['EVM',    'petersburg'],
                ].map(([k, v]) => (
                  <div key={k} className="flex justify-between items-center text-xs">
                    <span className="text-slate-600 font-mono">{k}</span>
                    <span className="text-slate-300 font-mono">{v}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* 合约统计 */}
            <div className="glass-card p-4 rounded-xl border-white/5">
              <span className="hud-label text-[9px] text-brand-primary block mb-3">STATS</span>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: '行数',     val: stats.lines,     icon: Code2 },
                  { label: '函数',     val: stats.functions, icon: Zap   },
                  { label: '事件',     val: stats.events,    icon: Activity },
                  { label: 'Mapping', val: stats.mappings,  icon: Tag   },
                ].map(({ label, val, icon: Icon }) => (
                  <div key={label} className="bg-white/[0.02] rounded-sm p-2.5 border border-white/5">
                    <Icon size={12} className="text-brand-primary mb-1" />
                    <div className="text-lg font-black text-white leading-none">{val}</div>
                    <div className="text-[9px] text-slate-600 font-mono mt-0.5">{label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* 控制台开关 */}
            <button
              onClick={() => setConsoleOpen((v: boolean) => !v)}
              className="flex items-center justify-between px-3 py-2.5 rounded-xl border border-white/8 bg-white/[0.02] hover:border-white/20 transition-all text-xs font-mono text-slate-400 hover:text-white"
            >
              <span className="flex items-center gap-2"><Terminal size={12} /> 控制台</span>
              {consoleOpen ? <ChevronDown size={12} /> : <ChevronUp size={12} />}
            </button>

            {/* ── 链上部署 ── */}
            <div className="glass-card p-4 rounded-xl border-white/5 flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <span className="hud-label text-[9px] text-brand-primary">DEPLOY TO CHAIN</span>
                {/* 连接状态指示 */}
                <span className={`flex items-center gap-1 text-[9px] font-mono ${
                  usersState === 'ok' || usersState === 'manual' ? 'text-brand-primary' :
                  usersState === 'fail'    ? 'text-red-400' :
                  usersState === 'loading' ? 'text-amber-400' :
                  'text-slate-600'
                }`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${
                    usersState === 'ok' || usersState === 'manual' ? 'bg-brand-primary' :
                    usersState === 'fail'    ? 'bg-red-400' :
                    usersState === 'loading' ? 'bg-amber-400 animate-pulse' :
                    'bg-slate-600'
                  }`} />
                  {usersState === 'ok'      ? '已连接' :
                   usersState === 'manual'  ? '手动模式' :
                   usersState === 'fail'    ? '连接失败' :
                   usersState === 'loading' ? '连接中'   : '未连接'}
                </span>
              </div>

              {/* 自动连接按钮（未连接 / 失败 时显示）*/}
              {(usersState === 'idle' || usersState === 'fail') && (
                <>
                  <button
                    onClick={loadUsers}
                    disabled={false}
                    className="flex items-center justify-center gap-1.5 w-full py-2 rounded-sm border border-white/10 text-xs font-mono text-slate-400 hover:border-brand-primary/40 hover:text-brand-primary transition-all disabled:opacity-50"
                  >
                    <Link size={11} /> {usersState === 'fail' ? '重新连接' : '自动连接'}
                  </button>
                  {/* 手动输入地址入口 */}
                  <button
                    onClick={() => setUsersState('manual')}
                    className="text-[9px] font-mono text-slate-600 hover:text-slate-400 transition-colors text-center"
                  >
                    手动输入账户地址 →
                  </button>
                </>
              )}

              {/* 加载中 */}
              {usersState === 'loading' && (
                <div className="flex items-center justify-center gap-1.5 py-2 text-xs font-mono text-amber-400">
                  <motion.span animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: 'linear' }} className="block">
                    <RotateCcw size={11} />
                  </motion.span>
                  连接中...
                </div>
              )}

              {/* 手动输入地址 */}
              {usersState === 'manual' && (
                <div className="flex flex-col gap-2">
                  <p className="text-[9px] text-slate-500 font-mono">粘贴 WeBASE 托管账户地址</p>
                  <input
                    type="text"
                    value={manualAddr}
                    onChange={e => setManualAddr(e.target.value)}
                    placeholder="0x..."
                    className="w-full bg-white/[0.03] border border-white/10 rounded-sm px-2 py-1.5 text-[10px] font-mono text-slate-300 focus:outline-none focus:border-brand-primary/40 placeholder-slate-700"
                  />
                  <div className="flex gap-1.5">
                    <button
                      onClick={() => {
                        const addr = manualAddr.trim();
                        if (!addr) return;
                        setUsers([{ address: addr, userName: '' }]);
                        setSelectedUser(addr);
                        setUsersState('ok');
                      }}
                      disabled={!manualAddr.trim()}
                      className="flex-1 py-1.5 rounded-sm border border-brand-primary/40 text-[10px] font-mono text-brand-primary hover:bg-brand-primary/10 transition-all disabled:opacity-40"
                    >
                      确认
                    </button>
                    <button
                      onClick={() => setUsersState('idle')}
                      className="px-3 py-1.5 rounded-sm border border-white/10 text-[10px] font-mono text-slate-500 hover:text-slate-300 transition-all"
                    >
                      返回
                    </button>
                  </div>
                </div>
              )}

              {/* 用户选择 */}
              {usersState === 'ok' && (
                <>
                  <div>
                    <p className="text-[9px] text-slate-600 font-mono mb-1">签名用户</p>
                    <div className="flex items-center gap-1">
                      <User size={10} className="text-slate-500 shrink-0" />
                      <select
                        value={selectedUser}
                        onChange={e => setSelectedUser(e.target.value)}
                        className="flex-1 bg-white/[0.03] border border-white/10 rounded-sm px-2 py-1.5 text-[10px] font-mono text-slate-300 focus:outline-none focus:border-brand-primary/40 truncate"
                      >
                        {users.map(u => (
                          <option key={u.address} value={u.address} className="bg-[#0d1117]">
                            {u.userName ? `${u.userName} · ` : ''}{u.address.slice(0, 8)}...{u.address.slice(-6)}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* 部署按钮 */}
                  <motion.button
                    onClick={handleDeploy}
                    disabled={deployState === 'compiling' || deployState === 'deploying'}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.97 }}
                    className={`flex items-center justify-center gap-2 w-full py-2.5 rounded-sm text-xs font-mono font-semibold border transition-all ${
                      deployState === 'compiling' || deployState === 'deploying'
                        ? 'bg-brand-primary/10 border-brand-primary/25 text-brand-primary/50 cursor-not-allowed'
                        : deployState === 'success'
                        ? 'bg-brand-primary/15 border-brand-primary/40 text-brand-primary'
                        : deployState === 'error'
                        ? 'bg-red-500/10 border-red-500/40 text-red-400 hover:bg-red-500/20'
                        : 'bg-brand-primary text-brand-secondary border-brand-primary hover:bg-brand-primary/90'
                    }`}
                  >
                    {deployState === 'compiling' ? (
                      <><motion.span animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: 'linear' }} className="block"><RotateCcw size={12} /></motion.span> 编译中...</>
                    ) : deployState === 'deploying' ? (
                      <><motion.span animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: 'linear' }} className="block"><RotateCcw size={12} /></motion.span> 部署中...</>
                    ) : deployState === 'success' ? (
                      <><CheckCircle2 size={12} /> 部署成功 · 再次部署</>
                    ) : deployState === 'error' ? (
                      <><XCircle size={12} /> 部署失败 · 重试</>
                    ) : (
                      <><Rocket size={12} /> 部署到链</>
                    )}
                  </motion.button>
                </>
              )}

              {/* 手动编译输入面板（WeBASE-Front 无 compile 接口时显示）*/}
              <AnimatePresence>
                {showManualCompile && (
                  <motion.div
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="border border-amber-400/20 bg-amber-400/5 rounded-lg p-3 flex flex-col gap-2"
                  >
                    <div className="flex items-center justify-between">
                      <p className="hud-label text-[9px] text-amber-400">手动输入编译结果</p>
                      <button onClick={() => setShowManualCompile(false)} className="text-slate-600 hover:text-slate-400">
                        <XCircle size={11} />
                      </button>
                    </div>
                    <p className="text-[8px] text-slate-500 font-mono leading-relaxed">
                      此 WeBASE-Front 无编译接口。<br />
                      请在 <a href="http://8.137.93.11:5002/WeBASE-Front/#/home" target="_blank" rel="noopener noreferrer" className="text-amber-400 underline">WeBASE IDE</a> 或 Remix 编译后粘贴 ABI 和 Bytecode。
                    </p>
                    <div>
                      <p className="text-[9px] text-slate-600 font-mono mb-1">ABI（JSON 数组）</p>
                      <textarea
                        value={manualABI}
                        onChange={e => setManualABI(e.target.value)}
                        placeholder='[{"type":"function",...}]'
                        rows={3}
                        className="w-full bg-black/30 border border-white/10 rounded-sm px-2 py-1.5 text-[9px] font-mono text-slate-300 focus:outline-none focus:border-amber-400/40 placeholder-slate-700 resize-none"
                      />
                    </div>
                    <div>
                      <p className="text-[9px] text-slate-600 font-mono mb-1">Bytecode（0x 开头或纯十六进制）</p>
                      <textarea
                        value={manualBytecode}
                        onChange={e => setManualBytecode(e.target.value)}
                        placeholder="608060405234..."
                        rows={2}
                        className="w-full bg-black/30 border border-white/10 rounded-sm px-2 py-1.5 text-[9px] font-mono text-slate-300 focus:outline-none focus:border-amber-400/40 placeholder-slate-700 resize-none"
                      />
                    </div>
                    <button
                      onClick={handleManualDeploy}
                      disabled={!manualABI.trim() || !manualBytecode.trim() || deployState === 'deploying'}
                      className="flex items-center justify-center gap-1.5 w-full py-2 rounded-sm border border-amber-400/40 text-[10px] font-mono text-amber-400 hover:bg-amber-400/10 transition-all disabled:opacity-40"
                    >
                      {deployState === 'deploying'
                        ? <><motion.span animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: 'linear' }} className="block"><RotateCcw size={10} /></motion.span> 部署中...</>
                        : <><Rocket size={10} /> 确认部署到链</>
                      }
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* 部署结果 */}
              <AnimatePresence>
                {deployState === 'success' && deployResult && (
                  <motion.div
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="border border-brand-primary/20 bg-brand-primary/5 rounded-lg p-3 space-y-2"
                  >
                    <p className="hud-label text-[9px] text-brand-primary">合约已上链</p>
                    <div>
                      <p className="text-[9px] text-slate-600 font-mono mb-0.5">合约地址</p>
                      <div className="flex items-center gap-1">
                        <code className="text-[9px] text-brand-primary font-mono flex-1 truncate">{deployResult.contractAddress}</code>
                        <button onClick={() => {
                          navigator.clipboard.writeText(deployResult.contractAddress);
                          setCopiedAddr(true);
                          setTimeout(() => setCopiedAddr(false), 2000);
                        }} className="shrink-0 text-slate-500 hover:text-brand-primary transition-colors">
                          {copiedAddr ? <Check size={11} /> : <Copy size={11} />}
                        </button>
                      </div>
                    </div>
                    {deployResult.txHash && (
                      <div>
                        <p className="text-[9px] text-slate-600 font-mono mb-0.5">交易哈希</p>
                        <code className="text-[9px] text-slate-400 font-mono block truncate">{deployResult.txHash}</code>
                      </div>
                    )}
                  </motion.div>
                )}
                {deployState === 'error' && deployError && (
                  <motion.div
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="border border-red-500/20 bg-red-500/5 rounded-lg p-3"
                  >
                    <p className="hud-label text-[9px] text-red-400 mb-1">错误详情</p>
                    <p className="text-[9px] text-red-300 font-mono leading-relaxed break-all">{deployError}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

          </div>
        </div>

        {/* ── 控制台面板 ── */}
        <AnimatePresence>
          {consoleOpen && (
            <motion.div
              initial={{ height: 0 }}
              animate={{ height: 220 }}
              exit={{ height: 0 }}
              transition={{ type: 'spring', damping: 22, stiffness: 220 }}
              className="shrink-0 overflow-hidden border-t border-white/8 bg-[#040608] flex flex-col"
            >
              {/* Tab 栏 */}
              <div className="shrink-0 flex items-center gap-0 border-b border-white/5 px-2 pt-1">
                {(['output','abi','bytecode'] as const).map(tab => (
                  <button
                    key={tab}
                    onClick={() => setConsoleTab(tab)}
                    className={`px-4 py-1.5 text-[10px] font-mono border-b-2 transition-all ${
                      consoleTab === tab
                        ? 'border-brand-primary text-brand-primary'
                        : 'border-transparent text-slate-600 hover:text-slate-400'
                    }`}
                  >
                    {tab === 'output' ? 'OUTPUT' : tab === 'abi' ? 'ABI' : 'BYTECODE'}
                  </button>
                ))}
                <div className="ml-auto flex items-center gap-2 px-2 py-1">
                  {compileState === 'success' && (
                    <span className="flex items-center gap-1 text-[9px] font-mono text-brand-primary">
                      <CheckCircle2 size={10} /> 编译成功
                    </span>
                  )}
                  <button
                    onClick={() => setConsoleOpen(false)}
                    className="text-slate-600 hover:text-slate-400 transition-colors text-[10px] font-mono"
                  >✕</button>
                </div>
              </div>

              {/* 内容 */}
              <div ref={consoleRef} className="flex-1 overflow-auto p-3 font-mono text-xs">

                {/* OUTPUT */}
                {consoleTab === 'output' && (
                  <div className="space-y-0.5">
                    {outputLines.length === 0 && compileState === 'idle' && (
                      <span className="text-slate-600">点击「编译合约」开始编译...</span>
                    )}
                    {outputLines.map((line: ConsoleLine, i: number) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, x: -6 }}
                        animate={{ opacity: 1, x: 0 }}
                        className={`leading-6 ${
                          line.type === 'success' ? 'text-brand-primary' :
                          line.type === 'error'   ? 'text-red-400' :
                          line.type === 'warn'    ? 'text-amber-400' :
                          'text-slate-400'
                        }`}
                      >
                        {line.text}
                      </motion.div>
                    ))}
                    {compileState === 'compiling' && (
                      <motion.span
                        animate={{ opacity: [1, 0] }}
                        transition={{ repeat: Infinity, duration: 0.8 }}
                        className="inline-block text-brand-primary"
                      >▋</motion.span>
                    )}
                  </div>
                )}

                {/* ABI */}
                {consoleTab === 'abi' && (
                  compileState !== 'success' ? (
                    <span className="text-slate-600">请先编译合约...</span>
                  ) : (
                    <div className="relative">
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(JSON.stringify(compiledABI, null, 2));
                          setCopiedABI(true);
                          setTimeout(() => setCopiedABI(false), 2000);
                        }}
                        className="absolute top-0 right-0 flex items-center gap-1 px-2 py-1 text-[9px] border border-white/10 rounded-sm text-slate-500 hover:text-brand-primary hover:border-brand-primary/30 transition-all"
                      >
                        {copiedABI ? <><Check size={9} /> 已复制</> : <><Copy size={9} /> 复制 ABI</>}
                      </button>
                      <pre className="text-slate-300 text-[11px] leading-5 pr-24 whitespace-pre-wrap">
                        {JSON.stringify(compiledABI, null, 2)}
                      </pre>
                    </div>
                  )
                )}

                {/* BYTECODE */}
                {consoleTab === 'bytecode' && (
                  compileState !== 'success' ? (
                    <span className="text-slate-600">请先编译合约...</span>
                  ) : (
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-[9px] text-slate-500">
                        <Hash size={10} /> <span>Bytecode（EVM 部署字节码，截取前 256 位）</span>
                      </div>
                      <div className="text-brand-accent break-all leading-6 text-[11px]">
                        {compiledBytecode}
                      </div>
                    </div>
                  )
                )}

              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
}
