import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Database, Menu, X, Copy, Check, ChevronRight } from 'lucide-react';

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
  { id: 'intro',    label: '开发第一个区块链应用' },
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
  // Java SDK
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

const assetSol = `pragma solidity ^0.4.24;

import "./Table.sol";

contract Asset {
    // event
    event RegisterEvent(int256 ret, string account, uint256 asset_value);
    event TransferEvent(int256 ret, string from_account, string to_account, uint256 amount);

    constructor() public {
        // 构造函数中创建t_asset表
        createTable();
    }

    function createTable() private {
        TableFactory tf = TableFactory(0x1001);
        // 资产管理表, key : account, field : asset_value
        // |  资产账户(主键)      |     资产金额       |
        // |-------------------- |-------------------|
        // |        account      |    asset_value    |
        // |---------------------|-------------------|
        //
        // 创建表
        tf.createTable("t_asset", "account", "asset_value");
    }

    function openTable() private returns(Table) {
        TableFactory tf = TableFactory(0x1001);
        Table table = tf.openTable("t_asset");
        return table;
    }

    /*
    描述 : 根据资产账户查询资产金额
    参数 ：
            account : 资产账户

    返回值：
            参数一： 成功返回0, 账户不存在返回-1
            参数二： 第一个参数为0时有效，资产金额
    */
    function select(string account) public constant returns(int256, uint256) {
        // 打开表
        Table table = openTable();
        // 查询
        Entries entries = table.select(account, table.newCondition());
        uint256 asset_value = 0;
        if (0 == uint256(entries.size())) {
            return (-1, asset_value);
        } else {
            Entry entry = entries.get(0);
            return (0, uint256(entry.getInt("asset_value")));
        }
    }

    /*
    描述 : 资产注册
    参数 ：
            account : 资产账户
            amount  : 资产金额
    返回值：
            0  资产注册成功
            -1 资产账户已存在
            -2 其他错误
    */
    function register(string account, uint256 asset_value) public returns(int256){
        int256 ret_code = 0;
        int256 ret= 0;
        uint256 temp_asset_value = 0;
        // 查询账户是否存在
        (ret, temp_asset_value) = select(account);
        if(ret != 0) {
            Table table = openTable();

            Entry entry = table.newEntry();
            entry.set("account", account);
            entry.set("asset_value", int256(asset_value));
            // 插入
            int count = table.insert(account, entry);
            if (count == 1) {
                // 成功
                ret_code = 0;
            } else {
                // 失败? 无权限或者其他错误
                ret_code = -2;
            }
        } else {
            // 账户已存在
            ret_code = -1;
        }

        emit RegisterEvent(ret_code, account, asset_value);

        return ret_code;
    }

    /*
    描述 : 资产转移
    参数 ：
            from_account : 转移资产账户
            to_account ： 接收资产账户
            amount ： 转移金额
    返回值：
            0  资产转移成功
            -1 转移资产账户不存在
            -2 接收资产账户不存在
            -3 金额不足
            -4 金额溢出
            -5 其他错误
    */
    function transfer(string from_account, string to_account, uint256 amount) public returns(int256) {
        // 查询转移资产账户信息
        int ret_code = 0;
        int256 ret = 0;
        uint256 from_asset_value = 0;
        uint256 to_asset_value = 0;

        // 转移账户是否存在?
        (ret, from_asset_value) = select(from_account);
        if(ret != 0) {
            ret_code = -1;
            // 转移账户不存在
            emit TransferEvent(ret_code, from_account, to_account, amount);
            return ret_code;

        }

        // 接受账户是否存在?
        (ret, to_asset_value) = select(to_account);
        if(ret != 0) {
            ret_code = -2;
            // 接收资产的账户不存在
            emit TransferEvent(ret_code, from_account, to_account, amount);
            return ret_code;
        }

        if(from_asset_value < amount) {
            ret_code = -3;
            // 转移资产的账户金额不足
            emit TransferEvent(ret_code, from_account, to_account, amount);
            return ret_code;
        }

        if (to_asset_value + amount < to_asset_value) {
            ret_code = -4;
            // 接收账户金额溢出
            emit TransferEvent(ret_code, from_account, to_account, amount);
            return ret_code;
        }

        Table table = openTable();

        Entry entry0 = table.newEntry();
        entry0.set("account", from_account);
        entry0.set("asset_value", int256(from_asset_value - amount));
        // 更新转账账户
        int count = table.update(from_account, entry0, table.newCondition());
        if(count != 1) {
            ret_code = -5;
            // 失败? 无权限或者其他错误?
            emit TransferEvent(ret_code, from_account, to_account, amount);
            return ret_code;
        }

        Entry entry1 = table.newEntry();
        entry1.set("account", to_account);
        entry1.set("asset_value", int256(to_asset_value + amount));
        // 更新接收账户
        table.update(to_account, entry1, table.newCondition());

        emit TransferEvent(ret_code, from_account, to_account, amount);

        return ret_code;
    }
}`;

const assetJavaIface = `package org.fisco.bcos.asset.contract;

public class Asset extends Contract {
    // Asset.sol合约 transfer接口生成
    public TransactionReceipt transfer(String from_account, String to_account, BigInteger amount);
    // Asset.sol合约 register接口生成
    public TransactionReceipt register(String account, BigInteger asset_value);
    // Asset.sol合约 select接口生成
    public Tuple2<BigInteger, BigInteger> select(String account) throws ContractException;

    // 加载Asset合约地址，生成Asset对象
    public static Asset load(String contractAddress, Client client, CryptoKeyPair credential);

    // 部署Assert.sol合约，生成Asset对象
    public static Asset deploy(Client client, CryptoKeyPair credential) throws ContractException;
}`;

