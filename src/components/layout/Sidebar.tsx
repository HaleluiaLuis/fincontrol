"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect, useCallback, useMemo } from 'react';
import { useAuth } from '@/contexts/AuthContext';

interface SidebarProps { isOpen: boolean; onToggle: () => void; }

type NavItem = { name: string; href: string; icon: JSX.Element; description?: string; badge?: string };

const navSections: { label: string; items: NavItem[] }[] = [
  {
    label: 'Geral',
    items: [
      {
        name: 'Dashboard',
        href: '/',
        icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5a2 2 0 012-2h4a2 2 0 012 2v6a2 2 0 01-2 2H10a2 2 0 01-2-2V5z"/></svg>,
        description: 'Visão geral financeira'
      },
      {
        name: 'Relatórios',
        href: '/relatorios',
        icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/></svg>,
        description: 'Análises e estatísticas'
      }
    ]
  },
  {
    label: 'Operacional',
    items: [
      {
        name: 'Gestão de Faturas',
        href: '/faturas',
        icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>,
        description: 'Controle e aprovação',
        badge: '3'
      },
      {
        name: 'Transações',
        href: '/transacoes',
        icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"/></svg>,
        description: 'Receitas e despesas'
      },
      {
        name: 'Fornecedores',
        href: '/fornecedores',
        icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-4m-5 0H9m11 0H5"/></svg>,
        description: 'Cadastro e análise'
      }
    ]
  },
  {
    label: 'Administração',
    items: [
      {
        name: 'Configurações',
        href: '/configuracoes',
        icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/></svg>,
        description: 'Parâmetros do sistema'
      }
    ]
  }
];

