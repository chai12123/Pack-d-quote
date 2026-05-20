import React, { useState, useEffect } from 'react';
import { Printer, MessageSquare, Mail, Bookmark, ChevronDown, ChevronUp, Share2, Info, Truck, Check } from 'lucide-react';
import { Quote } from '../types';
import { generateLineShareUrl, generateEmailUrl } from '../lib/share';

interface QuoteCardProps {
  quote: Quote | null;
  onSaveQuote: (quote: Quote) => void;
  isSaved?: boolean;
}

export default function QuoteCard({
  quote,
  onSaveQuote,
  isSaved = false
}: QuoteCardProps): React.ReactElement {
  const [isExpanded, setIsExpanded] = useState(true);
  const [displayPrice, setDisplayPrice] = useState(0);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Count-up animation over 600ms ease-out
  useEffect(() => {
    let active = true;
    const end = quote?.total || 0;
    
    if (end === 0) {
      setDisplayPrice(0);
      return;
    }

    const start = Math.max(0, end - 3000); // Start from a close value for speed
    const duration = 600; // ms
    const startTime = performance.now();

    const animate = (now: number) => {
      if (!active) return;
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // quad ease-out
      const easeOutQuad = progress * (2 - progress);
      const current = Math.round(start + (end - start) * easeOutQuad);
      
      setDisplayPrice(current);

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setDisplayPrice(end);
      }
    };

    requestAnimationFrame(animate);

    return () => {
      active = false;
    };
  }, [quote?.total, quote?.quoteId]);

  // Reset local save success toast on new quote
  useEffect(() => {
    setSaveSuccess(false);
  }, [quote?.quoteId]);

  const handlePrint = () => {
    window.print();
  };

  const handleSave = () => {
    if (!quote) return;
    try {
      onSaveQuote(quote);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000); // clear toast after 3s
    } catch (e) {
      alert('บันทึกข้อมูลไม่สำเร็จเนื่องจากหน่วยความจำเต็ม');
    }
  };

  // Render Empty State
  if (!quote) {
    return (
      <div className="bg-white rounded-xl border border-gray-150 p-6 sm:p-8 text-center text-[#0A1628] shadow-sm select-none no-print">
        <div className="w-14 h-14 bg-[#FF6B35]/10 border border-[#FF6B35]/20 rounded-full flex items-center justify-center mx-auto mb-4">
          <Truck size={24} className="text-[#FF6B35]" />
        </div>
        <h3 className="text-base font-bold text-[#0F2942]">กรอกข้อมูลเพื่อประเมินราคา</h3>
        <p className="text-xs text-gray-500 mt-2 max-w-xs mx-auto leading-relaxed">
          ระบุจังหวัดต้นทาง-ปลายทาง และน้ำหนักสินค้า เพื่อตรวจสอบราคารถขนส่งแต่ละประเภทได้ฟรีแบบเรียลไทม์ทันที
        </p>
        <div className="mt-5 p-3 rounded-lg bg-gray-50/50 border border-gray-150 text-left space-y-2">
          <p className="text-[10px] uppercase tracking-wider font-bold text-gray-400">ฟลีทรถและเป้าหมายการให้บริการ</p>
          <div className="space-y-1 text-xs text-gray-650">
            <p>• <strong>รถกระบะขนส่ง:</strong> เหมาะสำหรับพัสดุทั่วไปไม่เกิน 500 กิโลกรัม</p>
            <p>• <strong>รถตู้ตู้แห้งปิดตู้:</strong> ปลอดภัยตลอดเส้นทางรับพัสดุไม่เกิน 800 กิโลกรัม</p>
            <p>• <strong>รถขนส่งตู้ชิลล์/คุมอุณหภูมิ:</strong> ถนอมคุณภาพยาหรือสินค้าควบคุมเย็นจัด</p>
          </div>
        </div>
      </div>
    );
  }

  // Active State Card
  const serviceLabels = {
    standard: 'มาตรฐาน (Standard)',
    express: 'ด่วนพิเศษ (Express)',
    cold_chilled: 'แช่เย็นควบคุมอุณหภูมิ 2-8°C',
    cold_frozen: 'แช่แข็งควบคุมอุณหภูมิ -18°C',
  };

  const hasSpecialTags = quote.tags && quote.tags.length > 0;

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-md p-4 sm:p-5 text-[#0A1628] relative no-print max-h-[85vh] overflow-y-auto">
      {/* Active Header */}
      <div className="flex items-start justify-between border-b border-gray-100 pb-3 mb-4">
        <div>
          <span className="bg-[#0F2942] text-white text-[10px] font-bold tracking-widest font-mono uppercase px-2 py-0.5 rounded">
            OFFICIAL PRE-QUOTE
          </span>
          <h3 className="text-[#0F2942] font-semibold text-xs mt-1 font-mono tracking-tight">ID: {quote.quoteId}</h3>
          <p className="text-[10px] text-gray-400 font-medium">คำนวณเมื่อ: {new Date(quote.createdAt).toLocaleString('th-TH')}</p>
        </div>
        <div className="flex flex-col items-end">
          <span className="text-[10px] text-gray-400 font-bold uppercase select-none">ยอดสุทธิประเมิน</span>
          <span className="text-[#FF6B35] font-mono font-bold text-2xl leading-none pt-0.5">
            ฿{displayPrice.toLocaleString()}
          </span>
        </div>
      </div>

      {/* Main Parameters list */}
      <div className="space-y-2.5 mb-4 text-xs font-medium">
        {quote.origin && quote.destination && (
          <div className="bg-[#0F2942]/5 border border-dashed border-gray-200 rounded-lg p-2.5 text-[#0F2942]">
            <div className="flex justify-between">
              <span className="font-bold text-gray-500">เส้นทางขนส่ง:</span>
              <span className="font-bold text-right text-xs truncate max-w-[200px]" title={`${quote.origin} ➔ ${quote.destination}`}>
                {quote.origin} ➔ {quote.destination}
              </span>
            </div>
          </div>
        )}

        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="border border-gray-100 rounded-lg p-2 bg-gray-50/50">
            <span className="text-gray-400 block text-[10px] uppercase font-bold">ฟลีทรถจัดสรร</span>
            <span className="font-bold select-none text-[#0F2942] flex items-center space-x-1.5 mt-0.5">
              <Truck size={12} className="text-[#FF6B35]" />
              <span>{quote.vehicleLabel}</span>
            </span>
          </div>
          <div className="border border-gray-100 rounded-lg p-2 bg-gray-50/50">
            <span className="text-gray-400 block text-[10px] uppercase font-bold">ระยะทางขนส่ง</span>
            <span className="font-bold text-[#0F2942] block mt-0.5">
              <span className="font-mono text-xs">{quote.distance}</span> กม.
            </span>
          </div>
          <div className="border border-gray-100 rounded-lg p-2 bg-gray-50/50">
            <span className="text-gray-400 block text-[10px] uppercase font-bold">น้ำหนักสินค้าประเมิน</span>
            <span className="font-bold text-[#0F2942] block mt-0.5">
              <span className="font-mono text-xs">{quote.weight.toLocaleString()}</span> กก.
            </span>
          </div>
          <div className="border border-gray-100 rounded-lg p-2 bg-gray-50/50">
            <span className="text-gray-400 block text-[10px] uppercase font-bold">ประเภทจัดส่ง</span>
            <span className="font-bold text-[#0F2942] block truncate mt-0.5" title={serviceLabels[quote.service]}>
              {quote.service === 'standard' ? 'Standard ธรรมดา' : 
               quote.service === 'express' ? 'Express ด่วนพิเศษ' : 
               quote.service === 'cold_chilled' ? 'Chilled (2-8°C)' : 'Frozen (-18°C)'}
            </span>
          </div>
        </div>
      </div>

      {/* Pricing Breakdown Accordion */}
      <div className="border border-gray-150 rounded-xl overflow-hidden mb-4">
        <button
          type="button"
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full flex items-center justify-between p-3.5 bg-gray-50 border-b border-gray-150 hover:bg-gray-100 transition duration-150 select-none text-[#0F2942]"
        >
          <span className="text-xs font-bold uppercase tracking-wider flex items-center space-x-1.5">
            <span>โปร่งใส: รายละเอียดค่าใช้จ่าย</span>
          </span>
          {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </button>

        {isExpanded && (
          <div className="p-3.5 space-y-2 bg-white text-xs select-none">
            <div className="flex justify-between items-center text-gray-600">
              <span>ค่าเรียกรถรับสินค้าพื้นฐาน</span>
              <span className="font-mono">฿{quote.breakdown.base.toLocaleString()}</span>
            </div>

            <div className="flex justify-between items-center text-gray-600">
              <span className="flex items-center space-x-1">
                <span>ค่าระยะทางวิ่งตามจริง ({quote.distance} กม.)</span>
              </span>
              <span className="font-mono">฿{quote.breakdown.distance.toLocaleString()}</span>
            </div>

            <div className="flex justify-between items-center text-gray-600">
              <span>ค่าน้ำหนักส่วนเกินสะสม</span>
              <span className="font-mono">฿{quote.breakdown.weight.toLocaleString()}</span>
            </div>

            {quote.breakdown.serviceMultiplier > 1 && (
              <div className="flex justify-between items-center text-gray-600">
                <span>ตัวคูณเรตบริการพิเศษ (×{quote.breakdown.serviceMultiplier.toFixed(2)})</span>
                <span className="font-mono text-orange-600">
                  +฿{(quote.subtotal - (quote.breakdown.base + quote.breakdown.distance + quote.breakdown.weight)).toLocaleString()}
                </span>
              </div>
            )}

            {hasSpecialTags && (
              <div className="flex justify-between items-center text-gray-600 border-t border-gray-50 pt-1.5">
                <span className="text-[11px] text-gray-500 font-sans">
                  เงื่อนไขพิเศษรอบส่ง ({quote.tags.map(t => {
                    if (t === 'night') return 'กลางคืน';
                    if (t === 'holiday') return 'วันหยุด';
                    if (t === 'remote') return 'ห่างไกล';
                    if (t === 'multistop') return 'หลายจุดส่ง';
                    if (t === 'cod') return 'COD';
                    return t;
                  }).join(', ')})
                </span>
                <span className="font-mono text-[#0F2942] font-semibold">+฿{quote.breakdown.tags.toLocaleString()}</span>
              </div>
            )}

            <div className="flex justify-between items-center text-gray-600 pt-1.5 border-t border-gray-100">
              <span>ค่าชดเชยราคาน้ำมัน (Fuel Surcharge 8%)</span>
              <span className="font-mono">฿{quote.breakdown.fuel.toLocaleString()}</span>
            </div>

            <div className="flex justify-between items-center text-gray-600 pt-1">
              <span>ภาษีมูลค่าเพิ่ม (VAT 7%)</span>
              <span className="font-mono">฿{quote.breakdown.vat.toLocaleString()}</span>
            </div>

            <div className="flex justify-between items-center font-bold text-sm text-[#0F2942] pt-2 border-t border-gray-200">
              <span>ยอดรวมประเมิน (บาท)</span>
              <span className="font-mono text-[#FF6B35]">฿{quote.total.toLocaleString()}</span>
            </div>
          </div>
        )}
      </div>

      {/* Local Save Success Banner */}
      {saveSuccess && (
        <div className="mb-4 p-2.5 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-lg flex items-center space-x-2 font-medium">
          <Check size={14} />
          <span>บันทึกประวัติใบเสนอราคานี้ลงเครื่องสำเร็จ!</span>
        </div>
      )}

      {/* Action panel triggers */}
      <div className="space-y-2">
        <div className="grid grid-cols-2 gap-2">
          {/* Print trigger */}
          <button
            type="button"
            onClick={handlePrint}
            className="flex items-center justify-center space-x-2 py-2.5 px-3 border border-gray-200 rounded-lg hover:bg-gray-50 active:scale-[0.98] transition text-xs font-semibold select-none cursor-pointer"
          >
            <Printer size={14} className="text-gray-500" />
            <span>พิมพ์ / บันทึก PDF</span>
          </button>

          {/* Local storage save */}
          <button
            type="button"
            onClick={handleSave}
            disabled={isSaved}
            className={`
              flex items-center justify-center space-x-2 py-2.5 px-3 border rounded-lg transition text-xs font-semibold select-none cursor-pointer
              ${isSaved 
                ? 'bg-gray-100 text-gray-400 border-gray-100 cursor-not-allowed' 
                : 'border-gray-200 hover:bg-gray-50 active:scale-[0.98]'
              }
            `}
          >
            <Bookmark size={14} className={isSaved ? "text-emerald-500 fill-emerald-500" : "text-gray-500"} />
            <span>{isSaved ? 'บันทึกแล้ว' : 'บันทึกลงแผง'}</span>
          </button>
        </div>

        {/* LINE & Email CTA */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {/* Send to LINE Sales team */}
          <a
            href={generateLineShareUrl(quote)}
            target="_blank"
            referrerPolicy="no-referrer"
            className="flex items-center justify-center space-x-2 py-3 px-4 bg-[#06C755] hover:bg-[#05b04b] text-white rounded-lg transition text-xs font-bold active:scale-[0.98] text-center shadow-sm select-none"
          >
            <MessageSquare size={14} className="fill-white" />
            <span>ส่ง LINE ยืนยันจองกับ Sales</span>
          </a>

          {/* Send to Email */}
          <a
            href={generateEmailUrl(quote)}
            className="flex items-center justify-center space-x-2 py-3 px-4 bg-[#0F2942] hover:bg-[#1a3f61] text-white rounded-lg transition text-xs font-bold active:scale-[0.98] text-center shadow-sm select-none"
          >
            <Mail size={14} />
            <span>ส่งอีเมลตอบรับขนส่ง</span>
          </a>
        </div>
      </div>

      {/* Disclaimer */}
      <div className="mt-4 p-3 bg-amber-50 border border-amber-150 rounded-lg flex items-start space-x-2 select-none">
        <Info size={14} className="text-amber-700 flex-shrink-0 mt-0.5" />
        <div className="text-[10px] text-amber-900 leading-relaxed font-medium">
          <p className="font-bold">เงื่อนไขและข้อจำกัดความรับผิดชอบ:</p>
          <p>ใบงานนี้เป็นเพียงราคา "ประเมินประเมินเบื้องต้น ±10%" อิงประเมินตามพารามิเตอร์ระบบขนส่งของทางถนน และยังไม่ใช่เอกสารยืนยันจองรถจริง ราคาเสนอขายสุทธิจะได้รับการสรุปยืนยันโดยทีม Sales บริษัท แพ็คดี จำกัด เท่านั้น ทางบริษัทยินดีให้บริการขนส่งด้วยจริยธรรมสูงสุด</p>
        </div>
      </div>
    </div>
  );
}