const assetClientJava = `package org.fisco.bcos.asset.client;

import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.IOException;
import java.math.BigInteger;
import java.util.List;
import java.util.Properties;
import org.fisco.bcos.asset.contract.Asset;
import org.fisco.bcos.sdk.BcosSDK;
import org.fisco.bcos.sdk.abi.datatypes.generated.tuples.generated.Tuple2;
import org.fisco.bcos.sdk.client.Client;
import org.fisco.bcos.sdk.crypto.keypair.CryptoKeyPair;
import org.fisco.bcos.sdk.model.TransactionReceipt;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.ApplicationContext;
import org.springframework.context.support.ClassPathXmlApplicationContext;
import org.springframework.core.io.ClassPathResource;
import org.springframework.core.io.Resource;
import org.springframework.core.io.support.PathMatchingResourcePatternResolver;

public class AssetClient {
    static Logger logger = LoggerFactory.getLogger(AssetClient.class);

    private BcosSDK bcosSDK;
    private Client client;
    private CryptoKeyPair cryptoKeyPair;

    public void initialize() throws Exception {
        @SuppressWarnings("resource")
        ApplicationContext context =
                new ClassPathXmlApplicationContext("classpath:applicationContext.xml");
        bcosSDK = context.getBean(BcosSDK.class);
        client = bcosSDK.getClient(1);
        cryptoKeyPair = client.getCryptoSuite().createKeyPair();
        client.getCryptoSuite().setCryptoKeyPair(cryptoKeyPair);
        logger.debug("create client for group1, account address is " + cryptoKeyPair.getAddress());
    }

    public void deployAssetAndRecordAddr() {

        try {
            Asset asset = Asset.deploy(client, cryptoKeyPair);
            System.out.println(
                    " deploy Asset success, contract address is " + asset.getContractAddress());

            recordAssetAddr(asset.getContractAddress());
        } catch (Exception e) {
            // TODO Auto-generated catch block
            // e.printStackTrace();
            System.out.println(" deploy Asset contract failed, error message is  " + e.getMessage());
        }
    }

    public void recordAssetAddr(String address) throws FileNotFoundException, IOException {
        Properties prop = new Properties();
        prop.setProperty("address", address);
        final Resource contractResource = new ClassPathResource("contract.properties");
        FileOutputStream fileOutputStream = new FileOutputStream(contractResource.getFile());
        prop.store(fileOutputStream, "contract address");
    }

    public String loadAssetAddr() throws Exception {
        // load Asset contact address from contract.properties
        Properties prop = new Properties();
        final Resource contractResource = new ClassPathResource("contract.properties");
        prop.load(contractResource.getInputStream());

        String contractAddress = prop.getProperty("address");
        if (contractAddress == null || contractAddress.trim().equals("")) {
            throw new Exception(" load Asset contract address failed, please deploy it first. ");
        }
        logger.info(" load Asset address from contract.properties, address is {}", contractAddress);
        return contractAddress;
    }

    public void queryAssetAmount(String assetAccount) {
        try {
            String contractAddress = loadAssetAddr();
            Asset asset = Asset.load(contractAddress, client, cryptoKeyPair);
            Tuple2<BigInteger, BigInteger> result = asset.select(assetAccount);
            if (result.getValue1().compareTo(new BigInteger("0")) == 0) {
                System.out.printf(" asset account %s, value %s \\n", assetAccount, result.getValue2());
            } else {
                System.out.printf(" %s asset account is not exist \\n", assetAccount);
            }
        } catch (Exception e) {
            // TODO Auto-generated catch block
            // e.printStackTrace();
            logger.error(" queryAssetAmount exception, error message is {}", e.getMessage());

            System.out.printf(" query asset account failed, error message is %s\\n", e.getMessage());
        }
    }

    public void registerAssetAccount(String assetAccount, BigInteger amount) {
        try {
            String contractAddress = loadAssetAddr();

            Asset asset = Asset.load(contractAddress, client, cryptoKeyPair);
            TransactionReceipt receipt = asset.register(assetAccount, amount);
            List<Asset.RegisterEventEventResponse> response = asset.getRegisterEventEvents(receipt);
            if (!response.isEmpty()) {
                if (response.get(0).ret.compareTo(new BigInteger("0")) == 0) {
                    System.out.printf(
                            " register asset account success => asset: %s, value: %s \\n", assetAccount, amount);
                } else {
                    System.out.printf(
                            " register asset account failed, ret code is %s \\n", response.get(0).ret.toString());
                }
            } else {
                System.out.println(" event log not found, maybe transaction not exec. ");
            }
        } catch (Exception e) {
            // TODO Auto-generated catch block
            // e.printStackTrace();

            logger.error(" registerAssetAccount exception, error message is {}", e.getMessage());
            System.out.printf(" register asset account failed, error message is %s\\n", e.getMessage());
        }
    }

    public void transferAsset(String fromAssetAccount, String toAssetAccount, BigInteger amount) {
        try {
            String contractAddress = loadAssetAddr();
            Asset asset = Asset.load(contractAddress, client, cryptoKeyPair);
            TransactionReceipt receipt = asset.transfer(fromAssetAccount, toAssetAccount, amount);
            List<Asset.TransferEventEventResponse> response = asset.getTransferEventEvents(receipt);
            if (!response.isEmpty()) {
                if (response.get(0).ret.compareTo(new BigInteger("0")) == 0) {
                    System.out.printf(
                            " transfer success => from_asset: %s, to_asset: %s, amount: %s \\n",
                            fromAssetAccount, toAssetAccount, amount);
                } else {
                    System.out.printf(
                            " transfer asset account failed, ret code is %s \\n", response.get(0).ret.toString());
                }
            } else {
                System.out.println(" event log not found, maybe transaction not exec. ");
            }
        } catch (Exception e) {
            // TODO Auto-generated catch block
            // e.printStackTrace();

            logger.error(" registerAssetAccount exception, error message is {}", e.getMessage());
            System.out.printf(" register asset account failed, error message is %s\\n", e.getMessage());
        }
    }

    public static void Usage() {
        System.out.println(" Usage:");
        System.out.println(
                "\\t java -cp conf/:lib/*:apps/* org.fisco.bcos.asset.client.AssetClient deploy");
        System.out.println(
                "\\t java -cp conf/:lib/*:apps/* org.fisco.bcos.asset.client.AssetClient query account");
        System.out.println(
                "\\t java -cp conf/:lib/*:apps/* org.fisco.bcos.asset.client.AssetClient register account value");
        System.out.println(
                "\\t java -cp conf/:lib/*:apps/* org.fisco.bcos.asset.client.AssetClient transfer from_account to_account amount");
        System.exit(0);
    }

    public static void main(String[] args) throws Exception {
        if (args.length < 1) {
            Usage();
        }

        AssetClient client = new AssetClient();
        client.initialize();

        switch (args[0]) {
            case "deploy":
                client.deployAssetAndRecordAddr();
                break;
            case "query":
                if (args.length < 2) {
                    Usage();
                }
                client.queryAssetAmount(args[1]);
                break;
            case "register":
                if (args.length < 3) {
                    Usage();
                }
                client.registerAssetAccount(args[1], new BigInteger(args[2]));
                break;
            case "transfer":
                if (args.length < 4) {
                    Usage();
                }
                client.transferAsset(args[1], args[2], new BigInteger(args[3]));
                break;
            default:
            {
                Usage();
            }
        }
        System.exit(0);
    }

}`;

const appXml = `<?xml version="1.0" encoding="UTF-8" ?>

<beans xmlns="http://www.springframework.org/schema/beans"
       xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
       xsi:schemaLocation="http://www.springframework.org/schema/beans
    http://www.springframework.org/schema/beans/spring-beans-4.0.xsd">
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
</beans>`;

