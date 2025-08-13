'use client';

import { useTheme } from '@/contexts/ThemeContext';
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useSearchParams, usePathname, useRouter } from 'next/navigation';
import { IconButton } from '@/components/ui/IconButton';

interface HeaderProps {
  title: string;
  subtitle?: string;
  onMenuToggle: () => void;
  actions?: React.ReactNode;
  scrolled?: boolean; // indica se o container principal foi rolado
}

export function Header({ title, subtitle, onMenuToggle, actions, scrolled = false }: HeaderProps) {
  const { theme, toggleTheme } = useTheme();
  const { user, logout } = useAuth();
  const params = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  const [showMobileSearch, setShowMobileSearch] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);

  useEffect(()=>{
    const msgs: string[] = [];
    if(params.get('redirect')) msgs.push('Faça login para continuar');
    if(params.get('denied')) msgs.push('Acesso negado');
    setNotice(msgs.length? msgs.join(' • '): null);
  },[params]);
  const headerBase = 'sticky top-0 z-30 backdrop-blur supports-[backdrop-filter]:bg-white/60 bg-white/80 dark:supports-[backdrop-filter]:bg-gray-900/60 dark:bg-gray-900/70 border-b transition-colors';
  const shadow = scrolled ? 'shadow-sm dark:shadow-[0_2px_4px_-1px_rgba(0,0,0,0.7),0_1px_2px_rgba(0,0,0,0.4)]' : '';
  const borderColor = scrolled ? 'border-gray-200/70' : 'border-transparent';
  const paddingY = scrolled ? 'py-2.5' : 'py-4';

  return (
    <header className={`${headerBase} ${shadow} ${borderColor}`} data-scrolled={scrolled}>
      <div className="px-4 sm:px-6 lg:px-8 transition-[padding] duration-300">
        <div className={`flex justify-between items-center ${paddingY} transition-[padding] duration-300`}>
          <div className="flex items-center min-w-0">
            <button
              onClick={onMenuToggle}
              className="lg:hidden p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500/40"
              aria-label="Abrir menu lateral"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <div className="ml-4 lg:ml-0 truncate">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 leading-tight truncate">{title}</h1>
              {subtitle && (
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-0.5 truncate">{subtitle}</p>
              )}
            </div>
          </div>
          <div className="flex items-center space-x-2 md:space-x-4">
            {notice && (
              <span className="hidden md:inline-flex chip chip-amber !py-1 !px-2 !text-[10px] font-medium" aria-live="polite">{notice}</span>
            )}
            <IconButton ariaLabel="Notificações" tooltip="Notificações">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5-5m0 0l5-5m-5 5H9a6 6 0 01-6-6V6a6 6 0 016-6h10a6 6 0 016 6v1" />
              </svg>
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
            </IconButton>
            {/* Search (desktop) */}
            <div className="hidden md:flex relative group/search">
              <input
                type="text"
                placeholder="Pesquisar..."
                aria-label="Pesquisar"
                className="peer w-56 lg:w-64 xl:w-72 pl-10 pr-3 py-2 rounded-lg border border-gray-300/70 dark:border-gray-700/60 bg-white/60 dark:bg-gray-800/50 hover:bg-white/70 dark:hover:bg-gray-800/60 focus:bg-white dark:focus:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500/50 placeholder-gray-400 dark:placeholder-gray-500 text-sm text-gray-800 dark:text-gray-100 transition-colors"
              />
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400 dark:text-gray-500 peer-focus:text-gray-500 dark:peer-focus:text-gray-400 transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </span>
            </div>
            {/* Search toggle (mobile) */}
            <IconButton
              ariaLabel={showMobileSearch ? 'Fechar busca' : 'Abrir busca'}
              tooltip={showMobileSearch ? 'Fechar busca' : 'Busca'}
              onClick={() => setShowMobileSearch(s => !s)}
              size="sm"
            >
              {showMobileSearch ? (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
              )}
            </IconButton>
            <IconButton ariaLabel="Alternar tema" tooltip="Tema" onClick={toggleTheme}>
              {theme === 'dark' ? (
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d="M12 3v2m0 14v2m9-9h-2M5 12H3m15.364 6.364l-1.414-1.414M8.05 8.05 6.636 6.636m0 10.728 1.414-1.414M17.95 8.05l1.414-1.414" /><circle cx="12" cy="12" r="5" /></svg>
              ) : (
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" /></svg>
              )}
            </IconButton>
            {user && (
              <div className="relative">
                <button
                  onClick={()=>setShowMenu(m=>!m)}
                  className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 border border-gray-300/60 dark:border-gray-700/60 text-sm font-medium"
                >
                  <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-indigo-600 text-white text-xs font-semibold">
                    {user.name.slice(0,2).toUpperCase()}
                  </span>
                  <span className="hidden sm:flex flex-col items-start leading-tight">
                    <span className="text-gray-900 dark:text-gray-100 text-[11px] font-semibold tracking-wide uppercase">{user.role}</span>
                    <span className="text-gray-600 dark:text-gray-300 text-[11px] font-medium max-w-[110px] truncate">{user.name}</span>
                  </span>
                  <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                </button>
                {showMenu && (
                  <div className="absolute right-0 mt-2 w-56 rounded-lg shadow-lg ring-1 ring-black/5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 py-2 z-50">
                    <div className="px-3 py-2 border-b border-gray-100 dark:border-gray-700">
                      <p className="text-xs font-semibold text-gray-700 dark:text-gray-300">Sessão</p>
                      <p className="text-[11px] text-gray-500 dark:text-gray-400 truncate">{user.email}</p>
                    </div>
                    <button
                      onClick={()=>{
                        // Handler robusto: sempre tentar navegar para /login mesmo se a chamada falhar
                        logout()
                          .catch(()=>{})
                          .finally(()=>{
                            // replace evita que usuário volte com back
                            router.replace('/login?redirect='+encodeURIComponent(pathname));
                          });
                      }}
                      className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 flex items-center gap-2"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a2 2 0 01-2 2H6a2 2 0 01-2-2V7a2 2 0 012-2h5a2 2 0 012 2v1" /></svg>
                      Terminar sessão
                    </button>
                  </div>
                )}
              </div>
            )}
            {actions && <div className="hidden md:flex items-center space-x-2">{actions}</div>}
          </div>
        </div>
      </div>
      <MobileSearchBar visible={showMobileSearch} />
    </header>
  );
}

// Mobile search bar rendered below header content to slide in/out
function MobileSearchBar({ visible }: { visible: boolean }) {
  return (
    <div
      className={`sm:hidden px-4 pb-3 transition-[max-height,opacity] duration-300 overflow-hidden ${visible ? 'max-h-24 opacity-100' : 'max-h-0 opacity-0'}`}
      aria-hidden={!visible}
    >
      <div className="relative">
        <input
          type="text"
          placeholder="Pesquisar..."
          aria-label="Pesquisar"
          className="w-full pl-10 pr-3 py-2 rounded-lg border border-gray-300/70 dark:border-gray-700/60 bg-white/70 dark:bg-gray-800/60 focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500/50 placeholder-gray-400 dark:placeholder-gray-500 text-sm text-gray-800 dark:text-gray-100 transition-colors"
        />
        <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400 dark:text-gray-500">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </span>
      </div>
    </div>
  );
}
