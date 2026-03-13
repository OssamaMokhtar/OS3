import React from 'react';
import { 
  LayoutDashboard, 
  BrainCircuit, 
  FileText, 
  TrendingUp, 
  Settings,
  LogOut,
  UserCircle
} from 'lucide-react';
import { AppRoute } from '../types';

interface LayoutProps {
  children: React.ReactNode;
  currentRoute: AppRoute;
  onNavigate: (route: AppRoute) => void;
  userName?: string;
  userRole?: string;
}

export const Layout: React.FC<LayoutProps> = ({ 
  children, 
  currentRoute, 
  onNavigate,
  userName = "Guest User",
  userRole = "Software Engineer"
}) => {
  
  const navItems = [
    { id: AppRoute.DASHBOARD, label: 'Dashboard', icon: LayoutDashboard },
    { id: AppRoute.ASSESSMENT, label: 'IQ Assessment', icon: BrainCircuit },
    { id: AppRoute.RESUME, label: 'Resume Parser', icon: FileText },
    { id: AppRoute.MARKET, label: 'Market Insights', icon: TrendingUp },
  ];

  return (
    <div className="flex h-screen bg-slate-900 text-slate-100 overflow-hidden font-sans">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-950 border-r border-slate-800 flex flex-col hidden md:flex">
        <div className="p-6 border-b border-slate-800">
          <h1 className="text-xl font-bold bg-gradient-to-r from-primary-400 to-primary-600 bg-clip-text text-transparent">
            CareerOracle
          </h1>
          <p className="text-xs text-slate-500 mt-1">Intelligence Platform v1.0</p>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                currentRoute === item.id 
                  ? 'bg-primary-600/10 text-primary-400 border border-primary-600/20' 
                  : 'text-slate-400 hover:bg-slate-900 hover:text-slate-200'
              }`}
            >
              <item.icon className="w-5 h-5" />
              <span className="font-medium">{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-slate-800">
          <div className="flex items-center space-x-3 px-4 py-3 bg-slate-900 rounded-lg border border-slate-800">
            <div className="w-8 h-8 rounded-full bg-primary-900 flex items-center justify-center text-primary-400">
              <UserCircle className="w-5 h-5" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate text-white">{userName}</p>
              <p className="text-xs text-slate-500 truncate">{userRole}</p>
            </div>
          </div>
          <button 
            onClick={() => onNavigate(AppRoute.SETTINGS)}
            className={`w-full mt-2 flex items-center space-x-2 px-4 py-2 text-xs transition-colors rounded-lg ${
                currentRoute === AppRoute.SETTINGS 
                  ? 'bg-primary-600/10 text-primary-400 border border-primary-600/20' 
                  : 'text-slate-500 hover:text-slate-300'
            }`}
          >
            <Settings className="w-4 h-4" />
            <span>Preferences</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden relative">
        {/* Mobile Header (Hidden on Desktop) */}
        <header className="md:hidden h-16 bg-slate-950 border-b border-slate-800 flex items-center justify-between px-4">
          <span className="font-bold text-lg text-primary-500">CareerOracle</span>
          <button className="p-2 text-slate-400">
            <LayoutDashboard className="w-6 h-6" />
          </button>
        </header>

        <div className="flex-1 overflow-auto p-4 md:p-8">
          <div className="max-w-6xl mx-auto">
             {children}
          </div>
        </div>
      </main>
    </div>
  );
};