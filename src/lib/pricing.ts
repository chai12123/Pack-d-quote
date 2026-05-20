import { Quote, ServiceType } from '../types';

const BASE_FARE = {
  pickup: 500,
  van: 800,
  van_cold: 1200,
  truck6: 1500,
};

const DISTANCE_TIERS = {
  pickup:    [{max:50,r:15},{max:150,r:12},{max:300,r:10},{max:500,r:9},{max:Infinity,r:8}],
  van:       [{max:50,r:18},{max:150,r:15},{max:300,r:13},{max:500,r:11},{max:Infinity,r:10}],
  van_cold:  [{max:50,r:25},{max:150,r:22},{max:300,r:20},{max:500,r:18},{max:Infinity,r:16}],
  truck6:    [{max:50,r:30},{max:150,r:26},{max:300,r:23},{max:500,r:20},{max:Infinity,r:18}],
};

const FREE_WEIGHT = { pickup:500, van:800, van_cold:800, truck6:3000 };

const SERVICE_MULT = {
  standard: 1.00,
  express:  1.40,
  cold_chilled: 1.50, // 2-8°C (บังคับใช้ van_cold)
  cold_frozen:  1.75, // -18°C (บังคับใช้ van_cold)
};

const FUEL_SURCHARGE = 0.08; // 8%
const VAT = 0.07;

function pickVehicle(weight: number, service: ServiceType): 'pickup' | 'van' | 'van_cold' | 'truck6' {
  if (service.startsWith('cold')) return 'van_cold';
  if (weight <= 500)  return 'pickup';
  if (weight <= 800)  return 'van';
  return 'truck6';
}

function calcDistanceCost(distance: number, vehicle: 'pickup' | 'van' | 'van_cold' | 'truck6'): number {
  const tiers = DISTANCE_TIERS[vehicle];
  let cost = 0, remaining = distance, prevMax = 0;
  for (const tier of tiers) {
    if (remaining <= 0) break;
    const seg = Math.min(remaining, tier.max - prevMax);
    cost += seg * tier.r;
    remaining -= seg;
    prevMax = tier.max;
  }
  return cost;
}

function calcWeightCost(weight: number, vehicle: 'pickup' | 'van' | 'van_cold' | 'truck6'): number {
  const excess = Math.max(0, weight - FREE_WEIGHT[vehicle]);
  if (excess === 0) return 0;
  if (excess <= 500) return excess * 2;
  if (excess <= 1500) return 500*2 + (excess-500)*1.5;
  return 500*2 + 1000*1.5 + (excess-1500)*1.2;
}

function applyQuickTags(subtotal: number, tags: string[], multistopCount: number = 1): number {
  let extra = 0;
  if (tags.includes('night'))    extra += subtotal * 0.20;
  if (tags.includes('holiday'))  extra += subtotal * 0.15;
  if (tags.includes('remote'))   extra += 500;
  if (tags.includes('multistop')) extra += 300 * Math.max(1, multistopCount); // หนึ่งจุดเพิ่ม คูณด้วยจำนวนจุดที่เลือกในฟอร์ม
  if (tags.includes('cod'))      extra += 100;  // ค่าธรรมเนียมเฉลี่ย
  return extra;
}

interface CalculatePriceParams {
  distance: number;
  weight: number;
  service: ServiceType;
  tags?: string[];
  origin?: string;
  destination?: string;
  multistopCount?: number;
}

export function calculatePrice({
  distance,
  weight,
  service,
  tags = [],
  origin,
  destination,
  multistopCount = 1
}: CalculatePriceParams): Quote {
  const vehicle = pickVehicle(weight, service);
  const base = BASE_FARE[vehicle];
  const distCost = calcDistanceCost(distance, vehicle);
  const weightCost = calcWeightCost(weight, vehicle);
  const subtotal = (base + distCost + weightCost) * SERVICE_MULT[service];
  const tagsCost = applyQuickTags(subtotal, tags, multistopCount);
  const fuel = subtotal * FUEL_SURCHARGE;
  const preVat = subtotal + tagsCost + fuel;
  const vat = preVat * VAT;
  const total = Math.round(preVat + vat);
  
  const vehicleLabels = {
    pickup: 'รถกระบะ',
    van: 'รถตู้แห้ง',
    van_cold: 'รถตู้ควบคุมอุณหภูมิ',
    truck6: 'รถบรรทุก 6 ล้อ'
  };

  return {
    quoteId: `PKD-${Date.now().toString(36).toUpperCase()}`,
    vehicle,
    vehicleLabel: vehicleLabels[vehicle],
    breakdown: {
      base: Math.round(base),
      distance: Math.round(distCost),
      weight: Math.round(weightCost),
      serviceMultiplier: SERVICE_MULT[service],
      tags: Math.round(tagsCost),
      fuel: Math.round(fuel),
      vat: Math.round(vat),
    },
    subtotal: Math.round(subtotal),
    preVat: Math.round(preVat),
    total,
    distance,
    weight,
    service,
    tags,
    origin,
    destination,
    createdAt: new Date().toISOString(),
  };
}
