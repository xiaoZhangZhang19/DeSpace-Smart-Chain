import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Database, Menu, X, Copy, Check, ChevronRight, ChevronDown } from 'lucide-react';

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

const navItems = [
  { id: 'javasdk',        label: 'Java SDK' },
  { id: 'javasdk-qs',     label: '快速入门' },
  { id: 'javasdk-qs-1',   label: '　1. 安装环境' },
  { id: 'javasdk-qs-2',   label: '　2. 搭建DeSpace链' },
  { id: 'javasdk-qs-3',   label: '　3. 开发智能合约应用' },
  { id: 'javasdk-qs-4',   label: '　4. 附录' },
  { id: 'javasdk-cfg',    label: '配置说明' },
  { id: 'javasdk-cfg-1',  label: '　1. 快速配置' },
  { id: 'javasdk-cfg-2',  label: '　2. 配置解读' },
  { id: 'javasdk-cfg-3',  label: '　3. 配置示例' },
  { id: 'javasdk-cfg-4',  label: '　4. 其它格式配置' },
];

const docsNavItems = [
  { id: 's1',       label: '1. 了解应用需求' },
  { id: 's2',       label: '2. 设计与开发智能合约' },
  { id: 's2-step1', label: '　第一步. 设计智能合约' },
  { id: 's2-step2', label: '　第二步. 开发源码' },
  { id: 's3',       label: '3. 编译智能合约' },
  { id: 's4',       label: '4. 创建区块链应用项目' },
  { id: 's4-step1', label: '　第一步. 安装环境' },
  { id: 's4-step2', label: '　第二步. 创建Java工程' },
  { id: 's4-step3', label: '　第三步. 引入Java SDK' },
  { id: 's4-step4', label: '　第四步. 配置SDK证书' },
  { id: 's5',       label: '5. 业务逻辑开发' },
  { id: 's5-step1', label: '　第一步. 引入合约Java类' },
  { id: 's5-step2', label: '　第二步. 开发业务逻辑' },
  { id: 's6',       label: '6. 运行应用' },
];

