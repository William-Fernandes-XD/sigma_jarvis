import React, { ReactNode } from 'react';

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="flex h-screen bg-black font-sans text-slate-200 overflow-hidden">
      
      {/* SIDEBAR ESTILO CYBERPUNK/DARK */}
      <aside className="w-72 bg-slate-950 border-r border-white/5 flex flex-col relative z-20 shadow-2xl">
        {/* Glow de fundo sutil na sidebar */}
        <div className="absolute top-0 left-0 w-full h-32 bg-blue-500/5 blur-3xl -z-10" />

        {/* Logo / Header da Sidebar */}
        <div className="p-8">
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 bg-cyan-400 rounded-full animate-pulse shadow-[0_0_10px_#22d3ee]" />
            <h1 className="text-xl font-bold tracking-widest text-white uppercase">
              COI <span className="font-light text-slate-400">Core</span>
            </h1>
          </div>
          <p className="text-[10px] text-slate-500 mt-2 tracking-[0.3em] uppercase">Intelligence System</p>
        </div>
        
        {/* Navegação */}
        <nav className="flex-1 px-4 space-y-2 mt-4">
          <NavItem icon={<DashboardIcon />} label="Dashboard" active={false} />
          <NavItem icon={<MicIcon />} label="Interface de Voz" active={true} />
          <NavItem icon={<ChartIcon />} label="Monitoramento" active={false} />
          <NavItem icon={<SettingsIcon />} label="Configurações" active={false} />
        </nav>

        {/* Footer da Sidebar */}
        <div className="p-6 border-t border-white/5 bg-black/20">
          <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/10">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-white font-bold shadow-lg">
              JS
            </div>
            <div>
              <p className="text-xs font-bold text-white">Operador Alpha</p>
              <p className="text-[10px] text-cyan-400/70 font-mono">Nível de Acesso 5</p>
            </div>
          </div>
        </div>
      </aside>

      {/* ÁREA DE CONTEÚDO PRINCIPAL */}
      <main className="flex-1 flex flex-col relative">
        
        {/* HEADER SUPERIOR TRANSPARENTE (GLASS) */}
        <header className="h-20 border-b border-white/5 flex items-center justify-between px-10 backdrop-blur-md bg-black/20 z-10">
          <div>
            <h2 className="text-sm font-medium text-slate-400 uppercase tracking-widest">
              Terminal <span className="text-white">v4.0.2</span>
            </h2>
          </div>
          
          <div className="flex items-center gap-6">
            {/* Status do Sistema */}
            <div className="flex items-center gap-2 px-3 py-1 bg-green-500/10 border border-green-500/20 rounded-full">
              <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-ping" />
              <span className="text-[10px] font-bold text-green-500 uppercase tracking-tighter">Sincronizado</span>
            </div>
            
            {/* Notificações Sutil */}
            <button className="text-slate-400 hover:text-white transition-colors">
              <BellIcon />
            </button>
          </div>
        </header>

        {/* CONTEÚDO DA PÁGINA */}
        <section className="flex-1 overflow-y-auto relative bg-slate-950">
          {/* Background Ambient Glow */}
          <div className="absolute top-0 left-1/4 w-1/2 h-1/2 bg-blue-600/5 blur-[120px] pointer-events-none" />
          
          <div className="p-10 relative z-10">
            {children}
          </div>
        </section>
      </main>
    </div>
  );
};

// COMPONENTE AUXILIAR PARA ITENS DO MENU
const NavItem = ({ icon, label, active }: { icon: any, label: string, active: boolean }) => (
  <a 
    href="#" 
    className={`flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-300 group ${
      active 
        ? 'bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 shadow-[0_0_20px_-5px_rgba(34,211,238,0.2)]' 
        : 'text-slate-500 hover:bg-white/5 hover:text-slate-200 border border-transparent'
    }`}
  >
    <span className={`${active ? 'text-cyan-400' : 'text-slate-600 group-hover:text-slate-300'}`}>
      {icon}
    </span>
    <span className="text-sm font-medium tracking-wide">{label}</span>
    {active && <div className="ml-auto w-1 h-4 bg-cyan-400 rounded-full shadow-[0_0_10px_#22d3ee]" />}
  </a>
);

// ÍCONES SVG (Para não precisar de biblioteca externa)
const DashboardIcon = () => <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>;
const MicIcon = () => <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" /></svg>;
const ChartIcon = () => <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>;
const SettingsIcon = () => <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>;
const BellIcon = () => <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>;

export default Layout;