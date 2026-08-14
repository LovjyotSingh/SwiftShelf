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
  onLoginSuccess: (user: UserSession) => void;
}

export default function AuthModal({ isOpen, onClose, onLoginSuccess }: AuthModalProps) {
  if (!isOpen) return null;

  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Quick 1-Click Demo Logins
  const handleQuickDemoLogin = (role: 'CUSTOMER' | 'ADMIN') => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      if (role === 'ADMIN') {
        onLoginSuccess({
          id: 'usr_admin_01',
          name: 'Lovjyot Singh (SuperAdmin)',
          email: 'admin@swiftshelf.io',
          role: 'ADMIN',
          avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
        });
      } else {
        onLoginSuccess({
          id: 'usr_cust_02',
          name: 'Alex Rivera',
          email: 'alex.rivera@techluxury.io',
          role: 'CUSTOMER',
          avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
        });
      }
      onClose();
    }, 600);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      onLoginSuccess({
        id: `usr_${Date.now()}`,
        name: name.trim() || email.split('@')[0],
        email: email.trim(),
        role: email.toLowerCase().includes('admin') ? 'ADMIN' : 'CUSTOMER',
      });
      onClose();
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
      <div className="relative w-full max-w-md glass-card rounded-3xl p-6 md:p-8 border border-white/10 shadow-2xl bg-[#0D111A] space-y-6">
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full bg-slate-900 border border-white/10 text-slate-400 hover:text-white"
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
              ? 'Sign in to access real-time stock locks & order invoices'
              : 'Join the next-gen luxury hardware ecosystem'}
          </p>
        </div>

        {/* 1-Click Fast Profiles */}
        <div className="space-y-2">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block text-center">
            ⚡ Quick 1-Click Demo Profiles:
          </span>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => handleQuickDemoLogin('CUSTOMER')}
              className="p-2.5 rounded-xl bg-slate-900 border border-indigo-500/30 hover:border-indigo-500 text-left transition-all group"
            >
              <div className="text-xs font-bold text-white flex items-center gap-1">
                <span>Customer Demo</span>
                <Sparkles className="w-3 h-3 text-cyan-400 group-hover:scale-110" />
              </div>
              <div className="text-[10px] text-slate-400">Alex Rivera</div>
            </button>

            <button
              onClick={() => handleQuickDemoLogin('ADMIN')}
              className="p-2.5 rounded-xl bg-slate-900 border border-purple-500/30 hover:border-purple-500 text-left transition-all group"
            >
              <div className="text-xs font-bold text-white flex items-center gap-1">
                <span>Admin Master</span>
                <ShieldCheck className="w-3 h-3 text-purple-400 group-hover:scale-110" />
              </div>
              <div className="text-[10px] text-purple-300">Executive BI Access</div>
            </button>
          </div>
        </div>

        <div className="relative flex items-center justify-center">
          <div className="border-t border-white/10 w-full" />
          <span className="bg-[#0D111A] px-3 text-[11px] text-slate-500 uppercase tracking-wider">
            Or With Email
          </span>
        </div>

        {/* Tabs */}
        <div className="flex bg-slate-900 rounded-xl p-1 border border-white/10 text-xs font-semibold">
          <button
            onClick={() => setMode('signin')}
            className={`flex-1 py-1.5 rounded-lg transition-all ${
              mode === 'signin' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            Sign In
          </button>
          <button
            onClick={() => setMode('signup')}
            className={`flex-1 py-1.5 rounded-lg transition-all ${
              mode === 'signup' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            Create Account
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-3 text-xs">
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
                  className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-950 border border-white/10 text-white placeholder-slate-600"
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
                placeholder="name@example.com"
                className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-950 border border-white/10 text-white placeholder-slate-600"
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
                className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-950 border border-white/10 text-white placeholder-slate-600"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="btn-luxury-primary w-full py-3 rounded-xl font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/40 mt-4"
          >
            <span>{mode === 'signin' ? 'Sign In' : 'Create Account'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </form>
      </div>
    </div>
  );
}
