import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronDown } from 'lucide-react';

export const developNavItems = [
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
  { id: 'blockchain-ledger',     label: '　账本' },
  { id: 'blockchain-consensus',  label: '　共识机制' },
  { id: 'blockchain-contract',   label: '　智能合约' },
  { id: 'consortium',            label: '联盟链概念分析' },
  { id: 'consortium-perf',       label: '　性能' },
  { id: 'consortium-security',   label: '　安全性' },
  { id: 'consortium-governance', label: '　治理与监管' },
];

export const configNavItems = [
  { id: 'node-config',        label: '节点配置' },
  { id: 'config-ini',         label: '　主配置config.ini' },
  { id: 'config-group',       label: '　群组系统配置' },
  { id: 'config-mutable',     label: '　账本可变配置' },
  { id: 'node-management',    label: '组员节点管理' },
  { id: 'cert-list',          label: 'CA黑白名单配置' },
  { id: 'storage-enc',        label: '存储加密' },
  { id: 'permission-control', label: '账户权限控制' },
];

const sections = [
  { key: 'develop',      label: '开发第一个区块链应用', route: '/docs',                   items: developNavItems },
  { key: 'java-sdk',     label: 'Java SDK Docs',         route: '/docs/java-sdk',          items: javaNavItems },
  { key: 'key-concepts', label: '关键概念',               route: '/docs/key-concepts',      items: keyConceptsNavItems },
  { key: 'config',       label: '配置管理',               route: '/docs/blockchain-config', items: configNavItems },
];

interface Props {
  activePage: 'develop' | 'java-sdk' | 'key-concepts' | 'config';
  activeId: string;
  scrollTo: (id: string) => void;
  sidebarOpen: boolean;
}

export default function DocsSidebar({ activePage, activeId, scrollTo, sidebarOpen }: Props) {
  const navigate = useNavigate();
  const [expanded, setExpanded] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(sections.map(s => [s.key, s.key === activePage]))
  );

  const toggle = (key: string, route: string) => {
    setExpanded(prev => {
      const nowExpanded = !prev[key];
      if (nowExpanded && key !== activePage) navigate(route);
      return { ...prev, [key]: nowExpanded };
    });
  };

  return (
    <aside className={`fixed md:sticky top-14 z-40 h-[calc(100vh-3.5rem)] w-60 bg-[#020c18] border-r border-white/5 overflow-y-auto transition-transform duration-300 shrink-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}>
      <nav className="p-4">
        <p className="text-[10px] uppercase tracking-widest text-slate-600 font-bold mb-3">目录</p>
        {sections.map(section => {
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
      </nav>
    </aside>
  );
}
