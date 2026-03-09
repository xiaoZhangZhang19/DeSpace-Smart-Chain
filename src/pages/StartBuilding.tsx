import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import {
  ArrowLeft, Database, Terminal, FileCode, Cpu, Server,
  CheckCircle2, ChevronRight, Copy, Check, BookOpen,
  Layers, Shield, Zap, ArrowRight
} from 'lucide-react';

const CodeBlock = ({ code, language = 'bash' }: { code: string; language?: string }) => {
  const [copied, setCopied] = useState(false);
  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <div className="relative my-4 rounded-sm overflow-hidden border border-white/10">
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

const StepCard = ({
  step, icon: Icon, title, description, children, done = false
}: {
  step: number; icon: React.ElementType; title: string; description: string; children?: React.ReactNode; done?: boolean;
}) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.5, delay: step * 0.08 }}
    className="relative"
  >
    {/* Connector line */}
    <div className="absolute left-6 top-16 bottom-0 w-px bg-white/5 -z-10" />

    <div className="flex gap-5">
      {/* Step indicator */}
      <div className="shrink-0 flex flex-col items-center gap-1">
        <div className={`w-12 h-12 rounded-sm border flex items-center justify-center ${done ? 'bg-brand-primary/20 border-brand-primary/50' : 'bg-white/5 border-white/10'}`}>
          <Icon size={18} className={done ? 'text-brand-primary' : 'text-slate-500'} />
        </div>
        <span className="text-[10px] font-mono text-slate-600 font-bold">0{step}</span>
      </div>

      {/* Content */}
      <div className="flex-1 pb-10">
        <div className="flex items-center gap-3 mb-1">
          <h3 className="text-base font-black text-white tracking-tight">{title}</h3>
          {done && <CheckCircle2 size={14} className="text-brand-primary" />}
        </div>
        <p className="text-slate-500 text-xs mb-4 leading-relaxed">{description}</p>
        {children}
      </div>
    </div>
  </motion.div>
);

const Note = ({ type = 'note', children }: { type?: 'note' | 'warning' | 'tip'; children: React.ReactNode }) => {
  const map: Record<string, { label: string; cls: string }> = {
    note:    { label: '注解',  cls: 'border-blue-500/40 bg-blue-500/5 text-blue-300' },
    warning: { label: '注意',  cls: 'border-yellow-500/40 bg-yellow-500/5 text-yellow-300' },
    tip:     { label: '提示',  cls: 'border-brand-primary/40 bg-brand-primary/5 text-brand-primary' },
  };
  const s = map[type];
  return (
    <div className={`my-4 rounded-sm border p-4 ${s.cls}`}>
      <div className="font-bold text-xs uppercase tracking-widest mb-2">{s.label}</div>
      <div className="text-sm leading-relaxed text-slate-300">{children}</div>
    </div>
  );
};

const QuickLink = ({ icon: Icon, title, desc, route }: { icon: React.ElementType; title: string; desc: string; route: string }) => {
  const navigate = useNavigate();
  return (
    <button
      onClick={() => navigate(route)}
      className="group w-full flex items-start gap-4 p-4 rounded-sm border border-white/5 bg-white/2 hover:bg-brand-primary/5 hover:border-brand-primary/20 transition-all text-left"
    >
      <div className="w-10 h-10 rounded-sm bg-brand-primary/10 border border-brand-primary/20 flex items-center justify-center shrink-0 group-hover:bg-brand-primary/20 transition-colors">
        <Icon size={16} className="text-brand-primary" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-sm font-bold text-white mb-0.5 group-hover:text-brand-primary transition-colors">{title}</div>
        <div className="text-xs text-slate-500 leading-relaxed">{desc}</div>
      </div>
      <ChevronRight size={14} className="text-slate-600 group-hover:text-brand-primary transition-colors mt-0.5 shrink-0" />
    </button>
  );
};

