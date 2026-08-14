'use client';

import React, { useState } from 'react';
import {
  X,
  Lock,
  Mail,
  User,
  ShieldCheck,
  Zap,
  ArrowRight,
  CheckCircle2,
  Sparkles,
  AlertCircle,
  CheckSquare,
  Square,
} from 'lucide-react';

export interface UserSession {
  id: string;
  name: string;
  email: string;
  role: 'CUSTOMER' | 'ADMIN';
  avatar?: string;
}

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (user: UserSession, remember: boolean) => void;
}

// Pre-registered accounts for validation
const PRESET_ACCOUNTS: Record<string, { name: string; passwordHash: string; role: 'CUSTOMER' | 'ADMIN'; avatar?: string }> = {
  'admin@swiftshelf.io': {
    name: 'Lovjyot Singh (SuperAdmin)',
    passwordHash: 'admin123',
    role: 'ADMIN',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
  },
  'alex.rivera@techluxury.io': {
    name: 'Alex Rivera',
    passwordHash: 'alex123',
    role: 'CUSTOMER',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
  },
};

export default function AuthModal({ isOpen, onClose, onLoginSuccess }: AuthModalProps) {
  if (!isOpen) return null;

  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Quick 1-Click Demo Logins
  const handleQuickDemoLogin = (role: 'CUSTOMER' | 'ADMIN') => {
    setIsLoading(true);
    setErrorMsg('');
    setTimeout(() => {
      setIsLoading(false);
      if (role === 'ADMIN') {
        const user: UserSession = {
          id: 'usr_admin_01',
          name: 'Lovjyot Singh (SuperAdmin)',
          email: 'admin@swiftshelf.io',
          role: 'ADMIN',
          avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
        };
        onLoginSuccess(user, rememberMe);
      } else {
        const user: UserSession = {
          id: 'usr_cust_02',
          name: 'Alex Rivera',
          email: 'alex.rivera@techluxury.io',
          role: 'CUSTOMER',
          avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
        };
        onLoginSuccess(user, rememberMe);
      }
      onClose();
    }, 500);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    const cleanEmail = email.trim().toLowerCase();

    // 1. Validation
    if (!cleanEmail || !cleanEmail.includes('@')) {
      setErrorMsg('Please enter a valid email address.');
      return;
    }

    if (!password || password.length < 5) {
      setErrorMsg('Password must be at least 5 characters long.');
      return;
    }

    // Get dynamic user registry from localStorage
    let registeredUsers: Record<string, { name: string; passwordHash: string; role: 'CUSTOMER' | 'ADMIN'; avatar?: string }> = { ...PRESET_ACCOUNTS };
    try {
      const stored = localStorage.getItem('swiftshelf_registered_users');
      if (stored) {
        registeredUsers = { ...registeredUsers, ...JSON.parse(stored) };
      }
    } catch (err) {
      console.warn('Could not read user registry:', err);
    }

    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);

      if (mode === 'signin') {
        // --- REAL CREDENTIAL CHECK ---
        const existing = registeredUsers[cleanEmail];
        if (!existing) {
          setErrorMsg('No account found with this email address. Please check your credentials or create an account.');
          return;
        }

        if (existing.passwordHash !== password) {
          setErrorMsg('Incorrect password. Please try again or use a demo login profile.');
          return;
        }

        // Successful Sign In
        const user: UserSession = {
          id: `usr_${cleanEmail.replace(/[^a-z0-9]/g, '_')}`,
          name: existing.name,
          email: cleanEmail,
          role: existing.role,
          avatar: existing.avatar,
        };
        onLoginSuccess(user, rememberMe);
        onClose();

      } else {
        // --- SIGN UP ---
        if (!name.trim()) {
          setErrorMsg('Please provide your full name to register.');
          return;
        }

        if (registeredUsers[cleanEmail]) {
          setErrorMsg('An account already exists with this email address. Please sign in instead.');
          return;
        }

        const newUserRecord = {
          name: name.trim(),
          passwordHash: password,
          role: (cleanEmail.includes('admin') ? 'ADMIN' : 'CUSTOMER') as 'CUSTOMER' | 'ADMIN',
        };

        registeredUsers[cleanEmail] = newUserRecord;
        try {
          localStorage.setItem('swiftshelf_registered_users', JSON.stringify(registeredUsers));
        } catch (err) {
          console.warn('Could not save user registry:', err);
        }

        const user: UserSession = {
          id: `usr_${Date.now()}`,
          name: name.trim(),
          email: cleanEmail,
          role: newUserRecord.role,
        };
        onLoginSuccess(user, rememberMe);
        onClose();
      }
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="relative w-full max-w-md luxury-card rounded-3xl p-6 md:p-8 shadow-2xl space-y-5">
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full bg-slate-900 border border-white/10 text-slate-400 hover:text-white transition-all"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-600 to-cyan-400 p-[1px] mx-auto shadow-lg shadow-indigo-500/20">
            <div className="w-full h-full bg-[#0B0F19] rounded-[15px] flex items-center justify-center">
              <Lock className="w-5 h-5 text-cyan-400" />
            </div>
          </div>
          <h3 className="font-heading text-xl font-bold text-white">
            {mode === 'signin' ? 'Welcome Back to SwiftShelf' : 'Create SwiftShelf Account'}
          </h3>
          <p className="text-xs text-slate-400">
            {mode === 'signin'
              ? 'Sign in with verified credentials or quick demo profiles'
              : 'Join the next-gen luxury hardware ecosystem'}
          </p>
        </div>

        {/* Error Alert */}
        {errorMsg && (
          <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-start gap-2.5 animate-in fade-in">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
            <span className="leading-relaxed">{errorMsg}</span>
          </div>
        )}

        {/* 1-Click Fast Profiles */}
        <div className="space-y-2">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block text-center">
            ⚡ Quick 1-Click Demo Profiles:
          </span>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => handleQuickDemoLogin('CUSTOMER')}
              className="p-2.5 rounded-xl bg-slate-900/90 border border-indigo-500/30 hover:border-indigo-500 text-left transition-all group"
            >
              <div className="text-xs font-bold text-white flex items-center gap-1">
                <span>Customer Demo</span>
                <Sparkles className="w-3 h-3 text-cyan-400 group-hover:scale-110" />
              </div>
              <div className="text-[10px] text-slate-400">alex.rivera@techluxury.io</div>
            </button>

            <button
              onClick={() => handleQuickDemoLogin('ADMIN')}
              className="p-2.5 rounded-xl bg-slate-900/90 border border-purple-500/30 hover:border-purple-500 text-left transition-all group"
            >
              <div className="text-xs font-bold text-white flex items-center gap-1">
                <span>Admin Master</span>
                <ShieldCheck className="w-3 h-3 text-purple-400 group-hover:scale-110" />
              </div>
              <div className="text-[10px] text-purple-300">admin@swiftshelf.io</div>
            </button>
          </div>
        </div>

        <div className="relative flex items-center justify-center">
          <div className="border-t border-white/10 w-full" />
          <span className="bg-[#0D111A] px-3 text-[11px] text-slate-500 uppercase tracking-wider">
            Or Verified Credentials
          </span>
        </div>

        {/* Mode Tabs */}
        <div className="flex bg-slate-900 rounded-xl p-1 border border-white/10 text-xs font-semibold">
          <button
            onClick={() => {
              setMode('signin');
              setErrorMsg('');
            }}
            className={`flex-1 py-1.5 rounded-lg transition-all ${
              mode === 'signin' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            Sign In
          </button>
          <button
            onClick={() => {
              setMode('signup');
              setErrorMsg('');
            }}
            className={`flex-1 py-1.5 rounded-lg transition-all ${
              mode === 'signup' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            Create Account
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
          {mode === 'signup' && (
            <div>
              <label className="block text-slate-400 mb-1">Full Name</label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Jordan Hayes"
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-slate-950 border border-white/10 text-white placeholder-slate-600 focus:outline-none focus:border-cyan-400"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-slate-400 mb-1">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={mode === 'signin' ? 'admin@swiftshelf.io or alex.rivera@techluxury.io' : 'name@example.com'}
                className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-slate-950 border border-white/10 text-white placeholder-slate-600 focus:outline-none focus:border-cyan-400"
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-400 mb-1">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-slate-950 border border-white/10 text-white placeholder-slate-600 focus:outline-none focus:border-cyan-400"
              />
            </div>
            <div className="text-[10px] text-slate-500 mt-1">
              Demo passwords: <code className="text-cyan-400">admin123</code> or <code className="text-cyan-400">alex123</code>
            </div>
          </div>

          {/* Remember Me Checkbox */}
          <div
            onClick={() => setRememberMe(!rememberMe)}
            className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer pt-1 select-none"
          >
            {rememberMe ? (
              <CheckSquare className="w-4 h-4 text-cyan-400" />
            ) : (
              <Square className="w-4 h-4 text-slate-600" />
            )}
            <span>Remember me on this device (Save login session)</span>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="btn-luxury-primary w-full py-3 rounded-xl font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/40 mt-4"
          >
            <span>{isLoading ? 'Verifying Credentials...' : mode === 'signin' ? 'Sign In' : 'Create Account'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </form>
      </div>
    </div>
  );
}
