import React from 'react';
import { Truck, ShieldAlert, Thermometer, Wind, Zap, ShieldCheck } from 'lucide-react';
import { ServiceType } from '../types';

interface ServiceSectionProps {
  service: ServiceType;
  setService: (val: ServiceType) => void;
}

interface ServiceOption {
  id: ServiceType;
  title: string;
  description: string;
  badge: string;
  multiplierText: string;
  icon: React.ReactNode;
}

export default function ServiceSection({
  service,
  setService
}: ServiceSectionProps): React.ReactElement {

  const options: ServiceOption[] = [
    {
      id: 'standard',
      title: 'Standard (ทั่วไป)',
      description: 'ขนส่งปกติทางถนน ครอบคลุมทั่วประเทศ',
      badge: '1-3 วันทำการ',
      multiplierText: 'ตัวคูณ ×1.00',
      icon: <Truck size={18} className="text-gray-500" />
    },
    {
      id: 'express',
      title: 'Express (ด่วนพิเศษ)',
      description: 'จองคิวรถคันเดียว วิ่งส่งตรงด่วนที่สุด',
      badge: 'Next-day / Same-day',
      multiplierText: 'ตัวคูณ ×1.40',
      icon: <Zap size={18} className="text-amber-500 fill-amber-500/10" />
    },
    {
      id: 'cold_chilled',
      title: 'Cold Chilled (แช่เย็น)',
      description: 'ควบคุมอุณหภูมิ 2 ถึง 8°C (นม, ผัก, ยา)',
      badge: 'ถนอมความเย็นพรีเมียม',
      multiplierText: 'ตัวคูณ ×1.50',
      icon: <Thermometer size={18} className="text-blue-500" />
    },
    {
      id: 'cold_frozen',
      title: 'Cold Frozen (แช่แข็ง)',
      description: 'ควบคุมอุณหภูมิความเย็นจัดพิเศษ -18°C (ไอศกรีม)',
      badge: 'แช่แข็งเสถียรตลอดเส้นทาง',
      multiplierText: 'ตัวคูณ ×1.75',
      icon: <Wind size={18} className="text-[#00B4D8]" />
    }
  ];

  return (
    <div id="section-service" className="bg-white rounded-xl border border-gray-150 p-4 sm:p-5 shadow-sm text-[#0A1628] space-y-4">
      {/* SECTION HEADER */}
      <div className="flex items-center space-x-2 pb-2 border-b border-gray-100">
        <div className="p-1.5 bg-[#0F2942]/10 text-[#0F2942] rounded-lg">
          <Truck size={18} className="text-[#0F2942]" />
        </div>
        <div>
          <h3 className="font-bold text-sm text-[#0F2942]">SECTION 3: 🚚 ประเภทบริการขนส่ง</h3>
          <p className="text-[11px] text-gray-500">เลือกประเภทความเร็วหรือการถนอมรักษาความเย็นที่เหมาะสม</p>
        </div>
      </div>

      {/* SERVICE GRID SELECTOR */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {options.map((opt) => {
          const isSelected = service === opt.id;
          return (
            <button
              key={opt.id}
              type="button"
              onClick={() => setService(opt.id)}
              className={`
                text-left p-3.5 rounded-xl border transition-all duration-200 select-none cursor-pointer active:scale-98
                hover:scale-[1.02] hover:shadow-sm
                ${isSelected
                  ? 'border-[#FF6B35] bg-[#FF6B35]/5 ring-1 ring-[#FF6B35]' 
                  : 'border-gray-200 bg-white hover:border-gray-300'
                }
              `}
            >
              {/* TOP ROW */}
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center space-x-2">
                  <div className={`p-1.5 rounded-lg ${isSelected ? 'bg-orange-100' : 'bg-gray-100'}`}>
                    {opt.icon}
                  </div>
                  <h4 className="font-bold text-xs text-[#0F2942]">{opt.title}</h4>
                </div>
                {/* SELECT DOT */}
                <div className={`w-4.5 h-4.5 rounded-full border flex items-center justify-center transition-colors ${
                  isSelected ? 'border-[#FF6B35] bg-[#FF6B35]' : 'border-gray-300 bg-transparent'
                }`}>
                  {isSelected && <div className="w-2 h-2 bg-white rounded-full animate-pulse-dots" />}
                </div>
              </div>

              {/* DESCRIPTION TEXT */}
              <p className="text-[11px] text-gray-550 leading-relaxed font-medium mb-2 pr-4">{opt.description}</p>

              {/* META INFO BADGES */}
              <div className="flex justify-between items-center pt-2 border-t border-dashed border-gray-100 mt-1">
                <span className="text-[10px] font-bold text-gray-400 font-sans uppercase bg-gray-50 px-1.5 py-0.5 rounded border border-gray-100">
                  {opt.badge}
                </span>
                <span className={`text-[10px] font-bold font-sans ${isSelected ? 'text-[#FF6B35]' : 'text-gray-500'}`}>
                  {opt.multiplierText}
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
