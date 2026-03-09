import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronDown } from 'lucide-react';

export const developNavItems = [
  { id: 's1',       label: '了解应用需求' },
  { id: 's2',       label: '设计与开发智能合约' },
  { id: 's2-step1', label: '　第一步. 设计智能合约' },
  { id: 's2-step2', label: '　第二步. 开发源码' },
  { id: 's3',       label: '编译智能合约' },
  { id: 's4',       label: '创建区块链应用项目' },
  { id: 's4-step1', label: '　第一步. 安装环境' },
  { id: 's4-step2', label: '　第二步. 创建Java工程' },
  { id: 's4-step3', label: '　第三步. 引入Java SDK' },
  { id: 's4-step4', label: '　第四步. 配置SDK证书' },
  { id: 's5',       label: '业务逻辑开发' },
  { id: 's5-step1', label: '　第一步. 引入合约Java类' },
  { id: 's5-step2', label: '　第二步. 开发业务逻辑' },
  { id: 's6',       label: '运行应用' },
];

export const javaNavItems = [
  { id: 'javasdk-qs',    label: '快速入门' },
  { id: 'javasdk-qs-1',  label: '　1. 安装环境' },
  { id: 'javasdk-qs-2',  label: '　2. 搭建DeSpace链' },
  { id: 'javasdk-qs-3',  label: '　3. 开发智能合约应用' },
  { id: 'javasdk-qs-4',  label: '　4. 附录' },
  { id: 'javasdk-cfg',   label: '配置说明' },
  { id: 'javasdk-cfg-1', label: '　1. 快速配置' },
  { id: 'javasdk-cfg-2', label: '　2. 配置解读' },
  { id: 'javasdk-cfg-3', label: '　3. 配置示例' },
  { id: 'javasdk-cfg-4', label: '　4. 其它格式配置' },
];

export const keyConceptsNavItems = [
  { id: 'blockchain',            label: '区块链是什么' },
  { id: 'blockchain-ledger',     label: '　1. 账本' },
  { id: 'blockchain-consensus',  label: '　2. 共识机制' },
  { id: 'blockchain-contract',   label: '　3. 智能合约' },
  { id: 'consortium',            label: '联盟链概念分析' },
  { id: 'consortium-perf',       label: '　1. 性能' },
  { id: 'consortium-security',   label: '　2. 安全性' },
  { id: 'consortium-governance', label: '　3. 治理与监管' },
];

const configSubPages = [
  {
    key: 'node-config',
    label: '节点配置',
    route: '/docs/config/node-config',
    items: [
      { id: 'config-ini',     label: '1. 主配置config.ini' },
      { id: 'config-group',   label: '2. 群组系统配置' },
      { id: 'config-mutable', label: '3. 账本可变配置' },
    ],
  },
  {
    key: 'node-management',
    label: '组员配置',
    route: '/docs/config/node-management',
    items: [
      { id: 'nm-ops',        label: '1. 操作命令' },
      { id: 'nm-cases',      label: '2. 操作案例' },
      { id: 'nm-join-net',   label: '3. 节点加入网络' },
      { id: 'nm-leave-net',  label: '4. 节点退出网络' },
      { id: 'nm-join-group', label: '5. 节点加入群组' },
      { id: 'nm-leave-group',label: '6. 节点退出群组' },
    ],
  },
  {
    key: 'cert-list',
    label: '配置CA黑白名单',
    route: '/docs/config/cert-list',
    items: [
      { id: 'cl-blacklist', label: '1. 黑名单' },
      { id: 'cl-whitelist', label: '2. 白名单' },
      { id: 'cl-public-ca', label: '3. 公共CA场景' },
      { id: 'cl-examples',  label: '4. 操作举例' },
    ],
  },
  {
    key: 'storage-enc',
    label: '存储加密',
    route: '/docs/config/storage-enc',
    items: [
      { id: 'se-step1', label: '1. 部署Key Manager' },
      { id: 'se-step2', label: '2. 生成节点' },
      { id: 'se-step3', label: '3. 启动Key Manager' },
      { id: 'se-step4', label: '4. 配置dataKey' },
      { id: 'se-step5', label: '5. 加密节点私钥' },
      { id: 'se-step6', label: '6. 节点运行' },
      { id: 'se-step7', label: '7. 正确性判断' },
    ],
  },
  {
    key: 'permission-control',
    label: '账户权限控制',
    route: '/docs/config/permission-control',
    items: [
      { id: 'pc-role',  label: '1. 基于角色的权限控制' },
      { id: 'pc-table', label: '2. 基于表的权限控制' },
    ],
  },
  {
    key: 'sdk-allowlist',
    label: '设置SDK白名单',
    route: '/docs/config/sdk-allowlist',
    items: [
      { id: 'sa-config', label: '1. 配置方法' },
      { id: 'sa-usage',  label: '2. 使用说明' },
    ],
  },
];

const CONFIG_PAGE_KEYS = configSubPages.map(p => p.key);

type ActivePage = 'develop' | 'java-sdk' | 'key-concepts' | 'node-config' | 'node-management' | 'cert-list' | 'storage-enc' | 'permission-control' | 'sdk-allowlist';

const mainSections = [
  { key: 'develop',      label: '开发第一个区块链应用', route: '/docs',              items: developNavItems },
  { key: 'java-sdk',     label: 'Java SDK Docs',        route: '/docs/java-sdk',     items: javaNavItems },
  { key: 'key-concepts', label: '关键概念',              route: '/docs/key-concepts', items: keyConceptsNavItems },
];

interface Props {
  activePage: ActivePage;
  activeId: string;
  scrollTo: (id: string) => void;
  sidebarOpen: boolean;
}

