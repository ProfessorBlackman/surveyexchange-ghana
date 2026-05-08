import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { LogOut, Coins, PlusCircle } from 'lucide-react';

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

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (!user) return null;

  return (
    <nav className="bg-white border-b border-stone-200 sticky top-0 z-50 h-16 flex items-center shrink-0 shadow-sm">
      <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 flex justify-between">
        <div className="flex items-center gap-10">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-emerald-700 flex items-center justify-center text-white font-bold rounded-sm">S</div>
            <span className="font-light text-stone-400">
              Survey<span className="text-xl font-extrabold tracking-tight text-emerald-900 uppercase">X</span>
              change
            </span>
            {/* <span className="text-xl font-extrabold tracking-tight text-emerald-900 uppercase">
              Survey <span className="font-light text-stone-400">Xchange</span>
            </span> */}
          </Link>

          <div className="hidden sm:flex sm:gap-6">
            <Link
              to="/"
              className="text-xs font-bold uppercase tracking-wider text-emerald-800 border-b-2 border-emerald-600 pb-1"
            >
              Browse
            </Link>
            <Link
              to="/dashboard"
              className="text-xs font-bold uppercase tracking-wider text-stone-500 hover:text-emerald-700 transition-colors"
            >
              Dashboard
            </Link>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <Link
            to="/credits"
            className="flex items-center gap-2 bg-amber-50 px-3 py-1 border border-amber-200 rounded-full hover:bg-amber-100 transition-colors group"
          >
            <span className="text-amber-700 text-[10px] font-black uppercase tracking-widest italic group-hover:text-amber-800 transition-colors">Credits</span>
            <span className="text-stone-900 font-mono font-bold text-sm tracking-tighter">{user.creditBalance}</span>
          </Link>

          <Link
            to="/create"
            className="hidden md:inline-flex items-center gap-2 px-4 py-1.5 bg-emerald-800 text-white rounded-xl font-bold text-xs uppercase tracking-wider hover:bg-emerald-900 transition-all shadow-md shadow-emerald-900/10"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            Post
          </Link>

          <div className="flex items-center gap-3 border-l border-stone-100 pl-4">
            <Link to="/profile" className="text-right hidden sm:block hover:opacity-70 transition-opacity">
              <p className="text-xs font-bold leading-tight text-stone-900">{user.name}</p>
              <p className="text-[10px] text-stone-500 uppercase font-medium">{user.institution || 'Ghanian Student'}</p>
            </Link>

            <Link
              to="/profile"
              className="w-10 h-10 bg-emerald-800 rounded-full flex items-center justify-center text-white text-xs font-black hover:bg-emerald-900 transition-colors"
              title="View profile"
            >
              {getInitials(user.name)}
            </Link>

            <button
              onClick={handleLogout}
              className="w-8 h-8 bg-stone-100 rounded-full border border-stone-200 flex items-center justify-center hover:bg-stone-200 transition-colors"
              title="Logout"
            >
              <LogOut className="w-3.5 h-3.5 text-stone-600" />
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
