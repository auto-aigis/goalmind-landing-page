'use client';

import { useState, useEffect, ReactNode } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Menu, X, Home, Target, BarChart2, CreditCard, Settings, LogOut, MessageCircle } from 'lucide-react';
import { useAuth } from './AuthProvider';

interface AppShellProps {
  children: ReactNode;
}

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: Home },
  { href: '/goals', label: 'Goals', icon: Target },
  { href: '/chat', label: 'Check-in', icon: MessageCircle },
  { href: '/progress', label: 'Progress', icon: BarChart2 },
  { href: '/pricing', label: 'Pricing', icon: CreditCard },
  { href: '/settings', label: 'Settings', icon: Settings },
];

export function AppShell({ children }: AppShellProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout, subscription } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    setSidebarOpen(false);
  }, [pathname]);

  const handleLogout = async () => {
    await logout();
  };

  const isPaidTier = subscription?.tier === 'coach' || subscription?.tier === 'pro';

  const filteredNavItems = navItems.filter((item) => {
    if (item.href === '/progress' && !isPaidTier) return false;
    return true;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Top Bar */}
      <header className="md:hidden fixed top-0 left-0 right-0 h-14 bg-white border-b border-gray-200 z-50 flex items-center px-4">
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 -ml-2 hover:bg-gray-100 rounded"
          aria-label="Toggle menu"
        >
          {sidebarOpen ? <X className="w-5 h-5 text-gray-900" /> : <Menu className="w-5 h-5 text-gray-900" />}
        </button>
        <span className="ml-4 font-semibold text-gray-900">GoalMind</span>
      </header>

      {/* Mobile Backdrop */}
      {sidebarOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black/20 z-40"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full w-64 bg-white border-r border-gray-200 z-50 transform transition-transform md:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="h-14 flex items-center px-6 border-b border-gray-200">
          <span className="text-lg font-semibold text-gray-900">GoalMind</span>
        </div>
        <nav className="p-4 space-y-1">
          {filteredNavItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                  isActive
                    ? 'bg-gray-100 font-medium text-gray-900'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <Icon className="w-5 h-5" />
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200">
          {user && (
            <p className="text-xs text-gray-500 mb-3 px-3 truncate">{user.email}</p>
          )}
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
          >
            <LogOut className="w-5 h-5" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="md:ml-64 pt-14 md:pt-0 min-h-screen">
        <div className="p-4 md:p-6">{children}</div>
      </main>
    </div>
  );
}