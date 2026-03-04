import React, { useState, useEffect } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import {
  ShieldCheck,
  Database,
  Users,
  Vote,
  TrendingUp,
  Lock,
  Eye,
  ArrowRight,
  Building2,
  Cpu,
  Compass,
  Globe,
  Menu,
  X,
  ChevronRight,
  FileCode,
  Terminal,
  LayoutDashboard,
  SearchCode,
  Activity,
  Zap,
  Layers,
  Server
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import ContractTemplates from './pages/ContractTemplates';
import ContractIDE from './pages/ContractIDE';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${isScrolled ? 'bg-brand-secondary/90 backdrop-blur-md border-b border-white/5 py-3' : 'bg-brand-secondary/40 backdrop-blur-sm py-6'}`}>
      <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
        <div className="flex items-center gap-3 group cursor-pointer">
          <div className="relative">
            <div className="w-10 h-10 bg-brand-primary/20 border border-brand-primary/50 rounded-lg flex items-center justify-center glow-primary group-hover:rotate-90 transition-transform duration-500">
              <Database className="text-brand-primary w-5 h-5" />
            </div>
            <div className="absolute -inset-1 bg-brand-primary/20 blur-lg rounded-lg opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
          <div className="flex flex-col">
            <span className="text-lg font-black tracking-tighter text-white leading-none uppercase">DESPACE</span>
            <span className="hud-label leading-none mt-1 text-white/70">SMART CHAIN</span>
          </div>
        </div>

        {/* Desktop Menu - System Status Indicators */}
        <div className="hidden md:flex items-center gap-10">
          {[
            { label: 'TPS', value: '20,000+' },
            { label: 'NODES', value: '1,024' },
            { label: 'LATENCY', value: '12ms' },
            { label: 'SECURITY', value: 'BFT' }
          ].map((stat) => (
            <div key={stat.label} className="flex flex-col items-start group cursor-default">
              <span className="text-[8px] text-brand-primary/50 font-bold tracking-[0.2em] uppercase group-hover:text-brand-primary transition-colors">{stat.label}</span>
              <span className="text-[10px] text-white/80 font-mono font-medium tracking-tight group-hover:text-white transition-colors">{stat.value}</span>
              <div className="w-full h-[1px] bg-brand-primary/10 mt-1 overflow-hidden">
                <motion.div 
                  animate={{ x: ['-100%', '100%'] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                  className="w-1/2 h-full bg-brand-primary/40"
                />
              </div>
            </div>
          ))}
        </div>

        {/* Mobile Toggle */}
        <button className="md:hidden text-white" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
          {isMobileMenuOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-full left-0 right-0 bg-brand-secondary border-b border-white/10 p-6 md:hidden"
          >
            <div className="flex flex-col gap-6">
              <div className="grid grid-cols-2 gap-4">
                {[
                  { label: 'TPS', value: '20,000+' },
                  { label: 'NODES', value: '1,024' },
                  { label: 'LATENCY', value: '12ms' },
                  { label: 'SECURITY', value: 'BFT' }
                ].map((stat) => (
                  <div key={stat.label} className="p-3 bg-white/5 border border-white/10 rounded-sm">
                    <span className="block text-[8px] text-brand-primary/50 font-bold tracking-widest uppercase mb-1">{stat.label}</span>
                    <span className="text-lg font-mono text-white">{stat.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

const UrbanDigitalTwin = () => {
  return (
    <div className="relative w-full aspect-square flex items-center justify-center overflow-visible">
      {/* Perspective Container */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-[140%] h-[140%] opacity-20" 
             style={{ 
               backgroundImage: 'radial-gradient(circle at center, rgba(0,255,156,0.2) 0%, transparent 70%)',
               transform: 'perspective(1000px) rotateX(60deg) rotateZ(-45deg)' 
             }} 
        />
      </div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.8, rotateX: 60, rotateZ: -45 }}
        animate={{ opacity: 1, scale: 1, rotateX: 60, rotateZ: -45 }}
        transition={{ duration: 1.5, ease: "easeOut" }}
        className="relative w-full h-full"
        style={{ transformStyle: 'preserve-3d' }}
      >
        {/* Base Grid */}
        <div className="absolute inset-0 grid grid-cols-8 grid-rows-8 border border-white/5">
          {[...Array(64)].map((_, i) => (
            <div key={i} className="border border-white/5" />
          ))}
        </div>

        {/* City Assets (Buildings) */}
        {[
          { x: 2, y: 2, h: 80, color: 'brand-primary' },
          { x: 5, y: 1, h: 40, color: 'brand-accent' },
          { x: 1, y: 5, h: 60, color: 'brand-primary' },
          { x: 4, y: 4, h: 120, color: 'brand-primary' },
          { x: 6, y: 6, h: 50, color: 'brand-accent' },
          { x: 2, y: 6, h: 30, color: 'brand-primary' },
        ].map((building, i) => (
          <motion.div
            key={i}
            initial={{ height: 0 }}
            animate={{ height: building.h }}
            transition={{ duration: 1, delay: 0.5 + i * 0.1 }}
            className={`absolute bg-${building.color}/20 border border-${building.color}/40 backdrop-blur-sm`}
            style={{
              width: '12.5%',
              left: `${building.x * 12.5}%`,
              top: `${building.y * 12.5}%`,
              transform: 'translateZ(0)',
              transformStyle: 'preserve-3d',
              boxShadow: `0 0 20px rgba(var(--${building.color}-rgb), 0.1)`
            }}
          >
            {/* Top Face */}
            <div className={`absolute top-0 left-0 w-full h-full bg-${building.color}/40`} 
                 style={{ transform: `translateZ(${building.h}px)` }} />
          </motion.div>
        ))}

        {/* Data Streams */}
        {[...Array(4)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ offset: 0 }}
            animate={{ offset: [0, 1] }}
            transition={{ duration: 3, repeat: Infinity, delay: i * 0.7, ease: "linear" }}
            className="absolute h-px bg-gradient-to-r from-transparent via-brand-primary to-transparent z-50"
            style={{
              width: '100%',
              top: `${(i + 2) * 20}%`,
              opacity: 0.5,
            }}
          />
        ))}
      </motion.div>

      {/* Floating HUD Overlays */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 1.2 }}
          className="absolute top-0 right-0 glass-card p-4 cyber-border min-w-[180px]"
        >
          <div className="flex items-center gap-2 mb-2">
            <Compass size={14} className="text-brand-primary" />
            <span className="hud-label">PRODUCT POSITIONING</span>
          </div>
          <div className="text-xl font-mono text-white tracking-tight">TRUST BASE</div>
          <div className="mt-2 text-[9px] text-slate-500 uppercase tracking-widest font-sans">城市空间资产公信力底座</div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 1.4 }}
          className="absolute bottom-10 left-0 glass-card p-4 cyber-border min-w-[180px]"
        >
          <div className="flex items-center gap-2 mb-2">
            <Cpu size={14} className="text-brand-accent" />
            <span className="hud-label">TECHNICAL ROUTE</span>
          </div>
          <div className="text-xl font-mono text-brand-accent tracking-tight">FISCO BCOS</div>
          <div className="mt-2 text-[9px] text-slate-500 uppercase tracking-widest font-sans">合规联盟链基础设施</div>
        </motion.div>

        {/* Scanning Line */}
        <motion.div 
          animate={{ top: ['0%', '100%', '0%'] }}
          transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
          className="absolute left-0 right-0 h-[2px] bg-brand-primary/20 blur-sm z-10"
        />
      </div>
    </div>
  );
};

const Hero = () => {
  return (
    <section id="vision" className="relative pb-20 overflow-hidden grid-background min-h-screen flex flex-col">
      {/* Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-brand-secondary via-transparent to-brand-secondary pointer-events-none" />
      <div className="absolute top-1/4 -left-20 w-[500px] h-[500px] bg-brand-primary/5 blur-[120px] rounded-full animate-pulse" />
      <div className="absolute bottom-1/4 -right-20 w-[500px] h-[500px] bg-brand-accent/5 blur-[120px] rounded-full animate-pulse" />
      <div className="scanline" />

      {/* Navbar Spacer */}
      <div className="h-32 md:h-40 w-full shrink-0" />
      
      <div className="flex-1 flex items-start py-12 md:py-20">
        <div className="max-w-7xl mx-auto px-6 relative z-10 w-full">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-flex items-center gap-3 px-4 py-1 rounded-sm bg-brand-primary/5 border border-brand-primary/20 text-brand-primary text-[10px] font-bold tracking-[0.2em] mb-8 uppercase">
              <Zap size={12} className="animate-pulse" />
              <span>POWERED BY FISCO BCOS</span>
            </div>
            <h1 className="text-6xl md:text-8xl font-black leading-[0.9] mb-8 tracking-tighter">
              城市空间 <br />
              <span className="inline-block mt-4 px-6 py-2 bg-gradient-to-r from-brand-primary to-brand-accent text-brand-secondary">公信力底座</span>
            </h1>
            <p className="text-lg text-slate-400 mb-10 max-w-xl leading-relaxed font-light">
              DeSpace Smart Chain (DSC) 是专注“城市空间”垂直场景的产业区块链基础设施，为 <span className="text-white font-mono font-bold">320B m²</span> 存量资产提供高频可信数据底座。
            </p>
            <div className="flex flex-wrap gap-6">
              <button className="px-10 py-4 rounded-sm bg-brand-primary text-brand-secondary font-black text-xs uppercase tracking-widest flex items-center gap-3 hover:scale-105 transition-all glow-primary">
                START BUILDING <ArrowRight size={16} />
              </button>
              <button className="px-10 py-4 rounded-sm border border-white/10 hover:border-brand-primary/50 hover:bg-white/5 text-xs font-bold uppercase tracking-widest transition-all">
                DOCUMENTATION
              </button>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="relative hidden lg:block"
          >
            <UrbanDigitalTwin />
          </motion.div>
        </div>
      </div>
    </div>
  </section>
  );
};

const FeatureCard = ({ icon: Icon, title, description, delay }: any) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.6, delay }}
    className="relative group"
  >
    <div className="absolute -inset-0.5 bg-brand-primary rounded-2xl blur opacity-0 group-hover:opacity-20 transition duration-500" />
    <div className="relative glass-card p-8 transition-all cyber-border">
      <div className="w-14 h-14 rounded-sm bg-brand-primary/5 border border-brand-primary/20 flex items-center justify-center mb-6 group-hover:bg-brand-primary/10 transition-colors glow-primary">
        <Icon className="text-brand-primary w-7 h-7" />
      </div>
      <h3 className="text-xl font-black mb-4 tracking-tight">{title}</h3>
      <p className="text-slate-400 leading-relaxed text-sm font-light">{description}</p>
    </div>
  </motion.div>
);

const TrustCrisis = () => {
  return (
    <section className="py-32 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <span className="hud-label text-brand-primary mb-4 block">SOCIAL TRUST</span>
          <h2 className="text-4xl md:text-6xl font-black mb-8 italic font-serif tracking-tighter">信任，是物业治理的最后一块拼图</h2>
          <p className="text-slate-400 max-w-2xl mx-auto text-lg font-light leading-relaxed">
            传统的数字化手段只解决了效率问题，却无法解决信任问题。业主不信任账目、不信任投票、不信任治理。
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-10">
          <FeatureCard 
            icon={Eye}
            title="账目不透明"
            description="收支明细难以核实，公共收益去向不明，导致业主与物业长期对立。"
            delay={0.1}
          />
          <FeatureCard 
            icon={Vote}
            title="投票造假疑云"
            description="重大事项决策投票过程不透明，结果易被篡改，业主参与感极低。"
            delay={0.2}
          />
          <FeatureCard 
            icon={Users}
            title="治理参与度低"
            description="缺乏多方共治的机制，社区治理沦为单方面的管理，而非共同的经营。"
            delay={0.3}
          />
        </div>
      </div>
    </section>
  );
};

const DeveloperTools = () => {
  const navigate = useNavigate();
  const tools = [
    { title: '标准合约模板', desc: '内置 ERC-20 (DSCToken) 与 ERC-721 (DSCNFT) 模板，开箱即用。', icon: FileCode, tag: 'v1.2', route: '/contracts' },
    { title: '在线合约 IDE', desc: '浏览器端 Solidity 编辑器，语法高亮 · 一键编译 · 生成 ABI，无需本地环境。', icon: Terminal, tag: 'ONLINE', route: '/ide' },
    { title: 'BaaS 管理平台', desc: '一站式节点管理、合约部署与数据看板，降低运维门槛。', icon: LayoutDashboard, tag: 'CLOUD', url: 'http://121.196.226.157:5000/#/login' },
    { title: '区块浏览器', desc: '专业版 Web 端与简化版小程序内嵌，全方位透明监督。', icon: SearchCode, tag: 'LIVE', url: 'http://8.137.93.11:5100/#/home' },
  ];

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <section id="developers" className="py-32 relative">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(0,255,156,0.05),transparent_50%)]" />
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6"
        >
          <div className="max-w-2xl">
            <span className="hud-label text-brand-primary mb-4 block">INFRASTRUCTURE</span>
            <h2 className="text-4xl md:text-5xl font-black mb-4 tracking-tighter">开发者工具链</h2>
            <p className="text-slate-400 font-light">为开发者提供全套工业级区块链基础设施工具，降低集成成本。</p>
          </div>
          <div className="flex items-center gap-4 hud-label border border-white/10 px-4 py-2 rounded-sm">
            <Activity size={14} className="text-brand-primary animate-pulse" />
            <span>NETWORK: FISCO-BCOS</span>
          </div>
        </motion.div>
        
        <motion.div 
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {tools.map((tool, i) => (
            <div key={i} className="relative group">
              <div className="absolute -inset-0.5 bg-brand-primary rounded-2xl blur opacity-0 group-hover:opacity-20 transition duration-500" />
              <motion.div
                variants={item}
                whileHover={{ y: -10, scale: 1.02 }}
                onClick={() => {
                  if (tool.route) navigate(tool.route);
                  else if (tool.url) window.open(tool.url, '_blank');
                }}
                className={`relative glass-card p-8 border-white/5 hover:border-brand-primary/40 transition-all overflow-hidden cyber-border h-full ${tool.route || tool.url ? 'cursor-pointer' : ''}`}
              >
                <div className="absolute top-0 right-0 p-4">
                  <span className="text-[8px] font-mono text-slate-600 border border-white/5 px-2 py-0.5 rounded-sm">{tool.tag}</span>
                </div>
                <div className="w-14 h-14 rounded-sm bg-brand-primary/5 border border-brand-primary/20 flex items-center justify-center mb-8 group-hover:glow-primary transition-all">
                  <tool.icon className="text-brand-primary w-7 h-7" />
                </div>
                <h4 className="font-black text-lg mb-3 tracking-tight">{tool.title}</h4>
                <p className="text-sm text-slate-500 leading-relaxed font-light group-hover:text-slate-300 transition-colors">{tool.desc}</p>

                <div className="mt-8 pt-6 border-t border-white/5 flex justify-between items-center">
                  <span className="hud-label text-[8px]">ACCESS MODULE</span>
                  <ChevronRight size={14} className="text-brand-primary opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all" />
                </div>
              </motion.div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

const CodePreview = () => {
  return (
    <section className="py-32 relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(circle_at_50%_50%,rgba(0,209,255,0.03),transparent_70%)]" />
      
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid lg:grid-cols-2 gap-20 items-center">
          <div>
            <span className="hud-label text-brand-accent mb-4 block">QUICK INTEGRATION</span>
            <h2 className="text-5xl font-black mb-8 tracking-tighter leading-tight">5 分钟部署 <br />第一个合约</h2>
            <p className="text-slate-400 mb-10 leading-relaxed font-light text-lg">
              通过 DSC SDK，开发者可以快速实现资产存证、积分发放等业务逻辑。我们提供了完善的示例代码与文档，降低区块链开发门槛。
            </p>
            <div className="grid grid-cols-2 gap-6 mb-10">
              {[
                { label: 'ACCOUNT', val: '国密账户管理' },
                { label: 'DEPLOY', val: '合约自动部署' },
                { label: 'LISTEN', val: '链上事件监听' },
                { label: 'VERIFY', val: '数据一致性校验' }
              ].map((item, i) => (
                <div key={i} className="flex flex-col gap-1">
                  <span className="hud-label text-[8px] text-brand-primary">{item.label}</span>
                  <span className="text-sm text-slate-300 font-medium">{item.val}</span>
                </div>
              ))}
            </div>
            <button className="flex items-center gap-2 text-brand-primary font-bold text-xs uppercase tracking-widest group">
              VIEW FULL DOCUMENTATION <ArrowRight size={14} className="group-hover:translate-x-2 transition-transform" />
            </button>
          </div>

          <div className="relative">
            <div className="absolute -inset-4 bg-brand-accent/10 blur-3xl rounded-full opacity-50" />
            <div className="glass-card bg-[#011627]/90 p-8 font-mono text-sm overflow-hidden shadow-2xl cyber-border relative z-10">
              <div className="flex justify-between items-center mb-6 border-b border-white/5 pb-4">
                <div className="flex gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500/30" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500/30" />
                  <div className="w-3 h-3 rounded-full bg-green-500/30" />
                </div>
                <div className="hud-label text-[8px]">evidence_deploy.ts</div>
              </div>
              <pre className="text-slate-300 leading-relaxed">
                <code className="block">
                  <span className="text-pink-500">import</span> {'{ BcosSDK }'} <span className="text-pink-500">from</span> <span className="text-cyan-400">'@fisco-bcos/web3sdk'</span>;<br />
                  <span className="text-pink-500">import</span> {'{ Evidence }'} <span className="text-pink-500">from</span> <span className="text-cyan-400">'./contracts/Evidence'</span>;<br /><br />
                  <span className="text-slate-500">// 1. 初始化 SDK & 获取国密客户端</span><br />
                  <span className="text-pink-500">const</span> sdk = <span className="text-pink-500">await</span> BcosSDK.build(<span className="text-cyan-400">'./config.toml'</span>);<br />
                  <span className="text-pink-500">const</span> client = sdk.getClient(<span className="text-yellow-400">1</span>);<br /><br />
                  <span className="text-slate-500">// 2. 获取国密密钥对</span><br />
                  <span className="text-pink-500">const</span> keyPair = client.getCryptoSuite().getCryptoKeyPair();<br /><br />
                  <span className="text-slate-500">// 3. 部署存证合约</span><br />
                  <span className="text-pink-500">const</span> evidence = <span className="text-pink-500">await</span> Evidence.deploy(client, keyPair);<br /><br />
                  <span className="text-slate-500">// 4. 提交存证哈希上链</span><br />
                  <span className="text-pink-500">const</span> receipt = <span className="text-pink-500">await</span> evidence.newEvidence(<br />
                  &nbsp;&nbsp;<span className="text-cyan-400">'0x8f2a3b...e91c'</span>, &nbsp;<span className="text-cyan-400">'finance'</span><br />
                  );
                </code>
              </pre>
              <div className="mt-6 pt-4 border-t border-white/5 flex justify-between items-center opacity-50">
                <span className="text-[10px] text-slate-500">Lines: 15</span>
                <span className="text-[10px] text-slate-500">UTF-8</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const TechnicalAdvantages = () => {
  const advantages = [
    {
      title: '极速性能：支撑高频治理',
      desc: '基于 FISCO BCOS 的并行计算与 PBFT 共识机制，支持万级 TPS 与秒级交易确认。确保在大型社区的重大表决或高频物业缴费场景下，系统依然稳健高效。',
      icon: Cpu,
      stats: '10,000+ TPS',
      id: 'PERF_01'
    },
    {
      title: '金融级安全：守护业主隐私',
      desc: '全面支持国密算法，提供细粒度的权限控制与隐私计算方案。在实现财务公开透明的同时，严格保护业主的个人身份信息不被泄露。',
      icon: ShieldCheck,
      stats: 'SM2/SM3/SM4',
      id: 'SEC_02'
    },
    {
      title: '弹性扩展：覆盖城市空间',
      desc: '独创的多群组架构，支持根据社区规模动态扩展。通过跨链交互技术，实现从单一小区到智慧城市级空间资产的互联互通。',
      icon: Globe,
      stats: 'MULTI-GROUP',
      id: 'SCALE_03'
    }
  ];

  return (
    <section id="technology" className="py-32 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_0%_0%,rgba(0,255,156,0.02)_0%,transparent_50%)]" />
      
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="flex flex-col lg:flex-row gap-20">
          <div className="lg:w-2/5">
            <div className="sticky top-32">
              <span className="hud-label text-brand-primary mb-4 block">CORE ENGINE</span>
              <h2 className="text-5xl md:text-6xl font-black mb-8 leading-tight tracking-tighter">
                技术优势 <br />
                <span className="text-brand-primary italic font-serif text-4xl">FISCO BCOS</span>
              </h2>
              <p className="text-slate-400 mb-10 leading-relaxed font-light text-lg">
                DeSpace Smart Chain 采用国产自主可控的 FISCO BCOS 平台，针对物业治理的特殊需求进行了深度优化，将金融级的技术标准引入社区管理。
              </p>
              <div className="p-8 glass-card border-brand-primary/20 bg-brand-primary/5 cyber-border">
                <h4 className="text-brand-primary font-black mb-4 flex items-center gap-3 tracking-widest uppercase text-xs">
                  <ShieldCheck size={18} /> 信任闭环协议
                </h4>
                <p className="text-sm text-slate-400 leading-relaxed font-light">
                  技术优势不仅是参数的领先，更是对“不可篡改”承诺的兑现。每一行代码都在为业主与物业之间的信任背书。
                </p>
              </div>
            </div>
          </div>

          <div className="lg:w-3/5 space-y-8">
            {advantages.map((adv, i) => (
              <div key={i} className="relative group">
                <div className="absolute -inset-0.5 bg-brand-primary rounded-2xl blur opacity-0 group-hover:opacity-20 transition duration-500" />
                <motion.div
                  initial={{ opacity: 0, x: 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: i * 0.1 }}
                  className="relative glass-card p-10 flex flex-col md:flex-row gap-10 items-start md:items-center hover:bg-white/[0.04] transition-all border-l-2 border-l-transparent hover:border-l-brand-primary cyber-border"
                >
                  <div className="w-20 h-20 shrink-0 rounded-sm bg-brand-secondary border border-white/10 flex items-center justify-center shadow-2xl group-hover:glow-primary transition-all">
                    <adv.icon className="text-brand-primary w-10 h-10" />
                  </div>
                  <div className="flex-grow">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex flex-col">
                        <span className="hud-label text-[8px] text-brand-primary mb-1">{adv.id}</span>
                        <h3 className="text-2xl font-black tracking-tight">{adv.title}</h3>
                      </div>
                      <span className="text-[10px] font-mono bg-brand-primary/10 text-brand-primary px-3 py-1 rounded-sm uppercase tracking-widest border border-brand-primary/20">
                        {adv.stats}
                      </span>
                    </div>
                    <p className="text-slate-400 leading-relaxed font-light">
                      {adv.desc}
                    </p>
                  </div>
                </motion.div>
              </div>
            ))}

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-16">
              {[
                { label: 'CONSENSUS', value: 'PBFT' },
                { label: 'ENCRYPTION', value: 'SM2/SM3' },
                { label: 'STORAGE', value: 'RocksDB' },
                { label: 'LANGUAGE', value: 'Solidity' },
              ].map((item, i) => (
                <div key={i} className="glass-card p-6 text-center cyber-border">
                  <div className="hud-label text-[8px] mb-2">{item.label}</div>
                  <div className="text-lg font-mono text-white font-bold">{item.value}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const Solutions = () => {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const item = {
    hidden: { opacity: 0, scale: 0.95 },
    show: { opacity: 1, scale: 1 }
  };

  return (
    <section id="solutions" className="py-32 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_100%,rgba(0,209,255,0.05),transparent_50%)]" />
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-24"
        >
          <span className="hud-label text-brand-primary mb-4 block">ECOSYSTEM</span>
          <h2 className="text-5xl font-black mb-6 tracking-tighter">核心应用场景</h2>
          <p className="text-slate-400 max-w-2xl mx-auto font-light text-lg">
            从“不可信”到“可信”，从“不可计价”到“可交易”，实现基础设施的跃迁。
          </p>
        </motion.div>

        <motion.div 
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-10 mb-20"
        >
          {[
            { 
              title: '阳光账本', 
              icon: Database, 
              color: 'brand-primary',
              items: ['公共收益流水实时上链，业主随时在线审计。', '维修基金使用全程留痕，杜绝资金挪用风险。']
            },
            { 
              title: '可信投票', 
              icon: Vote, 
              color: 'brand-accent',
              items: ['基于 DID 身份认证，确保“一户一票”，无法冒充。', '投票过程全透明，结果自动公示且不可撤回。']
            },
            { 
              title: '社区积分', 
              icon: TrendingUp, 
              color: 'brand-primary',
              items: ['行为挖矿：垃圾分类、按时缴费即可获得链上积分。', '权益兑换：积分可抵扣物业费或兑换周边商户服务。']
            },
            { 
              title: '资产确权', 
              icon: ShieldCheck, 
              color: 'brand-accent',
              items: ['空间确权：对社区公共空间、共有设施进行链上登记，明确产权归属。', '权益存证：业主委员会决议、物业合同等核心权益文件上链，确立法律效力。']
            },
            { 
              title: '数据资产', 
              icon: Layers, 
              color: 'brand-primary',
              items: ['数据资产化：将社区运营数据转化为可信资产，为物业融资提供信用背书。', 'RWA 映射：对接 AssetX 平台，实现物理资产与数字资产的 1:1 映射与流转。']
            }
          ].map((solution, i) => (
            <motion.div key={i} variants={item} className="relative group">
              <div className="absolute -inset-0.5 bg-brand-primary rounded-2xl blur opacity-0 group-hover:opacity-20 transition duration-500"></div>
              <div className="relative glass-card p-10 h-full cyber-border flex flex-col">
                <div className="flex items-center gap-4 mb-8">
                  <div className={`w-12 h-12 rounded-sm flex items-center justify-center border ${solution.color === 'brand-primary' ? 'bg-brand-primary/10 border-brand-primary/20' : 'bg-brand-accent/10 border-brand-accent/20'}`}>
                    <solution.icon className={solution.color === 'brand-primary' ? 'text-brand-primary' : 'text-brand-accent'} size={24} />
                  </div>
                  <h3 className="text-2xl font-black tracking-tight">{solution.title}</h3>
                </div>
                <ul className="space-y-6 flex-grow">
                  {solution.items.map((item, j) => (
                    <li key={j} className="flex items-start gap-4 group/item">
                      <div className={`w-1.5 h-1.5 rounded-full ${solution.color === 'brand-primary' ? 'bg-brand-primary' : 'bg-brand-accent'} mt-2 shrink-0 animate-pulse`} />
                      <span className="text-sm text-slate-400 leading-relaxed font-light group-hover/item:text-slate-200 transition-colors">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          ))}
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="glass-card p-16 text-center relative overflow-hidden cyber-border bg-brand-primary/[0.01]"
        >
          <div className="absolute top-0 right-0 p-8 opacity-10">
            <Globe className="text-brand-primary w-48 h-48" />
          </div>
          <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-brand-primary/10 blur-[100px] rounded-full" />
          
          <span className="hud-label text-brand-primary mb-6 block">RWA BRIDGE</span>
          <h3 className="text-4xl font-black mb-8 tracking-tighter">AssetX RWA 桥接</h3>
          <p className="text-xl text-slate-400 max-w-3xl mx-auto mb-12 font-light leading-relaxed">
            DSC 作为城市空间资产的数据底座，为 AssetX 提供可信 Oracle 数据包。通过 RWA 技术，实现从“不可计价”到“可交易”的跨越。
          </p>
          <div className="flex flex-wrap justify-center gap-6">
            <button className="px-12 py-5 rounded-sm bg-brand-primary text-brand-secondary font-black text-xs uppercase tracking-widest hover:scale-105 transition-all glow-primary">
              探索资产数字化方案
            </button>
            <button className="px-12 py-5 rounded-sm border border-white/10 hover:border-brand-accent/50 hover:bg-white/5 text-xs font-bold uppercase tracking-widest transition-all">
              了解 AssetX 平台
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

const Footer = () => {
  return (
    <footer className="py-24 border-t border-white/5 relative overflow-hidden">
      <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-brand-primary via-brand-accent to-brand-primary opacity-20" />
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid md:grid-cols-4 gap-16 mb-20">
          <div className="col-span-2">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 bg-brand-primary/10 border border-brand-primary/30 rounded-sm flex items-center justify-center">
                <Database className="text-brand-primary w-5 h-5" />
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-black text-white tracking-tighter">DESPACE</span>
                <span className="hud-label text-[8px] uppercase">SMART CHAIN</span>
              </div>
            </div>
            <p className="text-slate-500 max-w-sm mb-10 font-light leading-relaxed">
              重构物业信任，赋能空间价值。基于 FISCO BCOS 的城市空间资产治理联盟链基础设施。
            </p>
            <div className="flex gap-4">
              {['Twitter', 'GitHub', 'Telegram', 'Discord'].map(social => (
                <a key={social} href="#" className="w-12 h-12 rounded-sm bg-white/[0.02] border border-white/5 flex items-center justify-center hover:border-brand-primary/30 hover:bg-brand-primary/5 hover:text-brand-primary transition-all group">
                  <div className="hud-label text-[10px] group-hover:scale-110 transition-transform">{social[0]}</div>
                </a>
              ))}
            </div>
          </div>
          
          <div>
            <h4 className="hud-label text-white mb-8">DEVELOPERS</h4>
            <ul className="space-y-4 text-slate-500 text-[10px] font-light uppercase tracking-widest">
              <li><a href="#" className="hover:text-brand-primary transition-colors">DOCUMENTATION</a></li>
              <li><a href="#" className="hover:text-brand-primary transition-colors">SMART CONTRACTS</a></li>
              <li><a href="#" className="hover:text-brand-primary transition-colors">NODE SETUP</a></li>
              <li><a href="#" className="hover:text-brand-primary transition-colors">API REFERENCE</a></li>
            </ul>
          </div>

          <div>
            <h4 className="hud-label text-white mb-8">COMPANY</h4>
            <ul className="space-y-4 text-slate-500 text-[10px] font-light uppercase tracking-widest">
              <li><a href="#" className="hover:text-brand-primary transition-colors">VISION & MISSION</a></li>
              <li><a href="#" className="hover:text-brand-primary transition-colors">PARTNERSHIPS</a></li>
              <li><a href="#" className="hover:text-brand-primary transition-colors">ECOSYSTEM</a></li>
              <li><a href="#" className="hover:text-brand-primary transition-colors">CONTACT</a></li>
            </ul>
          </div>
        </div>
        
        <div className="pt-10 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="hud-label text-[8px]">© 2026 DESPACE SMART CHAIN. ALL RIGHTS RESERVED.</div>
          <div className="flex gap-10">
            <a href="#" className="hud-label text-[8px] hover:text-white transition-colors">PRIVACY POLICY</a>
            <a href="#" className="hud-label text-[8px] hover:text-white transition-colors">TERMS OF SERVICE</a>
          </div>
          <div className="flex items-center gap-2 hud-label text-[8px]">
            <div className="w-1.5 h-1.5 rounded-full bg-brand-primary animate-pulse" />
            <span>MAINNET STATUS: OPERATIONAL</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

const BlockchainBackground = () => {
  const canvasRef = React.useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let particles: Particle[] = [];
    let streams: DataStream[] = [];
    const particleCount = 50;
    const streamCount = 20;
    const connectionDistance = 250;

    class Particle {
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
      pulse: number;
      color: string;

      constructor(w: number, h: number) {
        this.x = Math.random() * w;
        this.y = Math.random() * h;
        this.vx = (Math.random() - 0.5) * 0.4;
        this.vy = (Math.random() - 0.5) * 0.4;
        this.size = Math.random() * 2 + 0.5;
        this.pulse = Math.random() * Math.PI;
        this.color = Math.random() > 0.8 ? 'rgba(0, 209, 255, ' : 'rgba(0, 255, 156, ';
      }

      update(w: number, h: number) {
        this.x += this.vx;
        this.y += this.vy;
        this.pulse += 0.015;

        if (this.x < 0 || this.x > w) this.vx *= -1;
        if (this.y < 0 || this.y > h) this.vy *= -1;
      }

      draw(ctx: CanvasRenderingContext2D) {
        const alpha = 0.05 + Math.sin(this.pulse) * 0.1;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = `${this.color}${alpha})`;
        ctx.fill();
        
        if (Math.sin(this.pulse) > 0.92) {
          ctx.beginPath();
          ctx.arc(this.x, this.y, this.size * 4, 0, Math.PI * 2);
          ctx.fillStyle = `${this.color}0.03)`;
          ctx.fill();
        }
      }
    }

    class DataStream {
      x: number;
      y: number;
      speed: number;
      length: number;
      opacity: number;
      color: string;

      constructor(w: number, h: number) {
        this.reset(w, h);
      }

      reset(w: number, h: number) {
        this.x = Math.random() * w;
        this.y = -200;
        this.speed = Math.random() * 3 + 1;
        this.length = Math.random() * 200 + 100;
        this.opacity = Math.random() * 0.15;
        this.color = Math.random() > 0.5 ? '0, 255, 156' : '0, 209, 255';
      }

      update(w: number, h: number) {
        this.y += this.speed;
        if (this.y > h + 200) {
          this.reset(w, h);
        }
      }

      draw(ctx: CanvasRenderingContext2D) {
        const gradient = ctx.createLinearGradient(this.x, this.y, this.x, this.y + this.length);
        gradient.addColorStop(0, `rgba(${this.color}, 0)`);
        gradient.addColorStop(0.5, `rgba(${this.color}, ${this.opacity})`);
        gradient.addColorStop(1, `rgba(${this.color}, 0)`);
        
        ctx.beginPath();
        ctx.moveTo(this.x, this.y);
        ctx.lineTo(this.x, this.y + this.length);
        ctx.strokeStyle = gradient;
        ctx.lineWidth = 1.5;
        ctx.stroke();
      }
    }

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      particles = [];
      streams = [];
      for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle(canvas.width, canvas.height));
      }
      for (let i = 0; i < streamCount; i++) {
        streams.push(new DataStream(canvas.width, canvas.height));
      }
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Draw Grid
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.015)';
      ctx.lineWidth = 0.5;
      const gridSize = 120;
      for (let x = 0; x < canvas.width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
      }
      for (let y = 0; y < canvas.height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
      }

      streams.forEach(s => {
        s.update(canvas.width, canvas.height);
        s.draw(ctx);
      });

      particles.forEach((p, i) => {
        p.update(canvas.width, canvas.height);
        p.draw(ctx);

        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dx = p.x - p2.x;
          const dy = p.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < connectionDistance) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            const opacity = (1 - dist / connectionDistance) * 0.08;
            ctx.strokeStyle = `rgba(0, 255, 156, ${opacity})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
            
            if (Math.sin(p.pulse) > 0.96) {
              const t = (Math.sin(p.pulse * 3) + 1) / 2;
              const px = p.x + (p2.x - p.x) * t;
              const py = p.y + (p2.y - p.y) * t;
              ctx.beginPath();
              ctx.arc(px, py, 1.2, 0, Math.PI * 2);
              ctx.fillStyle = `rgba(0, 255, 156, 0.5)`;
              ctx.fill();
            }
          }
        }
      });

      animationFrameId = requestAnimationFrame(animate);
    };

    window.addEventListener('resize', resize);
    resize();
    animate();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <>
      <canvas 
        ref={canvasRef} 
        className="fixed inset-0 pointer-events-none z-0"
        style={{ opacity: 0.7 }}
      />
      <div className="fixed inset-0 pointer-events-none z-0 bg-[radial-gradient(circle_at_50%_50%,transparent_0%,rgba(5,5,5,0.4)_100%)]" />
      <div className="fixed inset-0 pointer-events-none z-0 opacity-[0.03] mix-blend-overlay bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />
    </>
  );
};

const HomePage = () => (
  <div className="min-h-screen font-sans selection:bg-brand-primary selection:text-brand-secondary relative">
    <BlockchainBackground />
    <div className="relative z-10">
      <Navbar />
      <Hero />
      <DeveloperTools />
      <CodePreview />
      <TrustCrisis />
      <TechnicalAdvantages />
      <Solutions />
      <Footer />
    </div>
  </div>
);

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/contracts" element={<ContractTemplates />} />
      <Route path="/ide"       element={<ContractIDE />} />
    </Routes>
  );
}
