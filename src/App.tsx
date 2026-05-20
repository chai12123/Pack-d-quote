import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import CalculatorForm from './components/CalculatorForm';
import QuoteCard from './components/QuoteCard';
import QuoteHistory from './components/QuoteHistory';
import PrintLayout from './components/PrintLayout';
import {
  getQuoteHistory,
  clearQuoteHistory,
  saveQuoteToHistory,
  deleteQuoteFromHistory
} from './lib/storage';
import { getLookupDistance } from './lib/distances';
import { calculatePrice } from './lib/pricing';
import { Quote, ServiceType } from './types';
import { Info, HelpCircle, X, CheckCircle, Smartphone } from 'lucide-react';

export default function App(): React.ReactElement {
  // --- FORM STATES ---
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');
  const [distance, setDistance] = useState(0);
  const [weight, setWeight] = useState(0);
  const [useVolumetric, setUseVolumetric] = useState(false);
  const [dimensions, setDimensions] = useState({ w: 0, l: 0, h: 0, count: 1 });
  const [service, setService] = useState<ServiceType>('standard');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [multistopCount, setMultistopCount] = useState(1);

  // --- UI STATES ---
  const [historyQuotes, setHistoryQuotes] = useState<Quote[]>([]);
  const [latestQuote, setLatestQuote] = useState<Quote | null>(null);
  const [mobileDetailsOpen, setMobileDetailsOpen] = useState(false);
  const [saveToast, setSaveToast] = useState(false);

  // --- LOAD LIFE SEGMENTS ---
  useEffect(() => {
    const savedQuotes = getQuoteHistory();
    setHistoryQuotes(savedQuotes);
    if (savedQuotes.length > 0) {
      // Initalize with the latest calculated quote parameters if available
      const lastQ = savedQuotes[0];
      setLatestQuote(lastQ);
      loadQuoteToInputs(lastQ);
    }
  }, []);

  // --- DYNAMIC VEHICLE RESTRICTION & SERVICE SYNC ---
  useEffect(() => {
    // Force cold frozen or cold chilled to use van_cold in pricing. 
    // This is managed inside pricing.ts, but we keep option sync elegant
  }, [service]);

  // --- AUTOMATIC HIGHWAY SYSTEM DISTANCE FILL ---
  useEffect(() => {
    if (origin && destination) {
      const dbDistance = getLookupDistance(origin, destination);
      if (dbDistance !== null) {
        setDistance(dbDistance);
      }
    }
  }, [origin, destination]);

  // --- LIVE REAL-TIME CALCULATION ---
  const effectiveWeight = useVolumetric
    ? Math.max(weight, Math.round((dimensions.w * dimensions.l * dimensions.h * dimensions.count) / 5000))
    : weight;

  const liveActiveQuote = (origin.trim() && destination.trim() && distance > 0 && effectiveWeight > 0 && effectiveWeight <= 6000)
    ? calculatePrice({
        distance,
        weight: effectiveWeight,
        service,
        tags: selectedTags,
        origin,
        destination,
        multistopCount
      })
    : null;

  // --- VALIDATION ENGINES ---
  const errors: Record<string, string> = {};
  if (!origin.trim()) {
    errors.route = "กรุณากรอกจังหวัดหรือสถานที่ต้นทาง";
  }
  if (!destination.trim()) {
    errors.route = "กรุณากรอกจังหวัดหรือสถานที่ปลายทาง";
  }
  if (origin.trim() && destination.trim() && distance <= 0) {
    errors.distance = "ไม่พบเส้นทางตรงในตาราง คาดค่าน้ำมันไม่ถูกต้อง กรุณากรอกระยะทางจัดส่งเฉลี่ยตามจริง (เช่น 80 กม.)";
  } else if (distance <= 0) {
    errors.distance = "กรุณาระบุระยะทางขนส่งโดยประมาณ (มากกว่า 0 กม.)";
  }
  if (weight <= 0) {
    errors.weight = "กรุณาระบุน้ำหนักพัสดุหรือสิ่งของที่จะขนส่ง";
  } else if (effectiveWeight > 6000) {
    errors.weight = "น้ำหนักรวมหรือน้ำหนักปริมาตร (Volumetric) เกินพิกัดให้บริการสูงสุดของบริษัท แพ็คดี จำกัด (สูงสุด 6,000 กก.) กรุณาแบ่งน้ำหนักหรือติดต่อแอดมิน";
  }

  const isValid = Object.keys(errors).length === 0;

  // --- HELPER WRAPPER TO LOAD HISTORIC QUOTE TO FORM ---
  const loadQuoteToInputs = (q: Quote) => {
    setOrigin(q.origin || '');
    setDestination(q.destination || '');
    setDistance(q.distance);
    setWeight(q.weight);
    setService(q.service);
    setSelectedTags(q.tags || []);
    setLatestQuote(q);
  };

  // --- USER TRIGGERS ---
  const handleToggleTag = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
  };

  const handleCalculateAndSaveHistory = () => {
    if (!isValid || !liveActiveQuote) return;

    // Save actual quote record to localStorage history
    const updatedHistory = saveQuoteToHistory(liveActiveQuote);
    setHistoryQuotes(updatedHistory);
    setLatestQuote(liveActiveQuote);

    // Toast feedback & Mobile interaction
    setSaveToast(true);
    setTimeout(() => setSaveToast(false), 2500);
    setMobileDetailsOpen(true);
  };

  const handleClearForm = () => {
    setOrigin('');
    setDestination('');
    setDistance(0);
    setWeight(0);
    setUseVolumetric(false);
    setDimensions({ w: 0, l: 0, h: 0, count: 1 });
    setService('standard');
    setSelectedTags([]);
    setMultistopCount(1);
    setLatestQuote(null);
  };

  const handleDeleteHistoryQuote = (quoteId: string) => {
    const updated = deleteQuoteFromHistory(quoteId);
    setHistoryQuotes(updated);
    if (latestQuote?.quoteId === quoteId) {
      setLatestQuote(updated.length > 0 ? updated[0] : null);
    }
  };

  const handleClearHistoryAll = () => {
    if (confirm('คุณต้องการลบประวัติคำนวณทั้งหมดออกจากอุปกรณ์นี้ใช่หรือไม่? (การดำเนินการนี้ไม่สามารถย้อนคืนได้)')) {
      clearQuoteHistory();
      setHistoryQuotes([]);
      setLatestQuote(null);
    }
  };

  const handleSelectQuoteFromHistory = (q: Quote) => {
    loadQuoteToInputs(q);
    setMobileDetailsOpen(true);
  };

  const isSavedInHistory = latestQuote
    ? historyQuotes.some(q => q.quoteId === latestQuote.quoteId)
    : false;

  return (
    <div className="min-h-screen flex flex-col bg-[#F7F8FA] text-[#0A1628] font-sans">
      {/* HEADER SECTION */}
      <Header />

      {/* WORKSPACE AREA */}
      <main className="flex-grow max-w-7xl w-full mx-auto p-3 sm:p-5 lg:p-6 pb-24 no-print">
        
        {/* MOBILE FLOATING REAL-TIME COUNTER HEADER banner */}
        {(liveActiveQuote || latestQuote) && (
          <div className="lg:hidden sticky top-16 z-40 bg-white/95 backdrop-blur-md border border-gray-200 p-3 rounded-xl mb-4 shadow-sm flex items-center justify-between no-print transition-all duration-300">
            <div className="flex items-center space-x-2">
              <div className="w-2.5 h-2.5 bg-[#FF6B35] rounded-full animate-pulse" />
              <div>
                <p className="text-[9px] text-gray-400 font-bold uppercase select-none tracking-wider">ราคาประเมินเรียลไทม์</p>
                <p className="font-mono text-base font-bold text-[#FF6B35]">
                  ฿{((liveActiveQuote || latestQuote)?.total || 0).toLocaleString()} <span className="text-[10px] text-gray-500 font-sans font-medium">บาท</span>
                </p>
              </div>
            </div>
            
            <button
              type="button"
              onClick={() => setMobileDetailsOpen(true)}
              className="text-xs px-3.5 py-1.5 bg-[#0F2942] text-white hover:bg-[#1a3f61] font-bold rounded-lg shadow-sm transition active:scale-95 cursor-pointer flex items-center space-x-1"
            >
              <Smartphone size={13} />
              <span>ดูแผงราคาเต็ม</span>
            </button>
          </div>
        )}

        {/* WORKSPACE COLUMNS MATRIX */}
        <div className="grid grid-cols-1 lg:grid-cols-10 gap-5 sm:gap-6 items-start">
          
          {/* LEFT 60% COLUMN — THE COMPREHENSIVE INPUT FORM */}
          <div className="lg:col-span-6 space-y-4 sm:space-y-6">
            
            {/* HERO NOTIFICATION ROW */}
            <div className="bg-gradient-to-r from-[#0F2942] to-[#1D4A73] p-4 sm:p-5 rounded-xl text-white shadow-sm space-y-2 relative overflow-hidden">
              <div className="absolute right-0 bottom-0 translate-x-4 translate-y-4 opacity-10 select-none pointer-events-none">
                <Smartphone size={120} className="stroke-white" />
              </div>
              <div className="flex items-center space-x-1.5">
                <span className="bg-[#FF6B35] text-white text-[10px] font-bold px-2 py-0.5 rounded tracking-wide uppercase select-none">
                  Smart Logistics
                </span>
                <span className="text-xs text-gray-300 font-semibold">• อัตราประเมินแบบวินาทีต่อวินาที</span>
              </div>
              <h2 className="font-bold text-base sm:text-lg">ประเมินราคาขนส่งรถ B2B ทั่วประเทศ</h2>
              <p className="text-xs text-gray-300 max-w-xl leading-relaxed font-sans">
                เพียงคลิกเลือกรูปแบบเส้นทางและใส่น้ำหนักสัมภาระ ระบบจะวิเคราะห์คำนวณและแจกแจงค่าบริการอย่างโปร่งใสตามมาตรวัดจริงจากสถาบันการขนส่งภายในประเทศ
              </p>
            </div>

            {/* LIVE SYSTEM SUBMISSION SUCCESS ALERTS */}
            {saveToast && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs sm:text-sm rounded-lg flex items-center space-x-2 font-bold animate-bounce shadow-sm">
                <CheckCircle size={18} className="text-emerald-600 flex-shrink-0" />
                <span>คำนวณสำเร็จ! บันทึกใบเสนอราคารหัสคู่สัญญาลงแผงประวัติถาวรเรียบร้อยแล้วค่ะ</span>
              </div>
            )}

            {/* MAIN CALCULATOR MODULE */}
            <CalculatorForm
              origin={origin}
              setOrigin={setOrigin}
              destination={destination}
              setDestination={setDestination}
              distance={distance}
              setDistance={setDistance}
              weight={weight}
              setWeight={setWeight}
              useVolumetric={useVolumetric}
              setUseVolumetric={setUseVolumetric}
              dimensions={dimensions}
              setDimensions={setDimensions}
              service={service}
              setService={setService}
              selectedTags={selectedTags}
              toggleTag={handleToggleTag}
              multistopCount={multistopCount}
              setMultistopCount={setMultistopCount}
              onCalculate={handleCalculateAndSaveHistory}
              onClear={handleClearForm}
              errors={errors}
              isValid={isValid}
            />
          </div>

          {/* RIGHT 40% COLUMN — STICKY QUOTE CARD VIEW & HISTORY DOCK */}
          <div className="hidden lg:col-span-4 lg:flex lg:flex-col space-y-5 sm:space-y-6 sticky top-20">
            
            {/* Real-time active preview or previously loaded quote card view */}
            <QuoteCard
              quote={liveActiveQuote || latestQuote}
              onSaveQuote={handleCalculateAndSaveHistory}
              isSaved={isSavedInHistory}
            />

            {/* Saved queries history dock */}
            <QuoteHistory
              history={historyQuotes}
              activeQuoteId={(liveActiveQuote || latestQuote)?.quoteId}
              onSelectQuote={handleSelectQuoteFromHistory}
              onDeleteQuote={handleDeleteHistoryQuote}
              onClearAll={handleClearHistoryAll}
            />
          </div>
        </div>
      </main>

      {/* STICKY HORIZON FOOTER PRIVACY DISCLAIMER */}
      <footer className="fixed bottom-0 left-0 right-0 h-11 border-t border-gray-250 bg-white/95 backdrop-blur-md flex items-center justify-center select-none shadow-md no-print z-40 px-4 text-center">
        <div className="flex items-center justify-center space-x-2 text-[10px] sm:text-xs font-sans text-gray-500">
          <Info size={13} className="text-gray-400 flex-shrink-0" />
          <span>เงื่อนไข: ราคาทั้งหมดเป็นเพียงราคาทดสอบประเมิน ±10% เพื่อรวดเร็วในการตัดสินใจ ราคาอย่างเป็นทางการจะสรุปสุทธิโดยทีมงาน Sales แพ็คดี จำกัด เท่านั้น</span>
        </div>
      </footer>

      {/* MOBILE EXTRA DRAWER OVERLAY */}
      {mobileDetailsOpen && (liveActiveQuote || latestQuote) && (
        <div className="lg:hidden fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-end no-print animate-fade-in">
          <div className="w-full bg-[#F7F8FA] rounded-t-2xl max-h-[92vh] overflow-hidden flex flex-col shadow-2xl relative">
            
            {/* Header control line */}
            <div className="px-4 py-3 bg-white border-b border-gray-150 flex items-center justify-between sticky top-0 z-10 select-none">
              <h3 className="font-bold text-[#0F2942] text-sm flex items-center space-x-1.5">
                <span>สรุปใบเสนอราคา & ประวัติคำนวณ</span>
              </h3>
              <button
                type="button"
                onClick={() => setMobileDetailsOpen(false)}
                className="p-1 px-2.5 rounded-lg bg-gray-55 hover:bg-gray-100 border border-gray-200 flex items-center justify-center text-gray-500 cursor-pointer text-xs font-bold"
              >
                <X size={15} />
              </button>
            </div>

            {/* Floating scroll sheets context */}
            <div className="p-4 overflow-y-auto space-y-4 max-h-[85vh] font-sans pb-16">
              <QuoteCard
                quote={liveActiveQuote || latestQuote}
                onSaveQuote={handleCalculateAndSaveHistory}
                isSaved={isSavedInHistory}
              />

              <QuoteHistory
                history={historyQuotes}
                activeQuoteId={(liveActiveQuote || latestQuote)?.quoteId}
                onSelectQuote={handleSelectQuoteFromHistory}
                onDeleteQuote={handleDeleteHistoryQuote}
                onClearAll={handleClearHistoryAll}
              />
            </div>
          </div>
        </div>
      )}

      {/* HIDDEN DOCUMENT CONTAINER DEVOTED EXCLUSIVELY TO PHYSIC A4 PRINT (Visible only on print layout engines) */}
      <PrintLayout quote={liveActiveQuote || latestQuote} />
    </div>
  );
}