export default function JavaSDKDocs() {
  const navigate = useNavigate();
  const [activeId, setActiveId] = useState('javasdk');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [docsExpanded, setDocsExpanded] = useState(false);
  const [javaExpanded, setJavaExpanded] = useState(true);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveId(entry.target.id);
        });
      },
      { rootMargin: '-20% 0px -70% 0px' }
    );
    navItems.forEach(({ id }) => {
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
        <button onClick={() => navigate('/docs')} className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors text-xs font-bold uppercase tracking-widest">
          <ArrowLeft size={14} /> 返回文档
        </button>
        <span className="text-white/10">|</span>
        <div className="flex items-center gap-2">
          <Database size={14} className="text-brand-primary" />
          <span className="text-xs font-black uppercase tracking-widest text-white">Java SDK</span>
        </div>
        <button className="md:hidden ml-auto text-white" onClick={() => setSidebarOpen(!sidebarOpen)}>
          {sidebarOpen ? <X size={18} /> : <Menu size={18} />}
        </button>
      </header>

      <div className="pt-14 flex">
        <aside className={`fixed md:sticky top-14 z-40 h-[calc(100vh-3.5rem)] w-60 bg-[#020c18] border-r border-white/5 overflow-y-auto transition-transform duration-300 shrink-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}>
          <nav className="p-4">
            <p className="text-[10px] uppercase tracking-widest text-slate-600 font-bold mb-3">目录</p>

            {/* Section 1: 开发第一个区块链应用 */}
            <div className="mb-2">
              <button
                onClick={() => { setDocsExpanded(!docsExpanded); if (!docsExpanded) navigate('/docs'); }}
                className="w-full flex items-center justify-between px-3 py-2 rounded-sm text-xs font-bold text-slate-400 hover:text-white hover:bg-white/5 transition-all border-l-2 border-transparent hover:border-slate-500"
              >
                <span>开发第一个区块链应用</span>
                <ChevronDown size={12} className={`transition-transform duration-200 ${docsExpanded ? 'rotate-0' : '-rotate-90'}`} />
              </button>
              <div className="overflow-hidden transition-all duration-300 ease-in-out" style={{ maxHeight: docsExpanded ? '600px' : '0' }}>
                <ul className="mt-1 space-y-0.5">
                  {docsNavItems.map((item) => (
                    <li key={item.id}>
                      <button onClick={() => navigate('/docs')} className="w-full text-left px-3 py-1.5 rounded-sm text-xs transition-all text-slate-500 hover:text-white hover:bg-white/5">
                        {item.label}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Section 2: Java SDK Docs */}
            <div>
              <button
                onClick={() => setJavaExpanded(!javaExpanded)}
                className="w-full flex items-center justify-between px-3 py-2 rounded-sm text-xs font-bold text-white bg-brand-primary/10 border-l-2 border-brand-primary transition-all hover:bg-brand-primary/20"
              >
                <span>Java SDK Docs</span>
                <ChevronDown size={12} className={`transition-transform duration-200 ${javaExpanded ? 'rotate-0' : '-rotate-90'}`} />
              </button>
              <div className="overflow-hidden transition-all duration-300 ease-in-out" style={{ maxHeight: javaExpanded ? '600px' : '0' }}>
                <ul className="mt-1 space-y-0.5">
                  {navItems.filter(item => item.id !== 'javasdk').map((item) => (
                    <li key={item.id}>
                      <button onClick={() => scrollTo(item.id)} className={`w-full text-left px-3 py-1.5 rounded-sm text-xs transition-all ${activeId === item.id ? 'bg-brand-primary/10 text-brand-primary font-bold border-l-2 border-brand-primary' : 'text-slate-500 hover:text-white hover:bg-white/5'}`}>
                        {item.label}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </nav>
        </aside>

        <main className="flex-1 min-w-0 px-6 md:px-12 lg:px-16 py-10 max-w-4xl">

          <div id="javasdk" className="scroll-mt-20 mb-2">
            <div className="flex flex-wrap items-center gap-2 text-brand-primary text-xs font-bold uppercase tracking-widest mb-3">
              <span>SDK</span><span className="text-white/20">·</span>
              <span>Java</span><span className="text-white/20">·</span>
              <span>区块链开发</span>
            </div>
            <h1 className="text-3xl font-black text-white tracking-tight mb-6">Java SDK</h1>
          </div>

          <P>Java SDK 提供了访问 DeSpace 节点的Java API，支持节点状态查询、部署和调用合约等功能</P>
          <Note type="note">v2.0+版本的java-sdk仅支持v2.0+版本DeSpace区块链，若区块链版本是v3.0+,请使用v3.0+版本java-sdk</Note>
          <H4>主要特性</H4>
          <UL>
            <LI>提供合约编译，将Solidity合约文件转换成Java合约文件</LI>
            <LI>提供Java SDK API，提供访问DeSpace JSON-RPC的功能，并支持预编译（Precompiled）合约调用</LI>
            <LI>提供自定义构造和发送交易功能</LI>
            <LI>提供AMOP功能</LI>
            <LI>支持事件推送</LI>
            <LI>支持ABI解析</LI>
            <LI>提供账户管理接口</LI>
          </UL>

          {/* ── 快速入门 ── */}
          <H2 id="javasdk-qs">快速入门</H2>

          <H3 id="javasdk-qs-1">1. 安装环境</H3>
          <H4>Java：JDK 14（JDK1.8 至JDK 14都支持）</H4>
          <CodeBlock language="bash" code={`# 确认您当前的java版本
$ java -version
# 确认您的java路径
$ ls /Library/Java/JavaVirtualMachines
# 返回
# jdk-14.0.2.jdk

# 如果使用的是bash
$ vim .bash_profile
# 在文件中加入JAVA_HOME的路径
# export JAVA_HOME = Library/Java/JavaVirtualMachines/jdk-14.0.2.jdk/Contents/Home
$ source .bash_profile

# 如果使用的是zash
$ vim .zashrc
# 在文件中加入JAVA_HOME的路径
# export JAVA_HOME = Library/Java/JavaVirtualMachines/jdk-14.0.2.jdk/Contents/Home
$ source .zashrc`} />
          <H4>IDE：IntelliJ IDE</H4>
          <P>进入IntelliJ IDE官网，下载并安装社区版IntelliJ IDE</P>

          <H3 id="javasdk-qs-2">2. 搭建一条DeSpace链</H3>
          <P>参考 DeSpace 安装文档搭建一条区块链。</P>

          <H3 id="javasdk-qs-3">3. 开发智能合约应用</H3>

          <H4>第一步. 创建一个Gradle应用</H4>
          <P>在IntelliJ IDE中创建一个gradle项目，勾选Gradle和Java，并输入工程名。</P>

          <H4>第二步. 引入Java SDK</H4>
          <P>在build.gradle文件中的<IC>dependencies</IC>下加入对Java SDK的引用：</P>
          <CodeBlock language="gradle" code={`compile ('org.fisco-bcos.java-sdk:fisco-bcos-java-sdk:2.9.1')`} />
          <P>若使用Maven，在pom.xml中加入：</P>
          <CodeBlock language="xml" code={`<dependency>
    <groupId>org.fisco-bcos.java-sdk</groupId>
    <artifactId>fisco-bcos-java-sdk</artifactId>
    <version>2.9.1</version>
</dependency>`} />
          <div className="my-4 flex justify-center"><img src="https://fisco-bcos-documentation.readthedocs.io/zh-cn/latest/_images/import_sdk.gif" alt="引入Java SDK" className="max-w-full rounded-sm border border-white/10 block" /></div>
          <Note type="note">若使用最新的控制台生成Java代码，请将Java SDK升级到2.8.0+版本。</Note>

          <H4>第三步. 配置SDK证书</H4>
          <P>大部分场景仅需要配置certPath配置项，将节点证书从<IC>nodes/$&#123;ip&#125;/sdk/</IC>目录拷贝到certPath指定路径：</P>
          <CodeBlock language="bash" code={`mkdir -p conf && cp -r ~/fisco/nodes/127.0.0.1/sdk/* conf`} />

          <H4>第四步. 准备智能合约</H4>
          <CodeBlock language="bash" code={`mkdir -p ~/fisco && cd ~/fisco
curl -#LO https://github.com/FISCO-BCOS/console/releases/download/v2.9.2/download_console.sh
bash download_console.sh
cd ~/fisco/console

# 查看合约列表
ls contracts/solidity
# 返回: HelloWorld.sol  KVTableTest.sol  ShaTest.sol  Table.sol  TableTest.sol

# 若控制台版本大于等于2.8.0
bash sol2java.sh -p org.com.fisco

# 若控制台版本小于2.8.0
bash sol2java.sh org.com.fisco

# 验证编译结果
ls contracts/sdk/java/org/com/fisco
# 返回: HelloWorld.java  KVTableTest.java  ShaTest.java  Table.java  TableTest.java`} />
          <div className="my-4 flex justify-center"><img src="https://fisco-bcos-documentation.readthedocs.io/zh-cn/latest/_images/prepare_contract.gif" alt="准备智能合约" className="max-w-full rounded-sm border border-white/10 block" /></div>

          <H4>第五步. 创建配置文件</H4>
          <P>参考配置说明或从仓库中获取<IC>config-example.toml</IC>，存放在应用主目录下，根据实际情况修改节点IP和端口。</P>

          <H4>第六步. 使用Java SDK部署和调用智能合约</H4>
          <CodeBlock language="java" code={`public class BcosSDKTest
{
    public final String configFile = BcosSDKTest.class.getClassLoader().getResource("config-example.toml").getPath();
    
    public void testClient() throws ConfigException {
        BcosSDK sdk = BcosSDK.build(configFile);
        Client client = sdk.getClient(Integer.valueOf(1));
        
        BlockNumber blockNumber = client.getBlockNumber();
        
        CryptoKeyPair cryptoKeyPair = client.getCryptoSuite().getCryptoKeyPair();
        HelloWorld helloWorld = HelloWorld.deploy(client, cryptoKeyPair);
        
        String getValue = helloWorld.get();
        TransactionReceipt receipt = helloWorld.set("Hello, fisco");
    }
}`} />

          <H3 id="javasdk-qs-4">4. 附录</H3>
          <H4>附录一. 使用java-sdk-demo给智能合约生成调用它的Java工具类</H4>
          <CodeBlock language="bash" code={`mkdir -p ~/fisco && cd ~/fisco
git clone https://github.com/FISCO-BCOS/java-sdk-demo
cd java-sdk-demo
git checkout main-2.0
./gradlew clean build -x test
cd dist && mkdir -p contracts/solidity
java -cp "apps/*:lib/*:conf/" org.fisco.bcos.sdk.demo.codegen.DemoSolcToJava \${packageName}`} />

          <H4>附录二. sol2java.sh脚本的使用方法</H4>
          <P>控制台版本大于等于2.8.0时：</P>
          <CodeBlock language="bash" code={`bash sol2java.sh -h`} />
          <P>参数说明：</P>
          <UL>
            <LI><IC>-h, --help</IC>：显示帮助信息</LI>
            <LI><IC>-l, --libraries &lt;arg&gt;</IC>：[可选] 设置库地址信息</LI>
            <LI><IC>-o, --output &lt;arg&gt;</IC>：[可选] 生成Java代码的输出目录，默认为contracts/sdk/java/</LI>
            <LI><IC>-p, --package &lt;arg&gt;</IC>：[可选] 包名，默认为com</LI>
            <LI><IC>-s, --sol &lt;arg&gt;</IC>：[可选] Solidity文件/目录路径，默认为contracts/solidity/</LI>
          </UL>
          <P>控制台版本小于2.8.0时：</P>
          <CodeBlock language="bash" code={`./sol2java.sh [packageName] [solidityFilePath] [javaCodeOutputDir]`} />

          <H4>附录三. 使用xml配置进行配置</H4>
          <P>通过Gradle引入Spring：</P>
          <CodeBlock language="gradle" code={`def spring_version = "4.3.27.RELEASE"
List spring = [
    "org.springframework:spring-core:$spring_version",
    "org.springframework:spring-beans:$spring_version",
    "org.springframework:spring-context:$spring_version",
    "org.springframework:spring-tx:$spring_version",
]
compile spring`} />
          <P>通过Maven引入Spring：</P>
          <CodeBlock language="xml" code={`<dependency>
    <groupId>org.springframework</groupId>
    <artifactId>spring-core</artifactId>
    <version>4.3.27.RELEASE</version>
</dependency>
<dependency>
    <groupId>org.springframework</groupId>
    <artifactId>spring-beans</artifactId>
    <version>4.3.27.RELEASE</version>
</dependency>
<dependency>
    <groupId>org.springframework</groupId>
    <artifactId>spring-context</artifactId>
    <version>4.3.27.RELEASE</version>
</dependency>
<dependency>
    <groupId>org.springframework</groupId>
    <artifactId>spring-tx</artifactId>
    <version>4.3.27.RELEASE</version>
</dependency>`} />
          <P>使用XML初始化BcosSDK：</P>
          <CodeBlock language="java" code={`ApplicationContext context = new ClassPathXmlApplicationContext("classpath:applicationContext-sample.xml");
BcosSDK sdk = context.getBean(BcosSDK.class);`} />

          <H4>附录四. 使用ConfigOption初始化BcosSDK</H4>
          <P>ConfigProperty类结构：</P>
          <CodeBlock language="java" code={`public class ConfigProperty {
    // 证书配置: certPath, caCert, sslCert, sslKey, enSslCert, enSslKey
    public Map<String, Object> cryptoMaterial;
    
    // 网络配置: peers
    public Map<String, Object> network;
    
    // AMOP配置: topicName, publicKeys, privateKey, password
    public List<AmopTopic> amop;
    
    // 账户配置: keyStoreDir, accountFilePath, accountFileFormat, accountAddress, password
    public Map<String, Object> account;
    
    // 线程池配置: channelProcessorThreadSize, receiptProcessorThreadSize
    public Map<String, Object> threadPool;
}`} />
          <P>通过ConfigProperty加载ConfigOption：</P>
          <CodeBlock language="java" code={`public ConfigOption loadConfigOption(ConfigProperty configProperty) throws ConfigException {
    return new ConfigOption(configProperty);
}`} />
          <P>使用ConfigOption创建BcosSDK：</P>
          <CodeBlock language="java" code={`public BcosSDK createBcosSDK(ConfigOption configOption) throws BcosSDKException {
    return new BcosSDK(configOption);
}`} />

          {/* ── 配置说明 ── */}
          <H2 id="javasdk-cfg">配置说明</H2>
          <P>Java sdk主要包括五个配置选项，分别是 证书配置（必须）、网络连接配置（必须）、AMOP配置（非必须）、账户配置（非必须，不配置则使用默认配置值）、线程池配置（非必须，不配置则使用默认配置值）</P>
          <P>支持的配置格式，包括 toml(默认)、properties、yml、xml</P>

          <H3 id="javasdk-cfg-1">1. 快速配置</H3>
          <H4>配置步骤</H4>
          <UL>
            <LI>在您的应用的主目录下新建一个<IC>conf</IC>目录。</LI>
            <LI>从节点<IC>nodes/$&#123;ip&#125;/sdk/</IC>目录下的证书拷贝到新建的<IC>conf</IC>目录。</LI>
            <LI>将配置文件config-example.toml存放在应用的主目录下。<IC>config-example.toml</IC>可以在java-sdk GitHub链接或Gitee链接的源文件以下位置找到：<IC>src/test/resources/config-example.toml</IC></LI>
            <LI>修改config-example.toml中节点的IP和端口，与您要连接的节点所匹配。</LI>
            <LI>在您的应用中使用该配置文件初始化Java SDK，您就可以开发区块链应用了。</LI>
          </UL>
          <P>目录结构示例：</P>
          <CodeBlock language="bash" code={`├── lib
│   ├── fisco-bcos-java-sdk-2.7.0.jar
│   └── XXXXX.jar
├── conf
│   ├── applicationContext.xml
│   ├── conf
|   |   ├── node.crt
|   |   ├── ca.crt
|   |   ├── sdk.publickey
|   |   ├── sdk.key
|   |   ├── node.key
|   |   └── sdk.crt
│   └── log4j.properties
├── apps
│   └── XXXX.jar
└── other folders`} />
          <P>快速初始化SDK：</P>
          <CodeBlock language="java" code={`String configFile = "config-example.toml";
BcosSDK sdk = BcosSDK.build(configFile);`} />

          <H3 id="javasdk-cfg-2">2. 配置解读</H3>

          <H4>证书配置</H4>
          <P>基于安全考虑，Java SDK与节点间采用SSL加密通信，目前同时支持非国密SSL连接以及国密SSL连接</P>
          <UL>
            <LI><IC>certPath</IC>: 证书存放路径，默认是<IC>conf</IC>目录</LI>
            <LI><IC>caCert</IC>: CA证书路径，默认注释该配置项，该配置项注释时，当SDK与节点间采用非国密SSL连接时，默认的CA证书路径为<IC>$&#123;certPath&#125;/ca.crt</IC>，当SDK与节点采用国密SSL连接时，默认的CA证书路径为<IC>$&#123;certPath&#125;/gm/gmca.crt</IC></LI>
            <LI><IC>sslCert</IC>: SDK证书路径，默认注释该配置项，当SDK与节点间采用非国密SSL连接时，从<IC>$&#123;certPath&#125;/sdk.crt</IC>加载SDK证书，当SDK与节点间采用国密SSL连接时，从<IC>$&#123;certPath&#125;/gm/gmsdk.crt</IC>加载SDK证书</LI>
            <LI><IC>sslKey</IC>: SDK私钥路径，默认注释该配置项，当SDK与节点间采用非国密SSL连接时，从<IC>$&#123;certPath&#125;/sdk.key</IC>加载SDK私钥，SDK与节点采用国密SSL连接时，从<IC>$&#123;certPath&#125;/gm/gmsdk.key</IC>加载SDK私钥</LI>
            <LI><IC>enSslCert</IC>: 国密SSL加密证书路径，仅当SDK与节点间采用国密SSL连接时，需要配置该配置项，默认从<IC>$&#123;certPath&#125;/gm/gmensdk.crt</IC>加载国密SSL加密证书</LI>
            <LI><IC>enSslKey</IC>: 国密SSL加密私钥路径，仅当SDK与节点间采用国密SSL连接时，需配置该配置项，默认从<IC>$&#123;certPath&#125;/gm/gmensdk.key</IC>加载国密SSL加密私钥</LI>
          </UL>
          <Note type="note">大部分场景仅需要配置 certPath 配置项即可，其他配置项不需额外配置</Note>
          <Note type="note">SDK与节点间SSL连接方式，可通过节点配置项 sm_crypto_channel 判断</Note>
          <CodeBlock language="toml" code={`[cryptoMaterial]

certPath = "conf"                           # The certification path  

# The following configurations take the certPath by default if commented
# caCert = "conf/ca.crt"                    # CA cert file path
                                            # If connect to the GM node, default CA cert path is \${certPath}/gm/gmca.crt

# sslCert = "conf/sdk.crt"                  # SSL cert file path
                                            # If connect to the GM node, the default SDK cert path is \${certPath}/gm/gmsdk.crt

# sslKey = "conf/sdk.key"                   # SSL key file path
                                            # If connect to the GM node, the default SDK privateKey path is \${certPath}/gm/gmsdk.key

# enSslCert = "conf/gm/gmensdk.crt"         # GM encryption cert file path
                                            # default load the GM SSL encryption cert from \${certPath}/gm/gmensdk.crt

# enSslKey = "conf/gm/gmensdk.key"          # GM ssl cert file path
                                            # default load the GM SSL encryption privateKey from \${certPath}/gm/gmensdk.key`} />

          <H4>网络连接配置</H4>
          <P><IC>[network]</IC>配置了Java SDK连接的节点信息</P>
          <UL>
            <LI><IC>peers</IC>：SDK连接的节点的<IC>IP:Port</IC>信息，可配置多个连接。</LI>
          </UL>
          <Note type="note">节点与网络之间的连接信息：SDK与节点间通过 ChannelServer 进行通信，SDK需要连接 ChannelServer 的监听端口，该端口可通过节点 config.ini 的 rpc.channel_listen_port 获取</Note>
          <CodeBlock language="toml" code={`[network]
peers=["127.0.0.1:20200", "127.0.0.1:20201"]    # The peer list to connect`} />

          <H4>AMOP配置</H4>
          <P>AMOP支持私有话题的功能，配置文件中提供了<IC>AMOP</IC>相关配置项于<IC>[[amop]]</IC>中。</P>
          <P><strong className="text-white">私有话题订阅配置</strong>：AMOP私有话题订阅者需要配置私钥用于进行私有话题认证</P>
          <UL>
            <LI><IC>topicName</IC>: 私有话题名称</LI>
            <LI><IC>privateKey</IC>: 私有话题订阅者的私钥路径，用于证明订阅方身份信息</LI>
            <LI><IC>password</IC>: 访问私钥文件的口令</LI>
          </UL>
          <CodeBlock language="toml" code={`# Configure a private topic as a topic subscriber.
[[amop]]
topicName = "PrivateTopic"
privateKey = "conf/amop/consumer_private_key.p12"         # Your private key that used to subscriber verification.
password = "123456"`} />
          <P><strong className="text-white">私有话题消息发布配置</strong>：AMOP私有话题认证成功后，消息发布方可向订阅方发送私有话题消息</P>
          <UL>
            <LI><IC>topicName</IC>: 私有话题名称</LI>
            <LI><IC>publicKeys</IC>: 消息订阅方的公钥列表</LI>
          </UL>
          <CodeBlock language="toml" code={`# Configure a private topic as a topic message sender.
[[amop]]
topicName = "PrivateTopic"
publicKeys = [ "conf/amop/consumer_public_key_1.pem" ]    # Public keys of the nodes that you want to send AMOP message of this topic to.`} />

          <H4>账户配置</H4>
          <P>账户配置主要用于设置SDK向节点发交易的账户信息，SDK初始化client时，默认读取<IC>[account]</IC>配置项加载账户信息</P>
          <UL>
            <LI><IC>keyStoreDir</IC>: 账户文件存储路径，默认为<IC>account</IC></LI>
            <LI><IC>accountAddress</IC>: 加载的账户地址，默认为空</LI>
            <LI><IC>accountFileFormat</IC>: 账户文件格式，默认为<IC>pem</IC>，支持<IC>pem</IC>和<IC>p12</IC></LI>
            <LI><IC>password</IC>: 加载<IC>p12</IC>类型账户文件时，需要指定口令，加载<IC>pem</IC>账户文件不需要口令</LI>
          </UL>
          <CodeBlock language="toml" code={`[account]
keyStoreDir = "account"         # The directory to load/store the account file, default is "account"
# accountFilePath = ""          # The account file path (default load from the path specified by the keyStoreDir)
accountFileFormat = "pem"       # The account file format, support "pem" and "p12"
# accountAddress = ""           # The transactions sending account address
# password = ""                 # The password used to load the account file`} />

          <H4>线程池配置</H4>
          <P>为了便于业务根据机器实际负载调整SDK的处理线程，Java SDK将部分线程池暴露出来供业务配置</P>
          <UL>
            <LI><IC>channelProcessorThreadSize</IC>: 处理channel消息包的线程数，默认为机器的CPU数</LI>
            <LI><IC>receiptProcessorThreadSize</IC>: 处理交易回执的线程数，默认为机器的CPU数</LI>
            <LI><IC>maxBlockingQueueSize</IC>: 业务线程池中，阻塞队列的大小，默认为102400</LI>
          </UL>
          <CodeBlock language="toml" code={`[threadPool]
# channelProcessorThreadSize = "16"         # The size of the thread pool to process channel msg
# receiptProcessorThreadSize = "16"         # The size of the thread pool to process transaction receipt
maxBlockingQueueSize = "102400"             # The max blocking queue size of the thread pool`} />

          <H3 id="javasdk-cfg-3">3. 配置示例</H3>
          <H4>toml格式配置（默认）</H4>
          <CodeBlock language="toml" code={`[cryptoMaterial]
certPath = "conf"

[network]
peers=["127.0.0.1:20200", "127.0.0.1:20201"]

[account]
keyStoreDir = "account"
accountFileFormat = "pem"

[threadPool]
maxBlockingQueueSize = "102400"`} />

          <H4>properties格式配置</H4>
          <CodeBlock language="properties" code={`cryptoMaterial.certPath=conf
network.peers[0]=127.0.0.1:20200
network.peers[1]=127.0.0.1:20201
account.keyStoreDir=account
account.accountFileFormat=pem
threadPool.maxBlockingQueueSize=102400`} />

          <H4>yml格式配置</H4>
          <CodeBlock language="yaml" code={`cryptoMaterial:
  certPath: "conf"
network:
  peers:
    - "127.0.0.1:20200"
    - "127.0.0.1:20201"
account:
  keyStoreDir: "account"
  accountFileFormat: "pem"
threadPool:
  maxBlockingQueueSize: "102400"`} />

          <H3 id="javasdk-cfg-4">4. 其它格式配置</H3>
          <H4>使用xml配置</H4>
          <P>在<IC>src/test/resources</IC>下，提供了<IC>applicationContext-sample.xml</IC>，在使用xml配置文件时，需配置以下bean：</P>
          <UL>
            <LI><IC>ConfigProperty</IC>：记录配置信息，包括证书配置、网络配置、AMOP配置、账户配置和线程池配置</LI>
            <LI><IC>ConfigOption</IC>：由<IC>ConfigProperty</IC>初始化</LI>
            <LI><IC>BcosSDK</IC>：由<IC>ConfigOption</IC>初始化</LI>
          </UL>
          <CodeBlock language="xml" code={`<?xml version="1.0" encoding="UTF-8" ?>
<beans xmlns="http://www.springframework.org/schema/beans"
       xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
       xsi:schemaLocation="http://www.springframework.org/schema/beans
                           http://www.springframework.org/schema/beans/spring-beans-2.5.xsd">

    <bean id="defaultConfigProperty" class="org.fisco.bcos.sdk.config.model.ConfigProperty">
        <property name="cryptoMaterial">
            <map>
                <entry key="certPath" value="conf" />
            </map>
        </property>
        <property name="network">
            <map>
                <entry key="peers">
                    <list>
                        <value>127.0.0.1:20200</value>
                        <value>127.0.0.1:20201</value>
                    </list>
                </entry>
            </map>
        </property>
        <property name="account">
            <map>
                <entry key="keyStoreDir" value="account" />
                <entry key="accountAddress" value="" />
                <entry key="accountFileFormat" value="pem" />
                <entry key="password" value="" />
                <entry key="accountFilePath" value="" />
            </map>
        </property>
        <property name="threadPool">
            <map>
                <entry key="channelProcessorThreadSize" value="16" />
                <entry key="receiptProcessorThreadSize" value="16" />
                <entry key="maxBlockingQueueSize" value="102400" />
            </map>
        </property>
    </bean>

    <bean id="defaultConfigOption" class="org.fisco.bcos.sdk.config.ConfigOption">
        <constructor-arg name="configProperty">
            <ref bean="defaultConfigProperty"/>
        </constructor-arg>
    </bean>

    <bean id="bcosSDK" class="org.fisco.bcos.sdk.BcosSDK">
        <constructor-arg name="configOption">
            <ref bean="defaultConfigOption"/>
        </constructor-arg>
    </bean>
</beans>`} />
          <CodeBlock language="java" code={`@SuppressWarnings("resource")
ApplicationContext context =
        new ClassPathXmlApplicationContext("classpath:fisco-config.xml");
BcosSDK bcosSDK = context.getBean(BcosSDK.class);`} />

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
