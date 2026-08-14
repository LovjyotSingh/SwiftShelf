'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Sparkles, Command, X, ArrowRight, Bot, Search, Send } from 'lucide-react';
import { AIService } from '@/lib/ai/geminiClient';
import { Product } from '@/types';
import { formatCurrency } from '@/lib/utils';

interface AIConciergePaletteProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectProduct: (product: Product) => void;
}

export default function AIConciergePalette({
  isOpen,
  onClose,
  onSelectProduct,
}: AIConciergePaletteProps) {
  if (!isOpen) return null;

  const [inputQuery, setInputQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<Array<{ role: 'user' | 'assistant'; text: string; products?: Product[] }>>([
    {
      role: 'assistant',
      text: 'Greetings. I am your SwiftShelf AI Concierge. Ask me anything about specifications, acoustic profiles, ergonomic ratings, or flash sales.',
    },
  ]);

  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, [isOpen]);

  const handleSend = async (queryText?: string) => {
    const text = queryText || inputQuery;
    if (!text.trim()) return;

    const userMessage = { role: 'user' as const, text };
    setMessages((prev) => [...prev, userMessage]);
    setInputQuery('');
    setIsLoading(true);

    try {
      const res = await AIService.queryConcierge(text);
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          text: res.reply,
          products: res.suggestedProducts,
        },
      ]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          text: 'Unable to contact neural index. Please try another query.',
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const sampleQuestions = [
    'Show ANC headphones with 50+ hours battery',
    'Find best ergonomic chair under $800',
    'Which titanium smartwatch has dual GPS?',
    'What hardware is currently in flash sale?',
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
      <div className="relative w-full max-w-2xl glass-card rounded-3xl p-6 border border-white/10 shadow-2xl bg-[#0D111A] flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 pb-3">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-indigo-500/20 text-cyan-400">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-heading text-base font-bold text-white flex items-center gap-1.5">
                <span>SwiftShelf AI Concierge</span>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-indigo-500/20 text-indigo-300 font-mono">
                  Gemini 2.0
                </span>
              </h3>
              <p className="text-[11px] text-slate-400">Natural language product telemetry & recommendation engine</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full bg-slate-900 border border-white/10 text-slate-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Chat History Box */}
        <div className="flex-1 overflow-y-auto my-4 space-y-3.5 pr-1 text-xs">
          {messages.map((m, idx) => (
            <div
              key={idx}
              className={`flex flex-col ${m.role === 'user' ? 'items-end' : 'items-start'}`}
            >
              <div
                className={`p-3 rounded-2xl max-w-[88%] leading-relaxed ${
                  m.role === 'user'
                    ? 'bg-indigo-600 text-white rounded-br-none'
                    : 'bg-slate-900/90 text-slate-200 border border-white/10 rounded-bl-none'
                }`}
              >
                {m.text}
              </div>

              {/* Product recommendation cards inside AI reply */}
              {m.products && m.products.length > 0 && (
                <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2">
                  {m.products.slice(0, 2).map((p) => (
                    <div
                      key={p.id}
                      onClick={() => {
                        onSelectProduct(p);
                        onClose();
                      }}
                      className="p-2.5 rounded-xl glass-card flex items-center gap-2.5 cursor-pointer hover:border-cyan-400/50 transition-all text-xs"
                    >
                      <img
                        src={p.images[0]}
                        alt={p.title}
                        className="w-10 h-10 rounded-lg object-cover bg-slate-950 shrink-0"
                      />
                      <div className="truncate">
                        <div className="font-bold text-white truncate">{p.title}</div>
                        <div className="text-[11px] text-cyan-400 font-semibold">
                          {formatCurrency(p.price)}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}

          {isLoading && (
            <div className="flex items-center gap-2 text-xs text-slate-400 bg-slate-900/60 p-3 rounded-2xl w-fit">
              <Sparkles className="w-4 h-4 text-cyan-400 animate-spin" />
              <span>Analyzing catalog semantics & technical specs...</span>
            </div>
          )}
        </div>

        {/* Suggestion Chips */}
        <div className="pt-1 pb-3 flex flex-wrap gap-1.5">
          {sampleQuestions.map((q, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(q)}
              className="text-[11px] px-2.5 py-1 rounded-lg bg-slate-900/80 hover:bg-slate-800 text-slate-300 hover:text-white border border-white/5 transition-all text-left"
            >
              {q}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="relative flex items-center gap-2"
        >
          <input
            ref={inputRef}
            type="text"
            value={inputQuery}
            onChange={(e) => setInputQuery(e.target.value)}
            placeholder="Ask about materials, dimensions, wireless specs..."
            className="w-full pl-4 pr-12 py-3 rounded-xl bg-slate-950 border border-white/15 text-white text-xs placeholder-slate-500 focus:outline-none focus:border-indigo-500"
          />
          <button
            type="submit"
            disabled={!inputQuery.trim() || isLoading}
            className="absolute right-2 p-2 rounded-lg bg-indigo-600 text-white disabled:opacity-40 hover:bg-indigo-500 transition-all"
          >
            <Send className="w-3.5 h-3.5" />
          </button>
        </form>
      </div>
    </div>
  );
}