export default function DocsSidebar({ activePage, activeId, scrollTo, sidebarOpen }: Props) {
  const navigate = useNavigate();
  const isConfigPage = (CONFIG_PAGE_KEYS as string[]).includes(activePage);

  const [expanded, setExpanded] = useState<Record<string, boolean>>(() => {
    const init: Record<string, boolean> = {};
    mainSections.forEach(s => { init[s.key] = s.key === activePage; });
    init['config'] = isConfigPage;
    return init;
  });

  const toggle = (key: string, route: string) => {
    setExpanded(prev => {
      const nowExpanded = !prev[key];
      if (nowExpanded && key !== activePage && !(CONFIG_PAGE_KEYS as string[]).includes(key)) navigate(route);
      return { ...prev, [key]: nowExpanded };
    });
  };

  const toggleConfig = () => {
    setExpanded(prev => {
      const nowExpanded = !prev['config'];
      if (nowExpanded && !isConfigPage) navigate(configSubPages[0].route);
      return { ...prev, config: nowExpanded };
    });
  };

  const [subExpanded, setSubExpanded] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(configSubPages.map(p => [p.key, p.key === activePage]))
  );

  const toggleSubPage = (key: string, route: string) => {
    if ((activePage as string) !== key) navigate(route);
    setSubExpanded(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <aside className={`fixed md:sticky top-14 z-40 h-[calc(100vh-3.5rem)] w-60 bg-[#020c18] border-r border-white/5 overflow-y-auto transition-transform duration-300 shrink-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}>
      <nav className="p-4">
        <p className="text-[10px] uppercase tracking-widest text-slate-600 font-bold mb-3">目录</p>

        {/* Main sections: develop, java-sdk, key-concepts */}
        {mainSections.map(section => {
          const isActive = activePage === section.key;
          const isExpanded = expanded[section.key];
          return (
            <div key={section.key} className="mb-2">
              <button
                onClick={() => toggle(section.key, section.route)}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-sm text-xs font-bold transition-all ${
                  isActive
                    ? 'text-white bg-brand-primary/10 border-l-2 border-brand-primary hover:bg-brand-primary/20'
                    : 'text-slate-400 hover:text-white hover:bg-white/5 border-l-2 border-transparent hover:border-slate-500'
                }`}
              >
                <span>{section.label}</span>
                <ChevronDown size={12} className={`transition-transform duration-200 ${isExpanded ? 'rotate-0' : '-rotate-90'}`} />
              </button>
              <div
                className="overflow-hidden transition-all duration-300 ease-in-out"
                style={{ maxHeight: isExpanded ? '800px' : '0' }}
              >
                <ul className="mt-1 space-y-0.5">
                  {section.items.map(item => (
                    <li key={item.id}>
                      <button
                        onClick={() => isActive ? scrollTo(item.id) : navigate(section.route)}
                        className={`w-full text-left px-3 py-1.5 rounded-sm text-xs transition-all ${
                          isActive && activeId === item.id
                            ? 'bg-brand-primary/10 text-brand-primary font-bold border-l-2 border-brand-primary'
                            : 'text-slate-500 hover:text-white hover:bg-white/5'
                        }`}
                      >
                        {item.label}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          );
        })}

        {/* Config section with sub-pages */}
        <div className="mb-2">
          <button
            onClick={toggleConfig}
            className={`w-full flex items-center justify-between px-3 py-2 rounded-sm text-xs font-bold transition-all ${
              isConfigPage
                ? 'text-white bg-brand-primary/10 border-l-2 border-brand-primary hover:bg-brand-primary/20'
                : 'text-slate-400 hover:text-white hover:bg-white/5 border-l-2 border-transparent hover:border-slate-500'
            }`}
          >
            <span>配置管理</span>
            <ChevronDown size={12} className={`transition-transform duration-200 ${expanded['config'] ? 'rotate-0' : '-rotate-90'}`} />
          </button>
          <div
            className="overflow-hidden transition-all duration-300 ease-in-out"
            style={{ maxHeight: expanded['config'] ? '1200px' : '0' }}
          >
            <ul className="mt-1 space-y-0.5">
              {configSubPages.map(subPage => {
                const isSubActive = activePage === subPage.key;
                const isItemsExpanded = subExpanded[subPage.key];
                return (
                  <li key={subPage.key}>
                    <button
                      onClick={() => toggleSubPage(subPage.key, subPage.route)}
                      className={`w-full flex items-center justify-between px-3 py-1.5 rounded-sm text-xs transition-all font-medium ${
                        isSubActive
                          ? 'bg-brand-primary/10 text-brand-primary font-bold border-l-2 border-brand-primary'
                          : 'text-slate-500 hover:text-white hover:bg-white/5'
                      }`}
                    >
                      <span>{subPage.label}</span>
                      {subPage.items.length > 0 && (
                        <ChevronDown size={10} className={`transition-transform duration-200 shrink-0 ${isItemsExpanded ? 'rotate-0' : '-rotate-90'}`} />
                      )}
                    </button>
                    <div
                      className="overflow-hidden transition-all duration-300 ease-in-out"
                      style={{ maxHeight: isItemsExpanded ? '400px' : '0' }}
                    >
                      <ul className="ml-3 mt-0.5 space-y-0.5">
                        {subPage.items.map(item => (
                          <li key={item.id}>
                            <button
                              onClick={() => isSubActive ? scrollTo(item.id) : undefined}
                              className={`w-full text-left px-3 py-1 rounded-sm text-xs transition-all ${
                                isSubActive && activeId === item.id
                                  ? 'text-brand-primary font-bold'
                                  : 'text-slate-600 hover:text-white hover:bg-white/5'
                              }`}
                            >
                              {item.label}
                            </button>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </nav>
    </aside>
  );
}
