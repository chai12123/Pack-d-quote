import React from 'react';
import { Calculator, RefreshCw, AlertCircle } from 'lucide-react';
import RouteSection from './RouteSection';
import CargoSection from './CargoSection';
import ServiceSection from './ServiceSection';
import SurchargeSection from './SurchargeSection';
import { ServiceType } from '../types';

interface CalculatorFormProps {
  origin: string;
  setOrigin: (val: string) => void;
  destination: string;
  setDestination: (val: string) => void;
  distance: number;
  setDistance: (val: number) => void;
  weight: number;
  setWeight: (val: number) => void;
  useVolumetric: boolean;
  setUseVolumetric: (val: boolean) => void;
  dimensions: { w: number; l: number; h: number; count: number };
  setDimensions: (val: { w: number; l: number; h: number; count: number }) => void;
  service: ServiceType;
  setService: (val: ServiceType) => void;
  selectedTags: string[];
  toggleTag: (tag: string) => void;
  multistopCount: number;
  setMultistopCount: (count: number) => void;
  onCalculate: () => void;
  onClear: () => void;
  errors: Record<string, string>;
  isValid: boolean;
}

export default function CalculatorForm({
  origin,
  setOrigin,
  destination,
  setDestination,
  distance,
  setDistance,
  weight,
  setWeight,
  useVolumetric,
  setUseVolumetric,
  dimensions,
  setDimensions,
  service,
  setService,
  selectedTags,
  toggleTag,
  multistopCount,
  setMultistopCount,
  onCalculate,
  onClear,
  errors,
  isValid
}: CalculatorFormProps): React.ReactElement {
  return (
    <form 
      id="calculator-form"
      onSubmit={(e) => {
        e.preventDefault();
        if (isValid) onCalculate();
      }}
      className="space-y-4 sm:space-y-6"
    >
      {/* SECTION 1: ROUTE */}
      <RouteSection
        origin={origin}
        setOrigin={setOrigin}
        destination={destination}
        setDestination={setDestination}
        distance={distance}
        setDistance={setDistance}
        distanceError={errors.distance || errors.route}
      />

      {/* SECTION 2: CARGO */}
      <CargoSection
        weight={weight}
        setWeight={setWeight}
        useVolumetric={useVolumetric}
        setUseVolumetric={setUseVolumetric}
        dimensions={dimensions}
        setDimensions={setDimensions}
        weightError={errors.weight}
        activeService={service}
      />

      {/* SECTION 3: SERVICE */}
      <ServiceSection
        service={service}
        setService={setService}
      />

      {/* SECTION 4: SURCHARGE */}
      <SurchargeSection
        selectedTags={selectedTags}
        toggleTag={toggleTag}
        multistopCount={multistopCount}
        setMultistopCount={setMultistopCount}
      />

      {/* FORM ACTIONS */}
      <div className="flex flex-col sm:flex-row gap-3 pt-2 no-print">
        {/* CLEAR FORM BUTTON */}
        <button
          type="button"
          onClick={onClear}
          className="order-2 sm:order-1 sm:w-1/3 py-3 px-4 bg-gray-100 hover:bg-gray-200 active:bg-gray-250 text-gray-700 font-bold text-xs sm:text-sm rounded-xl transition flex items-center justify-center space-x-2 cursor-pointer select-none active:scale-95 border border-gray-200"
        >
          <RefreshCw size={15} />
          <span>ล้างข้อมูลฟอร์ม</span>
        </button>

        {/* CALCULATE PRE-QUOTE BUTTON */}
        <button
          type="submit"
          disabled={!isValid}
          className={`
            order-1 sm:order-2 flex-grow py-3 px-6 text-white font-bold text-xs sm:text-sm rounded-xl transition flex items-center justify-center space-x-2 select-none active:scale-98
            ${isValid 
              ? 'bg-[#FF6B35] hover:bg-[#FF8354] hover:shadow-md cursor-pointer' 
              : 'bg-gray-300 text-gray-500 border border-gray-200 cursor-not-allowed'
            }
          `}
        >
          <Calculator size={16} />
          <span>บันทึกประวัติและคำนวณราคาด่วน</span>
        </button>
      </div>

      {/* Error Warning Toast at bottom of form if invalid */}
      {!isValid && (Object.keys(errors).length > 0) && (
        <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-xs font-semibold flex items-start space-x-2 animate-pulse">
          <AlertCircle size={14} className="mt-0.5 flex-shrink-0" />
          <div>
            <p className="font-bold">กรุณากรอกข้อมูลให้ครบถ้วนถูกต้อง:</p>
            <ul className="list-disc pl-4 mt-1 space-y-0.5 font-normal">
              {errors.route && <li>{errors.route}</li>}
              {errors.distance && <li>{errors.distance}</li>}
              {errors.weight && <li>{errors.weight}</li>}
            </ul>
          </div>
        </div>
      )}
    </form>
  );
}
