import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Database, Menu, X, Copy, Check, ChevronRight } from 'lucide-react';
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

export default function PermissionControl() {
  const navigate = useNavigate();
  const [activeId, setActiveId] = useState('pc-role');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => { entries.forEach(e => { if (e.isIntersecting) setActiveId(e.target.id); }); },
      { rootMargin: '-20% 0px -70% 0px' }
    );
    ['pc-role', 'pc-table'].forEach(id => { const el = document.getElementById(id); if (el) observer.observe(el); });
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
          <span className="text-xs font-black uppercase tracking-widest text-white">账户权限控制</span>
        </div>
        <button className="md:hidden ml-auto text-white" onClick={() => setSidebarOpen(!sidebarOpen)}>
          {sidebarOpen ? <X size={18} /> : <Menu size={18} />}
        </button>
      </header>

      <div className="pt-14 flex">
        <DocsSidebar activePage="permission-control" activeId={activeId} scrollTo={scrollTo} sidebarOpen={sidebarOpen} />

        <main className="flex-1 min-w-0 px-6 md:px-12 lg:px-16 py-10 max-w-4xl">
          {/* breadcrumb */}
          <div className="flex flex-wrap items-center gap-2 text-brand-primary text-xs font-bold uppercase tracking-widest mb-3">
            <span>配置管理</span><span className="text-white/20">·</span>
            <span>账户权限控制</span>
          </div>
          <h1 className="text-3xl font-black text-white tracking-tight mb-6">账户权限控制</h1>

          <h2 id="pc-role" className="text-xl font-black text-white tracking-tight mt-10 mb-4 pb-2 border-b border-white/10 scroll-mt-20">基于角色的权限控制</h2>

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

          <h2 id="pc-table" className="text-xl font-black text-white tracking-tight mt-12 mb-4 pb-2 border-b border-white/10 scroll-mt-20">基于表的权限控制</h2>

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

          <div className="mt-16 pt-8 border-t border-white/5 text-slate-600 text-xs space-y-2">
            <p>© Copyright DeSpace 2019. 本技术文档适用于DeSpace 2.x版本。</p>
            <p>Built with Sphinx using a theme provided by Read the Docs.</p>
          </div>
        </main>
      </div>
    </div>
  );
}
