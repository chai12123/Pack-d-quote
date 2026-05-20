import React, { useEffect, useState } from 'react';
import { Package, HelpCircle, ShieldAlert, CheckSquare, Square, RefreshCcw } from 'lucide-react';
import { ServiceType } from '../types';

interface CargoSectionProps {
  weight: number;
  setWeight: (val: number) => void;
  useVolumetric: boolean;
  setUseVolumetric: (val: boolean) => void;
  dimensions: { w: number; l: number; h: number; count: number };
  setDimensions: (val: { w: number; l: number; h: number; count: number }) => void;
  weightError: string;
  activeService: ServiceType;
}

export default function CargoSection({
  weight,
  setWeight,
  useVolumetric,
  setUseVolumetric,
  dimensions,
  setDimensions,
  weightError,
  activeService
}: CargoSectionProps): React.ReactElement {
  
  // Calculate Volumetric Weight
  const volumetricWeight = Math.round(
    (dimensions.w * dimensions.l * dimensions.h * dimensions.count) / 5000
  );

  // Maximum of actual vs volumetric weight
  const effectiveWeight = useVolumetric ? Math.max(weight, volumetricWeight) : weight;

  // Pick vehicle for real-time preview (matching pricing.ts rules)
  const getVehicleInfo = (wt: number, svc: ServiceType) => {
    if (svc.startsWith('cold')) {
      return {
        label: 'รถตู้ควบคุมอุณหภูมิ (Chilled/Frozen)',
        icon: '❄️',
        color: 'text-blue-500 bg-blue-50 border-blue-200'
      };
    }
    if (wt <= 500) {
      return {
        label: 'รถกระบะทั่วไป (Pickup Truck)',
        icon: '🚚',
        color: 'text-emerald-600 bg-emerald-50 border-emerald-200'
      };
    }
    if (wt <= 800) {
      return {
        label: 'รถตู้แห้ง (Closed Cargo Van)',
        icon: '🚚',
        color: 'text-indigo-600 bg-indigo-50 border-indigo-200'
      };
    }
    return {
      label: 'รถบรรทุก 6 ล้อสำหรับงานอุตสาหกรรม (6-Wheeler)',
      icon: '🚛',
      color: 'text-[#FF6B35] bg-orange-50 border-orange-200'
    };
  };

  const vehicle = getVehicleInfo(effectiveWeight, activeService);

  const handleDimChange = (field: 'w' | 'l' | 'h' | 'count', val: number) => {
    setDimensions({
      ...dimensions,
      [field]: val
    });
  };

  return (
    <div id="section-cargo" className="bg-white rounded-xl border border-gray-150 p-4 sm:p-5 shadow-sm text-[#0A1628] space-y-4">
      {/* SECTION HEADER */}
      <div className="flex items-center space-x-2 pb-2 border-b border-gray-100">
        <div className="p-1.5 bg-[#0F2942]/10 text-[#0F2942] rounded-lg">
          <Package size={18} className="text-[#0F2942]" />
        </div>
        <div>
          <h3 className="font-bold text-sm text-[#0F2942]">SECTION 2: 📦 รายละเอียดสินค้า</h3>
          <p className="text-[11px] text-gray-500">ระบุน้ำหนักรวมและขนาดของพัสดุ</p>
        </div>
      </div>

      {/* WEIGHT CONTROLLER */}
      <div>
        <div className="flex justify-between items-center mb-1">
          <label className="block text-xs font-bold text-gray-500">น้ำหนักสินค้าจริง (กิโลกรัม) *</label>
          <span className="text-[10px] text-gray-400 font-sans">รับประกันเซฟตี้สูงสุด 6,000 กก.</span>
        </div>
        
        <div className="relative">
          <input
            type="number"
            min="0"
            className={`
              w-full text-sm py-2.5 pl-4 pr-12 bg-white border rounded-lg outline-none font-sans font-semibold text-[#0F2942]
              ${weightError ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : 'border-gray-250 focus:border-[#FF6B35] focus:ring-1 focus:ring-[#FF6B35]'}
            `}
            placeholder="ตัวอย่าง 1,200"
            value={weight || ''}
            onChange={(e) => {
              const val = parseFloat(e.target.value);
              setWeight(isNaN(val) ? 0 : val);
            }}
          />
          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-gray-400">กก.</span>
        </div>

        {/* Real-time Vehicle Preview Banner */}
        <div className={`mt-2.5 p-2.5 rounded-lg border text-xs font-medium flex items-center space-x-2 transition-all duration-300 ${vehicle.color}`}>
          <span className="text-base leading-none select-none">{vehicle.icon}</span>
          <div className="flex-1">
            <span className="text-gray-500 font-sans">จัดสรรพาหนะอัตโนมัติ:</span>{' '}
            <strong className="font-bold">{vehicle.label}</strong>
          </div>
        </div>

        {/* Inline limit alerts */}
        {weightError && (
          <div className="mt-2 text-[11px] text-red-500 font-bold flex items-center space-x-1 animate-pulse">
            <ShieldAlert size={12} className="flex-shrink-0" />
            <span>{weightError}</span>
          </div>
        )}
      </div>

      {/* VOLUMETRIC COLLAPSIBLE BOX */}
      <div className="border border-gray-150 rounded-xl overflow-hidden bg-gray-50/20">
        {/* Toggle triggering row */}
        <button
          type="button"
          onClick={() => setUseVolumetric(!useVolumetric)}
          className="w-full flex items-center justify-between p-3 hover:bg-gray-50 transition active:bg-gray-100/50 select-none cursor-pointer"
        >
          <div className="flex items-center space-x-2 text-xs font-bold text-gray-700">
            {useVolumetric ? (
              <span className="text-[#FF6B35]"><CheckSquare size={16} className="fill-[#FF6B35]/5" /></span>
            ) : (
              <span className="text-gray-400"><Square size={16} /></span>
            )}
            <span>ระบุขนาดพัสดุ (Volumetric Weight สำหรับสินค้ากล่องชิ้นใหญ่)</span>
          </div>
          <span className="text-[10px] text-gray-400 font-mono font-bold bg-[#0F2942]/5 px-2 py-0.5 rounded">
            {useVolumetric ? 'เปิดใช้งาน' : 'ปิด'}
          </span>
        </button>

        {/* Dimensions details panel */}
        {useVolumetric && (
          <div className="p-3 border-t border-gray-150 bg-white space-y-3 font-sans transition-all duration-300">
            <div className="grid grid-cols-4 gap-2">
              <div>
                <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">กว้าง (ซม.)</label>
                <input
                  type="number"
                  min="0"
                  className="w-full text-center text-xs py-1.5 border border-gray-250 rounded font-semibold text-[#0F2942]"
                  value={dimensions.w || ''}
                  onChange={(e) => handleDimChange('w', parseInt(e.target.value) || 0)}
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">ยาว (ซม.)</label>
                <input
                  type="number"
                  min="0"
                  className="w-full text-center text-xs py-1.5 border border-gray-250 rounded font-semibold text-[#0F2942]"
                  value={dimensions.l || ''}
                  onChange={(e) => handleDimChange('l', parseInt(e.target.value) || 0)}
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">สูง (ซม.)</label>
                <input
                  type="number"
                  min="0"
                  className="w-full text-center text-xs py-1.5 border border-gray-250 rounded font-semibold text-[#0F2942]"
                  value={dimensions.h || ''}
                  onChange={(e) => handleDimChange('h', parseInt(e.target.value) || 0)}
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">จำนวนกล่อง</label>
                <input
                  type="number"
                  min="1"
                  className="w-full text-center text-xs py-1.5 border border-gray-250 rounded font-semibold text-[#0F2942]"
                  value={dimensions.count || 1}
                  onChange={(e) => handleDimChange('count', parseInt(e.target.value) || 1)}
                />
              </div>
            </div>

            {/* Math validation & result note */}
            <div className="p-2 bg-[#FF6B35]/5 border border-dashed border-[#FF6B35]/20 rounded-lg text-xs leading-relaxed text-gray-700">
              <div className="flex justify-between font-medium">
                <span>คำนวณ Volumetric Weight:</span>
                <span className="font-mono font-bold text-[#FF6B35]">{volumetricWeight} กก.</span>
              </div>
              <p className="text-[10px] text-gray-400 mt-1">
                * สูตรคำนวณสากล: (กว้าง × ยาว × สูง × จำนวน) / 5000 | ระบบประมวลราคาจริงโดยยึดค่าที่ชั่งได้มากที่สุดระหว่าง <strong>น้ำหนักจริง ({weight} กก.)</strong> หรือ <strong>น้ำหนักปริมาตร ({volumetricWeight} กก.)</strong> จากเครื่องมือคำนวณ
              </p>
              {volumetricWeight > weight && (
                <p className="text-[10px] text-red-500 font-bold mt-1">
                  💡 เนื่องจากน้ำหนักปริมาตรเฉลี่ยสูงกว่า ระบบจะปรับน้ำหนักในการประเมินราคาเป็น {volumetricWeight} กก.
                </p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
