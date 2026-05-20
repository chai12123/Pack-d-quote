import React from 'react';
import { Trash2, Calendar, FileJson, ArrowRightLeft, FileDown } from 'lucide-react';
import { Quote } from '../types';

interface QuoteHistoryProps {
  history: Quote[];
  activeQuoteId: string | undefined;
  onSelectQuote: (quote: Quote) => void;
  onDeleteQuote: (quoteId: string) => void;
  onClearAll: () => void;
}

export default function QuoteHistory({
  history,
  activeQuoteId,
  onSelectQuote,
  onDeleteQuote,
  onClearAll
}: QuoteHistoryProps): React.ReactElement {

  const handleDownloadBackup = () => {
    if (history.length === 0) return;
    try {
      const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(history, null, 2));
      const downloadAnchor = document.createElement('a');
      downloadAnchor.setAttribute("href", dataStr);
      downloadAnchor.setAttribute("download", `packd_quotes_backup_${Date.now()}.json`);
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();
    } catch (e) {
      alert('ดาวน์โหลดข้อมูลสำรองไม่สำเร็จ');
    }
  };

  if (history.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-gray-150 p-5 text-center text-gray-400 text-xs shadow-sm no-print">
        <p className="italic">ยังไม่มีประวัติการประเมินราคาที่ถูกบันทึกในอุปกรณ์นี้</p>
        <p className="text-[10px] text-gray-400 mt-1">ใบราคาที่ท่านกด "บันทึกลงแผง" จะมาเรียงความจำอยู่ตรงนี้ (สูงสุด 10 ใบ)</p>
      </div>
    );
  }

  return (
    <div className="space-y-3 no-print">
      <div className="flex items-center justify-between">
        <h4 className="text-xs font-bold text-[#0F2942] uppercase tracking-wide flex items-center space-x-1">
          <span>ประวัติการคำนวณล่าสุด ({history.length}/10)</span>
        </h4>
        <div className="flex items-center space-x-2">
          {/* Backup trigger */}
          <button
            type="button"
            onClick={handleDownloadBackup}
            className="text-[10px] text-gray-500 hover:text-[#0F2942] flex items-center space-x-1 bg-gray-50 hover:bg-gray-100 border border-gray-150 px-2 py-1 rounded transition cursor-pointer select-none"
            title="สำรองข้อมูลทั้งหมดเป็นไฟล์ JSON"
          >
            <FileDown size={11} />
            <span>ดาวน์โหลดไฟล์แผง</span>
          </button>

          {/* Clear trigger */}
          <button
            type="button"
            onClick={onClearAll}
            className="text-[10px] text-red-500 hover:text-red-700 font-medium cursor-pointer"
          >
            ล้างประวัติทั้งหมด
          </button>
        </div>
      </div>

      {/* History scroll list */}
      <div className="space-y-2 max-h-[40vh] overflow-y-auto pr-1">
        {history.map((q) => {
          const isActive = q.quoteId === activeQuoteId;
          const serviceLabel = {
            standard: 'Standard',
            express: 'Express',
            cold_chilled: 'Chilled',
            cold_frozen: 'Frozen',
          }[q.service];

          return (
            <div
              key={q.quoteId}
              onClick={() => onSelectQuote(q)}
              className={`
                p-3 rounded-lg border transition duration-150 flex items-center justify-between gap-3 text-left cursor-pointer active:scale-[0.99] select-none
                ${isActive 
                  ? 'border-[#FF6B35] bg-[#FF6B35]/5 shadow-sm text-[#0F2942] ring-1 ring-[#FF6B35]' 
                  : 'border-gray-150 bg-white text-gray-700 hover:bg-gray-50/50 hover:border-gray-300'
                }
              `}
            >
              {/* Core Quote meta */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-1.5 flex-wrap">
                  <span className="font-mono text-xs font-bold text-[#0F2942]">{q.quoteId}</span>
                  <span className="bg-[#0F2942]/10 text-[#0F2942] px-1.5 py-0.2 rounded text-[10px] font-medium font-sans">
                    {q.vehicleLabel}
                  </span>
                  <span className="bg-gray-100 text-gray-600 px-1 py-0.2 rounded text-[9px] font-medium font-sans">
                    {serviceLabel}
                  </span>
                </div>
                
                {/* Route info */}
                <p className="text-xs font-semibold text-gray-700 truncate mt-1">
                  {q.origin || 'ไม่ระบุ'} ➔ {q.destination || 'ไม่ระบุ'}
                </p>
                
                {/* Time badge */}
                <div className="flex items-center space-x-1 text-[9px] text-gray-400 mt-1">
                  <Calendar size={9} />
                  <span>{new Date(q.createdAt).toLocaleDateString('th-TH')} {new Date(q.createdAt).toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' })}</span>
                  <span className="text-gray-300">|</span>
                  <span>{q.distance} กม.</span>
                </div>
              </div>

              {/* Price & action block */}
              <div className="flex items-center space-x-2 flex-shrink-0">
                <span className="font-mono text-sm font-bold text-[#FF6B35]">
                  ฿{q.total.toLocaleString()}
                </span>
                
                {/* Trash trigger */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation(); // prevent clicking card setting as active
                    if (confirm('คุณต้องการลบใบเสนอราคานี้จากประวัติใช่หรือไม่?')) {
                      onDeleteQuote(q.quoteId);
                    }
                  }}
                  className="p-1 px-1.5 bg-red-50 hover:bg-red-100 text-red-500 rounded-md transition hover:scale-105 active:scale-95 cursor-pointer"
                  title="ลบออกจากประวัติในเครื่อง"
                >
                  <Trash2 size={12} />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
