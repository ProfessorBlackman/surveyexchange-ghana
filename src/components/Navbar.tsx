import { useEffect, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { LogOut, Coins, PlusCircle, Menu, X, User, LayoutDashboard, Rss } from 'lucide-react';
import { cn } from '../lib/utils';

function getInitials(name: string): string {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
}

export default function Navbar() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const isActive = (path: string) =>
    path === '/' ? location.pathname === '/' : location.pathname.startsWith(path);

  const handleLogout = () => {
    logout();
    navigate('/login');
    setMenuOpen(false);
  };

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen]);

  // Close menu on route change
  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  if (!user) return null;

  const navLinkClass = (path: string) =>
    cn(
      'text-xs font-bold uppercase tracking-wider transition-colors pb-1',
      isActive(path)
        ? 'text-emerald-800 border-b-2 border-emerald-600'
        : 'text-stone-500 hover:text-emerald-700 border-b-2 border-transparent'
    );

  const mobileNavLinkClass = (path: string) =>
    cn(
      'flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-bold transition-colors',
      isActive(path)
        ? 'bg-emerald-50 text-emerald-800'
        : 'text-stone-700 hover:bg-stone-50 hover:text-emerald-800'
    );

  return (
    <>
      <nav
        className="bg-white border-b border-stone-200 sticky top-0 z-50 h-16 flex items-center shrink-0 shadow-sm"
        aria-label="Main navigation"
      >
        <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 flex justify-between">
          <div className="flex items-center gap-8 lg:gap-10">
            <Link
              to="/"
              className="flex items-center gap-2 focus-visible:ring-offset-0"
              aria-label="SurveyXchange home"
            >
              <div className="w-8 h-8 bg-emerald-700 flex items-center justify-center text-white font-bold rounded-sm shrink-0">
                S
              </div>
              <span className="font-light text-stone-400 hidden sm:inline-block">
                Survey<span className="text-xl font-extrabold tracking-tight text-emerald-900 uppercase">X</span>
                change
              </span>
            </Link>

            <div className="hidden sm:flex sm:gap-6">
              <Link to="/" className={navLinkClass('/')}>Browse</Link>
              <Link to="/dashboard" className={navLinkClass('/dashboard')}>Dashboard</Link>
            </div>
          </div>

          <div className="flex items-center gap-2 md:gap-3">
            {/* Credits chip — always visible */}
            <Link
              to="/credits"
              className={cn(
                'flex items-center gap-2 px-3 py-1.5 border rounded-full transition-colors group',
                isActive('/credits')
                  ? 'bg-amber-100 border-amber-300'
                  : 'bg-amber-50 border-amber-200 hover:bg-amber-100'
              )}
              aria-label={`Credits balance: ${user.creditBalance}`}
            >
              <span className="text-amber-700 text-[11px] font-black uppercase tracking-widest italic group-hover:text-amber-800 transition-colors">
                Credits
              </span>
              <span className="text-stone-900 font-mono font-bold text-sm tracking-tighter">
                {user.creditBalance}
              </span>
            </Link>

            {/* Post button — desktop only */}
            <Link
              to="/create"
              className="hidden md:inline-flex items-center gap-2 px-4 py-1.5 bg-emerald-800 text-white rounded-xl font-bold text-xs uppercase tracking-wider hover:bg-emerald-900 transition-all shadow-md shadow-emerald-900/20"
            >
              <PlusCircle className="w-3.5 h-3.5" aria-hidden="true" />
              Post
            </Link>

            {/* Desktop user section */}
            <div className="hidden sm:flex items-center gap-3 border-l border-stone-100 pl-3 md:pl-4">
              <Link to="/profile" className="text-right hover:opacity-70 transition-opacity min-w-0 max-w-30">
                <p className="text-xs font-bold leading-tight text-stone-900 truncate">{user.name}</p>
                <p className="text-[11px] text-stone-500 uppercase font-medium truncate">
                  {user.institution || 'Ghanaian Student'}
                </p>
              </Link>

              <Link
                to="/profile"
                className="w-9 h-9 bg-emerald-800 rounded-full flex items-center justify-center text-white text-xs font-black hover:bg-emerald-900 transition-colors shrink-0"
                aria-label="View profile"
              >
                {getInitials(user.name)}
              </Link>

              <button
                onClick={handleLogout}
                className="w-8 h-8 bg-stone-100 rounded-full border border-stone-200 flex items-center justify-center hover:bg-stone-200 transition-colors shrink-0"
                aria-label="Log out"
              >
                <LogOut className="w-3.5 h-3.5 text-stone-600" aria-hidden="true" />
              </button>
            </div>

            {/* Mobile hamburger */}
            <button
              onClick={() => setMenuOpen((o) => !o)}
              className="sm:hidden w-9 h-9 flex items-center justify-center rounded-xl bg-stone-100 hover:bg-stone-200 active:bg-stone-300 transition-colors border border-stone-300"
              aria-label={menuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={menuOpen}
              aria-controls="mobile-menu"
            >
              {menuOpen
                ? <X className="w-5 h-5 text-stone-800" aria-hidden="true" />
                : <Menu className="w-5 h-5 text-stone-800" aria-hidden="true" />
              }
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile menu backdrop */}
      {menuOpen && (
        <div
          className="sm:hidden fixed inset-0 top-16 z-40 bg-stone-900/20 backdrop-blur-sm"
          onClick={() => setMenuOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Mobile menu drawer */}
      {menuOpen && (
      <div
        id="mobile-menu"
        role="dialog"
        aria-label="Navigation menu"
        className="sm:hidden fixed inset-x-0 top-16 z-50 bg-white border-b border-stone-200 shadow-xl"
      >
        <div className="px-4 py-4 space-y-1">
          {/* User info */}
          <div className="flex items-center gap-3 px-3 py-3 mb-3 bg-stone-50 rounded-2xl border border-stone-100">
            <div className="w-10 h-10 bg-emerald-800 rounded-full flex items-center justify-center text-white text-xs font-black shrink-0">
              {getInitials(user.name)}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-bold text-stone-900 leading-tight truncate">{user.name}</p>
              <p className="text-[11px] text-stone-500 uppercase font-medium tracking-wider truncate">
                {user.institution || 'Ghanaian Student'}
              </p>
            </div>
          </div>

          {/* Nav links */}
          <Link to="/" className={mobileNavLinkClass('/')}>
            <Rss className="w-4 h-4 shrink-0" aria-hidden="true" />
            Browse Surveys
          </Link>
          <Link to="/dashboard" className={mobileNavLinkClass('/dashboard')}>
            <LayoutDashboard className="w-4 h-4 shrink-0" aria-hidden="true" />
            Dashboard
          </Link>
          <Link to="/create" className={mobileNavLinkClass('/create')}>
            <PlusCircle className="w-4 h-4 text-emerald-700 shrink-0" aria-hidden="true" />
            Post a Survey
          </Link>
          <Link to="/profile" className={mobileNavLinkClass('/profile')}>
            <User className="w-4 h-4 shrink-0" aria-hidden="true" />
            Profile
          </Link>
          <Link
            to="/credits"
            className={cn(mobileNavLinkClass('/credits'), 'justify-between')}
          >
            <div className="flex items-center gap-3">
              <Coins className="w-4 h-4 text-amber-600 shrink-0" aria-hidden="true" />
              Credits
            </div>
            <span className="font-mono font-bold text-stone-900 text-base">{user.creditBalance}</span>
          </Link>

          <div className="pt-2 border-t border-stone-100">
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-bold text-red-600 hover:bg-red-50 transition-colors"
            >
              <LogOut className="w-4 h-4 shrink-0" aria-hidden="true" />
              Log Out
            </button>
          </div>
        </div>
      </div>
      )}
    </>
  );
}
