'use client';

import { useState, useRef, useEffect } from 'react';
import { Sidebar } from './Sidebar';
import { Header } from './Header';

interface MainLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
}

export function MainLayout({ children, title, subtitle, actions }: MainLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const scrollRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const handler = () => {
      setScrolled(el.scrollTop > 6);
    };
    handler();
    el.addEventListener('scroll', handler, { passive: true });
    return () => el.removeEventListener('scroll', handler);
  }, []);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="h-screen overflow-hidden bg-gray-50 flex">
      <Sidebar isOpen={sidebarOpen} onToggle={toggleSidebar} />
      <div className="flex-1 flex flex-col min-w-0">
        <Header
          title={title}
          subtitle={subtitle}
          onMenuToggle={toggleSidebar}
          actions={actions}
          scrolled={scrolled}
        />
        <main ref={scrollRef} className="flex-1 overflow-x-hidden overflow-y-auto">
          {/* Container fluido com limites maiores em telas grandes para reduzir espaços vazios */}
          <div className="w-full mx-auto px-3 sm:px-4 lg:px-6 2xl:px-10 py-6 md:py-8 max-w-screen-2xl">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
