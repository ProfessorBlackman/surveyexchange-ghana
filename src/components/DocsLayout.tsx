import { useEffect, useState } from 'react';
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { Rocket, PlusCircle, Search, Coins, BarChart3, User, Menu, X, BookOpen, ArrowLeft } from 'lucide-react';
import { cn } from '../lib/utils';

const NAV_ITEMS = [
  { label: 'Getting Started', path: '/docs/getting-started', icon: Rocket },
  { label: 'Creating Surveys', path: '/docs/creating-surveys', icon: PlusCircle },
  { label: 'Browsing & Responding', path: '/docs/browsing-responding', icon: Search },
  { label: 'Credits System', path: '/docs/credits', icon: Coins },
  { label: 'Analytics', path: '/docs/analytics', icon: BarChart3 },
  { label: 'Profile Setup', path: '/docs/profile', icon: User },
];

function SidebarContent({ onLinkClick }: { onLinkClick?: () => void }) {
  const { user } = useAuthStore();

  return (
    <div className="flex flex-col h-full">
      <div className="px-3 py-4">
        <p className="text-[10px] font-black uppercase tracking-widest text-stone-400 px-3 mb-2">Documentation</p>
        <nav className="space-y-0.5">
          {NAV_ITEMS.map(({ label, path, icon: Icon }) => (
            <NavLink
              key={path}
              to={path}
              onClick={onLinkClick}
              className={({ isActive }) =>
                cn(
                  'flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-bold transition-colors',
                  isActive
                    ? 'bg-emerald-50 text-emerald-800'
                    : 'text-stone-600 hover:bg-stone-50 hover:text-emerald-700'
                )
              }
            >
              <Icon className="w-4 h-4 shrink-0" aria-hidden="true" />
              {label}
            </NavLink>
          ))}
        </nav>
      </div>

      <div className="mt-auto px-3 py-4 border-t border-stone-100">
        <Link
          to={user ? '/' : '/register'}
          onClick={onLinkClick}
          className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-bold text-stone-500 hover:bg-stone-50 hover:text-emerald-700 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 shrink-0" aria-hidden="true" />
          {user ? 'Back to Platform' : 'Get Started'}
        </Link>
      </div>
    </div>
  );
}

export default function DocsLayout() {
  const { user } = useAuthStore();
  const location = useLocation();
  const [drawerOpen, setDrawerOpen] = useState(false);

  useEffect(() => {
    setDrawerOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    if (drawerOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [drawerOpen]);

  return (
    <div className="flex flex-col flex-1">
      {/* Minimal header for unauthenticated visitors (Navbar returns null when !user) */}
      {!user && (
        <nav
          className="bg-white/80 backdrop-blur-md border-b border-stone-200 sticky top-0 z-50 h-16 flex items-center shrink-0 shadow-sm"
          aria-label="Docs navigation"
        >
          <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 flex items-center justify-between">
            <Link to="/" className="flex items-center gap-2" aria-label="SurveyXchange home">
              <div className="w-8 h-8 bg-emerald-700 flex items-center justify-center text-white font-bold rounded-sm shrink-0">S</div>
              <span className="font-light text-stone-400 hidden sm:inline-block">
                Survey<span className="text-xl font-extrabold tracking-tight text-emerald-900 uppercase">X</span>
                change
              </span>
            </Link>
            <div className="flex items-center gap-3 sm:gap-4">
              <Link
                to="/docs"
                className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-emerald-700"
              >
                <BookOpen className="w-3.5 h-3.5" aria-hidden="true" />
                Docs
              </Link>
              <Link
                to="/login"
                className="text-xs font-bold uppercase tracking-widest text-stone-600 hover:text-stone-900 transition-colors"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                className="px-4 sm:px-5 py-2 bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-black uppercase tracking-widest rounded-xl transition-all shadow-md shadow-emerald-900/20"
              >
                Get Started
              </Link>
            </div>
          </div>
        </nav>
      )}

      <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 flex gap-8 flex-1">
        {/* Desktop sidebar */}
        <aside className="hidden lg:block w-56 shrink-0 self-start sticky top-16">
          <div className="h-[calc(100vh-4rem)] overflow-y-auto py-6">
            <SidebarContent />
          </div>
        </aside>

        {/* Content */}
        <main className="flex-1 min-w-0 py-8">
          {/* Mobile sidebar toggle */}
          <div className="lg:hidden mb-6">
            <button
              onClick={() => setDrawerOpen(true)}
              className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white border border-stone-200 text-sm font-bold text-stone-700 hover:bg-stone-50 transition-colors shadow-sm"
              aria-label="Open documentation menu"
            >
              <Menu className="w-4 h-4" aria-hidden="true" />
              Docs Menu
            </button>
          </div>

          <Outlet />
        </main>
      </div>

      {/* Mobile drawer backdrop */}
      {drawerOpen && (
        <div
          className="lg:hidden fixed inset-0 z-40 bg-stone-900/20 backdrop-blur-sm"
          onClick={() => setDrawerOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Mobile drawer */}
      {drawerOpen && (
        <div
          role="dialog"
          aria-label="Documentation menu"
          className="lg:hidden fixed inset-y-0 left-0 z-50 w-72 bg-white shadow-xl flex flex-col"
        >
          <div className="flex items-center justify-between px-4 py-4 border-b border-stone-100">
            <span className="text-sm font-black uppercase tracking-widest text-stone-900">Docs</span>
            <button
              onClick={() => setDrawerOpen(false)}
              className="w-8 h-8 flex items-center justify-center rounded-xl bg-stone-100 hover:bg-stone-200 transition-colors"
              aria-label="Close menu"
            >
              <X className="w-4 h-4 text-stone-700" aria-hidden="true" />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto">
            <SidebarContent onLinkClick={() => setDrawerOpen(false)} />
          </div>
        </div>
      )}
    </div>
  );
}
