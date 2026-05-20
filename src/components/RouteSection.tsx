import React, { useState, useEffect, useRef } from 'react';
import { MapPin, Navigation, Compass, AlertCircle } from 'lucide-react';
import { POPULAR_CITIES, getLookupDistance } from '../lib/distances';

// All unique list of cities in our lookup database
const AVAILABLE_CITIES = [
  "กรุงเทพ", "ชลบุรี", "ระยอง", "นครราชสีมา", "ขอนแก่น", "เชียงใหม่", 
  "อุบลราชธานี", "หาดใหญ่", "ภูเก็ต", "อุดรธานี", "พิษณุโลก", "นครสวรรค์", 
  "สุราษฎร์ธานี", "เชียงราย", "ลำปาง", "นครศรีธรรมราช", "อยุธยา", "สมุทรสาคร", 
  "นครปฐม", "ราชบุรี", "เพชรบุรี", "ประจวบคีรีขันธ์", "ฉะเชิงเทรา", "ปราจีนบุรี", 
  "สระแก้ว", "จันทบุรี", "ตราด", "กาญจนบุรี", "สุพรรณบุรี", "สระบุรี", "ลพบุรี"
];

interface RouteSectionProps {
  origin: string;
  setOrigin: (val: string) => void;
  destination: string;
  setDestination: (val: string) => void;
  distance: number;
  setDistance: (val: number) => void;
  distanceError: string;
}