export default function StartBuilding() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#020c18] text-white font-sans">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-[#020c18]/90 backdrop-blur-md border-b border-white/5 h-14 flex items-center px-6 gap-4">
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors text-xs font-bold uppercase tracking-widest"
        >
          <ArrowLeft size={14} /> 返回官网
        </button>
        <span className="text-white/10">|</span>
        <div className="flex items-center gap-2">
          <Zap size={14} className="text-brand-primary" />
          <span className="text-xs font-black uppercase tracking-widest text-white">快速开始</span>
        </div>
      </header>

      <main className="pt-14">
        {/* Hero Banner */}
        <div className="relative border-b border-white/5 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-brand-primary/5 via-transparent to-brand-accent/5 pointer-events-none" />
          <div className="absolute inset-0 grid-background opacity-30 pointer-events-none" />
          <div className="max-w-4xl mx-auto px-6 md:px-12 lg:px-16 py-16 relative">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-sm bg-brand-primary/10 border border-brand-primary/20 text-brand-primary text-[10px] font-bold tracking-widest uppercase mb-6">
                <Zap size={10} className="animate-pulse" /> QUICK START
              </div>
              <h1 className="text-4xl md:text-5xl font-black tracking-tighter mb-4 leading-tight">
                开始构建你的<br />
                <span className="text-brand-primary">区块链应用</span>
              </h1>
              <p className="text-slate-400 text-base leading-relaxed max-w-2xl">
                按照以下步骤，从零开始在 DeSpace 上部署第一个智能合约应用。
                整个过程约需 <span className="text-white font-mono font-bold">30 分钟</span>。
              </p>
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="flex flex-wrap gap-6 mt-10"
            >
              {[
                { label: '步骤', value: '5' },
                { label: '预计时间', value: '30 min' },
                { label: '难度', value: '入门级' },
                { label: '依赖', value: 'JDK 14+' },
              ].map(s => (
                <div key={s.label} className="flex flex-col">
                  <span className="text-[10px] text-brand-primary/50 font-bold tracking-widest uppercase">{s.label}</span>
                  <span className="text-sm font-mono text-white font-bold">{s.value}</span>
                </div>
              ))}
            </motion.div>
          </div>
        </div>

        {/* Steps */}
        <div className="max-w-4xl mx-auto px-6 md:px-12 lg:px-16 py-12">

          {/* Step 1 */}
          <StepCard
            step={1}
            icon={Cpu}
            title="准备开发环境"
            description="在开始之前，请确保已在本地安装以下依赖工具。"
          >
            <div className="grid sm:grid-cols-2 gap-3 mb-4">
              {[
                { name: 'JDK 14+', desc: 'Java 开发运行环境', required: true },
                { name: 'Gradle 6+', desc: '项目构建工具', required: true },
                { name: 'Git', desc: '版本管理工具', required: true },
                { name: 'curl', desc: '网络请求工具（脚本下载）', required: false },
              ].map(dep => (
                <div key={dep.name} className="flex items-start gap-3 p-3 rounded-sm bg-white/3 border border-white/5">
                  <div className={`mt-0.5 w-2 h-2 rounded-full shrink-0 ${dep.required ? 'bg-brand-primary' : 'bg-slate-600'}`} />
                  <div>
                    <div className="text-xs font-bold text-white font-mono">{dep.name}</div>
                    <div className="text-[11px] text-slate-500 mt-0.5">{dep.desc}</div>
                  </div>
                </div>
              ))}
            </div>
            <CodeBlock language="bash" code={`# 检查 JDK 版本（需 14 及以上）
java -version

# 检查 Gradle 版本（需 6 及以上）
gradle -version`} />
            <Note type="tip">推荐使用 Ubuntu 16.04/18.04 或 macOS 作为开发环境。Windows 用户建议使用 WSL2。</Note>
          </StepCard>

          {/* Step 2 */}
          <StepCard
            step={2}
            icon={Server}
            title="搭建 DeSpace 区块链"
            description="使用官方脚本一键生成本地 4 节点区块链网络，用于开发测试。"
          >
            <CodeBlock language="bash" code={`# 创建工作目录
mkdir -p ~/despace && cd ~/despace

# 下载一键搭链脚本
curl -#LO https://github.com/DeSpace-Chain/releases/download/v2.11.0/build_chain.sh
chmod u+x build_chain.sh

# 生成单机 4 节点链（默认群组 1，IP 127.0.0.1，起始端口 30300）
bash build_chain.sh -l 127.0.0.1:4 -p 30300,20200,8545

# 启动所有节点
bash nodes/127.0.0.1/start_all.sh`} />
            <Note type="note">若脚本下载较慢，可前往 GitHub Releases 页面手动下载 build_chain.sh。</Note>
            <CodeBlock language="bash" code={`# 验证节点正常运行（4 个节点均应有 +++ 日志输出）
tail -f nodes/127.0.0.1/node0/log/log* | grep -i "+++"
# 出现如下输出则表示共识正常：
# info|2024-xx-xx|[g:1][CONSENSUS][SEALER]++++Generating seal on,...`} />
          </StepCard>

          {/* Step 3 */}
          <StepCard
            step={3}
            icon={FileCode}
            title="编写智能合约"
            description="以一个简单的资产转移合约为例，学习 Solidity 合约的基本结构。"
          >
            <p className="text-slate-500 text-xs mb-3">创建文件 <code className="text-brand-primary font-mono bg-brand-primary/10 px-1 py-0.5 rounded">Asset.sol</code>：</p>
            <CodeBlock language="solidity" code={`// SPDX-License-Identifier: Apache-2.0
pragma solidity ^0.6.10;

contract Asset {
    // 账户余额映射
    mapping(address => uint256) private balances;

    event Transfer(address indexed from, address indexed to, uint256 value);

    // 初始化发行
    constructor() public {
        balances[msg.sender] = 1000000;
    }

    // 查询余额
    function balanceOf(address account) public view returns (uint256) {
        return balances[account];
    }

    // 转账
    function transfer(address to, uint256 value) public returns (bool) {
        require(balances[msg.sender] >= value, "Insufficient balance");
        balances[msg.sender] -= value;
        balances[to] += value;
        emit Transfer(msg.sender, to, value);
        return true;
    }
}`} />
            <Note type="tip">DeSpace 支持 Solidity 0.4.x ~ 0.6.x 版本。可使用在线 IDE 进行合约编译和调试。</Note>
            <div className="mt-4">
              <button
                onClick={() => navigate('/ide')}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-sm bg-brand-primary/10 border border-brand-primary/20 text-brand-primary text-xs font-bold uppercase tracking-widest hover:bg-brand-primary/20 transition-all"
              >
                <FileCode size={12} /> 打开在线合约 IDE
              </button>
            </div>
          </StepCard>

          {/* Step 4 */}
          <StepCard
            step={4}
            icon={Terminal}
            title="创建 Java 应用项目"
            description="引入 DeSpace Java SDK，编写链上交互逻辑，完成合约的部署与调用。"
          >
            <p className="text-slate-400 text-xs mb-3 leading-relaxed">在 <code className="text-brand-primary font-mono bg-brand-primary/10 px-1 py-0.5 rounded">build.gradle</code> 中引入 SDK 依赖：</p>
            <CodeBlock language="groovy" code={`repositories {
    mavenCentral()
}

dependencies {
    // DeSpace Java SDK
    compile ('org.fisco-bcos.java-sdk:fisco-bcos-java-sdk:2.9.1')
}`} />
            <p className="text-slate-400 text-xs mt-4 mb-3 leading-relaxed">拷贝节点 SDK 证书到项目 <code className="text-brand-primary font-mono bg-brand-primary/10 px-1 py-0.5 rounded">conf/</code> 目录：</p>
            <CodeBlock language="bash" code={`mkdir -p conf
cp -r ~/despace/nodes/127.0.0.1/sdk/* conf/`} />
            <p className="text-slate-400 text-xs mt-4 mb-3 leading-relaxed">使用 <code className="text-brand-primary font-mono bg-brand-primary/10 px-1 py-0.5 rounded">sol2java.sh</code> 生成合约的 Java Wrapper 类：</p>
            <CodeBlock language="bash" code={`# 进入控制台目录，执行转换脚本
cd ~/despace/console
bash sol2java.sh -p com.example.asset -s ~/Asset.sol
# 生成的 Asset.java 位于 contracts/sdk/java/com/example/asset/`} />
            <Note type="warning">配置文件 config.toml 中的 peers 地址需与节点 config.ini 中的 channel_listen_port 对应，默认为 127.0.0.1:20200。</Note>
          </StepCard>

          {/* Step 5 */}
          <StepCard
            step={5}
            icon={Zap}
            title="部署合约并运行应用"
            description="编译项目，在链上部署合约，并通过 SDK 完成交易发起与链上状态查询。"
          >
            <CodeBlock language="java" code={`// AssetClient.java — 核心业务逻辑
ApplicationContext context = new ClassPathXmlApplicationContext("classpath:config.xml");
BcosSDK sdk = context.getBean(BcosSDK.class);
Client client = sdk.getClient(Integer.valueOf(1)); // 群组 1

// 部署合约
Asset asset = Asset.deploy(client, client.getCryptoSuite().getCryptoKeyPair());
System.out.println("合约地址: " + asset.getContractAddress());

// 发起转账交易
TransactionReceipt receipt = asset.transfer(toAddress, BigInteger.valueOf(100));
System.out.println("交易哈希: " + receipt.getTransactionHash());

// 查询余额
BigInteger balance = asset.balanceOf(myAddress).send();
System.out.println("余额: " + balance);`} />
            <CodeBlock language="bash" code={`# 编译项目
gradle build

# 运行应用（部署合约）
java -cp 'conf/:lib/*:apps/*' com.example.asset.AssetClient deploy

# 调用转账
java -cp 'conf/:lib/*:apps/*' com.example.asset.AssetClient transfer \
  0xabc...  0xdef...  100`} />
            <Note type="tip">运行成功后，可在控制台通过 <code className="text-white font-mono">getTransactionByHash</code> 命令查询交易详情，确认链上数据已写入。</Note>
          </StepCard>

          {/* Congrats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-6 p-6 rounded-sm border border-brand-primary/20 bg-brand-primary/5"
          >
            <div className="flex items-center gap-3 mb-3">
              <CheckCircle2 size={20} className="text-brand-primary" />
              <h3 className="text-base font-black text-white tracking-tight">恭喜！你已完成第一个区块链应用</h3>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed">
              你已成功搭建本地链、编写合约、部署应用并完成链上交互。接下来可以深入了解更多功能。
            </p>
          </motion.div>

          {/* Next Steps */}
          <div className="mt-12">
            <h2 className="text-lg font-black text-white tracking-tight mb-2">下一步</h2>
            <p className="text-slate-500 text-xs mb-6">探索更多文档，进一步提升你的 DeSpace 开发技能。</p>
            <div className="grid sm:grid-cols-2 gap-3">
              <QuickLink
                icon={BookOpen}
                title="开发第一个区块链应用"
                desc="完整的端到端开发教程，包含合约设计、编译、SDK 接入全流程"
                route="/docs"
              />
              <QuickLink
                icon={Layers}
                title="Java SDK 文档"
                desc="Java SDK 的快速入门、配置说明与完整 API 参考"
                route="/docs/java-sdk"
              />
              <QuickLink
                icon={Shield}
                title="配置管理"
                desc="节点配置、CA 黑白名单、存储加密与权限控制"
                route="/docs/config/node-config"
              />
              <QuickLink
                icon={FileCode}
                title="合约模板库"
                desc="浏览常用智能合约模板，快速复用业务逻辑"
                route="/contracts"
              />
            </div>
          </div>

          <div className="mt-16 pt-8 border-t border-white/5 text-slate-600 text-xs space-y-2">
            <p>© Copyright DeSpace 2024. 本技术文档适用于 DeSpace 2.x 版本。</p>
            <p>如有问题，请访问 DeSpace 开发者社区或提交 Issue。</p>
          </div>
        </div>
      </main>
    </div>
  );
}
