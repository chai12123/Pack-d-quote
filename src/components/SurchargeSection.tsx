import React from 'react';
import { Tag, HelpCircle, Check, Info } from 'lucide-react';

interface SurchargeSectionProps {
  selectedTags: string[];
  toggleTag: (tag: string) => void;
  multistopCount: number;
  setMultistopCount: (count: number) => void;
}

interface SurchargeOption {
  id: string;
  label: string;
  description: string;
  icon: string;
  badge: string;
}

export default function SurchargeSection({
  selectedTags,
  toggleTag,
  multistopCount,
  setMultistopCount
}: SurchargeSectionProps): React.ReactElement {

  const options: SurchargeOption[] = [
    {
      id: 'night',
      label: '⏰ ส่งกลางคืน (Night Surcharge)',
      description: 'บริการขนส่งในช่วงเวลา 20.00 น. - 05.00 น.',
      badge: '+20% ของยอดประเมิน',
      icon: '⏰'
    },
    {
      id: 'holiday',
      label: '📅 ส่งวันอาทิตย์/วันหยุด (Holiday Surcharge)',
      description: 'ขนส่งตรงในวันอาทิตย์หรือวันนขัตฤกษ์สากล',
      badge: '+15% ของยอดประเมิน',
      icon: '📅'
    },
    {
      id: 'remote',
      label: '🏝️ พื้นที่ห่างไกล/เกาะ (Remote Service)',
      description: 'จัดส่งปลายทางขึ้นเขา, ดอยสูง, หรือมีต้องต่อแพข้ามเกาะ',
      badge: '+500 บาท',
      icon: '🏝️'
    },
    {
      id: 'multistop',
      label: '📍 หลายจุดส่ง (Multi-stop Drops)',
      description: 'บริการจอดแวะถ่ายสินค้าเพิ่มหลายสถานที่ในการเดินทางเที่ยวเดียว',
      badge: '+300 บาท/จุดเพิ่มเติม',
      icon: '📍'
    },
    {
      id: 'cod',
      label: '💵 เก็บเงินปลายทาง (Cash on Delivery)',
      description: 'ขนส่งพร้อมเก็บค่าพัสดุและตีกลับเช็คโอนเข้าพอร์ทบริษัท',
      badge: '+100 บาท',
      icon: '💵'
    }
  ];

  const hasMultistop = selectedTags.includes('multistop');

  return (
    <div id="section-surcharge" className="bg-white rounded-xl border border-gray-150 p-4 sm:p-5 shadow-sm text-[#0A1628] space-y-4">
      {/* SECTION HEADER */}
      <div className="flex items-center space-x-2 pb-2 border-b border-gray-100">
        <div className="p-1.5 bg-[#0F2942]/10 text-[#0F2942] rounded-lg">
          <Tag size={18} className="text-[#0F2942]" />
        </div>
        <div>
          <h3 className="font-bold text-sm text-[#0F2942]">SECTION 4: 🏷️ เงื่อนไขพิเศษและบริการเสริม</h3>
          <p className="text-[11px] text-gray-500">เลือกบริการพิเศษเพื่อความเหมาะสมและตรงกับความต้องการใช้งาน</p>
        </div>
      </div>

      {/* HORIZONTAL WRAP CHIPS LIST */}
      <div className="flex flex-col gap-2.5">
        {options.map((opt) => {
          const isChecked = selectedTags.includes(opt.id);
          return (
            <div key={opt.id} className="w-full">
              <button
                type="button"
                onClick={() => toggleTag(opt.id)}
                className={`
                  w-full text-left p-3 rounded-lg border transition-all duration-150 flex items-start justify-between cursor-pointer active:scale-[0.995] select-none
                  ${isChecked 
                    ? 'border-[#FF6B35] bg-[#FF6B35]/5 shadow-sm' 
                    : 'border-gray-200 bg-white hover:bg-gray-50/50 hover:border-gray-300'
                  }
                `}
              >
                <div className="flex items-start space-x-3">
                  {/* Styled Box Check */}
                  <div className={`mt-0.5 w-4 h-4 rounded border flex items-center justify-center transition-all ${
                    isChecked ? 'border-[#FF6B35] bg-[#FF6B35] text-white' : 'border-gray-300 bg-white'
                  }`}>
                    {isChecked && <Check size={12} strokeWidth={3} />}
                  </div>
                  <div>
                    <h4 className="font-bold text-xs text-[#0F2942]">{opt.label}</h4>
                    <p className="text-[10px] text-gray-450 mt-0.5 leading-relaxed font-sans">{opt.description}</p>
                  </div>
                </div>
                {/* Charge Badge */}
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full font-sans uppercase ${
                  isChecked 
                    ? 'bg-[#FF6B35]/15 text-[#FF6B35]' 
                    : 'bg-gray-100 text-gray-550 border border-gray-150'
                }`}>
                  {opt.badge}
                </span>
              </button>

              {/* Multi-stop Sub Dropdown Slider when active */}
              {opt.id === 'multistop' && hasMultistop && (
                <div className="mx-3 mt-2 mb-1 p-3 bg-gray-50 rounded-lg border border-gray-250 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 animate-fade-in font-sans">
                  <div className="flex items-center space-x-2">
                    <Info size={14} className="text-[#FF6B35]" />
                    <span className="text-xs font-semibold text-gray-700">จำนวนจุดจัดส่งปลายทางเพิ่มเติม (drop points):</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      type="button"
                      disabled={multistopCount <= 1}
                      onClick={() => setMultistopCount(Math.max(1, multistopCount - 1))}
                      className="px-2 py-0.5 bg-white border border-gray-350 hover:bg-gray-100 disabled:opacity-40 text-xs font-bold rounded cursor-pointer select-none active:scale-95"
                    >
                      -
                    </button>
                    <input
                      type="number"
                      min="1"
                      className="w-12 text-center text-xs py-1 border border-gray-350 bg-white rounded font-bold text-[#0F2942]"
                      value={multistopCount}
                      onChange={(e) => {
                        const val = parseInt(e.target.value);
                        setMultistopCount(isNaN(val) || val < 1 ? 1 : val);
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => setMultistopCount(multistopCount + 1)}
                      className="px-2 py-0.5 bg-white border border-gray-350 hover:bg-gray-100 text-xs font-bold rounded cursor-pointer select-none active:scale-95"
                    >
                      +
                    </button>
                    <span className="text-xs text-gray-500 font-bold ml-1">จุด</span>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