export default function RouteSection({
  origin,
  setOrigin,
  destination,
  setDestination,
  distance,
  setDistance,
  distanceError
}: RouteSectionProps): React.ReactElement {
  const [activeInput, setActiveInput] = useState<'origin' | 'destination' | null>(null);
  const [originSearch, setOriginSearch] = useState('');
  const [destSearch, setDestSearch] = useState('');
  const [showOriginDropdown, setShowOriginDropdown] = useState(false);
  const [showDestDropdown, setShowDestDropdown] = useState(false);

  const originRef = useRef<HTMLDivElement>(null);
  const destRef = useRef<HTMLDivElement>(null);

  // Sync prop changes back to searches
  useEffect(() => {
    setOriginSearch(origin);
  }, [origin]);

  useEffect(() => {
    setDestSearch(destination);
  }, [destination]);

  // Click outside to close dropdowns
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (originRef.current && !originRef.current.contains(event.target as Node)) {
        setShowOriginDropdown(false);
      }
      if (destRef.current && !destRef.current.contains(event.target as Node)) {
        setShowDestDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Filter lists based on search string
  const filteredOriginCities = AVAILABLE_CITIES.filter(c =>
    c.toLowerCase().includes(originSearch.toLowerCase())
  );

  const filteredDestCities = AVAILABLE_CITIES.filter(c =>
    c.toLowerCase().includes(destSearch.toLowerCase())
  );

  // Popular chips click logic
  const handlePopularCityClick = (city: string) => {
    // If we have an active input, fill it
    if (activeInput === 'origin') {
      setOrigin(city);
      setShowOriginDropdown(false);
    } else if (activeInput === 'destination') {
      setDestination(city);
      setShowDestDropdown(false);
    } else {
      // Otherwise fill origin first if empty, else destination
      if (!origin) {
        setOrigin(city);
      } else {
        setDestination(city);
      }
    }
  };

  const handleOriginSelect = (city: string) => {
    setOrigin(city);
    setShowOriginDropdown(false);
  };

  const handleDestSelect = (city: string) => {
    setDestination(city);
    setShowDestDropdown(false);
  };

  return (
    <div id="section-route" className="bg-white rounded-xl border border-gray-150 p-4 sm:p-5 shadow-sm text-[#0A1628] space-y-4">
      {/* SECTION HEADER */}
      <div className="flex items-center space-x-2 pb-2 border-b border-gray-100">
        <div className="p-1.5 bg-[#0F2942]/10 text-[#0F2942] rounded-lg">
          <MapPin size={18} className="text-[#0F2942]" />
        </div>
        <div>
          <h3 className="font-bold text-sm text-[#0F2942]">SECTION 1: 📍 เส้นทางขนส่ง</h3>
          <p className="text-[11px] text-gray-500">ระบุต้นทาง ปลายทาง และระยะทางจัดส่ง</p>
        </div>
      </div>

      {/* ORIGIN / DESTINATION GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* ORIGIN INPUT CONTAINER */}
        <div ref={originRef} className="relative">
          <label className="block text-xs font-bold text-gray-500 mb-1">ต้นทาง *</label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
              <MapPin size={15} />
            </span>
            <input
              type="text"
              className="w-full text-sm py-2.5 pl-9 pr-4 bg-white border border-gray-250 rounded-lg focus:border-[#FF6B35] focus:ring-1 focus:ring-[#FF6B35] outline-none font-sans"
              placeholder="กรอกชื่อจังหวัด เช่น กรุงเทพ..."
              value={originSearch}
              onChange={(e) => {
                setOriginSearch(e.target.value);
                setOrigin(e.target.value);
                setShowOriginDropdown(true);
              }}
              onFocus={() => {
                setActiveInput('origin');
                setShowOriginDropdown(true);
              }}
            />
          </div>

          {/* ORIGIN DROPDOWN */}
          {showOriginDropdown && filteredOriginCities.length > 0 && (
            <div className="absolute z-20 left-0 right-0 mt-1 max-h-48 overflow-y-auto bg-white border border-gray-250 rounded-lg shadow-lg font-sans">
              {filteredOriginCities.map((city) => (
                <button
                  key={city}
                  type="button"
                  className="w-full text-left px-4 py-2 text-xs text-[#0A1628] hover:bg-gray-100 transition whitespace-nowrap overflow-hidden text-ellipsis cursor-pointer"
                  onClick={() => handleOriginSelect(city)}
                >
                  📍 {city}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* DESTINATION INPUT CONTAINER */}
        <div ref={destRef} className="relative">
          <label className="block text-xs font-bold text-gray-500 mb-1">ปลายทาง *</label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
              <Navigation size={15} className="rotate-45" />
            </span>
            <input
              type="text"
              className="w-full text-sm py-2.5 pl-9 pr-4 bg-white border border-gray-250 rounded-lg focus:border-[#FF6B35] focus:ring-1 focus:ring-[#FF6B35] outline-none font-sans"
              placeholder="กรอกชื่อจังหวัดปลายทาง เช่น ชลบุรี..."
              value={destSearch}
              onChange={(e) => {
                setDestSearch(e.target.value);
                setDestination(e.target.value);
                setShowDestDropdown(true);
              }}
              onFocus={() => {
                setActiveInput('destination');
                setShowDestDropdown(true);
              }}
            />
          </div>

          {/* DESTINATION DROPDOWN */}
          {showDestDropdown && filteredDestCities.length > 0 && (
            <div className="absolute z-20 left-0 right-0 mt-1 max-h-48 overflow-y-auto bg-white border border-gray-250 rounded-lg shadow-lg font-sans">
              {filteredDestCities.map((city) => (
                <button
                  key={city}
                  type="button"
                  className="w-full text-left px-4 py-2 text-xs text-[#0A1628] hover:bg-gray-100 transition whitespace-nowrap overflow-hidden text-ellipsis cursor-pointer"
                  onClick={() => handleDestSelect(city)}
                >
                  📍 {city}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* POPULAR SUGGESTIONS CHIPS */}
      <div>
        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5 select-none">
          จังหวัดยอดนิยม (คลิกเพื่อเลือกเติมได้สะดวก):
        </p>
        <div className="flex flex-wrap gap-1.5">
          {POPULAR_CITIES.map((city) => {
            const isSelected = origin === city || destination === city;
            return (
              <button
                key={city}
                type="button"
                onClick={() => handlePopularCityClick(city)}
                className={`
                  text-xs px-2.5 py-1 rounded-full border transition active:scale-95 cursor-pointer font-medium
                  ${isSelected
                    ? 'bg-[#FF6B35]/10 border-[#FF6B35] text-[#FF6B35]'
                    : 'bg-gray-55/60 border-gray-200 text-gray-600 hover:bg-gray-100 hover:border-gray-300'
                  }
                `}
              >
                {city}
              </button>
            );
          })}
        </div>
      </div>

      {/* DISTANCE (KM) INPUT */}
      <div className="bg-gray-50/50 p-3 rounded-lg border border-gray-150">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="flex-1">
            <label className="block text-xs font-bold text-[#0F2942] mb-0.5">ระยะทางขนส่งโดยประมาณ (กิโลเมตร) *</label>
            <p className="text-[10px] text-gray-400 font-sans leading-relaxed">
              ระบบสืบค้นอัตโนมัติ — คุณสามารถปรับค่าตามจริงได้โดยสะดวก
            </p>
          </div>
          <div className="sm:w-36">
            <div className="relative">
              <input
                type="number"
                min="0"
                className={`
                  w-full text-right text-sm py-2 pl-3 pr-10 bg-white border rounded-lg outline-none font-sans font-semibold text-[#0F2942]
                  ${distanceError ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : 'border-gray-250 focus:border-[#FF6B35] focus:ring-1 focus:ring-[#FF6B35]'}
                `}
                value={distance || ''}
                placeholder="ระบุกม."
                onChange={(e) => {
                  const val = parseFloat(e.target.value);
                  setDistance(isNaN(val) ? 0 : val);
                }}
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-gray-400">กม.</span>
            </div>
          </div>
        </div>

        {/* DISTANCE ERROR / DISMISSAL NOTES */}
        {distanceError ? (
          <div className="mt-2 text-[11px] text-red-500 font-medium flex items-center space-x-1 animate-pulse">
            <AlertCircle size={12} />
            <span>{distanceError}</span>
          </div>
        ) : (
          <div className="mt-1.5 text-[10px] text-gray-450 italic font-medium">
            * ค้นหาระยะทางการขนส่งเฉลี่ยจากฐานข้อมูลทางหลวงของ Packd (กรุงเทพฯ เป็นศูนย์กลาง)
          </div>
        )}
      </div>
    </div>
  );
}