export function Sidebar({ isOpen, onToggle }: SidebarProps) {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const [collapsed, setCollapsed] = useState(false);
  const [filter, setFilter] = useState('');
  const [autoCollapse, setAutoCollapse] = useState(false); // colapso adaptativo por breakpoint
  const [autoOverride, setAutoOverride] = useState(false); // usuário forçou expandir dentro do intervalo
  type Density = 'comfortable' | 'compact' | 'ultra';
  const [density, setDensity] = useState<Density>('compact');

  // carregar densidade
  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      const stored = localStorage.getItem('sidebar:density') as Density | null;
      if (stored && stored !== density) setDensity(stored);
    } catch {}
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // carregar preferencia inicial (uma vez)
  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      const storedCollapsed = localStorage.getItem('sidebar:collapsed') === 'true';
      const storedOverride = localStorage.getItem('sidebar:autoOverride') === 'true';
      if (storedCollapsed !== collapsed) setCollapsed(storedCollapsed);
      if (storedOverride !== autoOverride) setAutoOverride(storedOverride);
    } catch {}
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // resize listener dependente do override
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const handler = () => {
      const w = window.innerWidth;
      const shouldAuto = w >= 1024 && w < 1360;
      setAutoCollapse(prev => {
        const next = shouldAuto && !autoOverride;
        return prev === next ? prev : next;
      });
    };
    handler();
    window.addEventListener('resize', handler);
    return () => window.removeEventListener('resize', handler);
  }, [autoOverride]);

  // persistir
  useEffect(() => {
    if (typeof window === 'undefined') return;
    try { localStorage.setItem('sidebar:collapsed', String(collapsed)); } catch {}
  }, [collapsed]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    try { localStorage.setItem('sidebar:autoOverride', String(autoOverride)); } catch {}
  }, [autoOverride]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    try { localStorage.setItem('sidebar:density', density); } catch {}
  }, [density]);

  const toggleCollapse = useCallback(() => {
    // Se está em autoCollapse e ainda não houve override, ao clicar expande e marca override
    if (autoCollapse && !autoOverride) {
      setAutoOverride(true);
      setCollapsed(false);
      return;
    }
    setCollapsed(c => !c);
  }, [autoCollapse, autoOverride]);

  const isCollapsed = collapsed || autoCollapse; // estado efetivo

  const cycleDensity = useCallback(() => {
    setDensity(d => d === 'comfortable' ? 'compact' : d === 'compact' ? 'ultra' : 'comfortable');
  }, []);

  const densityCfg = {
    comfortable: {
      navItem: 'py-2 text-[14px]',
      sectionSpacing: 'space-y-2',
      sectionLabel: 'px-3 mb-1',
      icon: 'w-5 h-5',
      footerPad: 'p-4',
    },
    compact: {
      navItem: 'py-1.5 text-[13px]',
      sectionSpacing: 'space-y-1.5',
      sectionLabel: 'px-3 mb-0.5',
      icon: 'w-5 h-5',
      footerPad: 'p-3',
    },
    ultra: {
      navItem: 'py-1 text-[12px]',
      sectionSpacing: 'space-y-1',
      sectionLabel: 'px-2.5 mb-0.5',
      icon: 'w-4.5 h-4.5',
      footerPad: 'p-2.5',
    }
  } as const;
  const cfg = densityCfg[density];

  const isActive = useCallback((href: string) => href === '/' ? pathname === '/' : pathname.startsWith(href), [pathname]);

  const filteredSections = useMemo(() => navSections
    .map(sec => ({
      ...sec,
      items: sec.items.filter(i => {
        if (!filter) return true;
        const q = filter.toLowerCase();
        return i.name.toLowerCase().includes(q) || (i.description || '').toLowerCase().includes(q);
      })
    }))
    .filter(s => s.items.length > 0), [filter]);

  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden" onClick={onToggle} />
      )}
      <aside
  className={`fixed inset-y-0 left-0 z-50 flex flex-col border-r border-gray-800/60 dark:border-gray-700/60 bg-gray-950/95 dark:bg-gray-900/90 backdrop-blur-sm text-gray-200 shadow-lg transition-[transform,width] duration-300 ease-in-out lg:static lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } ${isCollapsed ? 'w-20' : 'w-72'} group/sidebar`}
        role="navigation"
        aria-label="Menu principal"
        data-collapsed={isCollapsed}
        data-density={density}
      >
        {/* Top / brand */}
  <div className="h-14 flex items-center px-3 gap-2 border-b border-gray-800/60 dark:border-gray-700/60 bg-gray-950/40 dark:bg-gray-900/40 shrink-0">
          <button
            onClick={() => { if (typeof window !== 'undefined' && window.innerWidth < 1024) onToggle(); }}
            className="lg:hidden inline-flex items-center justify-center w-9 h-9 rounded-md text-gray-400 hover:text-white hover:bg-gray-800/70 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
            aria-label="Fechar menu"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/></svg>
          </button>
          <div className="w-9 h-9 rounded-md flex items-center justify-center shadow-inner shadow-black/50 ring-1 ring-gray-700/70 bg-gray-800 text-sm font-semibold tracking-tight text-white">FC</div>
          {!isCollapsed && (
            <div className="flex flex-col leading-tight select-none">
              <span className="text-sm font-semibold text-white">FinControl</span>
              <span className="text-[10px] uppercase tracking-wider text-gray-400">Corporate</span>
            </div>
          )}
          <div className="flex-1" />
          {!isCollapsed && (
            <button
              onClick={cycleDensity}
              title={`Densidade: ${density}`}
              aria-label="Alterar densidade da navegação"
              className="hidden lg:inline-flex items-center justify-center w-8 h-8 rounded-md text-gray-400 hover:text-white hover:bg-gray-800/70 focus:outline-none focus:ring-2 focus:ring-blue-500/40"
            >
              <span className="flex flex-col items-center justify-center gap-[3px]">
                <span className={`block rounded-sm bg-current transition-all ${density === 'comfortable' ? 'w-4 h-0.5' : density === 'compact' ? 'w-4 h-[3px]' : 'w-4 h-1'}`} />
                <span className={`block rounded-sm bg-current transition-all ${density === 'comfortable' ? 'w-4 h-0.5' : density === 'compact' ? 'w-4 h-[3px]' : 'w-4 h-1'}`} />
                <span className={`block rounded-sm bg-current transition-all ${density === 'comfortable' ? 'w-4 h-0.5' : density === 'compact' ? 'w-4 h-[3px]' : 'w-4 h-1'}`} />
              </span>
            </button>
          )}
          <button
            onClick={toggleCollapse}
            aria-label={isCollapsed ? 'Expandir sidebar' : 'Colapsar sidebar'}
            aria-expanded={!isCollapsed}
            className="hidden lg:inline-flex items-center justify-center w-8 h-8 rounded-md text-gray-400 hover:text-white hover:bg-gray-800/70 focus:outline-none focus:ring-2 focus:ring-blue-500/40"
          >
            {isCollapsed ? (
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7"/></svg>
            ) : (
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7"/></svg>
            )}
          </button>
        </div>

        {/* Search */}
  <div className="px-3 py-2.5 border-b border-gray-800/60 dark:border-gray-700/60 bg-gray-950/30 dark:bg-gray-900/30 shrink-0">
          {!isCollapsed && (
            <div className="relative">
              <span className="absolute inset-y-0 left-2 flex items-center text-gray-500">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M11 19a8 8 0 100-16 8 8 0 000 16z"/></svg>
              </span>
              <input
                type="text"
                placeholder="Pesquisar..."
                value={filter}
                onChange={e => setFilter(e.target.value)}
    className="w-full bg-gray-900/70 border border-gray-700/60 rounded-md pl-8 pr-2 py-1.5 text-xs placeholder-gray-500 text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500/40"
              />
            </div>
          )}
        </div>

        {/* Navigation */}
  <nav className={`flex-1 overflow-y-auto px-2 py-3 space-y-4 custom-scrollbar`} aria-label="Secões de navegação">
          {filteredSections.map(section => (
      <div key={section.label} className={`${cfg.sectionSpacing}`} data-section>
              {!isCollapsed && (
                <div className={`${cfg.sectionLabel} text-[10px] font-semibold tracking-wider text-gray-500 uppercase`}>{section.label}</div>
              )}
              {isCollapsed && (
                <div className="relative flex justify-center mb-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-gray-600" />
                  <span className="pointer-events-none absolute left-full ml-2 px-2 py-1 rounded bg-gray-900/90 border border-gray-800 text-[11px] text-gray-200 opacity-0 translate-y-1 transition-all duration-150 group-hover/sidebar:opacity-100 group-hover/sidebar:translate-y-0 shadow-lg whitespace-nowrap">
                    {section.label}
                  </span>
                </div>
              )}
              {section.items.map(item => {
                const active = isActive(item.href);
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    aria-current={active ? 'page' : undefined}
                    title={isCollapsed ? item.name : undefined}
                    onClick={() => { if (typeof window !== 'undefined' && window.innerWidth < 1024) onToggle(); }}
  className={`group relative flex items-center ${collapsed ? 'justify-center px-0' : 'px-2.5'} ${cfg.navItem} rounded-md font-medium outline-none transition-colors focus-visible:ring-2 focus-visible:ring-blue-500/40 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-950 ${
                      active ? 'bg-gray-800/80 text-white shadow-inner ring-1 ring-blue-500/30' : 'text-gray-300 hover:bg-gray-800/50 hover:text-white'
                    }`}
                    data-active={active || undefined}
                  >
        <span className={`flex-shrink-0 ${isCollapsed ? '' : 'mr-3'} ${active ? 'text-white' : 'text-gray-400 group-hover:text-gray-200'} ${cfg.icon}`}>{item.icon}</span>
                    {!isCollapsed && (
                      <span className="flex-1 flex flex-col text-left">
                        <span>{item.name}</span>
                        {item.description && (
        <span className={`text-[10px] leading-tight ${active ? 'text-blue-100' : 'text-gray-500 group-hover:text-gray-400'}`}>{item.description}</span>
                        )}
                      </span>
                    )}
                    {item.badge && !isCollapsed && (
                      <span className="ml-2 inline-flex items-center rounded-full bg-blue-600/15 text-blue-300 text-[10px] px-2 py-0.5 font-semibold ring-1 ring-blue-400/20">{item.badge}</span>
                    )}
                    {active && <span className="absolute left-0 top-0 h-full w-0.5 rounded-r bg-blue-400/80" />}
                    {isCollapsed && (
                      <span className="pointer-events-none absolute left-full ml-2 px-2 py-1 rounded bg-gray-900/90 border border-gray-800 text-[11px] text-gray-200 opacity-0 translate-y-1 transition-all duration-150 group-hover:opacity-100 group-hover:translate-y-0 shadow-lg whitespace-nowrap">
                        {item.name}
                        {item.description && <span className="text-gray-500"> – {item.description}</span>}
                      </span>
                    )}
                  </Link>
                );
              })}
            </div>
          ))}
          {filteredSections.length === 0 && !isCollapsed && (
            <p className="text-xs text-gray-500 px-2">Nenhum item encontrado.</p>
          )}
        </nav>

        {/* User footer */}
  <div className={`border-t border-gray-800/60 dark:border-gray-700/60 ${cfg.footerPad} bg-gray-950/70 dark:bg-gray-900/70 shrink-0`}>
    <div className={`flex items-center ${isCollapsed ? 'justify-center' : ''}`}>
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-sm font-semibold ring-2 ring-white/10">
              {(user?.name || 'A').charAt(0).toUpperCase()}
            </div>
            {!isCollapsed && (
              <div className="ml-3 flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-100 truncate">{user?.name || 'Administrador'}</p>
                <p className="text-[11px] text-gray-500 truncate">{user?.email || '—'}</p>
              </div>
            )}
            <button
              onClick={logout}
              title="Terminar sessão"
              className="ml-2 inline-flex items-center justify-center text-gray-400 hover:text-white hover:bg-gray-800/70 rounded p-2 transition focus:outline-none focus:ring-2 focus:ring-blue-500/40"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H9m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h6a3 3 0 013 3v1"/></svg>
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}

export default Sidebar;
