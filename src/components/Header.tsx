import React from 'react';
import { Phone, MessageSquare, ShieldCheck } from 'lucide-react';

export default function Header(): React.ReactElement {
  return (
    <header className="sticky top-0 z-50 bg-[#0F2942] text-white shadow-sm no-print">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo & Tagline */}
        <div className="flex items-center space-x-3">
          <div className="bg-[#FF6B35] text-white p-2 rounded-lg flex items-center justify-center font-bold tracking-wider text-xl leading-none">
            P
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-bold text-lg tracking-tight select-none">Packd</span>
              <span className="bg-[#FF6B35]/20 text-[#FF8C60] border border-[#FF6B35]/40 text-[10px] uppercase tracking-widest font-semibold px-1 rounded">B2B Core</span>
            </div>
            <p className="text-[11px] text-gray-300 font-medium">ขนส่งแม่นยำ ต้นทุนโปร่งใส โดยบริษัท แพ็คดี จำกัด</p>
          </div>
        </div>

        {/* Contacts Buttons */}
        <div className="flex items-center space-x-2 sm:space-x-3">
          <a
            href="tel:0812345678"
            className="flex items-center space-x-1 sm:space-x-2 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 active:bg-white/30 text-xs sm:text-sm font-medium transition duration-200"
            title="โทรสอบถามฝ่ายขาย"
          >
            <Phone size={14} className="text-[#FF6B35]" />
            <span className="hidden sm:inline">081-234-5678</span>
          </a>
          <a
            href="https://line.me/R/ti/p/@packdlogistics"
            target="_blank"
            referrerPolicy="no-referrer"
            className="flex items-center space-x-1 sm:space-x-2 px-3 py-1.5 rounded-lg bg-[#06C755] hover:bg-[#05b04b] active:bg-[#049941] text-xs sm:text-sm font-medium transition duration-200"
            title="ติดต่อ Sales LINE"
          >
            <MessageSquare size={14} />
            <span>LINE @packdlogistics</span>
          </a>
        </div>
      </div>
    </header>
  );
}
