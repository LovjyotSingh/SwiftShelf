'use client';

import React, { useState } from 'react';
import { Download, FileText, Check, Loader2 } from 'lucide-react';
import { OrderRecord } from '@/types';
import { generateInvoicePDF } from '@/lib/pdf/invoiceGenerator';

interface InvoiceDownloadButtonProps {
  order: OrderRecord;
  className?: string;
}

export default function InvoiceDownloadButton({ order, className = '' }: InvoiceDownloadButtonProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [isDone, setIsDone] = useState(false);

  const handleDownload = () => {
    setIsGenerating(true);
    setTimeout(() => {
      try {
        const pdf = generateInvoicePDF(order);
        pdf.save(`SwiftShelf_Invoice_${order.orderNumber}.pdf`);
        setIsGenerating(false);
        setIsDone(true);
        setTimeout(() => setIsDone(false), 2500);
      } catch (err) {
        console.error('Invoice generation error:', err);
        setIsGenerating(false);
      }
    }, 400);
  };

  return (
    <button
      onClick={handleDownload}
      disabled={isGenerating}
      className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold border transition-all ${
        isDone
          ? 'bg-emerald-600 border-emerald-400 text-white'
          : 'bg-slate-900 border-white/15 text-slate-200 hover:text-white hover:border-indigo-400 shadow-md'
      } ${className}`}
    >
      {isGenerating ? (
        <>
          <Loader2 className="w-3.5 h-3.5 animate-spin text-cyan-400" />
          <span>Generating PDF...</span>
        </>
      ) : isDone ? (
        <>
          <Check className="w-3.5 h-3.5" />
          <span>Downloaded!</span>
        </>
      ) : (
        <>
          <FileText className="w-3.5 h-3.5 text-indigo-400" />
          <span>Download Tax Invoice (PDF)</span>
        </>
      )}
    </button>
  );
}