export default function Documentation() {
  const navigate = useNavigate();
  const [activeId, setActiveId] = useState('intro');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => { entries.forEach((e) => { if (e.isIntersecting) setActiveId(e.target.id); }); },
      { rootMargin: '-10% 0px -80% 0px' }
    );
    document.querySelectorAll('[id]').forEach((el) => observer.observe(el));
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
          <span className="text-xs font-black uppercase tracking-widest text-white">开发第一个区块链应用</span>
        </div>
        <button className="md:hidden ml-auto text-white" onClick={() => setSidebarOpen(!sidebarOpen)}>
          {sidebarOpen ? <X size={18} /> : <Menu size={18} />}
        </button>
      </header>

      <div className="pt-14 flex">
        <aside className={`fixed md:sticky top-14 z-40 h-[calc(100vh-3.5rem)] w-60 bg-[#020c18] border-r border-white/5 overflow-y-auto transition-transform duration-300 shrink-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}>
          <nav className="p-4">
            <p className="text-[10px] uppercase tracking-widest text-slate-600 font-bold mb-3">目录</p>
            <ul className="space-y-0.5">
              {navItems.map((item) => (
                <li key={item.id}>
                  <button onClick={() => scrollTo(item.id)} className={`w-full text-left px-3 py-1.5 rounded-sm text-xs transition-all ${activeId === item.id ? 'bg-brand-primary/10 text-brand-primary font-bold border-l-2 border-brand-primary' : 'text-slate-500 hover:text-white hover:bg-white/5'}`}>
                    {item.label}
                  </button>
                </li>
              ))}
            </ul>
          </nav>
        </aside>

        <main className="flex-1 min-w-0 px-6 md:px-12 lg:px-16 py-10 max-w-4xl">

          <div id="intro" className="scroll-mt-20 mb-2">
            <div className="flex flex-wrap items-center gap-2 text-brand-primary text-xs font-bold uppercase tracking-widest mb-3">
              <span>开发第一个应用</span><span className="text-white/20">·</span>
              <span>合约开发</span><span className="text-white/20">·</span>
              <span>区块链应用</span><span className="text-white/20">·</span>
              <span>教程</span>
            </div>
            <h1 className="text-3xl font-black text-white tracking-tight mb-6">开发第一个区块链应用</h1>
          </div>

          <Note type="tip">相关软件和环境版本说明！请查看兼容性文档。</Note>

          <P>本章将会介绍一个基于DeSpace区块链的业务应用场景开发全过程，从业务场景分析，到合约的设计实现，然后介绍合约编译以及如何部署到区块链，最后介绍一个应用模块的实现，通过提供的Java SDK实现对区块链上合约的调用访问。</P>
          <P>本教程要求用户熟悉Linux操作环境，具备Java开发的基本技能，能够使用Gradle工具，熟悉Solidity语法。</P>
          <P>如果您还未搭建区块链网络，或未下载控制台，请先走完教程搭建第一个区块链网络，再回到本教程。</P>

          <H2 id="s1">1. 了解应用需求</H2>
          <P>区块链天然具有防篡改，可追溯等特性，这些特性决定其更容易受金融领域的青睐。本示例中，将会提供一个简易的资产管理的开发示例，并最终实现以下功能：</P>
          <UL>
            <LI>能够在区块链上进行资产注册</LI>
            <LI>能够实现不同账户的转账</LI>
            <LI>可以查询账户的资产金额</LI>
          </UL>

          <H2 id="s2">2. 设计与开发智能合约</H2>
          <P>在区块链上进行应用开发时，结合业务需求，首先需要设计对应的智能合约，确定合约需要储存的数据，在此基础上确定智能合约对外提供的接口，最后给出各个接口的具体实现。</P>

          <H3 id="s2-step1">第一步. 设计智能合约</H3>
          <H4>存储设计</H4>
          <P>DeSpace提供合约CRUD接口开发模式，可以通过合约创建表，并对创建的表进行增删改查操作。针对本应用需要设计一个存储资产管理的表<IC>t_asset</IC>，该表字段如下：</P>
          <UL>
            <LI><IC>account</IC>: 主键，资产账户(string类型)</LI>
            <LI><IC>asset_value</IC>: 资产金额(uint256类型)</LI>
          </UL>
          <P>其中account是主键，即操作<IC>t_asset</IC>表时需要传入的字段，区块链根据该主键字段查询表中匹配的记录。<IC>t_asset</IC>表示例如下：</P>
          <div className="my-4 overflow-x-auto">
            <table className="text-sm border-collapse">
              <thead>
                <tr className="bg-white/5">
                  <th className="px-6 py-2 text-left text-slate-300 font-bold border border-white/10">account</th>
                  <th className="px-6 py-2 text-left text-slate-300 font-bold border border-white/10">asset_value</th>
                </tr>
              </thead>
              <tbody>
                <tr><td className="px-6 py-2 text-slate-400 border border-white/10">Alice</td><td className="px-6 py-2 text-slate-400 border border-white/10">10000</td></tr>
                <tr><td className="px-6 py-2 text-slate-400 border border-white/10">Bob</td><td className="px-6 py-2 text-slate-400 border border-white/10">20000</td></tr>
              </tbody>
            </table>
          </div>

          <H4>接口设计</H4>
          <P>按照业务的设计目标，需要实现资产注册，转账，查询功能，对应功能的接口如下：</P>
          <CodeBlock language="solidity" code={`// 查询资产金额
function select(string account) public constant returns(int256, uint256)
// 资产注册
function register(string account, uint256 amount) public returns(int256)
// 资产转移
function transfer(string from_asset_account, string to_asset_account, uint256 amount) public returns(int256)`} />


          <div className="my-4 flex justify-center"><img src="https://fisco-bcos-documentation.readthedocs.io/zh-cn/latest/_images/asset_contract.png" alt="资产合约接口设计" className="max-w-full rounded-sm border border-white/10 block" /></div>
          <H3 id="s2-step2">第二步. 开发源码</H3>
          <P>根据第一步的存储和接口设计，创建一个Asset的智能合约，实现注册、转账、查询功能，并引入一个叫Table的系统合约，这个合约提供了CRUD接口。</P>
          <CodeBlock language="bash" code={`# 进入console/contracts目录
cd ~/fisco/console/contracts/solidity
# 创建Asset.sol合约文件
vi Asset.sol

# 将Assert.sol合约内容写入。
# 并键入wq保存退出。`} />
          <P><IC>Asset.sol</IC>的内容如下：</P>
          <CodeBlock language="solidity" code={assetSol} />
          <P><IC>Asset.sol</IC>所引用的<IC>Table.sol</IC>已在<IC>~/fisco/console/contracts/solidity</IC>目录下。该系统合约文件中的接口由DeSpace底层实现。当业务合约需要操作CRUD接口时，均需要引入该接口合约文件。Table.sol 合约详细接口参考相关文档。</P>
          <P>运行<IC>ls</IC>命令，确保<IC>Asset.sol</IC>和<IC>Table.sol</IC>在目录<IC>~/fisco/console/contracts/solidity</IC>下。</P>

          <H2 id="s3">3. 编译智能合约</H2>
          <P><IC>.sol</IC>的智能合约需要编译成ABI和BIN文件才能部署至区块链网络上。有了这两个文件即可凭借Java SDK进行合约部署和调用。但这种调用方式相对繁琐，需要用户根据合约ABI来传参和解析结果。为此，控制台提供的编译工具不仅可以编译出ABI和BIN文件，还可以自动生成一个与编译的智能合约同名的合约Java类。这个Java类是根据ABI生成的，帮助用户解析好了参数，提供同名的方法。当应用需要部署和调用合约时，可以调用该合约类的对应方法，传入指定参数即可。使用这个合约Java类来开发应用，可以极大简化用户的代码。</P>
          <CodeBlock language="bash" code={`# 创建工作目录~/fisco
mkdir -p ~/fisco
# 下载控制台
cd ~/fisco && curl -#LO https://github.com/FISCO-BCOS/console/releases/download/v2.9.2/download_console.sh && bash download_console.sh

# 切换到fisco/console/目录
cd ~/fisco/console/

# 若控制台版本大于等于2.8.0，编译合约方法如下:（可通过bash sol2java.sh -h命令查看该脚本使用方法）
bash sol2java.sh -p org.fisco.bcos.asset.contract

# 若控制台版本小于2.8.0，编译合约(后面指定一个Java的包名参数，可以根据实际项目路径指定包名)如下：
./sol2java.sh org.fisco.bcos.asset.contract`} />
          <P>运行成功之后，将会在<IC>console/contracts/sdk</IC>目录生成java、abi和bin目录，如下所示。</P>
          <CodeBlock language="bash" code={`# 其它无关文件省略
|-- abi # 生成的abi目录，存放solidity合约编译生成的abi文件
|   |-- Asset.abi
|   |-- Table.abi
|-- bin # 生成的bin目录，存放solidity合约编译生成的bin文件
|   |-- Asset.bin
|   |-- Table.bin
|-- contracts # 存放solidity合约源码文件，将需要编译的合约拷贝到该目录下
|   |-- Asset.sol # 拷贝进来的Asset.sol合约，依赖Table.sol
|   |-- Table.sol # 实现系统CRUD操作的合约接口文件
|-- java  # 存放编译的包路径及Java合约文件
|   |-- org
|        |--fisco
|             |--bcos
|                  |--asset
|                       |--contract
|                             |-- Asset.java  # Asset.sol合约生成的Java文件
|                             |-- Table.java  # Table.sol合约生成的Java文件
|-- sol2java.sh`} />
          <P>java目录下生成了<IC>org/fisco/bcos/asset/contract/</IC>包路径目录，该目录下包含<IC>Asset.java</IC>和<IC>Table.java</IC>两个文件，其中<IC>Asset.java</IC>是Java应用调用<IC>Asset.sol</IC>合约需要的文件。</P>
          <P><IC>Asset.java</IC>的主要接口：</P>
          <CodeBlock language="java" code={assetJavaIface} />
          <P>其中load与deploy函数用于构造Asset对象，其他接口分别用来调用对应的solidity合约的接口。</P>

          <H2 id="s4">4. 创建区块链应用项目</H2>

          <H3 id="s4-step1">第一步. 安装环境</H3>
          <P>首先，我们需要安装JDK以及集成开发环境</P>
          <H4>Java：JDK 14（JDK1.8 至JDK 14都支持）</H4>
          <P>首先，在官网上下载JDK14并安装</P>
          <P>然后，修改环境变量</P>
          <CodeBlock language="bash" code={`# 确认您当前的java版本
$ java -version
# 确认您的java路径
$ ls /Library/Java/JavaVirtualMachines
# 返回
# jdk-14.0.2.jdk

# 如果使用的是bash
$ vim .bash_profile 
# 在文件中加入JAVA_HOME的路径
# export JAVA_HOME=/Library/Java/JavaVirtualMachines/jdk-14.0.2.jdk/Contents/Home 
$ source .bash_profile

# 如果使用的是zash
$ vim .zashrc
# 在文件中加入JAVA_HOME的路径
# export JAVA_HOME = Library/Java/JavaVirtualMachines/jdk-14.0.2.jdk/Contents/Home 
$ source .zashrc

# 确认您的java版本
$ java -version
# 返回
# java version "14.0.2" 2020-07-14
# Java(TM) SE Runtime Environment (build 14.0.2+12-46)
# Java HotSpot(TM) 64-Bit Server VM (build 14.0.2+12-46, mixed mode, sharing)`} />
          <H4>IDE：IntelliJ IDE</H4>
          <P>进入IntelliJ IDE官网，下载并安装社区版IntelliJ IDE</P>

          <div className="my-4 flex justify-center"><img src="https://fisco-bcos-documentation.readthedocs.io/zh-cn/latest/_images/install_java_intellij.gif" alt="安装IntelliJ IDE" className="max-w-full rounded-sm border border-white/10 block" /></div>

          <H3 id="s4-step2">第二步. 创建一个Java工程</H3>
          <P>在IntelliJ IDE中创建一个gradle项目，勾选Gradle和Java，并输入工程名<IC>asset-app</IC>。</P>

          <div className="my-4 flex justify-center"><img src="https://fisco-bcos-documentation.readthedocs.io/zh-cn/latest/_images/create_app_mid.gif" alt="创建Java工程" className="max-w-full rounded-sm border border-white/10 block" /></div>
          <Note type="warning">该项目的源码可以用以下方法获得并参考。（此步骤为非必须步骤）</Note>
          <CodeBlock language="bash" code={`$ cd ~/fisco
$ curl -#LO https://github.com/FISCO-BCOS/LargeFiles/raw/master/tools/asset-app.tar.gz
# 解压得到Java工程项目asset-app
$ tar -zxf asset-app.tar.gz`} />

          <div className="my-4 flex justify-center"><img src="https://fisco-bcos-documentation.readthedocs.io/zh-cn/latest/_images/download_asset.png" alt="下载asset-app" className="max-w-full rounded-sm border border-white/10 block" /></div>
          <Note type="note">如果因为网络问题导致长时间无法下载，请尝试将<IC>199.232.28.133 raw.githubusercontent.com</IC>追加到<IC>/etc/hosts</IC>中，或者请尝试：
            <CodeBlock language="bash" code="curl -#LO https://gitee.com/FISCO-BCOS/asset-app-demo/releases/download/v0.0.1/asset-app.tar.gz" />
          </Note>

          <H3 id="s4-step3">第三步. 引入DeSpace Java SDK</H3>
          <P>在build.gradle文件中的<IC>dependencies</IC>下加入对DeSpace Java SDK的引用。</P>
          <CodeBlock language="gradle" code={`repositories {
    mavenCentral()
    maven {
        allowInsecureProtocol = true
        url "http://maven.aliyun.com/nexus/content/groups/public/"
    }
    maven {
        allowInsecureProtocol = true
        url "https://oss.sonatype.org/content/repositories/snapshots" 
    }
}`} />
          <P>引入Java SDK jar包</P>
          <CodeBlock language="gradle" code={`testImplementation group: 'junit', name: 'junit', version: '4.12'
implementation ('org.fisco-bcos.java-sdk:fisco-bcos-java-sdk:2.9.1')`} />

          <div className="my-4 flex justify-center"><img src="https://fisco-bcos-documentation.readthedocs.io/zh-cn/latest/_images/import_sdk.png" alt="引入Java SDK" className="max-w-full rounded-sm border border-white/10 block" /></div>

          <H3 id="s4-step4">第四步. 配置SDK证书</H3>
          <P>修改<IC>build.gradle</IC>文件，引入Spring框架。</P>
          <CodeBlock language="gradle" code={`def spring_version = "4.3.27.RELEASE"
List spring = [
        "org.springframework:spring-core:$spring_version",
        "org.springframework:spring-beans:$spring_version",
        "org.springframework:spring-context:$spring_version",
        "org.springframework:spring-tx:$spring_version",
]

dependencies {
    testImplementation group: 'junit', name: 'junit', version: '4.12'
    implementation ("org.fisco-bcos.java-sdk:fisco-bcos-java-sdk:2.9.1")
    implementation spring
}`} />

          <div className="my-4 flex justify-center"><img src="https://fisco-bcos-documentation.readthedocs.io/zh-cn/latest/_images/import_spring.png" alt="引入Spring框架" className="max-w-full rounded-sm border border-white/10 block" /></div>
          <P>在<IC>asset-app/test/resources</IC>目录下创建配置文件<IC>applicationContext.xml</IC>，写入配置内容。各配置项的内容可参考Java SDK 配置说明，该配置说明以toml配置文件为例，本例中的配置项与该配置项相对应。</P>
          <P><IC>applicationContext.xml</IC>的内容如下：</P>
          <CodeBlock language="xml" code={appXml} />

          <div className="my-4 flex justify-center"><img src="https://fisco-bcos-documentation.readthedocs.io/zh-cn/latest/_images/config.png" alt="applicationContext.xml配置" className="max-w-full rounded-sm border border-white/10 block" /></div>
          <Note type="warning">如果搭链时设置的jsonrpc_listen_ip为127.0.0.1或者0.0.0.0，channel_port为20200，则<IC>applicationContext.xml</IC>配置不用修改。若区块链节点配置有改动，需要同样修改配置<IC>applicationContext.xml</IC>的<IC>network</IC>属性下的<IC>peers</IC>配置选项，配置所连接节点的<IC>IP:channel_listen_port</IC>。</Note>
          <P>在以上配置文件中，我们指定了证书存放的位<IC>certPath</IC>的值为<IC>conf</IC>。接下来我们需要把SDK用于连接节点的证书放到指定的<IC>conf</IC>目录下。</P>
          <CodeBlock language="bash" code={`# 假设我们将asset-app放在~/fisco目录下 进入~/fisco目录
$ cd ~/fisco
# 创建放置证书的文件夹
$ mkdir -p asset-app/src/test/resources/conf
# 拷贝节点证书到项目的资源目录
$ cp -r nodes/127.0.0.1/sdk/* asset-app/src/test/resources/conf
# 若在IDE直接运行，拷贝证书到resources路径
$ mkdir -p asset-app/src/main/resources/conf
$ cp -r nodes/127.0.0.1/sdk/* asset-app/src/main/resources/conf`} />

          <div className="my-4 flex justify-center"><img src="https://fisco-bcos-documentation.readthedocs.io/zh-cn/latest/_images/copy_cert.png" alt="拷贝节点证书" className="max-w-full rounded-sm border border-white/10 block" /></div>

          <H2 id="s5">5. 业务逻辑开发</H2>
          <P>我们已经介绍了如何在自己的项目中引入以及配置Java SDK，本节介绍如何通过Java程序调用合约，同样以示例的资产管理说明。</P>

          <H3 id="s5-step1">第一步. 将3编译好的Java合约引入项目中</H3>
          <CodeBlock language="bash" code={`cd ~/fisco  
# 将编译好的合约Java类引入项目中。
cp console/contracts/sdk/java/org/fisco/bcos/asset/contract/Asset.java asset-app/src/main/java/org/fisco/bcos/asset/contract/Asset.java`} />

          <div className="my-4 flex justify-center"><img src="https://fisco-bcos-documentation.readthedocs.io/zh-cn/latest/_images/copy_contract.png" alt="引入合约Java类" className="max-w-full rounded-sm border border-white/10 block" /></div>

          <H3 id="s5-step2">第二步. 开发业务逻辑</H3>
          <P>在路径<IC>/src/main/java/org/fisco/bcos/asset/client</IC>目录下，创建<IC>AssetClient.java</IC>类，通过调用<IC>Asset.java</IC>实现对合约的部署与调用</P>
          <P><IC>AssetClient.java</IC> 代码如下：</P>
          <CodeBlock language="java" code={assetClientJava} />

          <div className="my-4 flex justify-center"><img src="https://fisco-bcos-documentation.readthedocs.io/zh-cn/latest/_images/asset_client.png" alt="AssetClient代码" className="max-w-full rounded-sm border border-white/10 block" /></div>
          <P>让我们通过AssetClient这个例子，来了解DeSpace Java SDK的调用：</P>
          <H4>初始化</H4>
          <P>初始化代码的主要功能为构造Client与CryptoKeyPair对象，这两个对象在创建对应的合约类对象(调用合约类的deploy或者load函数)时需要使用。</P>
          <CodeBlock language="java" code={`// 函数initialize中进行初始化 
// 初始化BcosSDK
@SuppressWarnings("resource")
ApplicationContext context =
        new ClassPathXmlApplicationContext("classpath:applicationContext.xml");
bcosSDK = context.getBean(BcosSDK.class);
// 初始化可向群组1发交易的Client
client = bcosSDK.getClient(1);
// 随机生成发送交易的公私钥对
cryptoKeyPair = client.getCryptoSuite().createKeyPair();
client.getCryptoSuite().setCryptoKeyPair(cryptoKeyPair);
logger.debug("create client for group1, account address is " + cryptoKeyPair.getAddress());`} />
          <H4>构造合约类对象</H4>
          <P>可以使用deploy或者load函数初始化合约对象，两者使用场景不同，前者适用于初次部署合约，后者在合约已经部署并且已知合约地址时使用。</P>
          <CodeBlock language="java" code={`// 部署合约
Asset asset = Asset.deploy(client, cryptoKeyPair);
// 加载合约地址
Asset asset = Asset.load(contractAddress, client, cryptoKeyPair);`} />
          <H4>接口调用</H4>
          <P>使用合约对象调用对应的接口，处理返回结果。</P>
          <CodeBlock language="java" code={`// select接口调用
 Tuple2<BigInteger, BigInteger> result = asset.select(assetAccount);
// register接口调用
TransactionReceipt receipt = asset.register(assetAccount, amount);
// transfer接口
TransactionReceipt receipt = asset.transfer(fromAssetAccount, toAssetAccount, amount);`} />
          <P>在<IC>asset-app/tool</IC>目录下添加一个调用AssetClient的脚本<IC>asset_run.sh</IC>。</P>
          <CodeBlock language="bash" code={`#!/bin/bash 

function usage() 
{
    echo " Usage : "
    echo "   bash asset_run.sh deploy"
    echo "   bash asset_run.sh query    asset_account "
    echo "   bash asset_run.sh register asset_account asset_amount "
    echo "   bash asset_run.sh transfer from_asset_account to_asset_account amount "
    echo " "
    echo " "
    echo "examples : "
    echo "   bash asset_run.sh deploy "
    echo "   bash asset_run.sh register  Asset0  10000000 "
    echo "   bash asset_run.sh register  Asset1  10000000 "
    echo "   bash asset_run.sh transfer  Asset0  Asset1 11111 "
    echo "   bash asset_run.sh query Asset0"
    echo "   bash asset_run.sh query Asset1"
    exit 0
}

    case $1 in
    deploy)
            [ $# -lt 1 ] && { usage; }
            ;;
    register)
            [ $# -lt 3 ] && { usage; }
            ;;
    transfer)
            [ $# -lt 4 ] && { usage; }
            ;;
    query)
            [ $# -lt 2 ] && { usage; }
            ;;
    *)
        usage
            ;;
    esac

    java -Djdk.tls.namedGroups="secp256k1" -cp 'apps/*:conf/:lib/*' org.fisco.bcos.asset.client.AssetClient $@`} />

          <div className="my-4 flex justify-center"><img src="https://fisco-bcos-documentation.readthedocs.io/zh-cn/latest/_images/make_sh.png" alt="创建运行脚本" className="max-w-full rounded-sm border border-white/10 block" /></div>
          <P>接着，配置好log。在<IC>asset-app/src/test/resources</IC>目录下创建<IC>log4j.properties</IC></P>
          <CodeBlock language="properties" code={`### set log levels ###
log4j.rootLogger=DEBUG, file

### output the log information to the file ###
log4j.appender.file=org.apache.log4j.DailyRollingFileAppender
log4j.appender.file.DatePattern='_'yyyyMMddHH'.log'
log4j.appender.file.File=./log/sdk.log
log4j.appender.file.Append=true
log4j.appender.file.filter.traceFilter=org.apache.log4j.varia.LevelRangeFilter
log4j.appender.file.layout=org.apache.log4j.PatternLayout
log4j.appender.file.layout.ConversionPattern=[%p] [%-d{yyyy-MM-dd HH:mm:ss}] %C{1}.%M(%L) | %m%n

###output the log information to the console ###
log4j.appender.stdout=org.apache.log4j.ConsoleAppender
log4j.appender.stdout.Target=System.out
log4j.appender.stdout.layout=org.apache.log4j.PatternLayout
log4j.appender.stdout.layout.ConversionPattern=[%p] [%-d{yyyy-MM-dd HH:mm:ss}] %C{1}.%M(%L) | %m%n`} />

          <div className="my-4 flex justify-center"><img src="https://fisco-bcos-documentation.readthedocs.io/zh-cn/latest/_images/config_log.png" alt="配置log4j" className="max-w-full rounded-sm border border-white/10 block" /></div>
          <P>接着，通过配置gradle中的Jar命令，指定复制和编译任务。并引入日志库，在<IC>asset-app/src/test/resources</IC>目录下，创建一个空的<IC>contract.properties</IC>文件，用于应用在运行时存放合约地址。</P>
          <CodeBlock language="gradle" code={`dependencies {
    testCompile group: 'junit', name: 'junit', version: '4.12'
    compile ("org.fisco-bcos.java-sdk:fisco-bcos-java-sdk:2.9.1")
    compile spring
    compile ('org.slf4j:slf4j-log4j12:1.7.25')
    runtime ('org.slf4j:slf4j-log4j12:1.7.25')
}
jar {
    destinationDir file('dist/apps')
    archiveName project.name + '.jar'
    exclude '**/*.xml'
    exclude '**/*.properties'
    exclude '**/*.crt'
    exclude '**/*.key'

    doLast {
        copy {
            from configurations.runtime
            into 'dist/lib'
        }
        copy {
            from file('src/test/resources/')
            into 'dist/conf'
        }
        copy {
            from file('tool/')
            into 'dist/'
        }
        copy {
            from file('src/test/resources/contract')
            into 'dist/contract'
        }
    }
}`} />

          <div className="my-4 flex justify-center"><img src="https://fisco-bcos-documentation.readthedocs.io/zh-cn/latest/_images/conf_jar_log.png" alt="配置Jar与日志" className="max-w-full rounded-sm border border-white/10 block" /></div>
          <P>至此，我们已经完成了这个应用的开发。最后，我们得到的assert-app的目录结构如下：</P>
          <CodeBlock language="bash" code={`|-- build.gradle // gradle配置文件
|-- gradle
|   |-- wrapper
|       |-- gradle-wrapper.jar // 用于下载Gradle的相关代码实现
|       |-- gradle-wrapper.properties // wrapper所使用的配置信息，比如gradle的版本等信息
|-- gradlew // Linux或者Unix下用于执行wrapper命令的Shell脚本
|-- gradlew.bat // Windows下用于执行wrapper命令的批处理脚本
|-- src
|   |-- main
|   |   |-- java
|   |   |     |-- org
|   |   |          |-- fisco
|   |   |                |-- bcos
|   |   |                      |-- asset
|   |   |                            |-- client // 放置客户端调用类
|   |   |                                   |-- AssetClient.java
|   |   |                            |-- contract // 放置Java合约类
|   |   |                                   |-- Asset.java
|   |   |-- resources
|   |        |-- conf
|   |               |-- ca.crt
|   |               |-- node.crt
|   |               |-- node.key
|   |               |-- sdk.crt
|   |               |-- sdk.key
|   |               |-- sdk.publickey
|   |        |-- applicationContext.xml // 项目配置文件
|   |        |-- contract.properties // 存储部署合约地址的文件
|   |        |-- log4j.properties // 日志配置文件
|   |        |-- contract //存放solidity约文件
|   |                |-- Asset.sol
|   |                |-- Table.sol
|   |-- test
|       |-- resources // 存放代码资源文件
|           |-- conf
|                  |-- ca.crt
|                  |-- node.crt
|                  |-- node.key
|                  |-- sdk.crt
|                  |-- sdk.key
|                  |-- sdk.publickey
|           |-- applicationContext.xml // 项目配置文件
|           |-- contract.properties // 存储部署合约地址的文件
|           |-- log4j.properties // 日志配置文件
|           |-- contract //存放solidity约文件
|                   |-- Asset.sol
|                   |-- Table.sol
|
|-- tool
    |-- asset_run.sh // 项目运行脚本`} />

          <H2 id="s6">6. 运行应用</H2>
          <P>至此我们已经介绍使用区块链开发资产管理应用的所有流程并实现了功能，接下来可以运行项目，测试功能是否正常。</P>
          <H4>编译</H4>
          <CodeBlock language="bash" code={`# 切换到项目目录
$ cd ~/fisco/asset-app
# 编译项目
$ ./gradlew build`} />
          <P>编译成功之后，将在项目根目录下生成<IC>dist</IC>目录。dist目录下有一个<IC>asset_run.sh</IC>脚本，简化项目运行。现在开始一一验证本文开始定下的需求。</P>
          <H4>部署<IC>Asset.sol</IC>合约</H4>
          <CodeBlock language="bash" code={`# 进入dist目录
$ cd dist
$ bash asset_run.sh deploy
Deploy Asset successfully, contract address is 0xd09ad04220e40bb8666e885730c8c460091a4775`} />
          <H4>注册资产</H4>
          <CodeBlock language="bash" code={`$ bash asset_run.sh register Alice 100000
Register account successfully => account: Alice, value: 100000
$ bash asset_run.sh register Bob 100000
Register account successfully => account: Bob, value: 100000`} />
          <H4>查询资产</H4>
          <CodeBlock language="bash" code={`$ bash asset_run.sh query Alice
account Alice, value 100000
$ bash asset_run.sh query Bob
account Bob, value 100000`} />
          <H4>资产转移</H4>
          <CodeBlock language="bash" code={`$ bash asset_run.sh transfer Alice Bob  50000
Transfer successfully => from_account: Alice, to_account: Bob, amount: 50000
$ bash asset_run.sh query Alice
account Alice, value 50000
$ bash asset_run.sh query Bob
account Bob, value 150000`} />

          <div className="my-4 flex justify-center"><img src="https://fisco-bcos-documentation.readthedocs.io/zh-cn/latest/_images/test.png" alt="运行测试结果" className="max-w-full rounded-sm border border-white/10 block" /></div>
          <Note type="tip">至此，我们通过合约开发，合约编译，SDK配置与业务开发构建了一个基于DeSpace联盟区块链的应用。</Note>


          {/* ═══════════════════════════════════════ */}
          {/* Java SDK                                */}
          {/* ═══════════════════════════════════════ */}
          <H2 id="javasdk">Java SDK</H2>
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
          <P>大部分场景仅需要配置certPath配置项，将节点证书从<IC>nodes/${'{'}ip{'}'}/sdk/</IC>目录拷贝到certPath指定路径：</P>
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
java -cp "apps/*:lib/*:conf/" org.fisco.bcos.sdk.demo.codegen.DemoSolcToJava \${'{'}packageName{'}'}`} />

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
            <LI>从节点<IC>nodes/${'{'}{'}ip{'}'}{''}/sdk/</IC>目录下的证书拷贝到新建的<IC>conf</IC>目录。</LI>
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
            <LI><IC>caCert</IC>: CA证书路径，默认注释该配置项，该配置项注释时，当SDK与节点间采用非国密SSL连接时，默认的CA证书路径为<IC>{'$'}{'{'}certPath{'}'}/ca.crt</IC>，当SDK与节点采用国密SSL连接时，默认的CA证书路径为<IC>{'$'}{'{'}certPath{'}'}/gm/gmca.crt</IC></LI>
            <LI><IC>sslCert</IC>: SDK证书路径，默认注释该配置项，当SDK与节点间采用非国密SSL连接时，从<IC>{'$'}{'{'}certPath{'}'}/sdk.crt</IC>加载SDK证书，当SDK与节点间采用国密SSL连接时，从<IC>{'$'}{'{'}certPath{'}'}/gm/gmsdk.crt</IC>加载SDK证书</LI>
            <LI><IC>sslKey</IC>: SDK私钥路径，默认注释该配置项，当SDK与节点间采用非国密SSL连接时，从<IC>{'$'}{'{'}certPath{'}'}/sdk.key</IC>加载SDK私钥，SDK与节点采用国密SSL连接时，从<IC>{'$'}{'{'}certPath{'}'}/gm/gmsdk.key</IC>加载SDK私钥</LI>
            <LI><IC>enSslCert</IC>: 国密SSL加密证书路径，仅当SDK与节点间采用国密SSL连接时，需要配置该配置项，默认从<IC>{'$'}{'{'}certPath{'}'}/gm/gmensdk.crt</IC>加载国密SSL加密证书</LI>
            <LI><IC>enSslKey</IC>: 国密SSL加密私钥路径，仅当SDK与节点间采用国密SSL连接时，需配置该配置项，默认从<IC>{'$'}{'{'}certPath{'}'}/gm/gmensdk.key</IC>加载国密SSL加密私钥</LI>
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
          <P>AMOP支持私有话题的功能，配置文件中提供了<IC>AMOP</IC>相关配置项于<IC>{'['}{'['}amop{']'}{']'}</IC>中。</P>
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
            <LI><IC>keyStoreDir</IC>: 加载/保存账户文件的路径，默认为<IC>account</IC></LI>
            <LI><IC>accountFileFormat</IC>: 账户文件格式，默认为<IC>pem</IC>，目前仅支持<IC>pem</IC>和<IC>p12</IC>，<IC>pem</IC>格式的账户文件不需要口令加载，加载<IC>p12</IC>格式的账户文件时需要口令</LI>
            <LI><IC>accountAddress</IC>: 加载的账户地址，默认为空</LI>
            <LI><IC>accountFilePath</IC>: 加载的账户文件路径，默认注释该配置项</LI>
            <LI><IC>password</IC>: 加载<IC>p12</IC>类型账户文件的口令</LI>
          </UL>
          <Note type="note">当没有配置 accountAddress 和 accountFilePath 时，SDK会生成随机的账户向节点交易，生成的账户信息均保存在 keyStoreDir 配置项指定的目录下</Note>
          <CodeBlock language="toml" code={`[account]
keyStoreDir = "account"         # The directory to load/store the account file, default is "account"
# accountFilePath = ""          # The account file path (default load from the path specified by the keyStoreDir)
accountFileFormat = "pem"       # The storage format of account file (Default is "pem", "p12" as an option)

# accountAddress = ""           # The transactions sending account address
                                # Default is a randomly generated account
                                # The randomly generated account is stored in the path specified by the keyStoreDir

# password = ""                 # The password used to load the account file`} />

          <H4>线程池配置</H4>
          <P><IC>[threadPool]</IC>是线程池相关配置</P>
          <UL>
            <LI><IC>channelProcessorThreadSize</IC>: 处理网络回调的线程数目，默认注释该配置项，注释该配置项时，其默认值为机器的CPU数目</LI>
            <LI><IC>receiptProcessorThreadSize</IC>: 接收交易的线程数目，默认注释该配置项，默认值为机器的CPU数目</LI>
            <LI><IC>maxBlockingQueueSize</IC>: 线程池队列等待被处理的最大任务数目，默认为102400</LI>
          </UL>
          <Note type="note">大多数场景下，不需要手工配置线程池配置；压测场景下，可将 maxBlockingQueueSize 配置大一些。</Note>
          <CodeBlock language="toml" code={`[threadPool]
# channelProcessorThreadSize = "16"         # The size of the thread pool to process channel callback
                                            # Default is the number of cpu cores

# receiptProcessorThreadSize = "16"         # The size of the thread pool to process transaction receipt notification
                                            # Default is the number of cpu cores

maxBlockingQueueSize = "102400"             # The max blocking queue size of the thread pool`} />

          <H3 id="javasdk-cfg-3">3. 配置示例</H3>
          <P>完整的TOML配置示例：</P>
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
                                            # default load the GM SSL encryption privateKey from \${certPath}/gm/gmensdk.key

[network]
peers=["127.0.0.1:20200", "127.0.0.1:20201"]    # The peer list to connect

# AMOP configuration
# [[amop]]
# topicName = "PrivateTopic"
# publicKeys = [ "conf/amop/consumer_public_key_1.pem" ]

# [[amop]]
# topicName = "PrivateTopic"
# privateKey = "conf/amop/consumer_private_key.p12"
# password = "123456"

[account]
keyStoreDir = "account"
# accountFilePath = ""
accountFileFormat = "pem"
# accountAddress = ""
# password = ""

[threadPool]
# channelProcessorThreadSize = "16"
# receiptProcessorThreadSize = "16"
maxBlockingQueueSize = "102400"`} />

          <H3 id="javasdk-cfg-4">4. 其它格式的配置</H3>
          <P>Java SDK还支持<IC>properties</IC>、<IC>yml</IC>以及<IC>xml</IC>格式的配置文件。各字段的含义以及默认值与<IC>toml</IC>配置文件一致。</P>

          <H4>properties格式</H4>
          <P>在项目的主目录创建文件<IC>fisco-config.properties</IC>，复制以下配置内容，并根据实际情况修改各配置项。</P>
          <CodeBlock language="properties" code={`cryptoMaterial.certPath=conf

# network.peers[0]=127.0.0.1:20200
# network.peers[0]=127.0.0.1:21200

# amop[0].publicKeys[0]=conf/amop/consumer_public_key_1.pem
# amop[0].topicName=PrivateTopic1

# amop[1].password=123456 
# amop[1].privateKey=conf/amop/consumer_private_key.p12
# amop[1].topicName=PrivateTopic2

account.keyStoreDir=account
account.accountFileFormat=pem

# threadPool.channelProcessorThreadSize=16
# threadPool.receiptProcessorThreadSize=16
threadPool.maxBlockingQueueSize=102400`} />
          <CodeBlock language="java" code={`@Data
@ToString
@Component
@ConfigurationProperties
@PropertySource(value = "classpath:fisco-config.properties", ignoreResourceNotFound = true, encoding = "UTF-8")
public class BcosConfig {
    private Map<String, Object> cryptoMaterial;
    public Map<String, List<String> > network;
    public List<AmopTopic> amop;
    public Map<String, Object> account;
    public Map<String, Object> threadPool;
}

@Slf4j
@Data
@Component
public class FiscoBcos {

    @Autowired
    BcosConfig bcosConfig;

    BcosSDK bcosSDK;

    public void init() {
        ConfigProperty configProperty = loadProperty();
        ConfigOption configOption;
        try {
            configOption = new ConfigOption(configProperty, CryptoType.ECDSA_TYPE);
        } catch (ConfigException e) {
            log.error("init error:" + e.toString());
            return ;
        }
        bcosSDK = new BcosSDK(configOption);
    }

    public ConfigProperty loadProperty() {
        ConfigProperty configProperty = new ConfigProperty();
        configProperty.setCryptoMaterial(bcosConfig.getCryptoMaterial());
        configProperty.setAccount(bcosConfig.getAccount());
        configProperty.setNetwork(new HashMap<String, Object>(){{
            put("peers", bcosConfig.getNetwork().get("peers"));
        }} );
        configProperty.setAmop(bcosConfig.getAmop());
        configProperty.setThreadPool(bcosConfig.getThreadPool());
        return configProperty;
    }
}`} />

          <H4>yml格式</H4>
          <P>在项目的主目录创建文件<IC>fisco-config.yml</IC>，复制以下配置内容，并根据实际情况修改各配置项。</P>
          <CodeBlock language="yaml" code={`cryptoMaterial:                     
  certPath: "conf"                   
#  caCert: "conf/ca.crt"               
#  sslCert: "conf/sdk.crt"             
#  sslKey: "conf/sdk.key"
#  enSslCert: "conf/gm/gmensdk.crt"
#  enSslKey: "conf/gm/gmensdk.key"

network:
  peers:
    - "127.0.0.1:20201"
    - "127.0.0.1:20200"

amop:
#  - publicKeys: [ "conf/amop/consumer_public_key_1.pem" ]
#    topicName: "PrivateTopic1"
#  - password: "123456"
#    privateKey: "conf/amop/consumer_private_key.p12"
#    topicName: "PrivateTopic2"

account:
  keyStoreDir: "account"
  accountFileFormat: "pem"

threadPool:
#  channelProcessorThreadSize: "16"
#  receiptProcessorThreadSize: "16"
#  maxBlockingQueueSize: "102400"`} />
          <CodeBlock language="java" code={`@Data
@Component
@Slf4j
public class FiscoBcos {

    BcosSDK bcosSDK;

    public void init() {
        ConfigProperty configProperty = loadProperty();
        ConfigOption configOption ;
        try {
            configOption = new ConfigOption(configProperty, CryptoType.ECDSA_TYPE);
        } catch (ConfigException e) {
            log.error("init error:" + e.toString());
            return ;
        }
        bcosSDK = new BcosSDK(configOption);
    }

    public ConfigProperty loadProperty() {
        Representer representer = new Representer();
        representer.getPropertyUtils().setSkipMissingProperties(true);
        Yaml yaml = new Yaml(representer);
        String configFile = "/fisco-config.yml";
        try (InputStream inputStream = this.getClass().getResourceAsStream(configFile)) {
            return yaml.loadAs(inputStream, ConfigProperty.class);
        } catch (Exception e) {
            log.error("load property: ", e);
        }
    }
}`} />

          <H4>xml格式</H4>
          <P>在项目的主目录创建文件<IC>fisco-config.xml</IC>，复制以下配置内容，并根据实际情况修改各配置项。</P>
          <CodeBlock language="xml" code={`<?xml version="1.0" encoding="UTF-8" ?>

<beans xmlns="http://www.springframework.org/schema/beans"
       xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
       xsi:schemaLocation="http://www.springframework.org/schema/beans
    http://www.springframework.org/schema/beans/spring-beans-4.0.xsd">
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
            <p>© Copyright DeSpace 2019. 本技术文档适用于DeSpace 2.x版本，DeSpace 3.x版本技术文档请查看这里，DeSpace 1.3版本技术文档请查看这里。</p>
            <p>Built with Sphinx using a theme provided by Read the Docs.</p>
            <button onClick={() => navigate('/')} className="flex items-center gap-1.5 hover:text-brand-primary transition-colors mt-4">
              <ArrowLeft size={12} /> 返回官网
            </button>
          </div>
        </main>
      </div>
    </div>
  );
}
